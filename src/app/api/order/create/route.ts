import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Proxy to Edge Function
        // This avoids exposing Secrets in Next.js Env and centralizes backend logic
        // URL is hardcoded or could be env var. Hardcoding is fine for this specific project context.
        const edgeFunctionUrl = "https://lstbqwnhxqrgsmlixkcw.supabase.co/functions/v1/qadasolat-create-order";

        const response = await fetch(edgeFunctionUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
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
        return NextResponse.json({ success: false, error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
