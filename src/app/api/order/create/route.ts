import { NextResponse } from "next/server";
import { getAdminClient } from "@/lib/pocketbase";
import { sendEmail, generateOrderEmailHtml } from "@/lib/mail";

export const runtime = 'edge'; // Cloudflare Pages requires Edge Runtime

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { customer, amount, packageId, description, quantity, paymentMethod, refId: incomingRefId, sessionId } = body;
        const refId = incomingRefId || sessionId;
        const isCOD = paymentMethod === 'cod';

        if (!customer || !amount) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Initialize Admin Client (needed for writing 'status' if protected, or just safe practice)
        const pb = await getAdminClient();

        // 1. Logic: Calculate Total Books
        const bookMultipliers: Record<string, number> = { "solo": 1, "combo": 2, "family": 3 };
        const booksPerSet = bookMultipliers[packageId] || 1;
        const totalBooks = (quantity || 1) * booksPerSet;

        const fullAddress = [customer.address, customer.city, customer.postcode, customer.state].filter(Boolean).join(', ') || 'N/A';

        // 2. Create Order in PocketBase
        const orderStatus = isCOD ? "cod_pending" : "pending";
        const orderData = {
            customer_name: customer.name,
            customer_email: customer.email,
            customer_phone: customer.phone,
            amount: amount,
            status: orderStatus,
            created_at: new Date().toISOString(),
            bill_id: isCOD ? `COD-${refId}` : `TEMP-${refId}`,
            payment_metadata: {
                package_id: packageId,
                qty_sets: quantity || 1,
                qty_books: totalBooks,
                payment_method: paymentMethod,
                description: description,
                ref_id: refId,
                customer_data: {
                    address: customer.address,
                    city: customer.city,
                    state: customer.state,
                    postcode: customer.postcode
                }
            }
        };

        const record = await pb.collection('orders').create(orderData);
        const orderId = record.id;

        // ============================================
        // COD FLOW
        // ============================================
        if (isCOD) {
            // Run side-effects asynchronously (fire and forget pattern for speed, or await if critical)
            // In Vercel/NextJS serverless, it's safer to await critical calls or use waitUntil (if edge).
            // We will await them to ensure reliability.

            const tasks = [];

            // A. WhatsApp
            const wahaEndpoint = process.env.WAHA_ENDPOINT;
            if (wahaEndpoint) {
                // Sanitize phone: remove non-numeric chars
                const rawPhone = customer.phone.replace(/\D/g, '');
                const formattedPhone = rawPhone.startsWith("60") ? rawPhone : `60${rawPhone.replace(/^0+/, "")}`;
                const chatId = `${formattedPhone}@c.us`;
                const message = `Salam ${customer.name}, terima kasih kerana mendapatkan *Panduan Qadha Solat (Buku Rahsia)* secara COD. 🚚\n\nTempahan anda: *#${refId}*\nPakej: *${packageId.toUpperCase()}*\nJumlah Perlu Dibayar: *RM${amount}*\n\nSila sediakan wang tunai secukupnya apabila posmen sampai nanti.\n\nNombor tracking akan dimaklumkan melalui SMS/WhatsApp oleh pihak kurier.\n\nTerima kasih!`;

                const wahaKey = process.env.WAHA_API_KEY;
                const headers: Record<string, string> = { "Content-Type": "application/json" };
                if (wahaKey) headers["X-Api-Key"] = wahaKey;

                tasks.push(fetch(`${wahaEndpoint}/api/sendText`, {
                    method: "POST",
                    headers,
                    body: JSON.stringify({ chatId, text: message, session: "Bot_Notifikasi" })
                }).catch(e => console.error("WA COD Error", e)));
            }

            // B. Telegram
            const tgToken = process.env.TELEGRAM_BOT_TOKEN;
            const tgChat = process.env.TELEGRAM_CHAT_ID;
            if (tgToken && tgChat) {
                const tgMsg = `📦 *New Order (COD)*
Ref: \`${refId}\`
Nama: ${customer.name}
Phone: ${customer.phone}
Email: ${customer.email}
Pakej: *${packageId.toUpperCase()}*
Kuantiti: *${quantity || 1} Set*
Jumlah: *RM${amount}*

📍 *Alamat:*
${customer.address}
${customer.postcode} ${customer.city}
${customer.state}`;
                tasks.push(fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ chat_id: tgChat, text: tgMsg, parse_mode: 'Markdown' })
                }).catch(e => console.error("TG Error", e)));
            }

            // C. Sync to Bizapp HQ
            const bizappToken = process.env.BIZAPP_API_TOKEN;
            if (bizappToken) {
                const secretKey = bizappToken.endsWith("-MY") ? bizappToken : `${bizappToken}-MY`;
                const timestamp = Date.now().toString();
                const randomSuffix = Math.floor(Math.random() * 99).toString().padStart(2, '0');
                const wooOrderId = (timestamp + randomSuffix).slice(-7);

                const formData = new URLSearchParams();
                formData.append('name', customer.name);
                formData.append('email', customer.email);
                formData.append('hpno', customer.phone);
                formData.append('address', fullAddress);
                formData.append('sellingprice', amount.toString());
                formData.append('postageprice', '0');
                formData.append('note', `COD - ${description} | Ref: ${refId}`);
                formData.append('woo_url', 'https://qadasolat.my');
                formData.append('woo_orderid', wooOrderId);
                formData.append('woo_paymentgateway', 'Cash On Delivery (COD)');
                formData.append('woo_paymentgateway_id', 'cod');
                formData.append('set_paid', 'false');
                formData.append('woo_shipping_method', 'DHL');
                formData.append('currency', 'MYR');
                formData.append('status', 'processing');
                formData.append('products_info[0][sku]', 'BUKUQADASOLAT');
                formData.append('products_info[0][quantity]', totalBooks.toString());

                const bizappUrl = `https://woo.bizapp.my/v2/wooapi.php?api_name=WOO_TRACK_SAVE_ORDER_MULTIPLE_NEW_BYSKU&secretkey=${encodeURIComponent(secretKey)}`;

                // We await this one to update DB with ID
                const bizappTask = async () => {
                    try {
                        const res = await fetch(bizappUrl, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                            body: formData.toString()
                        });
                        const text = await res.text();
                        const data = JSON.parse(text);
                        if (data.status === 'success' && data.result?.[0]?.ID) {
                            // Update PB
                            const newBizappId = data.result[0].ID; // use specific var name
                            await pb.collection('orders').update(orderId, { bizapp_order_id: newBizappId });
                        }
                    } catch (e) {
                        console.error("Bizapp Sync Error", e);
                    }
                };
                tasks.push(bizappTask());
            }

            // D. Email (MailerSend)
            const emailHtml = generateOrderEmailHtml(
                customer.name,
                refId,
                amount,
                packageId,
                true, // isCOD
                false // no eBook for COD
            );

            tasks.push(sendEmail({
                toEmail: customer.email,
                toName: customer.name,
                subject: `✅ Tempahan Diterima - Panduan Qada Solat`,
                html: emailHtml
            }));

            // Execute all tasks
            await Promise.allSettled(tasks);

            return NextResponse.json({
                success: true,
                isCOD: true,
                redirectUrl: `https://qadasolat.my/terima-kasih?method=cod&ref=${refId}`,
                refId
            });
        }

        // ============================================
        // ONLINE BANKING FLOW
        // ============================================
        const bizappayKey = process.env.BIZAPPAY_API_KEY;
        const bizappayCategory = process.env.BIZAPPAY_CATEGORY_CODE || "default";

        if (!bizappayKey) {
            throw new Error("Missing BIZAPPAY_API_KEY");
        }

        // 1. Get Token
        const tokenFormData = new FormData();
        tokenFormData.append('apiKey', bizappayKey);
        const tokenRes = await fetch("https://bizappay.my/api/v3/token", { method: "POST", body: tokenFormData });
        if (!tokenRes.ok) throw new Error("Bizappay Token Failed");
        const { token } = await tokenRes.json();

        // 2. Create Bill
        // Callback URL needs to be updated to NEXTJS API
        // Assuming deployment is qadasolat.my, change this to your production domain or env var
        const origin = process.env.NEXT_PUBLIC_APP_URL || "https://qadasolat.my";
        const callbackUrl = `${origin}/api/payment/webhook`;

        const billBody = new URLSearchParams();
        billBody.append('apiKey', bizappayKey);
        billBody.append('category', bizappayCategory);
        billBody.append('name', description);
        billBody.append('description', `Order Ref: ${refId}`);
        billBody.append('amount', Number(amount).toFixed(2));
        billBody.append('payer_name', customer.name);
        billBody.append('payer_email', customer.email);
        billBody.append('payer_phone', customer.phone);
        billBody.append('webreturn_url', `${origin}/terima-kasih`);
        billBody.append('callback_url', callbackUrl);
        billBody.append('ext_reference', refId);

        const billRes = await fetch("https://bizappay.my/api/v3/bill/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authentication": token
            },
            body: billBody
        });

        if (!billRes.ok) throw new Error("Bizappay Bill Creation Failed");
        const billData = await billRes.json();
        const billCode = billData.billCode || billData.id;
        const paymentUrl = `https://bizappay.my/${billCode}`;

        // 3. Update PB
        await pb.collection('orders').update(orderId, {
            bill_id: billCode,
            payment_metadata: { ...orderData.payment_metadata, bizappay_url: paymentUrl }
        });

        return NextResponse.json({ success: true, paymentUrl, refId });

    } catch (error: unknown) {
        console.error("Create Order Error:", error);
        const errorMessage = error instanceof Error ? error.message : "Internal Error";
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
