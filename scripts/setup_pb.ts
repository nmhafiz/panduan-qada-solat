import { Utils } from 'pocketbase';
import fetch from 'node-fetch';

// Polyfill fetch for Node environment if needed (PocketBase SDK might need it)
// @ts-ignore
if (!globalThis.fetch) { globalThis.fetch = fetch; }

const PB_URL = 'https://db.qadasolat.my';
const ADMIN_EMAIL = 'admin@qadasolat.my';
const ADMIN_PASS = 'password123';

async function main() {
    console.log("Connecting to PocketBase...");

    // We use raw fetch here to avoid SDK node-shim issues for a simple script, 
    // or we can use the SDK if we had 'eventsource' etc. 
    // Let's use raw REST API for admin setup to be safe and dependency-free.

    // 1. Admin Auth
    const authRes = await fetch(`${PB_URL}/api/collections/_superusers/auth-with-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identity: ADMIN_EMAIL, password: ADMIN_PASS })
    });

    if (!authRes.ok) {
        throw new Error(`Admin Auth Failed: ${await authRes.text()}`);
    }

    const { token } = await authRes.json();
    console.log("Admin Authenticated.");

    // 2. Define Collection
    const collectionData = {
        name: "orders",
        type: "base",
        schema: [
            { name: "customer_name", type: "text", required: true },
            { name: "customer_email", type: "email", required: false },
            { name: "customer_phone", type: "text", required: true },
            { name: "amount", type: "number", required: true },
            { name: "status", type: "select", options: { values: ["pending", "paid", "cod_pending", "failed", "cancelled"] }, maxSelect: 1 },
            { name: "bill_id", type: "text", required: false }, // Bizappay bill code or COD Ref
            { name: "payment_metadata", type: "json", required: false }, // Packages, Description, etc
            { name: "bizapp_order_id", type: "text", required: false }
        ],
        // API Rules (Public can create, Admin/Auth can view)
        createRule: "",      // Public
        listRule: null,      // Admin only (null)
        viewRule: null,      // Admin only
        updateRule: null,    // Admin only
        deleteRule: null     // Admin only
    };

    // 3. Check if exists
    try {
        const check = await fetch(`${PB_URL}/api/collections/orders`, {
            headers: { Authorization: token }
        });

        if (check.ok) {
            console.log("Collection 'orders' already exists. Skipping creation.");
            return;
        }
    } catch (e) { }

    // 4. Create
    const createRes = await fetch(`${PB_URL}/api/collections`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify(collectionData)
    });

    if (!createRes.ok) {
        console.error("Failed to create collection:", await createRes.text());
    } else {
        console.log("Collection 'orders' created successfully!");
    }
}

main().catch(console.error);
