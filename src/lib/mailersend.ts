export const sendEmail = async (to: string, name: string, subject: string, html: string) => {
    const apiKey = process.env.MAILERSEND_API_KEY;
    if (!apiKey) {
        console.warn("MAILERSEND_API_KEY missing. Simulating email send.");
        return true;
    }

    try {
        await fetch("https://api.mailersend.com/v1/email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                from: {
                    email: process.env.SENDER_EMAIL || "info@myshop.com",
                    name: process.env.STORE_NAME || "Kedai Buku Qadha"
                },
                to: [{ email: to, name: name }],
                subject: subject,
                html: html
            })
        });
        return true;
    } catch (e) {
        console.error("Mailersend Error:", e);
        return false;
    }
};
