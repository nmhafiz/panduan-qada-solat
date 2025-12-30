"use client";

import Link from "next/link";
import { CheckCircle, XCircle, Clock, Home, MessageCircle, BookOpen, ArrowRight, RefreshCcw, Truck, Banknote } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function ThankYouClient() {
    const searchParams = useSearchParams();
    // Bizappay V3 uses 'billstatus': 1 = Success, 2 = Pending, 3 = Failed
    const status = searchParams.get("billstatus");
    const method = searchParams.get("method"); // 'cod' or undefined

    // COD Logic
    const isCOD = method === 'cod';


    const isPending = status === "2";
    const isFailed = status === "3" || status === "4"; // 4 = No Action/Cancelled

    // If no status is present (direct visit), default to success view (or handle as needed)
    if (isFailed) {
        return (
            <div className="max-w-lg w-full text-center">
                <div className="mb-8">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 rounded-full mb-4 animate-bounce">
                        <XCircle className="w-12 h-12 text-red-600" />
                    </div>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold font-serif text-gray-900 mb-4">
                    Alamak! Pembayaran Gagal
                </h1>
                <p className="text-xl text-red-600 font-semibold mb-2">
                    Transaksi Tidak Diterima
                </p>
                <p className="text-gray-600 mb-8">
                    Mungkin terdapat masalah dengan bank atau sambungan internet.
                    Sila cuba buat pembayaran semula.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-bold px-6 py-3 rounded-xl transition-all"
                    >
                        <RefreshCcw className="w-5 h-5" />
                        Cuba Bayar Semula
                    </Link>
                    <a
                        href="https://wa.me/60179949054?text=Salam%2C%20saya%20ada%20masalah%20nak%20buat%20bayaran%20Buku%20Qadha%20Solat."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-xl transition-all"
                    >
                        <MessageCircle className="w-5 h-5" />
                        Bantuan WhatsApp
                    </a>
                </div>
            </div>
        );
    }

    if (isPending && !isCOD) {
        return (
            <div className="max-w-lg w-full text-center">
                <div className="mb-8">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-yellow-100 rounded-full mb-4 animate-pulse">
                        <Clock className="w-12 h-12 text-yellow-600" />
                    </div>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold font-serif text-gray-900 mb-4">
                    Sedang Diproses...
                </h1>
                <p className="text-xl text-yellow-600 font-semibold mb-2">
                    Menunggu Pengesahan Bank
                </p>
                <p className="text-gray-600 mb-8">
                    Jika duit telah ditolak, sila tunggu sebentar. Kami akan update status melalui WhatsApp/Email.
                </p>
                <div className="flex justify-center">
                    <a
                        href="https://wa.me/60179949054?text=Salam%2C%20status%20payment%20saya%20pending."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-xl transition-all"
                    >
                        <MessageCircle className="w-5 h-5" />
                        Check Status Manual
                    </a>
                </div>
            </div>
        );
    }

    // Default: Success (isSuccess or no param or COD)
    return (
        <div className="max-w-lg w-full text-center">
            {/* Success Icon */}
            <div className="mb-8">
                <div className={`inline-flex items-center justify-center w-24 h-24 ${isCOD ? 'bg-amber-100' : 'bg-green-100'} rounded-full mb-4 animate-bounce`}>
                    {isCOD ? <Truck className="w-12 h-12 text-amber-600" /> : <CheckCircle className="w-12 h-12 text-green-600" />}
                </div>
            </div>

            {/* Main Message */}
            <h1 className="text-3xl md:text-4xl font-bold font-serif text-gray-900 mb-4">
                {isCOD ? 'Tempahan COD Diterima! 🚚' : 'Jazakallahu Khairan! 🤲'}
            </h1>
            <p className={`text-xl ${isCOD ? 'text-amber-700' : 'text-green-700'} font-semibold mb-2`}>
                {isCOD ? 'Barang Sampai, Baru Bayar' : 'Tempahan Anda Berjaya Diterima'}
            </p>
            <p className="text-gray-600 mb-8">
                {isCOD
                    ? 'Terima kasih kerana memilih COD. Kami akan proses penghantaran segera.'
                    : 'Kami akan memproses tempahan anda secepat mungkin. Semak email/WhatsApp untuk maklumat lanjut.'}
            </p>

            {/* COD Reminder Card */}
            {isCOD && (
                <div className="bg-amber-50 rounded-2xl border border-amber-200 p-6 mb-8 text-left">
                    <h3 className="font-bold text-amber-900 mb-4 flex items-center gap-2">
                        <Banknote className="w-5 h-5 text-amber-600" />
                        Peringatan Penting COD:
                    </h3>
                    <ul className="space-y-3 text-amber-800 text-sm">
                        <li className="flex items-start gap-3">
                            <span className="bg-amber-200 text-amber-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
                            <span>Sila sediakan <strong>wang tunai secukupnya</strong> untuk dibayar kepada posmen.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="bg-amber-200 text-amber-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
                            <span>Pastikan ada <strong>orang di rumah</strong> untuk terima barang.</span>
                        </li>
                    </ul>
                </div>
            )}

            {/* Order Info Card (Only for Online Payment) */}
            {!isCOD && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8 text-left">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-green-600" />
                        Apa Yang Seterusnya?
                    </h3>
                    <ul className="space-y-3 text-gray-600">
                        <li className="flex items-start gap-3">
                            <span className="bg-green-100 text-green-700 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
                            <span>Kami akan hubungi anda melalui <strong>WhatsApp</strong> untuk sahkan tempahan</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="bg-green-100 text-green-700 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
                            <span>Buku akan dipos menggunakan kurier <strong>DHL Express</strong></span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="bg-green-100 text-green-700 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">3</span>
                            <span>Tracking number akan dihantar selepas buku dipos</span>
                        </li>
                    </ul>
                </div>
            )}

            {/* Motivational Quote */}
            <div className={`bg-gradient-to-r ${isCOD ? 'from-amber-600 to-amber-700' : 'from-green-600 to-green-700'} text-white rounded-2xl p-6 mb-8`}>
                <p className="text-lg font-serif italic mb-2">
                    &quot;Solat adalah tiang agama. Sesiapa yang mendirikannya, dia mendirikan agama.&quot;
                </p>
                <p className={`text-sm ${isCOD ? 'text-amber-200' : 'text-green-200'}`}>- Hadis Riwayat Baihaqi</p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                    href="/"
                    className="inline-flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-bold px-6 py-3 rounded-xl transition-all"
                >
                    <Home className="w-5 h-5" />
                    Kembali ke Laman Utama
                </Link>
                <a
                    href="https://wa.me/60179949054?text=Salam%2C%20saya%20dah%20buat%20tempahan%20Buku%20Panduan%20Qadha%20Solat.%20Ini%20bukti%20pembayaran%20saya."
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center justify-center gap-2 ${isCOD ? 'bg-amber-600 hover:bg-amber-700' : 'bg-green-600 hover:bg-green-700'} text-white font-bold px-6 py-3 rounded-xl transition-all`}
                >
                    <MessageCircle className="w-5 h-5" />
                    Hubungi Kami
                </a>
            </div>

            {/* Share Section */}
            <div className="mt-12 pt-8 border-t border-gray-100">
                <p className="text-gray-500 text-sm mb-4">
                    Kongsikan kebaikan ini dengan keluarga dan rakan-rakan anda
                </p>
                <Link
                    href="/#pricing"
                    className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold"
                >
                    Hadiahkan Buku Ini <ArrowRight className="w-4 h-4" />
                </Link>
            </div>

            {/* Footer */}
            <p className="mt-8 text-xs text-gray-400">
                © {new Date().getFullYear()} Panduan Qadha Solat. Hak Cipta Terpelihara.
            </p>
        </div>
    );
}
