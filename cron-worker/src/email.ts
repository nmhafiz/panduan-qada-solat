export interface EmailParams {
    toEmail: string;
    toName: string;
    subject: string;
    html: string;
}

const MAILERSEND_API_URL = "https://api.mailersend.com/v1/email";

export async function sendEmail(env: any, { toEmail, toName, subject, html }: EmailParams) {
    const apiKey = env.MAILERSEND_API_KEY;
    const senderEmail = env.MAILERSEND_SENDER_EMAIL || "info@qadasolat.my";
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

const emailWrapper = (content: string) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse;">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #059669 0%, #047857 100%); padding: 30px 40px; border-radius: 16px 16px 0 0; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700;">📖 Panduan Qada Solat</h1>
                            <p style="color: #d1fae5; margin: 8px 0 0 0; font-size: 14px;">Buku Rahsia Panduan Lengkap</p>
                        </td>
                    </tr>
                    <!-- Content -->
                    <tr>
                        <td style="background-color: #ffffff; padding: 40px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                            ${content}
                        </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 30px 40px; text-align: center;">
                            <p style="color: #64748b; font-size: 13px; margin: 0 0 8px 0;">Ada soalan? Balas email ini atau WhatsApp kami.</p>
                            <p style="color: #94a3b8; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} Panduan Qada Solat. Hak cipta terpelihara.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;

export function generateFollowupEmailHtml(customerName: string, refId: string, amount: number, packageId: string, paymentUrl: string, sequence: number) {
    const packageNames: Record<string, string> = {
        solo: "Solo (1 Buku)",
        combo: "Combo (2 Buku)",
        family: "Family (3 Buku)"
    };
    const packageName = packageNames[packageId] || packageId.toUpperCase();

    const isLastReminder = sequence === 3;

    const headerEmoji = isLastReminder ? "🔔" : "⏰";
    const headerText = isLastReminder ? "Peringatan Terakhir" : "Checkout Belum Selesai";
    const headerColor = isLastReminder ? "#dc2626" : "#f59e0b";

    return emailWrapper(`
        <div style="text-align: center; margin-bottom: 30px;">
            <div style="font-size: 48px; margin-bottom: 16px;">${headerEmoji}</div>
            <h2 style="color: #1e293b; margin: 0; font-size: 22px;">Assalamualaikum, ${customerName}</h2>
        </div>
        
        <p style="color: #475569; font-size: 16px; line-height: 1.6; text-align: center; margin-bottom: 30px;">
            ${isLastReminder
            ? "Ini peringatan terakhir kami. Tempahan anda akan tamat tidak lama lagi."
            : "Kami perasan checkout anda untuk <strong>Panduan Qada Solat</strong> belum selesai."
        }
        </p>
        
        <table style="width: 100%; background-color: #f1f5f9; border-radius: 12px; padding: 24px; margin-bottom: 30px;">
            <tr>
                <td style="padding: 8px 0; color: #64748b; font-size: 14px;">No. Rujukan</td>
                <td style="padding: 8px 0; color: #1e293b; font-size: 14px; font-weight: 600; text-align: right;">#${refId}</td>
            </tr>
            <tr>
                <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Pakej</td>
                <td style="padding: 8px 0; color: #1e293b; font-size: 14px; font-weight: 600; text-align: right;">${packageName}</td>
            </tr>
            <tr>
                <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Jumlah</td>
                <td style="padding: 8px 0; color: ${headerColor}; font-size: 18px; font-weight: 700; text-align: right;">RM${amount}</td>
            </tr>
        </table>
        
        <div style="text-align: center; margin-bottom: 30px;">
            <a href="${paymentUrl}" 
               style="display: inline-block; background: linear-gradient(135deg, #059669 0%, #047857 100%); color: #ffffff; padding: 16px 40px; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 16px;">
                ✅ Selesaikan Tempahan Sekarang
            </a>
        </div>
        
        <p style="color: #64748b; font-size: 14px; text-align: center; margin: 0;">
            Ada soalan? Balas email ini atau WhatsApp kami. Kami sedia membantu!
        </p>
    `);
}
