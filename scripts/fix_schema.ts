
import { PocketBase } from 'pocketbase'; // We need the node SDK type but we'll use simple fetch or just the JS SDK if available. 
// Actually we can use the project's own lib/pocketbase logic but that's for client.
// Let's just use a raw fetch script to be dependency-free/simple or re-use the removed setup logic.

async function fixSchema() {
    const PB_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL || "https://db.qadasolat.my";
    const ADMIN_EMAIL = process.env.POCKETBASE_ADMIN_EMAIL || "admin@qadasolat.my";
    const ADMIN_PASS = process.env.POCKETBASE_ADMIN_PASSWORD || "password123";

    console.log(`Connecting to ${PB_URL}...`);

    try {
        // 1. Auth as Admin
        const authRes = await fetch(`${PB_URL}/api/admins/auth-with-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ identity: ADMIN_EMAIL, password: ADMIN_PASS })
        });

        const authData = await authRes.json();
        if (!authData.token) throw new Error("Admin Auth Failed: " + JSON.stringify(authData));
        const token = authData.token;
        console.log("Admin Authenticated.");

        // 2. Get existing collection
        const colRes = await fetch(`${PB_URL}/api/collections/orders`, {
            headers: { 'Authorization': token }
        });

        let schema = [];
        let collectionId = "";

        if (colRes.ok) {
            const colData = await colRes.json();
            collectionId = colData.id;
            schema = colData.schema;
            console.log("Found 'orders' collection. Updating schema...");
        } else {
            console.log("'orders' collection not found. Creating...");
            // If strictly not found, we'd create. But user said it exists.
        }

        // 3. Define missing fields
        const newFields = [
            { name: 'customer_name', type: 'text' },
            { name: 'customer_email', type: 'email' },
            { name: 'customer_phone', type: 'text' },
            { name: 'amount', type: 'number' },
            { name: 'status', type: 'text' }, // simple text for now
            { name: 'bill_id', type: 'text' },
            { name: 'bizapp_order_id', type: 'text' },
            { name: 'payment_metadata', type: 'json' }
        ];

        // 4. Merge fields (avoid duplicates)
        const currentFieldNames = new Set(schema.map((f: any) => f.name));
        let addedCount = 0;

        for (const field of newFields) {
            if (!currentFieldNames.has(field.name)) {
                schema.push(field);
                addedCount++;
            }
        }

        if (addedCount === 0) {
            console.log("Schema looks good! No new fields needed.");
            return;
        }

        // 5. Update Collection
        const updateRes = await fetch(`${PB_URL}/api/collections/orders`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({ schema })
        });

        if (!updateRes.ok) {
            const err = await updateRes.text();
            throw new Error("Failed to update schema: " + err);
        }

        console.log(`✅ Success! Added ${addedCount} missing fields to 'orders' collection.`);

    } catch (e) {
        console.error("Error:", e);
    }
}

fixSchema();
