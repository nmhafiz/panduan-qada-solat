import { NextResponse } from "next/server";
import { createBill } from "@/lib/bizappay";
import { sendEmail } from "@/lib/mailersend";
import { sendWhatsApp } from "@/lib/waha";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { packageId, amount, paymentMethod, customer } = body;

        // Basic Validation
        if (!customer.name || !customer.phone || !customer.email || !customer.address || !packageId) {
            return NextResponse.json({ success: false, error: "Sila lengkapkan semua butiran." }, { status: 400 });
        }

        const refId = `ORD-${Date.now()}`;
        const description = `Tempahan Buku Qadha: ${packageId.toUpperCase()}`;

        // Handle Online Banking (Bizappay)
        if (paymentMethod === "online") {
            const bill = await createBill(amount, {
                name: customer.name,
                email: customer.email,
                phone: customer.phone,
                description: description,
                refId: refId
            });

            // We don't send email/WA here yet, we wait for callback or user to return to success page.
            // But for simplicity in this MVP, we can send a "Pending Payment" email if we want.
            // Only return the payment URL.
            return NextResponse.json({ success: true, paymentUrl: bill.url, refId });
        }

        // Handle COD
        if (paymentMethod === "cod") {
            // 1. Send Email
            const emailHtml = `
        <h1>Tempahan COD Berjaya!</h1>
        <p>Terima kasih ${customer.name}.</p>
        <p>Kami telah menerima tempahan anda untuk <strong>${description}</strong>.</p>
        <p>Jumlah perlu dibayar kepada posmen: <strong>RM${amount}</strong></p>
        <p>Sila sediakan wang tunai secukupnya.</p>
        <br>
        <p>Rujukan: ${refId}</p>
      `;
            await sendEmail(customer.email, customer.name, "Tempahan COD Buku Qadha Diterima", emailHtml);

            // 2. Send WhatsApp
            const waMessage = `✅ *Tempahan Diterima!*
      
Terima kasih ${customer.name}. Buku Panduan Qadha Solat (COD) akan dipos segera.

📦 Pakej: ${packageId.toUpperCase()}
💰 Jumlah: RM${amount} (Bayar Tunai)

Sila sediakan wang tunai apabila kurier DHL sampai.`;

            await sendWhatsApp(customer.phone, waMessage);

            return NextResponse.json({ success: true, refId });
        }

        return NextResponse.json({ success: false, error: "Kaedah pembayaran tidak sah." }, { status: 400 });

    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}
