"use client";

import { motion } from "framer-motion";
import { XCircle, CheckCircle } from "lucide-react";

export default function ComparisonSection() {
    return (
        <section className="py-20 bg-gray-50 relative">
            <div className="container mx-auto px-4 max-w-5xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 font-serif">
                        Kenapa Ramai <span className="text-red-600">Gagal</span> Habiskan Qadha?
                    </h2>
                    <p className="text-lg text-gray-600">
                        Ini beza ketara antara cara biasa dengan strategi yang disusun dalam buku ini.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 md:gap-12 text-left">
                    {/* OLD WAY */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className="bg-white p-8 rounded-3xl border-2 border-red-100 shadow-sm"
                    >
                        <h3 className="text-xl font-bold text-red-600 mb-6 flex items-center gap-2">
                            <XCircle className="w-6 h-6" /> Cara Biasa (Susah)
                        </h3>
                        <ul className="space-y-4">
                            {[
                                "Kira manual atas kertas koyak/hilang",
                                "Tak ada sistem rekod, main agak-agak",
                                "Rasa beban sebab nampak hutang banyak",
                                "Tak tahu cara niat & tertib sebenar",
                                "Buat sekejap, lepas tu berhenti sebab bosan"
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-3 text-gray-600">
                                    <XCircle className="w-5 h-5 text-red-200 flex-shrink-0 mt-0.5" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* NEW WAY */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className="bg-green-50 p-8 rounded-3xl border-2 border-green-500 shadow-xl relative overflow-hidden"
                    >
                        {/* Badge */}
                        <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                            RECOMMENDED
                        </div>

                        <h3 className="text-xl font-bold text-green-700 mb-6 flex items-center gap-2">
                            <CheckCircle className="w-6 h-6" /> Kaedah Panduan Qadha
                        </h3>
                        <ul className="space-y-4">
                            {[
                                "Panduan Bergambar & Flowchart",
                                "Ada Ruang Nota & Rujukan Pantas",
                                "Strategi 'Snowball' (mula sikit lama-lama bukit)",
                                "Bahasa Mudah & Terus Praktikal",
                                "Rasa seronok & semangat nak mula"
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-3 text-gray-800 font-medium">
                                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </div>

                {/* Bridge Connector */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-10">
                    <div className="bg-white p-3 rounded-full shadow-lg border border-gray-100">
                        <motion.div
                            animate={{ y: [0, 5, 0] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                                <path d="M12 5v14" /><path d="m19 12-7 7-7-7" />
                            </svg>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
