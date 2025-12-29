"use client";
import React, { useEffect, useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FloatingCTA() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 400) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 100, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 100, scale: 0.9 }}
                    className="fixed bottom-6 left-4 right-4 z-[100] md:hidden"
                >
                    <div className="bg-emerald-950/90 backdrop-blur-xl border border-emerald-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-2xl p-4 overflow-hidden relative">
                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_3s_infinite] pointer-events-none"></div>

                        <div className="flex items-center justify-between gap-4 relative z-10">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-0.5">
                                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                                    <span className="text-[10px] uppercase tracking-widest font-bold text-emerald-400">
                                        Edisi Terhad 2026
                                    </span>
                                </div>
                                <h4 className="text-white font-bold text-sm md:text-base leading-tight">
                                    Selesaikan Hutang Solat
                                </h4>
                                <p className="text-emerald-400/70 text-[10px] font-medium italic">
                                    *Pakej Cetakan Pertama: Jimat RM109
                                </p>
                            </div>

                            <motion.button
                                onClick={() => document.getElementById('checkout')?.scrollIntoView({ behavior: 'smooth' })}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                animate={{
                                    boxShadow: ["0px 0px 0px rgba(245,158,11,0)", "0px 0px 15px rgba(245,158,11,0.5)", "0px 0px 0px rgba(245,158,11,0)"]
                                }}
                                transition={{
                                    boxShadow: { repeat: Infinity, duration: 2 }
                                }}
                                className="bg-gradient-to-r from-amber-400 to-amber-600 text-emerald-950 px-5 py-3 rounded-xl font-bold text-sm shadow-xl flex items-center gap-2 relative group overflow-hidden active:scale-95 transition-transform"
                            >
                                <motion.span
                                    animate={{ y: [0, -2, 0] }}
                                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                                    className="whitespace-nowrap flex items-center gap-2"
                                >
                                    Tempah Sekarang
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </motion.span>
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
