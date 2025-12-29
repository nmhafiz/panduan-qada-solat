
import { NextResponse } from "next/server";

// In a real DB, you'd insert/upsert into an Orders table with status='DRAFT'
// adhering to the existing DB schema or Bizapp schema if applicable.
// Since we might not have a full DB migration for 'drafts' yet, 
// we'll simulate a success response. 
// Ideally, this would connect to Supabase/Postgres.

export async function POST(req: Request) {
    try {
        const data = await req.json();

        // Validation (Basic)
        if (!data.customer) {
            return NextResponse.json({ error: "No customer data" }, { status: 400 });
        }

        // Simulate DB Save logic 
        // e.g., await supabase.from('orders').upsert({ ...data, status: 'DRAFT' })

        console.log(`[Draft UPSERT] Session: ${data.sessionId}`, {
            timestamp: new Date().toISOString(),
            package: data.packageId,
            customer: data.customer
        });

        return NextResponse.json({
            success: true,
            draftId: "draft_" + Date.now(),
            message: "Draft saved"
        });

    } catch (error) {
        console.error("Draft Error:", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
