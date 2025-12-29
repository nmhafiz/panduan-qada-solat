"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    ShieldCheck,
    Truck,
    Package,
    CheckCircle2,
    Lock,
    RotateCcw
} from "lucide-react";

const TRUST_POINTS = [
    {
        icon: ShieldCheck,
        title: "100% Original HQ",
        description: "Buku berkualiti tinggi terus dari gudang penulis (BUKAN cetakan haram).",
        color: "emerald"
    },
    {
        icon: RotateCcw,
        title: "Jaminan Sampai",
        description: "Rosak atau hilang semasa pos? Kami ganti baru atau pulangkan wang anda.",
        color: "blue"
    },
    {
        icon: Lock,
        title: "Privasi Dijamin",
        description: "Data anda sulit & dienkripsi. Kami tidak akan berkongsi maklumat anda.",
        color: "teal"
    }
];

const PROCESS_STEPS = [
    {
        icon: Package,
        title: "Order Disahkan",
        desc: "Resit & Butiran Order dihantar via WhatsApp/Email."
    },
    {
        icon: Truck,
        title: "Proses & Pos",
        desc: "Barang dipos dlm 24 jam (Hari bekerja) via DHL/NinjaVan."
    },
    {
        icon: CheckCircle2,
        title: "Selamat Sampai",
        desc: "Tracking hantar ke phone anda. Buku sampai dlm 1-3 hari."
    }
];

export default function TrustProcessSection() {
    return (
        <section className="py-20 bg-white overflow-hidden">
            <div className="container mx-auto px-4 max-w-6xl">

                {/* Section Header */}
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-2xl md:text-4xl font-serif font-bold text-gray-900 mb-4"
                    >
                        Kenapa Anda Boleh Berurusan Dengan Kami <span className="text-emerald-600">Tanpa Ragu-Ragu</span>
                    </motion.h2>
                    <div className="w-20 h-1.5 bg-emerald-500 mx-auto rounded-full"></div>
                </div>

                {/* Trust Pillars Grid */}
                <div className="grid md:grid-cols-3 gap-8 mb-24">
                    {TRUST_POINTS.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-stone-50 p-8 rounded-[2rem] border border-stone-100 hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-500 text-center group"
                        >
                            <div className={`w-16 h-16 rounded-2xl bg-${item.color}-100 text-${item.color}-600 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500`}>
                                <item.icon className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                {item.description}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Roadmap Section */}
                <div className="relative">
                    <div className="text-center mb-12">
                        <span className="text-[10px] uppercase font-black text-emerald-600 tracking-[0.2em] mb-2 block">Our Workflow</span>
                        <h2 className="text-xl font-bold text-gray-900">Apa Berlaku Selepas Anda Tempah?</h2>
                    </div>

                    {/* Desktop Line Connector */}
                    <div className="hidden md:block absolute top-[4.5rem] left-[15%] right-[15%] h-0.5 bg-dashed bg-gradient-to-r from-emerald-100 via-emerald-500 to-emerald-100 opacity-30"></div>

                    <div className="grid md:grid-cols-3 gap-12 relative z-10">
                        {PROCESS_STEPS.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 + (index * 0.1) }}
                                className="flex flex-col items-center text-center"
                            >
                                <div className="w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center mb-6 shadow-lg shadow-emerald-600/20 relative">
                                    <step.icon className="w-6 h-6" />
                                    {/* Small number badge */}
                                    <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-white border-2 border-emerald-600 text-emerald-600 flex items-center justify-center text-[10px] font-black">
                                        {index + 1}
                                    </div>
                                </div>
                                <h4 className="font-bold text-gray-900 mb-2">{step.title}</h4>
                                <p className="text-xs text-gray-500 leading-relaxed max-w-[200px]">
                                    {step.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Infinite Marquee Strip */}
                <div className="mt-24 pt-12 border-t border-stone-100 relative">
                    <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10"></div>
                    <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10"></div>

                    <div className="overflow-hidden whitespace-nowrap">
                        <motion.div
                            className="inline-flex items-center gap-16 md:gap-32 px-4"
                            animate={{ x: ["0%", "-50%"] }}
                            transition={{
                                duration: 30,
                                ease: "linear",
                                repeat: Infinity
                            }}
                        >
                            {/* Original Set */}
                            <TrustBadges />
                            {/* Duplicate Set for Seamless Loop */}
                            <TrustBadges />
                        </motion.div>
                    </div>
                </div>

            </div>
        </section>
    );
}

function TrustBadges() {
    return (
        <div className="flex items-center gap-16 md:gap-32 opacity-40 grayscale filter hover:grayscale-0 transition-all duration-700 py-4">
            {/* BeDaie */}
            <div className="flex items-center">
                <span className="font-serif font-black text-2xl md:text-5xl text-gray-800 tracking-tighter">BeDaie</span>
            </div>

            {/* DHL */}
            <div className="flex items-center">
                <img src="https://www.svgrepo.com/show/330296/dhl.svg" alt="DHL" className="h-12 md:h-20" />
            </div>

            {/* Bizappay */}
            <div className="flex items-center">
                <span className="font-sans font-black text-2xl md:text-5xl text-blue-600 tracking-tight">Bizappay</span>
            </div>

            {/* GrabPay - Stylized Text */}
            <div className="flex items-center">
                <span className="font-sans font-bold text-2xl md:text-4xl text-emerald-500 tracking-tighter flex items-center">
                    Grab<span className="text-emerald-600">Pay</span>
                </span>
            </div>

            {/* TnG - Stylized Text */}
            <div className="flex items-center">
                <span className="font-sans font-black text-2xl md:text-4xl text-blue-700 flex flex-col leading-none">
                    <span className="text-[10px] md:text-xs tracking-widest opacity-70">Touch &apos;n Go</span>
                    <span>eWallet</span>
                </span>
            </div>

            {/* ShopeePay - Stylized Text */}
            <div className="flex items-center">
                <span className="font-sans font-black text-2xl md:text-4xl text-orange-600 tracking-tight">
                    Shopee<span className="text-orange-500 font-bold">Pay</span>
                </span>
            </div>

            {/* J&T Express */}
            <div className="flex items-center">
                <span className="font-black text-2xl md:text-4xl italic text-red-600 tracking-tighter">J&T <span className="text-gray-900 not-italic">EXPRESS</span></span>
            </div>

            {/* FPX */}
            <div className="flex items-center gap-1 px-4 py-2 border-4 border-gray-400 rounded-2xl">
                <span className="font-black text-xl md:text-3xl text-gray-700 uppercase italic">fpx</span>
            </div>

            {/* Pos Malaysia */}
            <div className="flex items-center font-black text-base md:text-2xl text-gray-800 tracking-[0.3em] uppercase">Pos Malaysia</div>
        </div>
    );
}
