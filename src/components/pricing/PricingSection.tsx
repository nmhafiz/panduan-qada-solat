"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Lock } from "lucide-react";
import Link from "next/link"; // Changed from 'next/scroll' to 'next/link' for anchor scrolling

export default function PricingSection() {
    return (
        <section id="pricing" className="py-24 relative overflow-hidden bg-emerald-900">
            {/* Ambient Background */}
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl bg-emerald-500/20 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="container mx-auto px-4 relative z-10">

                {/* HEADLINE */}
                <div className="text-center mb-12 text-white">
                    <span className="inline-block py-1 px-3 rounded-full bg-emerald-800/50 border border-emerald-700 text-emerald-300 text-xs font-bold uppercase tracking-widest mb-4">
                        Edisi Terhad 2026
                    </span>
                    <h2 className="text-3xl md:text-5xl font-bold font-serif mb-4 leading-tight">
                        Jualan Cetakan <span className="text-emerald-400">Pertama</span>
                    </h2>
                    <p className="text-emerald-100 max-w-xl mx-auto text-lg opacity-90">
                        Harga akan dinaikkan kepada RM89 sebaik sahaja stok cetakan ini habis.
                    </p>
                </div>

                {/* --- TICKET CARD --- */}
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    className="max-w-lg mx-auto bg-white rounded-[2.5rem] p-2 shadow-2xl shadow-emerald-900/50 relative"
                >
                    {/* Inner Border Container */}
                    <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden relative">

                        {/* Top Banner (Limited Batch) */}
                        <div className="bg-red-50 p-4 text-center border-b border-red-100">
                            <div className="flex items-center justify-center gap-2 text-red-600 font-bold text-sm uppercase tracking-wider animate-pulse">
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                </span>
                                Batch 1: Hampir Habis!
                            </div>
                        </div>

                        <div className="p-8 md:p-10 text-center">

                            {/* Product Title */}
                            <h3 className="text-2xl font-bold text-gray-900 font-serif mb-2">
                                Buku Panduan Qadha Solat
                            </h3>
                            <p className="text-gray-500 text-sm mb-8">
                                + Ebook Solat Sunat <span className="text-red-500 text-[10px] font-bold uppercase tracking-wider ml-1">(Combo 2+)</span>
                            </p>

                            {/* PRICE DISPLAY */}
                            <div className="flex justify-center items-end gap-3 mb-8">
                                <span className="text-2xl text-gray-400 line-through font-bold mb-2">RM 158</span>
                                <div className="group relative">
                                    <span className="text-6xl md:text-7xl font-extrabold text-gray-900 tracking-tight">
                                        49
                                    </span>
                                    <span className="absolute top-2 -right-6 text-lg font-bold text-emerald-600">RM</span>
                                </div>
                            </div>

                            {/* PROGRESS BAR (SCARCITY) */}
                            <div className="mb-10 text-left">
                                <div className="flex justify-between text-xs font-bold text-gray-500 mb-2">
                                    <span>Stok Terjual</span>
                                    <span className="text-red-500">87%</span>
                                </div>
                                <div className="h-4 bg-gray-100 rounded-full overflow-hidden shadow-inner relative">
                                    <motion.div
                                        initial={{ width: "0%" }}
                                        whileInView={{ width: "87%" }}
                                        transition={{ duration: 1.5, ease: "circOut" }}
                                        className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full relative"
                                    >
                                        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:20px_20px]"></div>
                                    </motion.div>
                                </div>
                                <p className="text-[10px] text-gray-400 mt-2 italic text-center">
                                    *Stok fizikal adalah terhad. Siapa cepat dia dapat.
                                </p>
                            </div>

                            {/* CTA BUTTON */}
                            <Link href="#checkout" className="block w-full group relative">
                                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-500 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                                <button className="relative w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:to-teal-500 text-white font-bold text-xl py-5 rounded-xl shadow-lg transform transition hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2">
                                    <span>Dapatkan Sekarang</span>
                                    <ShieldCheck className="w-5 h-5 opacity-80" />
                                </button>
                            </Link>

                            <p className="mt-4 text-xs text-gray-400 flex items-center justify-center gap-1">
                                <Lock className="w-3 h-3" /> Secure Payment via Bizappay
                            </p>

                        </div>

                        {/* Guarantee Strip */}
                        <div className="bg-stone-50 p-4 border-t border-gray-100 flex justify-center items-center gap-4 text-gray-500 grayscale opacity-80 transform scale-90 flex-wrap">
                            <span className="text-xs font-bold uppercase tracking-wider">FPX Online Banking</span>
                            <div className="h-4 w-px bg-gray-300"></div>
                            <span className="text-xs font-bold uppercase tracking-wider">GrabPay</span>
                            <div className="h-4 w-px bg-gray-300"></div>
                            <span className="text-xs font-bold uppercase tracking-wider">ShopeePay</span>
                            <div className="h-4 w-px bg-gray-300"></div>
                            <span className="text-xs font-bold uppercase tracking-wider">TnG eWallet</span>
                            <div className="h-4 w-px bg-gray-300"></div>
                            <span className="text-xs font-bold uppercase tracking-wider">COD (Barang Sampai Baru Bayar)</span>
                        </div>
                    </div>

                </motion.div>

                {/* ADDITIONAL TRUST (Money Back) */}
                <div className="mt-12 text-center">
                    <div className="inline-flex items-center gap-3 bg-emerald-800/30 backdrop-blur-sm px-6 py-3 rounded-full border border-emerald-500/30">
                        <ShieldCheck className="w-6 h-6 text-emerald-400" />
                        <span className="text-emerald-100 text-sm font-medium">Jaminan Wang Dikembalikan 30 Hari Jika Tidak Berpuas Hati</span>
                    </div>
                </div>

            </div>
        </section>
    );
}
