"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
    {
        question: "Apa itu Qadha Solat? (Penting)",
        answer: "Qadha solat bermaksud menggantikan solat fardhu yang ditinggalkan (sama ada sengaja atau tidak sengaja) selepas berlalunya waktu solat tersebut. Ia berbeza dengan Solat Jamak/Qasar."
    },
    {
        question: "Wajibkah Qadha Solat yang tertinggal lama?",
        answer: "Mengikut Jumhur Ulama (Majoriti) termasuk Mazhab Syafi'i, Maliki, Hanafi, dan Hanbali - WAJIB mengqadha semua solat fardhu yang ditinggalkan walaupun ia berlaku bertahun-tahun lamanya. Ia dikira sebagai hutang dengan Allah yang mesti dilunaskan segera."
    },
    {
        question: "Bagaimana cara kira jumlah solat yang tertinggal?",
        answer: "Dalam buku ini, kami sediakan 'Sistem Log Mufashil' dan formula mudah untuk anda anggar jumlah tahun yang tertinggal. Anda tak perlu ingat setiap hari, cukup sekadar anggaran yakin (Ghalib ad-Zhan)."
    },
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
        <section id="faq" className="py-24 bg-gradient-to-b from-emerald-50/30 to-stone-100 relative overflow-hidden border-t border-stone-200">
            {/* Background Pattern - Islamic Geometric (Undeniable Visibility) */}
            <div className="absolute inset-0 opacity-[0.15] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>

            {/* Ambient Glows */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="container mx-auto px-4 max-w-3xl relative z-10">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 bg-emerald-100/50 px-4 py-2 rounded-full border border-emerald-200 shadow-sm text-emerald-800 text-sm font-bold mb-6 backdrop-blur-sm"
                    >
                        <HelpCircle className="w-4 h-4" />
                        Soalan Lazim
                    </motion.div>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 font-serif leading-tight">
                        Ada Persoalan Yang <br className="md:hidden" />
                        <span className="text-emerald-700">Belum Terjawab?</span>
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
