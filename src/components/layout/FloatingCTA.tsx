"use client";
import React, { useEffect, useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FloatingCTA() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px'
        };

        const handleIntersection = (entries: IntersectionObserverEntry[]) => {
            entries.forEach(entry => {
                if (entry.target.id === 'solution' && entry.isIntersecting) {
                    setIsVisible(true);
                }
                if (entry.target.id === 'price' && entry.isIntersecting) {
                    setIsVisible(false);
                }
            });
        };

        const observer = new IntersectionObserver(handleIntersection, observerOptions);

        const solutionSection = document.getElementById('solution');
        const priceSection = document.getElementById('price');

        if (solutionSection) observer.observe(solutionSection);
        if (priceSection) observer.observe(priceSection);

        // Fallback for direct scroll if elements not immediately available
        const handleScrollFallback = () => {
            if (window.scrollY < 200) setIsVisible(false);
        };
        window.addEventListener('scroll', handleScrollFallback, { passive: true });

        return () => {
            if (solutionSection) observer.unobserve(solutionSection);
            if (priceSection) observer.unobserve(priceSection);
            window.removeEventListener('scroll', handleScrollFallback);
        };
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
                    <div className="bg-emerald-950/90 backdrop-blur-xl border border-emerald-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-2xl p-3 overflow-hidden relative">
                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_3s_infinite] pointer-events-none"></div>

                        <div className="flex items-center justify-between gap-3 relative z-10">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5 truncate">
                                    <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
                                    <span className="text-[9px] uppercase tracking-tighter font-black text-emerald-400 whitespace-nowrap">
                                        Edisi 2026 • Jimat RM109
                                    </span>
                                </div>
                                <h4 className="text-white font-bold text-xs leading-none truncate mb-1">
                                    Selesaikan Hutang Solat
                                </h4>
                                <div className="text-emerald-400 font-bold text-[10px] leading-tight flex items-center gap-1">
                                    <span className="opacity-60 font-normal line-through">RM168</span>
                                    <span>RM59</span>
                                    <span className="bg-amber-400 text-amber-950 px-1 rounded-[2px] text-[8px] uppercase font-black ml-1">POPULAR</span>
                                </div>
                            </div>

                            <motion.button
                                onClick={() => document.getElementById('checkout')?.scrollIntoView({ behavior: 'smooth' })}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-gradient-to-r from-amber-400 to-amber-600 text-emerald-950 px-4 py-2.5 rounded-xl font-bold text-[11px] shadow-xl flex items-center gap-1.5 shrink-0"
                            >
                                <span className="whitespace-nowrap">Tempah Sekarang</span>
                                <ArrowRight className="w-3 h-3" />
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
