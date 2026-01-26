import { sendEmail, generateFollowupEmailHtml } from "./email";

// Malaysia timezone offset: UTC+8
const MY_TIMEZONE_OFFSET = 8;

// Allowed send windows (Malaysia time)
const SEND_WINDOWS = [
    { start: 10, end: 12 },  // 10am - 12pm
    { start: 14, end: 17 },  // 2pm - 5pm
    { start: 20, end: 22 },  // 8pm - 10pm
];

function getMalaysiaHour(): number {
    const now = new Date();
    const utcHour = now.getUTCHours();
    return (utcHour + MY_TIMEZONE_OFFSET) % 24;
}

function isWithinSendWindow(): boolean {
    const hour = getMalaysiaHour();
    return SEND_WINDOWS.some(w => hour >= w.start && hour < w.end);
}

interface Order {
    id: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    amount: number;
    status: string;
    followup_count: number;
    created_at: string; // Using manually added field
    created: string; // PB auto field
    payment_metadata: {
        package_id?: string;
        ref_id?: string;
        bizappay_url?: string;
    } | null;
}

async function pbAuth(env: any): Promise<string> {
    const pbUrl = env.NEXT_PUBLIC_POCKETBASE_URL || 'https://db.qadasolat.my';
    const email = env.POCKETBASE_ADMIN_EMAIL;
    const password = env.POCKETBASE_ADMIN_PASSWORD;

    const res = await fetch(`${pbUrl}/api/collections/_superusers/auth-with-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identity: email, password })
    });

    if (!res.ok) throw new Error('PocketBase auth failed');
    const data: any = await res.json();
    return data.token;
}

async function pbGetOrders(env: any, token: string): Promise<Order[]> {
    const pbUrl = env.NEXT_PUBLIC_POCKETBASE_URL || 'https://db.qadasolat.my';
    // Use perPage=500 and handle sorting/filtering in code to be safe
    const res = await fetch(`${pbUrl}/api/collections/orders/records?perPage=500`, {
        headers: { 'Authorization': token }
    });

    if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Failed to fetch orders: ${res.status} ${errText}`);
    }
    const data: any = await res.json();
    return data.items;
}

async function pbUpdateOrder(env: any, token: string, orderId: string, updates: Record<string, unknown>): Promise<void> {
    const pbUrl = env.NEXT_PUBLIC_POCKETBASE_URL || 'https://db.qadasolat.my';
    await fetch(`${pbUrl}/api/collections/orders/records/${orderId}`, {
        method: 'PATCH',
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
    });
}

