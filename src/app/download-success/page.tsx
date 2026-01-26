"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

function DownloadContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get("id");

    const [status, setStatus] = useState<"loading" | "valid" | "invalid">("loading");
    const [orderData, setOrderData] = useState<{ customer_name: string; package_id: string } | null>(null);

    useEffect(() => {
        async function verifyOrder() {
            if (!orderId) {
                setStatus("invalid");
                return;
            }

            try {
                const res = await fetch(`/api/order/verify?id=${orderId}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.valid && data.package_id !== "solo") {
                        setOrderData({ customer_name: data.customer_name, package_id: data.package_id });
                        setStatus("valid");
                    } else {
                        setStatus("invalid");
                    }
                } else {
                    setStatus("invalid");
                }
            } catch {
                setStatus("invalid");
            }
        }

        verifyOrder();
    }, [orderId]);

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Mengesahkan pesanan...</p>
                </div>
            </div>
        );
    }

    if (status === "invalid") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-100">
                <div className="text-center max-w-md mx-auto p-8">
                    <div className="text-6xl mb-4">❌</div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Akses Ditolak</h1>
                    <p className="text-gray-600">
                        Link ini tidak sah atau pakej anda tidak termasuk eBook.
                    </p>
                    <a href="https://qadasolat.my" className="mt-6 inline-block bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition">
                        Kembali ke Laman Utama
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100">
            <div className="text-center max-w-lg mx-auto p-8 bg-white rounded-2xl shadow-xl">
                <div className="text-6xl mb-4">📚</div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    Tahniah, {orderData?.customer_name}!
                </h1>
                <p className="text-gray-600 mb-6">
                    Terima kasih kerana mendapatkan Pakej <strong>{orderData?.package_id?.toUpperCase()}</strong>.
                    Klik butang di bawah untuk muat turun eBook bonus anda.
                </p>

                <a
                    href="/api/download/ebook"
                    className="inline-flex items-center gap-2 bg-emerald-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-emerald-700 transition shadow-lg"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download eBook Sekarang
                </a>

                <p className="text-sm text-gray-500 mt-6">
                    Buku fizikal anda akan dihantar melalui DHL/Ninjavan/J&T. Tracking akan dimaklumkan kemudian.
                </p>
            </div>
        </div>
    );
}

export default function DownloadSuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
        }>
            <DownloadContent />
        </Suspense>
    );
}
