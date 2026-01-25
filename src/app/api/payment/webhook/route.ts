import { NextResponse } from "next/server";
import { getAdminClient } from "@/lib/pocketbase";

export const runtime = 'nodejs';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const billCode = formData.get("billcode")?.toString();
        const transactionStatus = formData.get("status")?.toString(); // '1' = Success
        const transactionID = formData.get("transaction_id")?.toString();

        console.log(`[Webhook] Bill: ${billCode}, Status: ${transactionStatus}`);

        if (transactionStatus !== "1") {
            return NextResponse.json({ message: "Ignored (Not Success)" });
        }

        const pb = await getAdminClient();

        // 1. Find Order
        const order = await pb.collection('orders').getFirstListItem(`bill_id="${billCode}"`).catch(() => null);

        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        // 2. Update Status
        const updatedOrder = await pb.collection('orders').update(order.id, {
            status: "paid",
            payment_metadata: {
                ...order.payment_metadata,
                transaction_id: transactionID,
                raw_callback: Object.fromEntries(formData),
            }
        });

        // 3. Automations (WhatsApp, Telegram, Sheets, Bizapp Sync)
        // Similar to Create Order, we run these in background.
        // Reusing logic? Ideally extracted to a helper function, but inline for now is fine.

        const tasks = [];
        const { customer_phone, customer_name, customer_email, amount, payment_metadata } = updatedOrder;
        const meta = payment_metadata || {};
        const packageId = meta.package_id || 'combo';
        const isSolo = packageId === 'solo';
        const refId = meta.ref_id || billCode;

        // A. WhatsApp
        const wahaEndpoint = process.env.WAHA_ENDPOINT;
        if (wahaEndpoint) {
            const formattedPhone = customer_phone.startsWith("60") ? customer_phone : `60${customer_phone.replace(/^0+/, "")}`;
            const chatId = `${formattedPhone}@c.us`;
            let message = `Salam ${customer_name}, terima kasih kerana mendapatkan *Panduan Qadha Solat (Buku Rahsia)*.\n\nAlhamdulillah, bayaran anda telah disahkan. ✅\n\n`;

            if (isSolo) {
                message += `Buku fizikal anda akan diproses untuk penghantaran.\n\nSila tunggu tracking number dari kami nanti.`;
            } else {
                message += `📥 *Link Download eBook:* https://qadasolat.my/download-success?id=${order.id}&method=online\n\nBuku fizikal juga akan diproses dengan segera.`;
            }

            tasks.push(fetch(`${wahaEndpoint}/api/sendText`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ chatId, text: message, session: "Bot_Notifikasi" })
            }).catch(console.error));
        }

        // B. Telegram
        const tgToken = process.env.TELEGRAM_BOT_TOKEN;
        const tgChat = process.env.TELEGRAM_CHAT_ID;
        if (tgToken && tgChat) {
            const tgMsg = `✅ *Payment Success*\nRay: *#${refId}*\nNama: ${customer_name}\nPhone: ${customer_phone}\nPakej: ${packageId.toUpperCase()}\nJumlah: RM${amount}\nGateway: Bizappay`;
            tasks.push(fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: tgChat, text: tgMsg, parse_mode: 'Markdown' })
            }).catch(console.error));
        }

        // C. Sync to Bizapp HQ (Mark as Paid)
        // Note: For simplicity, we just submit a new order as "Paid" or similar logic. 
        // In previous Supabase logic, it submitted the order NOW if it wasn't done? 
        // Actually Supabase logic submitted concurrent with WhatsApp.
        // Let's replicate the logic: "Submit Order to Bizapp".
        // Logic: Online Banking flow didn't submit to Bizapp in Create Step? 
        // Checked Supabase generic: "COD Flow" submitted immediately. "Online Banking Flow" returned Payment URL.
        // So YES, we must submit to Bizapp NOW (upon payment success).

        const bizappToken = process.env.BIZAPP_API_TOKEN;
        if (bizappToken) {
            const secretKey = bizappToken.endsWith("-MY") ? bizappToken : `${bizappToken}-MY`;
            const timestamp = Date.now().toString();
            const randomSuffix = Math.floor(Math.random() * 99).toString().padStart(2, '0');
            const wooOrderId = (timestamp + randomSuffix).slice(-7);

            // Full Addr
            const cData = meta.customer_data || {};
            const fullAddress = [cData.address, cData.city, cData.postcode, cData.state].filter(Boolean).join(', ') || 'N/A';

            const formData = new URLSearchParams();
            formData.append('name', customer_name);
            formData.append('email', customer_email);
            formData.append('hpno', customer_phone);
            formData.append('address', fullAddress);
            formData.append('sellingprice', amount.toString());
            formData.append('postageprice', '0');
            formData.append('note', `Paid - ${meta.description} | Ref: ${refId}`);

            formData.append('woo_url', 'https://qadasolat.my');
            formData.append('woo_orderid', wooOrderId);
            formData.append('woo_paymentgateway', 'Online Banking');
            formData.append('woo_paymentgateway_id', 'online_banking');
            formData.append('woo_payment_txn', billCode || '');
            formData.append('woo_shipping_method', 'Pos Laju');
            formData.append('currency', 'MYR');
            formData.append('status', 'processing');
            formData.append('set_paid', 'true'); // PAID
            formData.append('products_info[0][sku]', 'BUKUQADASOLAT');
            formData.append('products_info[0][quantity]', (meta.qty_books || 1).toString());

            const url = `https://woo.bizapp.my/v2/wooapi.php?api_name=WOO_TRACK_SAVE_ORDER_MULTIPLE_NEW_BYSKU&secretkey=${encodeURIComponent(secretKey)}`;

            tasks.push(fetch(url, { method: 'POST', body: formData }).then(res => res.text()).then(async (txt) => {
                // Update Bizapp ID if success
                try {
                    const d = JSON.parse(txt);
                    if (d.status === 'success' && d.result?.[0]?.ID) {
                        await pb.collection('orders').update(order.id, { bizapp_order_id: d.result[0].ID });
                    }
                } catch { }
            }).catch(console.error));
        }

        await Promise.allSettled(tasks);

        return NextResponse.json({ success: true });

    } catch (error: unknown) {
        console.error("Webhook Error:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown Internal Error";
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
