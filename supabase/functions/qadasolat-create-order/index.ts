
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
        const bizappApiToken = Deno.env.get("BIZAPP_API_TOKEN"); // For Bizapp HQ

        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        // 2. Parse Request
        const { customer, amount, packageId, description, quantity, paymentMethod, refId: incomingRefId, sessionId } = await req.json();
        const refId = incomingRefId || sessionId;
        const isCOD = paymentMethod === 'cod';

        if (!customer || !amount) {
            return new Response(JSON.stringify({ error: "Missing required fields" }), {
                status: 400,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        // Logic: Calculate Total Books
        const bookMultipliers: Record<string, number> = {
            "solo": 1,
            "combo": 2,
            "family": 3
        };
        const booksPerSet = bookMultipliers[packageId] || 1;
        const totalBooks = (quantity || 1) * booksPerSet;

        // Full address for Bizapp
        const fullAddress = [
            customer.address,
            customer.city,
            customer.postcode,
            customer.state
        ].filter(Boolean).join(', ') || 'N/A';

        // 3. Create Order in Supabase
        const orderStatus = isCOD ? "cod_pending" : "pending";
        const { data: order, error: orderError } = await supabase
            .from("qadasolat_orders")
            .insert({
                customer_name: customer.name,
                customer_email: customer.email,
                customer_phone: customer.phone,
                amount: amount,
                status: orderStatus,
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
                },
            })
            .select()
            .single();

        if (orderError) {
            console.error("Database Insert Error:", orderError);
            throw new Error("Failed to create order record");
        }

        // ============================================
        // COD FLOW: Skip Bizappay, Submit to Bizapp HQ
        // ============================================
        if (isCOD) {
            console.log("COD Order - Submitting directly to Bizapp HQ...");

            let bizappOrderId = null;

            if (bizappApiToken) {
                try {
                    // Secret Key with Currency Suffix
                    const secretKey = bizappApiToken.endsWith("-MY") ? bizappApiToken : `${bizappApiToken}-MY`;
                    const apiMethod = 'WOO_TRACK_SAVE_ORDER_MULTIPLE_NEW_BYSKU';

                    // Generate 7-character Order ID
                    const timestamp = Date.now().toString();
                    const randomSuffix = Math.floor(Math.random() * 99).toString().padStart(2, '0');
                    let wooOrderId = (timestamp + randomSuffix).slice(-7);

                    // Build Form Data for Bizapp
                    const bizappFormData = new URLSearchParams();
                    bizappFormData.append('name', customer.name);
                    bizappFormData.append('email', customer.email);
                    bizappFormData.append('hpno', customer.phone);
                    bizappFormData.append('address', fullAddress);
                    bizappFormData.append('sellingprice', amount.toString());
                    bizappFormData.append('postageprice', '0');
                    bizappFormData.append('note', `COD - ${description} | Ref: ${refId}`);
                    bizappFormData.append('woo_url', 'https://qadasolat.my');
                    bizappFormData.append('woo_orderid', wooOrderId);

                    // COD specific settings
                    bizappFormData.append('woo_paymentgateway', 'Cash On Delivery (COD)');
                    bizappFormData.append('woo_paymentgateway_id', 'cod');
                    bizappFormData.append('set_paid', 'false'); // NOT PAID YET

                    bizappFormData.append('woo_shipping_method', 'Pos Laju');
                    bizappFormData.append('currency', 'MYR');
                    bizappFormData.append('status', 'processing');
                    bizappFormData.append('products_info[0][sku]', 'BUKUQADASOLAT');
                    bizappFormData.append('products_info[0][quantity]', totalBooks.toString());

                    const bizappUrl = `https://woo.bizapp.my/v2/wooapi.php?api_name=${apiMethod}&secretkey=${encodeURIComponent(secretKey)}`;

                    console.log(`Sending COD order to Bizapp: ${wooOrderId}`);

                    const res = await fetch(bizappUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        body: bizappFormData.toString(),
                    });

                    const text = await res.text();
                    console.log("Bizapp Response:", text);

                    try {
                        const data = JSON.parse(text);
                        if (data.status === 'success' && data.result?.[0]?.ID) {
                            bizappOrderId = data.result[0].ID;
                            console.log("✅ COD Order submitted to Bizapp! ID:", bizappOrderId);
                        } else {
                            console.error("Bizapp COD Error:", data.error_message || data);
                        }
                    } catch {
                        console.error("Bizapp response not JSON:", text);
                    }
                } catch (err) {
                    console.error("Bizapp COD Sync Failed:", err);
                    // Don't throw - still allow order to proceed
                }
            } else {
                console.warn("Skipping Bizapp sync: BIZAPP_API_TOKEN not set");
            }

            // Update order with Bizapp ID if available
            if (bizappOrderId) {
                await supabase
                    .from("qadasolat_orders")
                    .update({
                        payment_metadata: {
                            ...order.payment_metadata,
                            bizapp_order_id: bizappOrderId,
                        },
                    })
                    .eq("id", order.id);
            }

            // Return redirect to Thank You page for COD
            const thankYouUrl = `https://qadasolat.my/terima-kasih?method=cod&ref=${refId}`;

            return new Response(JSON.stringify({
                success: true,
                isCOD: true,
                redirectUrl: thankYouUrl,
                refId,
                bizappOrderId
            }), {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 200,
            });
        }

        // ============================================
        // ONLINE BANKING FLOW: Create Bizappay Bill
        // ============================================
        if (!bizappayApiKey) {
            throw new Error("Server Configuration Error: Missing BIZAPPAY_API_KEY");
        }

        // Get Bizappay Token
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

        // Create Bizappay Bill
        const bizappBody = new URLSearchParams();
        bizappBody.append('apiKey', bizappayApiKey);
        bizappBody.append('category', bizappayCategoryCode);
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
                "Authentication": token
            },
            body: bizappBody,
        });

        if (!bizappRes.ok) {
            const errText = await bizappRes.text();
            console.error("Bizappay API Error:", bizappRes.status, errText);
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

        // Update Order with Real Bill ID
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

        // Return Payment URL for Online Banking
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
