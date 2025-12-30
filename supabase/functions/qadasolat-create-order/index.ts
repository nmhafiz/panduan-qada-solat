
// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        // 1. Init Credentials
        const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
        const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
        const bizappayApiKey = Deno.env.get("BIZAPPAY_API_KEY");
        const bizappayCategoryCode = Deno.env.get("BIZAPPAY_CATEGORY_CODE") || "default";

        if (!bizappayApiKey) {
            throw new Error("Server Configuration Error: Missing BIZAPPAY_API_KEY");
        }

        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        // 2. Parse Request
        const { customer, amount, packageId, description, quantity, paymentMethod, refId: incomingRefId, sessionId } = await req.json();
        const refId = incomingRefId || sessionId;

        if (!customer || !amount) {
            return new Response(JSON.stringify({ error: "Missing required fields" }), {
                status: 400,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        // Logic: Calculate Total Books
        // solo = 1 book, combo = 2 books, family = 3 books
        const bookMultipliers: Record<string, number> = {
            "solo": 1,
            "combo": 2,
            "family": 3
        };
        const booksPerSet = bookMultipliers[packageId] || 1;
        const totalBooks = (quantity || 1) * booksPerSet;

        // 3. Create Order in Supabase (Pending)
        // We use refId as temporary bill_id in case Bizappay fails
        const { data: order, error: orderError } = await supabase
            .from("qadasolat_orders")
            .insert({
                customer_name: customer.name,
                customer_email: customer.email,
                customer_phone: customer.phone,
                amount: amount,
                status: "pending",
                bill_id: `TEMP-${refId}`,
                payment_metadata: {
                    package_id: packageId,
                    qty_sets: quantity || 1,        // Qty of packages/sets
                    qty_books: totalBooks,          // Total physical books
                    payment_method: paymentMethod,  // 'cod' or 'online'
                    description: description,
                    ref_id: refId,
                    customer_data: {
                        address: customer.address,
                        city: customer.city,
                        state: customer.state,
                        postcode: customer.postcode
                    }
                },
            })
            .select()
            .single();

        if (orderError) {
            console.error("Database Insert Error:", orderError);
            throw new Error("Failed to create order record");
        }

        // 4.1 Get Bizappay Token (Required for V3)
        const tokenRes = await fetch("https://bizappay.my/api/v3/token", {
            method: "POST",
            body: new FormData(), // API Key goes here in form-data
        });

        // Construct form data manually to ensure compatibility
        const tokenFormData = new FormData();
        tokenFormData.append('apiKey', bizappayApiKey);

        const tokenResponse = await fetch("https://bizappay.my/api/v3/token", {
            method: "POST",
            body: tokenFormData,
        });

        if (!tokenResponse.ok) {
            const errText = await tokenResponse.text();
            console.error("Bizappay Token Error:", tokenResponse.status, errText);
            throw new Error("Failed to authenticate with Payment Gateway");
        }

        const { token } = await tokenResponse.json();

        // 4.2 Call Bizappay API (Create Bill)
        // CRITICAL FIX: Bizappay V3 requires application/x-www-form-urlencoded and snake_case fields
        const bizappBody = new URLSearchParams();
        bizappBody.append('apiKey', bizappayApiKey);
        bizappBody.append('category', bizappayCategoryCode); // Note: field is 'category', NOT 'categoryCode'
        bizappBody.append('name', description);
        bizappBody.append('description', `Order Ref: ${refId}`);
        bizappBody.append('amount', Number(amount).toFixed(2));
        bizappBody.append('payer_name', customer.name);
        bizappBody.append('payer_email', customer.email);
        bizappBody.append('payer_phone', customer.phone);
        bizappBody.append('webreturn_url', "https://qadasolat.my/terima-kasih");
        bizappBody.append('callback_url', `${supabaseUrl}/functions/v1/qadasolat-webhook`);
        bizappBody.append('ext_reference', refId);

        console.log("Calling Bizappay...", bizappBody.toString());

        const bizappRes = await fetch("https://bizappay.my/api/v3/bill/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authentication": token // No Bearer prefix
            },
            body: bizappBody,
        });

        if (!bizappRes.ok) {
            const errText = await bizappRes.text();
            console.error("Bizappay API Error:", bizappRes.status, errText);
            // Mark order as failed
            await supabase.from("qadasolat_orders").update({ status: "failed" }).eq("id", order.id);
            throw new Error("Payment Gateway Request Failed");
        }

        const bizappData = await bizappRes.json();
        const billCode = bizappData.billCode || bizappData.id;

        if (!billCode) {
            console.error("Invalid Bizappay Response:", bizappData);
            throw new Error("Received invalid response from payment gateway");
        }

        const paymentUrl = `https://bizappay.my/${billCode}`;

        // 5. Update Order with Real Bill ID
        await supabase
            .from("qadasolat_orders")
            .update({
                bill_id: billCode,
                payment_metadata: {
                    ...order.payment_metadata,
                    bizappay_url: paymentUrl,
                },
            })
            .eq("id", order.id);

        // 6. Return Success
        return new Response(JSON.stringify({ success: true, paymentUrl, refId }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
        });

    } catch (error) {
        console.error("Function Error:", error);
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500,
        });
    }
});
