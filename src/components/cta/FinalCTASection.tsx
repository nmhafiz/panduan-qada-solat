"use client";

import { motion } from "framer-motion";
import { ArrowUp } from "lucide-react";

export default function FinalCTASection() {
    return (
        <section className="py-24 bg-green-900 relative overflow-hidden text-white">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>

            {/* Glow Effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-transparent via-green-800/50 to-green-950/80"></div>

            <div className="container mx-auto px-4 max-w-4xl relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-3xl md:text-5xl font-bold font-serif mb-8 leading-tight">
                        "Bayangkan Perasaan <span className="text-green-300">Tenang</span> Bila Hutang Lama Mula Lunas..."
                    </h2>

                    <p className="text-lg md:text-xl text-green-100/90 mb-10 leading-relaxed max-w-2xl mx-auto">
                        Tak perlu gopoh. Mulakan dengan satu langkah kecil hari ini.
                        Buku ini akan pimpin tangan anda, satu per satu, sehingga anda rasa lapang dan dekat kembali dengan-Nya.
                        <br /><br />
                        <strong>Jangan biarkan hari ini berlalu tanpa sebarang tindakan.</strong>
                    </p>

                    <motion.a
                        href="#checkout"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-green-950 font-bold text-lg md:text-xl px-6 md:px-10 py-4 md:py-5 rounded-full shadow-2xl hover:shadow-yellow-400/50 transition-all group border-2 border-yellow-300/50 max-w-full"
                    >
                        <span className="whitespace-nowrap">Dapatkan Kitab Sekarang</span>
                        <ArrowUp className="w-6 h-6 group-hover:-translate-y-1 transition-transform flex-shrink-0" />
                    </motion.a>

                    <p className="mt-6 text-sm text-green-300/60">
                        *Stok semakin susut. Dapatkan sebelum habis.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
