export const createBill = async (
    amount: number,
    customerArg: { name: string; email: string; phone: string; description: string; refId: string }
) => {
    const apiKey = process.env.BIZAPPAY_API_KEY;
    if (!apiKey) {
        console.warn("BIZAPPAY_API_KEY missing. Simulating success.");
        return { url: "https://example.com/simulated-payment", billId: "simulated-id" };
    }

    // Bizappay V3 Standard Structure
    const payload = {
        apiKey: apiKey,
        categoryCode: process.env.BIZAPPAY_CATEGORY_CODE || "default",
        billName: customerArg.description,
        billDescription: `Order ${customerArg.refId}`,
        billTo: customerArg.name,
        billEmail: customerArg.email,
        billPhone: customerArg.phone,
        billAmount: (amount * 100).toString(), // in cents
        billReturnUrl: process.env.NEXT_PUBLIC_APP_URL ? `${process.env.NEXT_PUBLIC_APP_URL}/success` : "http://localhost:3000/success",
        billCallbackUrl: process.env.NEXT_PUBLIC_APP_URL ? `${process.env.NEXT_PUBLIC_APP_URL}/api/callback/bizappay` : "http://localhost:3000/api/callback/bizappay",
        billExternalReferenceNo: customerArg.refId
    };

    try {
        const res = await fetch("https://bizappay.com/api/v3/bills", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        return { url: `https://bizappay.com/${data.billCode}`, billId: data.billCode };
    } catch (e) {
        console.error("Bizappay Error:", e);
        throw new Error("Payment Gateway Error");
    }
};
