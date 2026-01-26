import { NextResponse } from "next/server";
import { sendEmail, generateFollowupEmailHtml } from "@/lib/mail";

export const runtime = 'edge';

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
    created_at: string;
    payment_metadata: {
        package_id?: string;
        ref_id?: string;
        bizappay_url?: string;
    } | null;
}

// Direct PocketBase API helper (SDK has issues in Edge Runtime)
async function pbAuth(): Promise<string> {
    const pbUrl = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'https://db.qadasolat.my';
    const email = process.env.POCKETBASE_ADMIN_EMAIL;
    const password = process.env.POCKETBASE_ADMIN_PASSWORD;

    const res = await fetch(`${pbUrl}/api/collections/_superusers/auth-with-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identity: email, password })
    });

    if (!res.ok) throw new Error('PocketBase auth failed');
    const data = await res.json();
    return data.token;
}

async function pbGetOrders(token: string): Promise<Order[]> {
    const pbUrl = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'https://db.qadasolat.my';
    const res = await fetch(`${pbUrl}/api/collections/orders/records?perPage=200`, {
        headers: { 'Authorization': token }
    });

    if (!res.ok) {
        const errBody = await res.text();
        console.error(`pbGetOrders failed: ${res.status} - ${errBody}`);
        throw new Error(`Failed to fetch orders: ${res.status}`);
    }
    const data = await res.json();
    return data.items;
}

async function pbUpdateOrder(token: string, orderId: string, updates: Record<string, unknown>): Promise<void> {
    const pbUrl = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'https://db.qadasolat.my';
    await fetch(`${pbUrl}/api/collections/orders/records/${orderId}`, {
        method: 'PATCH',
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
    });
}

export async function GET(request: Request) {
    // Verify cron secret (optional security)
    const authHeader = request.headers.get("Authorization");
    const cronSecret = process.env.CRON_SECRET;
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if within allowed send window
    if (!isWithinSendWindow()) {
        const hour = getMalaysiaHour();
        return NextResponse.json({
            skipped: true,
            reason: `Outside send window (current MY hour: ${hour})`
        });
    }

    try {
        // Use direct fetch API instead of SDK (Edge Runtime compatibility)
        const token = await pbAuth();
        const allOrders = await pbGetOrders(token);

        // Filter to pending orders with < 3 followups
        const orders = allOrders.filter(o =>
            o.status === "pending" && (o.followup_count || 0) < 3
        );

        const now = Date.now();
        const ONE_HOUR = 60 * 60 * 1000;
        const ONE_DAY = 24 * ONE_HOUR;
        const THREE_DAYS = 3 * ONE_DAY;

        const results = [];

        for (const order of orders) {
            const createdAt = new Date(order.created_at).getTime();
            const ageMs = now - createdAt;
            const followupCount = order.followup_count || 0;


            let shouldSend = false;
            let sequence = 0;

            // Determine which followup to send based on age
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

            // Send WhatsApp for sequence 1 and 3
            if (sequence === 1 || sequence === 3) {
                const wahaEndpoint = process.env.WAHA_ENDPOINT;
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

                    const wahaKey = process.env.WAHA_API_KEY;
                    const headers: Record<string, string> = { "Content-Type": "application/json" };
                    if (wahaKey) headers["X-Api-Key"] = wahaKey;

                    tasks.push(fetch(`${wahaEndpoint}/api/sendText`, {
                        method: "POST",
                        headers,
                        body: JSON.stringify({ chatId, text: message, session: "Bot_Notifikasi" })
                    }).catch(e => console.error("WA Followup Error", e)));
                }
            }

            // Send Email for sequence 2 and 3
            if (sequence === 2 || sequence === 3) {
                const emailHtml = generateFollowupEmailHtml(
                    customer_name,
                    refId,
                    amount,
                    packageId,
                    paymentUrl,
                    sequence
                );

                tasks.push(sendEmail({
                    toEmail: customer_email,
                    toName: customer_name,
                    subject: sequence === 2
                        ? `⏰ Jangan Lupa - Lengkapkan Tempahan Anda`
                        : `🔔 Peringatan Terakhir - Panduan Qada Solat`,
                    html: emailHtml
                }));
            }

            await Promise.allSettled(tasks);

            // Update followup count
            await pbUpdateOrder(token, order.id, {
                followup_count: followupCount + 1,
                last_followup_at: new Date().toISOString()
            });

            results.push({ orderId: order.id, sequence, sent: true });
        }

        return NextResponse.json({
            success: true,
            processed: results.length,
            results
        });

    } catch (error: unknown) {
        console.error("Followup Cron Error:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
