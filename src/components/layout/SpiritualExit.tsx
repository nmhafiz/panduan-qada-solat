"use client";

import { motion } from "framer-motion";

export default function SpiritualExit() {
    return (
        <section className="py-24 bg-stone-100 relative overflow-hidden flex flex-col items-center justify-center text-center">
            {/* Very subtle background light */}
            <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>

            <div className="container mx-auto px-4 max-w-3xl relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                >
                    {/* Arabic Text */}
                    <div className="mb-8">
                        <span className="text-3xl md:text-5xl font-serif text-emerald-900/40 leading-relaxed block tracking-widest italic opacity-50">
                            أَوَّلُ مَا يُحَاسَبُ بِهِ الْعَبْدُ يَوْمَ الْقِيَامَةِ مِنْ عَمَلِهِ صَلَاتُهُ
                        </span>
                    </div>

                    {/* Divider Icon */}
                    <div className="flex items-center justify-center gap-4 mb-8">
                        <div className="h-[1px] w-12 bg-emerald-900/10"></div>
                        <div className="w-2 h-2 rounded-full bg-emerald-500/20"></div>
                        <div className="h-[1px] w-12 bg-emerald-900/10"></div>
                    </div>

                    {/* Translation */}
                    <h3 className="text-2xl md:text-4xl font-serif text-emerald-950 font-medium leading-tight mb-6">
                        &ldquo;Perkara pertama yang akan dihisab <br className="hidden md:block" />
                        daripada amalan seorang hamba pada hari kiamat ialah <span className="text-emerald-700 italic text-3xl md:text-5xl block mt-2">solatnya.</span>&rdquo;
                    </h3>

                    {/* Reference */}
                    <p className="text-sm md:text-base text-stone-500 font-medium tracking-widest uppercase mb-12">
                        — Hadis Riwayat Abu Daud & Tirmidzi
                    </p>

                    <div className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500/30"></div>
                </motion.div>
            </div>

            {/* Subtle Gradient Fade to Footer */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-gray-900/5 to-transparent"></div>
        </section>
    );
}
