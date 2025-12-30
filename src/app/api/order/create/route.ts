import { NextResponse } from "next/server";

export const runtime = 'edge';

export async function POST(request: Request) {
    console.log("[DEBUG] API /api/order/create called");

    try {
        const body = await request.json();
        console.log("[DEBUG] Request body parsed:", JSON.stringify(body));

        // Proxy to Edge Function
        const edgeFunctionUrl = "https://lstbqwnhxqrgsmlixkcw.supabase.co/functions/v1/qadasolat-create-order";
        const anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzdGJxd25oeHFyZ3NtbGl4a2N3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3NTU4ODQsImV4cCI6MjA4MDMzMTg4NH0.N9esdEnfRBOFLA1OYux1MPtbcXQhs2Uww4nG6-vgbIM";

        console.log("[DEBUG] Calling Edge Function:", edgeFunctionUrl);

        const response = await fetch(edgeFunctionUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${anonKey}`
            },
            body: JSON.stringify(body)
        });

        console.log("[DEBUG] Edge Function response status:", response.status);

        // Handle response
        const contentType = response.headers.get("content-type");
        console.log("[DEBUG] Response content-type:", contentType);

        let data;
        if (contentType && contentType.includes("application/json")) {
            data = await response.json();
            console.log("[DEBUG] Response data:", JSON.stringify(data));
        } else {
            const text = await response.text();
            console.error("[DEBUG] Edge Function Raw Error:", text);
            return NextResponse.json({ success: false, error: "Backend returned non-JSON: " + text.substring(0, 200), status: response.status }, { status: response.status });
        }

        if (!response.ok) {
            console.error("[DEBUG] Edge Function Error:", data);
            return NextResponse.json(data, { status: response.status });
        }

        return NextResponse.json(data);

    } catch (error: unknown) {
        console.error("[DEBUG] API Proxy Error:", error);
        const errorMessage = error instanceof Error
            ? `${error.name}: ${error.message}`
            : typeof error === 'string'
                ? error
                : JSON.stringify(error);
        return NextResponse.json({
            success: false,
            error: errorMessage || "Internal Server Error",
            stack: error instanceof Error ? error.stack : undefined
        }, { status: 500 });
    }
}
