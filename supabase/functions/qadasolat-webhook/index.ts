
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

            const message = `Salam ${name}, terima kasih kerana mendapatkan *Panduan Qadha Solat (Buku Rahsia)*.

Alhamdulillah, tempahan anda telah disahkan. ✅

📥 *Link Download eBook:*
https://panduan-qadha-solat-lz.netlify.app/download-success?id=${order.id}

_(Sila klik link di atas untuk muat turun)_

Sebarang pertanyaan boleh balas mesej ini. Terima kasih!`;

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

        // 4. Helper: Submit Order to Bizapp (Mock Implementation for now)
        // Need full documentation on Bizapp V3 Order API to implement correctly.
        const submitToBizapp = async () => {
            // Placeholder for future implementation
            console.log("Submitting order to Bizapp HQ...");
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