async function processAbandonedOrders(env: any) {
    if (!isWithinSendWindow()) {
        const hour = getMalaysiaHour();
        return {
            skipped: true,
            reason: `Outside send window (current MY hour: ${hour})`
        };
    }

    try {
        const token = await pbAuth(env);
        const allOrders = await pbGetOrders(env, token);

        // Filter to pending orders with < 3 followups
        const orders = allOrders.filter(o =>
            o.status === "pending" && (o.followup_count || 0) < 3
        );

        // Identify customers who have ALREADY purchased (paid orders)
        // We use a Set of emails and normalized phones to check against
        const paidOrders = allOrders.filter(o => o.status === "paid");
        const paidEmails = new Set(paidOrders.map(o => o.customer_email.toLowerCase()));
        const paidPhones = new Set(paidOrders.map(o => o.customer_phone.replace(/\D/g, '')));

        const now = Date.now();
        const ONE_HOUR = 60 * 60 * 1000;
        const ONE_DAY = 24 * 60 * 60 * 1000;
        const THREE_DAYS = 3 * ONE_DAY;

        const results = [];

        for (const order of orders) {
            // Check if customer has already paid via another order
            const isPaidEmail = paidEmails.has(order.customer_email.toLowerCase());
            const isPaidPhone = paidPhones.has(order.customer_phone.replace(/\D/g, ''));

            if (isPaidEmail || isPaidPhone) {
                // Skip sending follow-up if they have a paid order
                console.log(`Skipping order ${order.id} - Customer already paid via another order`);
                continue;
            }

            // Use created_at (manual) preference, fallback to created (auto)
            const createdStr = order.created_at || order.created;
            if (!createdStr) continue;

            const createdAt = new Date(createdStr).getTime();
            const ageMs = now - createdAt;
            const followupCount = order.followup_count || 0;

            let shouldSend = false;
            let sequence = 0;

            if (followupCount === 0 && ageMs >= ONE_HOUR) {
                shouldSend = true;
                sequence = 1;
            } else if (followupCount === 1 && ageMs >= ONE_DAY) {
                shouldSend = true;
                sequence = 2;
            } else if (followupCount === 2 && ageMs >= THREE_DAYS) {
                shouldSend = true;
                sequence = 3;
            }

            if (!shouldSend) continue;

            const { customer_name, customer_email, customer_phone, amount, payment_metadata } = order;
            const meta = payment_metadata || {};
            const packageId = meta.package_id || "combo";
            const paymentUrl = meta.bizappay_url || "https://qadasolat.my";
            const refId = meta.ref_id || order.id;

            const tasks = [];

            // WAHA (WhatsApp)
            if (sequence === 1 || sequence === 3) {
                const wahaEndpoint = env.WAHA_ENDPOINT;
                if (wahaEndpoint) {
                    const rawPhone = customer_phone.replace(/\D/g, '');
                    const formattedPhone = rawPhone.startsWith("60") ? rawPhone : `60${rawPhone.replace(/^0+/, "")}`;
                    const chatId = `${formattedPhone}@c.us`;

                    let message = "";
                    if (sequence === 1) {
                        message = `Assalamualaikum ${customer_name} 👋\n\nKami perasan checkout anda belum selesai untuk *Panduan Qada Solat*.\n\nJika ada sebarang masalah atau soalan, jangan segan untuk tanya kami ya! 😊\n\n👉 Klik untuk sambung: ${paymentUrl}`;
                    } else {
                        message = `Assalamualaikum ${customer_name},\n\nIni peringatan terakhir - tempahan *Panduan Qada Solat* anda akan tamat tidak lama lagi.\n\nJangan lepaskan peluang untuk dapatkan buku rahsia ini! 📖\n\n👉 Selesaikan sekarang: ${paymentUrl}`;
                    }

                    const wahaKey = env.WAHA_API_KEY;
                    const headers: Record<string, string> = { "Content-Type": "application/json" };
                    if (wahaKey) headers["X-Api-Key"] = wahaKey;

                    tasks.push(fetch(`${wahaEndpoint}/api/sendText`, {
                        method: "POST",
                        headers,
                        body: JSON.stringify({ chatId, text: message, session: "Bot_Notifikasi" })
                    }).catch(e => console.error("WA Followup Error", e)));
                }
            }

            // Email
            if (sequence === 2 || sequence === 3) {
                const emailHtml = generateFollowupEmailHtml(
                    customer_name,
                    refId,
                    amount,
                    packageId,
                    paymentUrl,
                    sequence
                );

                tasks.push(sendEmail(env, {
                    toEmail: customer_email,
                    toName: customer_name,
                    subject: sequence === 2
                        ? `⏰ Jangan Lupa - Lengkapkan Tempahan Anda`
                        : `🔔 Peringatan Terakhir - Panduan Qada Solat`,
                    html: emailHtml
                }));
            }

            await Promise.allSettled(tasks);

            // Update DB
            await pbUpdateOrder(env, token, order.id, {
                followup_count: followupCount + 1,
                last_followup_at: new Date().toISOString()
            });

            results.push({ orderId: order.id, sequence, sent: true });
        }

        return {
            success: true,
            processed: results.length,
            results
        };

    } catch (error: any) {
        console.error("Worker Error:", error);
        throw error;
    }
}

export default {
    // Cron Handler
    async scheduled(controller: any, env: any, ctx: any) {
        console.log("Cron triggered");
        ctx.waitUntil(processAbandonedOrders(env));
    },

    // HTTP Handler (for manual testing/triggering)
    async fetch(request: Request, env: any, ctx: any) {
        const url = new URL(request.url);

        // Basic auth check
        const authHeader = request.headers.get("Authorization");
        const cronSecret = env.CRON_SECRET;
        if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
            return new Response("Unauthorized", { status: 401 });
        }

        try {
            const result = await processAbandonedOrders(env);
            return new Response(JSON.stringify(result, null, 2), {
                headers: { "Content-Type": "application/json" }
            });
        } catch (error: any) {
            return new Response(JSON.stringify({ error: error.message }), {
                status: 500,
                headers: { "Content-Type": "application/json" }
            });
        }
    }
};
