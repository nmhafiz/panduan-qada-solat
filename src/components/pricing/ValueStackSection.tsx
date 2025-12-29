"use client";

import { motion } from "framer-motion";


export default function ValueStackSection() {
    return (
        <section className="py-20 bg-emerald-50/50">
            <div className="container mx-auto px-4 max-w-3xl">
                <div className="text-center mb-10">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 font-serif">
                        Berapa Nilai Sebenar Ilmu Ini?
                    </h2>
                    <p className="text-gray-600 mt-2 text-sm md:text-base">
                        Jika anda cari satu persatu di luar sana:
                    </p>
                </div>

                <div className="relative max-w-lg mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                    {/* Header */}
                    <div className="bg-gray-50 p-6 border-b border-gray-200">
                        <h3 className="font-bold text-gray-500 text-xs uppercase tracking-wider text-center">Pecahan Harga Pasaran</h3>
                    </div>

                    {/* List */}
                    <div className="p-6 md:p-8 space-y-4">
                        <div className="flex justify-between items-center text-base md:text-lg text-gray-800">
                            <span className="flex-1 text-left">📖 Panduan Fizikal</span>
                            <span className="font-mono font-bold text-gray-400">RM 89</span>
                        </div>
                        <div className="flex justify-between items-center text-base md:text-lg text-gray-800">
                            <span className="flex-1 text-left">📱 Ebook Bonus</span>
                            <span className="font-mono font-bold text-gray-400">RM 59</span>
                        </div>
                        <div className="flex justify-between items-center text-base md:text-lg text-gray-800">
                            <span className="flex-1 text-left">🚚 Postage</span>
                            <span className="font-mono font-bold text-gray-400">RM 10</span>
                        </div>

                        <div className="h-px bg-gray-200 my-4"></div>

                        <div className="flex justify-between items-center">
                            <span className="font-bold text-gray-900">Total Nilai</span>
                            <div className="text-right relative">
                                <span className="block text-2xl font-extrabold text-gray-300 line-through decoration-red-400/50">RM 158</span>
                            </div>
                        </div>
                    </div>
                </div>

                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    className="mt-10 text-center"
                >
                    <p className="text-xl text-gray-800 font-medium mb-4">
                        TAPI... Khas Untuk Tawaran Hari Ini:
                    </p>
                    <div className="inline-block bg-gradient-to-r from-red-600 to-red-500 text-white text-3xl md:text-5xl font-bold px-8 py-4 rounded-xl shadow-lg -rotate-1 transform">
                        Bermula RM49 Sahaja!
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
