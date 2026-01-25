
const MAILERSEND_API_URL = "https://api.mailersend.com/v1/email";

interface EmailParams {
    toEmail: string;
    toName: string;
    subject: string;
    html: string;
}

export async function sendEmail({ toEmail, toName, subject, html }: EmailParams) {
    const apiKey = process.env.MAILERSEND_API_KEY;
    const senderEmail = process.env.MAILERSEND_SENDER_EMAIL || "info@qadasolat.my";
    const senderName = "Panduan Qada Solat";

    if (!apiKey) {
        console.error("Missing MAILERSEND_API_KEY");
        return;
    }

    try {
        const res = await fetch(MAILERSEND_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                from: { email: senderEmail, name: senderName },
                to: [{ email: toEmail, name: toName }],
                subject: subject,
                html: html
            })
        });

        if (!res.ok) {
            console.error("MailerSend Error:", await res.text());
        } else {
            console.log(`Email sent to ${toEmail}`);
        }
    } catch (error) {
        console.error("Email Fetch Error:", error);
    }
}

export function generateOrderEmailHtml(customerName: string, refId: string, amount: number, packageId: string, isCOD: boolean, showEbookLink: boolean, orderId?: string) {
    const footer = `
        <br><hr>
        <p style="font-size: 12px; color: #666;">
        Jika ada sebarang pertanyaan, sila balas email ini atau hubungi kami di WhatsApp.<br>
        © ${new Date().getFullYear()} Panduan Qada Solat
        </p>
    `;

    if (isCOD) {
        return `
            <h2>Terima Kasih, ${customerName}!</h2>
            <p>Tempahan COD anda telah diterima.</p>
            <p><strong>Ref:</strong> #${refId}<br>
            <strong>Pakej:</strong> ${packageId.toUpperCase()}<br>
            <strong>Jumlah Perlu Dibayar:</strong> RM${amount}</p>
            <p>Sila sediakan wang tunai secukupnya apabila posmen sampai.</p>
            <p>Tracking number akan dimaklumkan melalui SMS/WhatsApp oleh kurier.</p>
            ${footer}
        `;
    }

    // Online Banking Success
    let ebookSection = "";
    if (showEbookLink && orderId) {
        ebookSection = `
            <div style="background-color: #f0fdf4; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #bbf7d0;">
                <h3 style="color: #166534; margin-top: 0;">📥 Download eBook Bonus</h3>
                <p>Terima kasih kerana membeli Pakej ${packageId.toUpperCase()}. Sila muat turun eBook anda di bawah:</p>
                <a href="https://qadasolat.my/download-success?id=${orderId}&method=online" 
                   style="background-color: #16a34a; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
                   Download eBook Sekarang
                </a>
            </div>
        `;
    }

    return `
        <h2>Pembayaran Berjaya! ✅</h2>
        <p>Terima kasih ${customerName}. Pembayaran anda telah disahkan.</p>
        <p><strong>Ref:</strong> #${refId}<br>
        <strong>Pakej:</strong> ${packageId.toUpperCase()}<br>
        <strong>Jumlah:</strong> RM${amount}</p>
        
        ${ebookSection}
        
        <p>Buku fizikal anda sedang diproses untuk penghantaran (Pos Laju). Tracking number akan dihantar kemudian.</p>
        ${footer}
    `;
}
