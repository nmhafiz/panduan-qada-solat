"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
    {
        question: "Boleh bayar masa barang sampai (COD)?",
        answer: "Boleh, tiada masalah. Kami menggunakan khidmat kurier DHL untuk barang sampai baru anda bayar. Cuma pilih 'COD' di borang tempahan."
    },
    {
        question: "Berapa lama buku akan sampai?",
        answer: "Untuk Semenanjung Malaysia, kebiasaannya ambil masa 1-3 hari bekerja. Untuk Sabah & Sarawak, 3-5 hari bekerja bergantung pada kawasan."
    },
    {
        question: "Buku ni sesuai untuk umur berapa?",
        answer: "Buku ini ditulis dengan bahasa santai dan mudah faham. Sesuai untuk remaja seawal 12 tahun sehinggalah warga emas. Tiada istilah berat yang memeningkan."
    },
    {
        question: "Kalau beli Pakej Combo, macam mana nak dapat Ebook?",
        answer: "Link download Ebook akan dihantar terus ke email anda sejurus selepas tempahan disahkan. Pastikan anda masukkan email yang betul."
    },
    {
        question: "Adakah buku ini patuh syariah?",
        answer: "Ya, isi kandungan buku ini telah disemak oleh panel syariah bertauliah dan mengikut pegangan Ahli Sunnah Wal Jamaah (Mazhab Syafi'i)."
    }
];

export default function FAQSection() {
    const [activeIndex, setActiveIndex] = useState<number | null>(0);

    return (
        <section className="py-20 bg-gray-50 border-t border-gray-200">
            <div className="container mx-auto px-4 max-w-3xl">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm text-gray-600 text-sm font-semibold mb-6">
                        <HelpCircle className="w-4 h-4 text-green-600" />
                        Soalan Lazim
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-serif">
                        Ada Persoalan Yang <span className="text-green-600">Belum Terjawab?</span>
                    </h2>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, idx) => (
                        <div
                            key={idx}
                            className={`bg-white rounded-2xl border transition-all duration-300 ${activeIndex === idx ? 'border-green-500 shadow-lg' : 'border-gray-200 hover:border-green-200'}`}
                        >
                            <button
                                onClick={() => setActiveIndex(activeIndex === idx ? null : idx)}
                                className="w-full flex items-center justify-between p-6 text-left"
                            >
                                <span className={`font-bold text-lg ${activeIndex === idx ? 'text-green-700' : 'text-gray-800'}`}>
                                    {faq.question}
                                </span>
                                <ChevronDown
                                    className={`w-6 h-6 text-gray-400 transition-transform duration-300 ${activeIndex === idx ? 'rotate-180 text-green-500' : ''}`}
                                />
                            </button>

                            <AnimatePresence>
                                {activeIndex === idx && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="p-6 pt-0 text-gray-600 leading-relaxed border-t border-gray-50 mt-2">
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
