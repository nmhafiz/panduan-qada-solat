import { NextResponse } from "next/server";

export const runtime = 'edge';

export async function GET() {
    const ebookUrl = process.env.EBOOK_DOWNLOAD_URL;

    if (!ebookUrl) {
        return NextResponse.json({ error: "eBook URL not configured" }, { status: 500 });
    }

    // Redirect to Google Drive download
    return NextResponse.redirect(ebookUrl);
}
