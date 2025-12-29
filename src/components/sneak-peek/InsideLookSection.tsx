"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Calculator,
    Calendar,
    BookOpen,
    PenTool,
    ArrowRight,
    VolumeX
} from 'lucide-react';

const insideContent = [
    {
        title: "Formula Kiraan Pantas",
        subtitle: "Matematik Mudah",
        desc: "Tak perlu pening kepala. Guna formula X+Y yang kami sediakan untuk tahu anggaran hutang puasa & solat anda dalam 5 minit.",
        icon: Calculator,
        color: "bg-blue-50 text-blue-600",
        border: "border-blue-100"
    },
    {
        title: "Jadual Qadha Tracker",
        subtitle: "Sistem Rekod",
        desc: "Template jadual siap 'tick-box'. Cetak dan tampal di dinding. Tanda setiap kali selesai qadha untuk nampak progress depan mata.",
        icon: Calendar,
        color: "bg-emerald-50 text-emerald-600",
        border: "border-emerald-100"
    },
    {
        title: "Lafaz Niat & Tata Cara",
        subtitle: "Panduan Langkah demi Langkah",
        desc: "Jangan risau salah niat. Kami sediakan lafaz Rumi & Arab untuk setiap waktu solat, lengkap dengan cara susun dengan solat fardu.",
        icon: BookOpen,
        color: "bg-amber-50 text-amber-600",
        border: "border-amber-100"
    },
    {
        title: "Ruang Catatan Kuliah",
        subtitle: "Nota Peribadi",
        desc: "Ruang khas untuk anda catat ilmu baru dari kuliah Ustaz. Jadikan buku ini sebagai 'Diari Taubat' anda yang personal.",
        icon: PenTool,
        color: "bg-rose-50 text-rose-600",
        border: "border-rose-100"
    }
];

function VideoPlayer({ className }: { className?: string }) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isMuted, setIsMuted] = useState(true);

    useEffect(() => {
        if (videoRef.current) {
            // Ensure video plays on mount (muted)
            videoRef.current.muted = true;
            videoRef.current.play().catch(error => {
                console.log("Autoplay prevented:", error);
            });
        }
    }, []);

    const handleUnmute = () => {
        if (videoRef.current) {
            videoRef.current.muted = false;
            setIsMuted(false);
            videoRef.current.currentTime = 0; // Restart video for full context
            videoRef.current.play();
        }
    };

    return (
        <div className={`relative group overflow-hidden ${className}`}>
            <video
                ref={videoRef}
                src="/videoqadasolatpromo.mp4"
                className="w-full h-full object-cover"
                loop
                playsInline
                muted={isMuted}
                controls={!isMuted} // Only show controls when unmuted
            />

            {/* MUTE OVERLAY - Visible only when Muted */}
            {isMuted && (
                <div
                    onClick={handleUnmute}
                    className="absolute inset-0 z-20 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors cursor-pointer group/overlay"
                >
                    {/* Pulsing Speaker Icon */}
                    <div className="relative">
                        <div className="absolute inset-0 bg-white/20 rounded-full blur-xl animate-pulse"></div>
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
                            className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40 shadow-xl group-hover/overlay:scale-110 transition-transform duration-300"
                        >
                            <VolumeX className="w-8 h-8 text-white drop-shadow-md" />
                        </motion.div>
                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 whitespace-nowrap">
                            <span className="text-xs font-bold text-white uppercase tracking-widest bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm">
                                Tap to Unmute
                            </span>
                        </div>


                    </div>
                </div>
            )}
        </div>
    );
}

