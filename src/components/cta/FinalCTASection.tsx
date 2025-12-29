"use client";

import { motion } from "framer-motion";
import { ArrowUp } from "lucide-react";

export default function FinalCTASection() {
    return (
        <section className="py-24 bg-emerald-950 relative overflow-hidden text-white">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>

            {/* NEW: Focal Light Effect (Pencahayaan Hidayah) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[600px] bg-emerald-400/10 blur-[120px] rounded-full pointer-events-none z-0"></div>

            {/* Glow Effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-transparent via-emerald-800/20 to-emerald-950"></div>

            <div className="container mx-auto px-4 max-w-4xl relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    {/* NEW: Social Proof "Live" Counter */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-900/40 border border-emerald-500/30 text-emerald-100 text-xs md:text-sm font-bold tracking-wider uppercase mb-8 backdrop-blur-sm"
                    >
                        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                        Sertai <span className="text-emerald-400">30,000+</span> Pembaca Yang Dah Bermula
                    </motion.div>

                    <h2 className="text-3xl md:text-5xl font-bold font-serif mb-8 leading-tight">
                        &ldquo;Bayangkan Perasaan <span className="text-emerald-400">Tenang</span> Bila Hutang Lama Mula Lunas...&rdquo;
                    </h2>

                    <p className="text-lg md:text-xl text-emerald-100/90 mb-10 leading-relaxed max-w-2xl mx-auto">
                        Tak perlu gopoh. Mulakan dengan satu langkah kecil hari ini.
                        Buku ini akan pimpin tangan anda, satu per satu, sehingga anda rasa lapang dan dekat kembali dengan-Nya.
                        <br /><br />
                        <strong>Jangan biarkan hari ini berlalu tanpa sebarang tindakan.</strong>
                    </p>

                    <motion.a
                        href="#checkout"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-amber-400 to-amber-600 text-emerald-950 font-bold text-lg md:text-xl px-6 md:px-10 py-4 md:py-5 rounded-full shadow-2xl hover:shadow-amber-400/50 transition-all group border-2 border-amber-300/50 max-w-full"
                    >
                        <span className="whitespace-nowrap uppercase tracking-wider">Dapatkan Buku Sekarang</span>
                        <ArrowUp className="w-6 h-6 group-hover:-translate-y-1 transition-transform flex-shrink-0" />
                    </motion.a>

                    <p className="mt-6 text-sm text-emerald-300/60 font-medium italic">
                        *Langkah kecil anda hari ini adalah hadiah paling bermakna buat diri sendiri di sana nanti.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
