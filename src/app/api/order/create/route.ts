import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Proxy to Edge Function
        // This avoids exposing Secrets in Next.js Env and centralizes backend logic
        // URL is hardcoded or could be env var. Hardcoding is fine for this specific project context.
        // URL is hardcoded or could be env var. Hardcoding is fine for this specific project context.
        const edgeFunctionUrl = "https://lstbqwnhxqrgsmlixkcw.supabase.co/functions/v1/qadasolat-create-order";
        const anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzdGJxd25oeHFyZ3NtbGl4a2N3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3NTU4ODQsImV4cCI6MjA4MDMzMTg4NH0.N9esdEnfRBOFLA1OYux1MPtbcXQhs2Uww4nG6-vgbIM";

        const response = await fetch(edgeFunctionUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${anonKey}`
            },
            body: JSON.stringify(body)
        });

        // Handle response
        const contentType = response.headers.get("content-type");
        let data;
        if (contentType && contentType.includes("application/json")) {
            data = await response.json();
        } else {
            const text = await response.text();
            console.error("Edge Function Raw Error:", text);
            throw new Error("Backend Error: " + response.status);
        }

        if (!response.ok) {
            console.error("Edge Function Error:", data);
            return NextResponse.json(data, { status: response.status });
        }

        return NextResponse.json(data);

    } catch (error: any) {
        console.error("API Proxy Error:", error);
        const errorMessage = error instanceof Error ? error.message : typeof error === 'string' ? error : JSON.stringify(error);
        return NextResponse.json({ success: false, error: errorMessage || "Internal Server Error" }, { status: 500 });
    }
}
