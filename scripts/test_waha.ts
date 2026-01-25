
import fetch from 'node-fetch'; // Ensure we use a fetch compatible with Node if not global

async function testWaha() {
    const endpoint = "https://wa.sifatsahabat.com";
    const apiKey = "9844f4f5c2dd44cdaf2cf5c06bd77f10267c4331de012e0796b7c924da98f4c6";
    const session = "Bot_Notifikasi";

    // Replace with a safe test number, e.g. the user's own number or a placeholder if known.
    // I'll ask the user to input their number or use a dummy.
    // For now, let's try to just get sessions list to check auth first.

    console.log("Testing WAHA Connection...", endpoint);

    try {
        // 1. Check Sessions (GET /api/sessions)
        // Usually requires auth if key is set
        const sessionsUrl = `${endpoint}/api/sessions?all=true`;
        const headers: any = {
            "Content-Type": "application/json",
            "X-Api-Key": apiKey
        };

        console.log("Fetching sessions...");
        const res = await fetch(sessionsUrl, { headers });

        if (!res.ok) {
            console.error(`❌ Session Check Failed: ${res.status} ${res.statusText}`);
            console.error(await res.text());
        } else {
            const data = await res.json();
            console.log("✅ Sessions List:", JSON.stringify(data, null, 2));

            // Check if our session exists
            const mySession = data.find((s: any) => s.name === session);
            if (mySession) {
                console.log(`ℹ️ Session '${session}' status: ${mySession.status}`);
            } else {
                console.error(`❌ Session '${session}' NOT FOUND in list.`);
            }
        }

    } catch (e) {
        console.error("❌ Connection Error:", e);
    }
}

testWaha();
