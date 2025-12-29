export const sendWhatsApp = async (phone: string, message: string) => {
    const endpoint = process.env.WAHA_ENDPOINT; // e.g., http://my-waha.com
    if (!endpoint) {
        console.warn("WAHA_ENDPOINT missing. Simulating WA send.");
        return true;
    }

    // Format phone: 60123456789 (Must end with @c.us for WAHA)
    const formattedPhone = phone.startsWith("60") ? phone : `60${phone.replace(/^0+/, "")}`;
    const chatId = `${formattedPhone}@c.us`;

    try {
        await fetch(`${endpoint}/api/sendText`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chatId: chatId,
                text: message,
                session: "default"
            })
        });
        return true;
    } catch (e) {
        console.error("WAHA Error:", e);
        return false;
    }
};
