"use client";

import { motion } from "framer-motion";
import { Check, Star } from "lucide-react";
import Link from "next/link";

const packages = [
    {
        id: 1,
        pkgId: "solo",
        name: "Pakej Jimat",
        subtitle: "1 Unit Buku",
        price: "49",
        normalPrice: "89",
        save: "40",
        items: [
            "1x Buku Panduan Qadha",
            "Free Postage (Semenanjung)",
        ],
        popular: false,
        buttonText: "Dapatkan Pakej Jimat",
        delay: 0.2
    },
    {
        id: 2,
        pkgId: "combo",
        name: "Pakej Combo",
        subtitle: "2 Unit Buku + Ebook",
        price: "59",
        normalPrice: "178",
        save: "119",
        items: [
            "2x Buku Panduan Qadha",
            "BONUS: Ebook Panduan Solat",
            "Free Postage (Semenanjung)",
        ],
        popular: true,
        buttonText: "Dapatkan Pakej Combo",
        delay: 0.4
    },
    {
        id: 3,
        pkgId: "family",
        name: "Pakej Famili",
        subtitle: "3 Unit Buku + Ebook",
        price: "69",
        normalPrice: "267",
        save: "198",
        items: [
            "3x Buku Panduan Qadha",
            "BONUS: Ebook Panduan Solat",
            "Free Postage (Semenanjung)"
        ],
        popular: false,
        buttonText: "Dapatkan Pakej Famili",
        delay: 0.6
    }
];

export default function PricingSection() {
    return (
        <section id="pricing" className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[100vw] h-[500px] bg-green-50/50 blur-3xl -z-10 rounded-full"></div>

            <div className="container mx-auto px-4 max-w-6xl relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-bold mb-6">
                        <Star className="w-4 h-4 fill-current" />
                        Harga Perkenalan Edisi {new Date().getFullYear()}
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 font-serif">
                        Mulakan Langkah <span className="text-green-600">Taubat</span> Sekarang
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Jangan bertangguh lagi. Pilih pakej yang sesuai dengan kemampuan anda. Pelaburan akhirat yang sangat berbaloi.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8 items-center">
                    {packages.map((pkg) => (
                        <motion.div
                            key={pkg.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: pkg.delay }}
                            className={`relative bg-white rounded-3xl border-2 ${pkg.popular ? 'border-green-500 shadow-2xl md:scale-105 z-20' : 'border-gray-100 shadow-xl z-10'} p-8 flex flex-col`}
                        >
                            {pkg.popular && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-green-500 text-white px-6 py-1 rounded-full text-sm font-bold shadow-lg flex items-center gap-2 whitespace-nowrap animate-pulse">
                                    <Star className="w-4 h-4 fill-current" /> Paling Ramai Pilih
                                </div>
                            )}

                            <div className="text-center mb-8">
                                <h3 className="text-2xl font-bold text-gray-900 mb-1">{pkg.name}</h3>
                                <p className="text-sm text-gray-500 mb-6">{pkg.subtitle}</p>

                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <span className="text-gray-400 line-through text-lg">RM{pkg.normalPrice}</span>
                                    <span className="text-red-500 font-bold text-sm bg-red-50 px-2 py-1 rounded">Jimat RM{pkg.save}</span>
                                </div>
                                <div className="text-5xl font-bold text-gray-900">
                                    <span className="text-2xl align-top text-gray-500">RM</span>{pkg.price}
                                </div>
                            </div>

                            <ul className="space-y-4 mb-8 flex-1">
                                {pkg.items.map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-3">
                                        <div className={`mt-1 rounded-full p-0.5 ${pkg.popular ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                                            <Check className="w-4 h-4" strokeWidth={3} />
                                        </div>
                                        <span className="text-gray-700 text-sm font-medium">{item}</span>
                                    </li>
                                ))}
                            </ul>

                            <Link
                                href={`/?pkg=${pkg.pkgId}#checkout`}
                                className={`w-full block text-center py-4 rounded-xl font-bold transition-all duration-300 transform hover:-translate-y-1 ${pkg.popular ? 'bg-green-600 text-white hover:bg-green-700 shadow-green-200 shadow-lg' : 'bg-gray-900 text-white hover:bg-gray-800'}`}
                            >
                                {pkg.buttonText}
                            </Link>

                            <p className="text-center text-xs text-gray-400 mt-4">
                                Pembayaran selamat via FPX/Bizappay
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