export default function InsideLookSection() {
    return (
        <section id="preview" className="py-24 bg-stone-50 overflow-hidden relative">
            {/* Background Gradients */}
            <div className="absolute top-0 right-0 w-full h-[500px] bg-gradient-to-b from-white to-transparent opacity-80 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-50/50 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="container mx-auto px-4 relative z-10">

                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="px-4 py-1.5 rounded-full bg-white border border-stone-200 shadow-sm text-xs font-bold uppercase tracking-widest text-emerald-800 mb-4 inline-block">
                            Sneak Peek
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-serif tracking-tight">
                            Apa Yang Ada <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-800">Di Dalam?</span>
                        </h2>
                        <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
                            Bukan sekadar teks padat. Ini adalah workbook praktikal yang direka untuk memudahkan urusan akhirat anda.
                        </p>
                    </motion.div>
                </div>

                {/* --- DESKTOP: BENTO GRID --- */}
                <div className="hidden md:grid grid-cols-12 gap-6 max-w-6xl mx-auto">
                    {/* Featured Large Card (Video) */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="col-span-5 bg-stone-900 rounded-[2rem] shadow-xl shadow-emerald-900/20 border border-stone-800 relative overflow-hidden flex flex-col"
                    >
                        {/* Video Header */}
                        <div className="p-6 pb-0 relative z-10">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                                <span className="text-white/60 text-xs font-bold uppercase tracking-widest">Sneak Peek</span>
                            </div>
                            <h3 className="text-2xl font-bold text-white font-serif">Video Panduan & Isi Buku</h3>
                        </div>

                        {/* Video Player */}
                        <div className="flex-1 w-full h-full relative mt-4 bg-black rounded-t-[1.5rem] overflow-hidden mx-4 mb-4">
                            <VideoPlayer className="w-full h-full" />
                        </div>
                    </motion.div>

                    {/* Feature Grid */}
                    <div className="col-span-7 grid grid-cols-2 gap-6">
                        {insideContent.map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1, duration: 0.5 }}
                                className={`p-8 rounded-[2rem] bg-white border ${item.border} shadow-lg shadow-stone-200/40 hover:shadow-xl transition-shadow duration-300 flex flex-col items-start justify-between min-h-[240px] group`}
                            >
                                <div className={`p-3 rounded-2xl ${item.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                    <item.icon className="w-8 h-8" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-gray-900 mb-2 font-serif">{item.title}</h4>
                                    <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>


                {/* --- MOBILE: HORIZONTAL SNAP CARD (Digital Galley) --- */}
                <div className="md:hidden">
                    {/* Scroll Container */}
                    < div className="flex overflow-x-auto snap-x snap-center pb-8 -mx-4 px-4 space-x-4 no-scrollbar scroll-smooth" style={{ scrollBehavior: 'smooth' }}>

                        {/* 1. Video Card (Mobile) */}
                        <div className="snap-center shrink-0 w-[85vw] max-w-[320px] first:pl-2">
                            <div className="h-full bg-stone-900 rounded-[2rem] shadow-lg border border-stone-800 flex flex-col overflow-hidden relative">
                                <div className="p-5 relative z-10">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                                        <span className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Sneak Peek</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-white font-serif">Video Preview</h3>
                                </div>
                                <div className="flex-1 relative bg-black rounded-t-[1.5rem] overflow-hidden mx-4 mb-4">
                                    <VideoPlayer className="w-full h-full" />
                                </div>
                            </div>
                        </div>

                        {/* 2. Content Groups (Stacked Pairs) */}
                        {/* Group 1: Items 0 & 1 */}
                        <div className="snap-center shrink-0 w-[85vw] max-w-[320px] flex flex-col gap-3">
                            {insideContent.slice(0, 2).map((item, idx) => (
                                <div key={idx} className={`flex-1 bg-white rounded-[1.5rem] p-5 shadow-sm border ${item.border} flex flex-col items-start justify-center gap-3 relative overflow-hidden group`}>
                                    <div className="flex items-center gap-3 w-full">
                                        {/* Compact Icon */}
                                        <div className={`shrink-0 w-10 h-10 rounded-lg ${item.color} flex items-center justify-center shadow-sm`}>
                                            <item.icon className="w-5 h-5" />
                                        </div>
                                        {/* Header */}
                                        <div className="min-w-0">
                                            <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400 block">{item.subtitle}</span>
                                            <h3 className="text-base font-bold text-gray-900 font-serif leading-tight">{item.title}</h3>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">
                                        {item.desc}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Group 2: Items 2 & 3 */}
                        <div className="snap-center shrink-0 w-[85vw] max-w-[320px] flex flex-col gap-3">
                            {insideContent.slice(2, 4).map((item, idx) => (
                                <div key={idx} className={`flex-1 bg-white rounded-[1.5rem] p-5 shadow-sm border ${item.border} flex flex-col items-start justify-center gap-3 relative overflow-hidden group`}>
                                    <div className="flex items-center gap-3 w-full">
                                        {/* Compact Icon */}
                                        <div className={`shrink-0 w-10 h-10 rounded-lg ${item.color} flex items-center justify-center shadow-sm`}>
                                            <item.icon className="w-5 h-5" />
                                        </div>
                                        {/* Header */}
                                        <div className="min-w-0">
                                            <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400 block">{item.subtitle}</span>
                                            <h3 className="text-base font-bold text-gray-900 font-serif leading-tight">{item.title}</h3>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">
                                        {item.desc}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* 3. Spacer for last item visibility */}
                        <div className="snap-center shrink-0 w-4"></div>
                    </div>

                    {/* Swipe Indicator */}
                    <div className="flex justify-center items-center gap-2 text-xs text-gray-400 font-medium animate-pulse mt-2">
                        <span>Swipe ke tepi</span>
                        <ArrowRight className="w-3 h-3" />
                    </div>
                </div>

            </div>
        </section>
    );
}
