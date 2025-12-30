const https = require('https');

// Key with -MY suffix as per new findings
const SECRET_KEY = "-68f34ff8fe24ad6367ad6ec5d4ec1ddc-MY";
const URL = `https://woo.bizapp.my/v2/submitorder/${SECRET_KEY}`;

async function testBizappSync() {
    console.log("🚀 Starting Bizapp Sync Test (Correct V2 Endpoint)...");

    // Payload (x-www-form-urlencoded) matching the "Format Betul (V2)"
    const formData = new URLSearchParams();

    // Customer Info
    formData.append("name", "FINAL DEPLOYMENT TEST");
    formData.append("email", "test-final@antigravity.com");
    formData.append("hpno", "0123456789");
    formData.append("address", "No. 1, Jalan Final Test, Cyberjaya");
    formData.append("sellingprice", "1.00"); // Low amount
    formData.append("postageprice", "0.00");
    formData.append("note", "Final Test from Antigravity Script");

    // System Fields
    const numericId = Math.floor(Date.now() / 1000).toString(); // Unix timestamp
    formData.append("woo_url", "https://qadasolat.my");
    formData.append("woo_orderid", numericId);
    formData.append("woo_paymentgateway", "Online Banking");
    formData.append("woo_paymentgateway_id", "online_banking"); // usually smallcase

    // Items
    formData.append("products_info[0][sku]", "bukuqadasolat");
    formData.append("products_info[0][quantity]", "1");

    console.log(`📡 Sending to: ${URL} (POST)`);
    console.log(`🆔 ID Used: ${numericId}`);

    try {
        const res = await fetch(URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "User-Agent": "curl/7.64.1" // Mimic curl
            },
            body: formData.toString(),
        });

        console.log(`HTTP Status: ${res.status} ${res.statusText}`);
        const text = await res.text();
        console.log("📄 Raw Response:", text);

        try {
            const json = JSON.parse(text);
            console.log("✅ Parsed JSON:", JSON.stringify(json, null, 2));
        } catch (e) {
            console.log("⚠️ Not JSON.");
        }

    } catch (err) {
        console.error("🔥 Network Error:", err);
    }
}

testBizappSync();
