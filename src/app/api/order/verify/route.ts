import { NextResponse } from "next/server";
import { getAdminClient } from "@/lib/pocketbase";

export const runtime = 'edge';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("id");

    if (!orderId) {
        return NextResponse.json({ valid: false, error: "Missing order ID" }, { status: 400 });
    }

    try {
        const pb = await getAdminClient();
        const order = await pb.collection('orders').getOne(orderId);

        // Only allow download if order exists and is paid (not COD pending)
        if (order && order.status === "paid") {
            const meta = order.payment_metadata || {};
            return NextResponse.json({
                valid: true,
                customer_name: order.customer_name,
                package_id: meta.package_id || "combo"
            });
        }

        return NextResponse.json({ valid: false });
    } catch {
        return NextResponse.json({ valid: false }, { status: 404 });
    }
}
