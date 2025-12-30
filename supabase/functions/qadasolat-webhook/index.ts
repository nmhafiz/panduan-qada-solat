
// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Environment Variables (Set these in Supabase Dashboard)
// BIZAPPAY_SECRET_KEY
// BIZAPP_API_TOKEN
// WAHA_API_KEY (if needed for auth)
// WAHA_ENDPOINT
// SUPABASE_URL
// SUPABASE_SERVICE_ROLE_KEY

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const supabase = createClient(
            Deno.env.get("SUPABASE_URL") ?? "",
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
        );

        // 1. Parse Bizappay Callback Payload
        // Documentation: https://bizappay.com/docs (V3)
        const formData = await req.formData();
        const billCode = formData.get("billcode")?.toString();
        const transactionStatus = formData.get("status")?.toString(); // '1' = Success, '2' = Pending, '3' = Fail
        const transactionID = formData.get("transaction_id")?.toString();

        console.log(`Received callback: Bill ${billCode}, Status ${transactionStatus}`);

        if (transactionStatus !== "1") {
            return new Response(JSON.stringify({ message: "Payment ignored (not success)" }), {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 200,
            });
        }

        // 2. Update Order in Supabase
        // We assume 'billCode' matches 'bill_id' in our table
        const { data: order, error: orderError } = await supabase
            .from("qadasolat_orders")
            .update({
                status: "paid",
                payment_metadata: {
                    transaction_id: transactionID,
                    raw_callback: Object.fromEntries(formData),
                },
                updated_at: new Date().toISOString(),
            })
            .eq("bill_id", billCode)
            .select()
            .single();

        if (orderError || !order) {
            console.error("Order not found or update failed:", orderError);
            return new Response(JSON.stringify({ error: "Order not found" }), {
                status: 404,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        // 3. Helper: Send WhatsApp (Waha)
        // Session: Bot_Notifikasi (as requested)
        const sendWhatsapp = async (phone: string, name: string) => {
            const wahaEndpoint = Deno.env.get("WAHA_ENDPOINT");
            const sessionName = "Bot_Notifikasi"; // User specified session

            if (!wahaEndpoint) {
                console.warn("Skipping WhatsApp: WAHA_ENDPOINT not set");
                return;
            }

            // Format phone: 60123456789 -> 60123456789@c.us
            const formattedPhone = phone.startsWith("60") ? phone : `60${phone.replace(/^0+/, "")}`;
            const chatId = `${formattedPhone}@c.us`;

            // Conditional Message Based on Package
            const packageId = order.payment_metadata?.package_id || 'combo'; // Default to combo if missing
            const isSolo = packageId === 'solo';

            let message = `Salam ${name}, terima kasih kerana mendapatkan *Panduan Qadha Solat (Buku Rahsia)*.\n\nAlhamdulillah, tempahan anda telah disahkan. ✅\n\n`;

            if (isSolo) {
                // Solo Package: No eBook, just physical book confirmation
                message += `Buku fizikal anda akan diproses untuk penghantaran secepat mungkin.\n\nSila tunggu tracking number dari kami nanti.\n\nSebarang pertanyaan boleh balas mesej ini. Terima kasih!`;
            } else {
                // Combo/Family: Include eBook Link
                message += `📥 *Link Download eBook:*
https://panduan-qadha-solat-lz.netlify.app/download-success?id=${order.id}
_(Sila klik link di atas untuk muat turun)_\n\nBuku fizikal juga akan diproses dengan segera.\n\nSebarang pertanyaan boleh balas mesej ini. Terima kasih!`;
            }

            try {
                await fetch(`${wahaEndpoint}/api/sendText`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        chatId,
                        text: message,
                        session: sessionName
                    })
                });
                console.log(`WhatsApp sent to ${chatId}`);
            } catch (e) {
                console.error("WhatsApp Failed:", e);
            }
        };

        // 4. Helper: Submit Order to Bizapp (Exact MCP Client Logic)
        const submitToBizapp = async () => {
            const apiKey = Deno.env.get("BIZAPP_API_TOKEN");
            if (!apiKey) {
                console.log("Skipping Bizapp Sync: BIZAPP_API_TOKEN not set");
                return;
            }

            try {
                console.log("Syncing order to Bizapp HQ...");
                const customer = order.payment_metadata?.customer_data || {};
                const meta = order.payment_metadata || {};

                // 1. Secret Key with Currency Suffix (-MY for MYR)
                const secretKey = apiKey.endsWith("-MY") ? apiKey : `${apiKey}-MY`;
                const apiMethod = 'WOO_TRACK_SAVE_ORDER_MULTIPLE_NEW_BYSKU';

                // 2. Generate 7-character Order ID (EXACT MCP LOGIC)
                const timestamp = Date.now().toString();
                const randomSuffix = Math.floor(Math.random() * 99).toString().padStart(2, '0');
                let wooOrderId = timestamp + randomSuffix;
                if (wooOrderId.length > 7) {
                    wooOrderId = wooOrderId.slice(-7); // Last 7 chars
                }

                // 3. Build Form Data (Body)
                const formData = new URLSearchParams();
                formData.append('name', order.customer_name || 'Pelanggan');
                formData.append('email', order.customer_email || 'noemail@example.com');
                formData.append('hpno', order.customer_phone || '0123456789'); // MCP uses 'hpno'

                // Full Address (combine all parts)
                const fullAddress = [
                    customer.address,
                    customer.city,
                    customer.postcode,
                    customer.state
                ].filter(Boolean).join(', ') || 'N/A';
                formData.append('address', fullAddress);

                formData.append('sellingprice', order.amount.toString());
                formData.append('postageprice', '0');

                // Note includes package description + Bizappay payment URL
                const bizappayUrl = meta.bizappay_url || `https://bizappay.my/${order.bill_id}`;
                const noteText = [
                    meta.description || 'Tempahan Buku Qada Solat',
                    `Payment Link: ${bizappayUrl}`,
                    `Ref: ${meta.ref_id || order.bill_id}`
                ].join(' | ');
                formData.append('note', noteText);

                formData.append('woo_url', 'https://qadasolat.my');
                formData.append('woo_orderid', wooOrderId);
                formData.append('woo_paymentgateway', 'Online Banking');
                formData.append('woo_paymentgateway_id', 'online_banking');

                // Transaction ID for payment reference
                formData.append('woo_payment_txn', order.bill_id || '');

                // Shipping method (Pos Laju default for physical books)
                formData.append('woo_shipping_method', 'Pos Laju');

                formData.append('currency', 'MYR');
                formData.append('status', 'processing');
                formData.append('set_paid', 'true');

                // UPPERCASE SKU (Validated via getproductlist)
                formData.append('products_info[0][sku]', 'BUKUQADASOLAT');
                formData.append('products_info[0][quantity]', (meta.qty_books || 1).toString());

                // 4. Build URL (MCP Style: encodeURIComponent on secretKey)
                const bizappUrl = `https://woo.bizapp.my/v2/wooapi.php?api_name=${apiMethod}&secretkey=${encodeURIComponent(secretKey)}`;

                console.log(`Sending to Bizapp: ${bizappUrl.split('?')[0]} (ID: ${wooOrderId})`);

                const res = await fetch(bizappUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: formData.toString(),
                });

                const text = await res.text();
                console.log("Bizapp Raw Response:", text);

                try {
                    const data = JSON.parse(text);
                    if (data.status === 'success' && data.result?.[0]?.ID) {
                        console.log("✅ Bizapp Order Submitted! ID:", data.result[0].ID);
                    } else {
                        console.error("Bizapp API Error:", data.error_message || data);
                    }
                } catch {
                    console.error("Bizapp Response not JSON:", text);
                }
            } catch (err) {
                console.error("Bizapp Sync Failed:", err);
            }
        };

        // Execute integrations concurrently
        await Promise.all([
            sendWhatsapp(order.customer_phone, order.customer_name),
            submitToBizapp()
        ]);

        return new Response(JSON.stringify({ success: true, orderId: order.id }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
        });

    } catch (error) {
        console.error("Webhook Error:", error);
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500,
        });
    }
});
