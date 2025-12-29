"use client";

import { motion } from "framer-motion";
import { X, Check } from "lucide-react";

export default function ComparisonSection() {
    return (
        <section className="py-24 bg-stone-100 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-50"></div>

            <div className="container mx-auto px-4 max-w-6xl relative z-10">
                <div className="text-center mb-16 max-w-2xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 font-serif leading-tight">
                        Kenapa Ramai Kekal <br /> <span className="text-red-500 italic">&quot;Ahli Nanti Dulu&quot;?</span>
                    </h2>
                    <p className="text-lg text-gray-600 leading-relaxed">
                        Lihat beza ketara bila anda ada strategi yang betul. Jangan biarkan hutang solat jadi beban yang tak sudah.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-stretch">

                    {/* --- THE OLD WAY (CHAOS) --- */}
                    <motion.div
                        initial={{ opacity: 0, x: -30, rotate: -2 }}
                        whileInView={{ opacity: 1, x: 0, rotate: -2 }}
                        transition={{ duration: 0.6 }}
                        className="bg-white/80 p-8 md:p-10 rounded-3xl border border-stone-200 shadow-sm relative overflow-hidden group grayscale-[0.3] hover:grayscale-0 transition-all duration-500"
                    >
                        {/* crumpled paper effect overlay */}
                        <div className="absolute inset-0 bg-stone-100/50 mix-blend-multiply opacity-50"></div>

                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-8 opacity-70">
                                <span className="px-3 py-1 bg-gray-200 text-gray-600 rounded-lg text-xs font-bold uppercase tracking-widest">Cara Lama</span>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-700 mb-6 font-serif opacity-80 decoration-4 decoration-red-300 underline underline-offset-4">
                                Rasa Beban & Keliru
                            </h3>
                            <ul className="space-y-5">
                                {[
                                    "Kira manual atas kertas koyak",
                                    "Tak ada sistem, main agak-agak",
                                    "Rasa hutang terlalu banyak",
                                    "Tak tahu niat yang betul",
                                    "Semangat sekejap, lepas tu stop"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-4 text-gray-500">
                                        <div className="mt-1 p-0.5 bg-gray-100 rounded-full">
                                            <X className="w-4 h-4 text-gray-400" />
                                        </div>
                                        <span className="font-medium line-through decoration-gray-300 decoration-2">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>

                    {/* --- THE NEW WAY (CLARITY) --- */}
                    <motion.div
                        initial={{ opacity: 0, x: 30, scale: 1.02 }}
                        whileInView={{ opacity: 1, x: 0, scale: 1.02 }}
                        transition={{ duration: 0.6 }}
                        className="bg-white p-8 md:p-10 rounded-3xl border-2 border-emerald-500 shadow-2xl shadow-emerald-200/50 relative overflow-hidden z-20"
                    >
                        {/* Shine Effect */}
                        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-gradient-to-b from-emerald-50 to-transparent opacity-50 blur-3xl -translate-y-1/2 translate-x-1/2 rounded-full pointer-events-none"></div>

                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-8">
                                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold uppercase tracking-widest border border-emerald-200">New Strategy</span>
                                <div className="text-emerald-500">
                                    <Check className="w-6 h-6 border-2 border-emerald-500 rounded-full p-0.5" />
                                </div>
                            </div>

                            <h3 className="text-3xl font-bold text-gray-900 mb-6 font-serif">
                                Minda Tenang... <br /><span className="text-emerald-600">Ada Sistem!</span>
                            </h3>

                            <ul className="space-y-5">
                                {[
                                    "Kira Auto guna Formula Khas",
                                    "Tracker visual yang 'Satisfying'",
                                    "Strategi 'Snowball' (Mula sikit)",
                                    "Lafaz Niat Rumi & Arab"
                                ].map((item, i) => (
                                    <motion.li
                                        key={i}
                                        initial={{ opacity: 0, x: 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.2 + (i * 0.1) }}
                                        className="flex items-start gap-4"
                                    >
                                        <div className="mt-1 p-1 bg-emerald-100 rounded-full text-emerald-600 shadow-sm">
                                            <Check className="w-4 h-4" />
                                        </div>
                                        <span className="font-bold text-gray-800 text-lg">{item}</span>
                                    </motion.li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
