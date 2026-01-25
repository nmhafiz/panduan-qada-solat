
import { PocketBase } from 'pocketbase';

async function fixSchemaRetry() {
    const PB_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL || "https://db.qadasolat.my";
    const ADMIN_EMAIL = process.env.POCKETBASE_ADMIN_EMAIL || "admin@qadasolat.my";
    const ADMIN_PASS = process.env.POCKETBASE_ADMIN_PASSWORD || "password123";

    console.log(`Checking connection to ${PB_URL}...`);

    // 1. Check Health
    try {
        const health = await fetch(`${PB_URL}/api/health`).then(res => res.json());
        console.log("Health Check:", health);
    } catch (e) {
        console.error("Health Check Failed. URL might be wrong or server down.", e);
        return;
    }

    // 2. Auth
    try {
        console.log("Attempting Admin Auth...");
        // Use raw fetch for clarity
        const authRes = await fetch(`${PB_URL}/api/admins/auth-with-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ identity: ADMIN_EMAIL, password: ADMIN_PASS })
        });

        if (!authRes.ok) {
            console.error(`Auth Failed: ${authRes.status} ${authRes.statusText}`);
            console.error(await authRes.text());
            return;
        }

        const authData = await authRes.json();
        const token = authData.token;
        console.log("Admin Authenticated ✅");

        // 3. Update Schema
        console.log("Fetching 'orders' collection...");
        const colRes = await fetch(`${PB_URL}/api/collections/orders`, {
            headers: { 'Authorization': token }
        });

        if (!colRes.ok) {
            console.error("Orders collection not found?", await colRes.text());
            return;
        }

        const colData = await colRes.json();
        let schema = colData.schema || [];

        const newFields = [
            { name: 'customer_name', type: 'text' },
            { name: 'customer_email', type: 'email' },
            { name: 'customer_phone', type: 'text' },
            { name: 'amount', type: 'number' },
            { name: 'status', type: 'text' },
            { name: 'bill_id', type: 'text' },
            { name: 'bizapp_order_id', type: 'text' },
            { name: 'payment_metadata', type: 'json' }
        ];

        const currentFieldNames = new Set(schema.map((f: any) => f.name));
        let addedCount = 0;

        for (const field of newFields) {
            if (!currentFieldNames.has(field.name)) {
                schema.push(field);
                addedCount++;
            }
        }

        if (addedCount > 0) {
            console.log(`Adding ${addedCount} missing fields...`);
            const updateRes = await fetch(`${PB_URL}/api/collections/orders`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify({ schema })
            });
            if (updateRes.ok) {
                console.log("Schema Updated Successfully! 🚀");
            } else {
                console.error("Update Failed:", await updateRes.text());
            }
        } else {
            console.log("Schema is already up to date.");
        }

    } catch (e) {
        console.error("Script Error:", e);
    }
}

fixSchemaRetry();
