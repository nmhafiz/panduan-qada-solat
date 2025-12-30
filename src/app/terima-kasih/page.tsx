import { Suspense } from "react";
import ThankYouClient from "./ThankYouClient";

export const metadata = {
    title: "Status Tempahan - Panduan Qadha Solat",
    description: "Semakan status tempahan anda.",
};

export default function ThankYouPage() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-4">
            <Suspense fallback={<div className="text-green-600 font-bold animate-pulse text-center">Loading Status...</div>}>
                <ThankYouClient />
            </Suspense>
        </main>
    );
}
