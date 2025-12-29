'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sparkles,
    ArrowRight,
    ShieldCheck,
    HeartHandshake
} from 'lucide-react';

interface UpsellModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpgrade: () => void;
    onContinue: () => void;
    currentPackage: 'solo' | 'combo' | 'family';
}

export default function UpsellModal({
    isOpen,
    onClose,
    onUpgrade,
    onContinue,
    currentPackage
}: UpsellModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!mounted) return null;

    const isSolo = currentPackage === 'solo';

    const content = isSolo ? {
        badge: "JIMAT RM20",
        headline: "Upgrade ke Pakej COMBO?",
        subheadline: "Hanya Tambah RM10 Sahaja!",
        valuePoint: "+1 Unit Buku & Ebook Solat Sunat",
        icon: Sparkles,
        iconColor: "text-amber-500",
        bgGradient: "from-amber-50 to-orange-100",
        cta: "Ya, Upgrade Pakej Combo"
    } : {
        badge: "PALING BERBALOI",
        headline: "Upgrade ke Pakej FAMILY?",
        subheadline: "Hanya Tambah RM10 Sahaja!",
        valuePoint: "+1 Unit Buku Extra (Sesuai Wakaf)",
        icon: HeartHandshake,
        iconColor: "text-emerald-600",
        bgGradient: "from-emerald-50 to-teal-100",
        cta: "Ya, Ambil Pakej Family"
    };

    const Icon = content.icon;

    const modalContent = (
        <AnimatePresence>
            {isOpen && (
                <div
                    className="fixed inset-0 flex items-center justify-center p-4"
                    style={{ zIndex: 999999 }}
                >
                    {/* Backdrop */}
                    <motion.div
                        key="upsell-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
                    />

                    {/* Compact Floating Card */}
                    <motion.div
                        key="upsell-content"
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 10 }}
                        transition={{
                            type: "spring",
                            damping: 25,
                            stiffness: 400
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white w-full max-w-sm rounded-[2rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)] overflow-hidden pointer-events-auto relative border border-gray-100"
                    >
                        {/* Compact Header */}
                        <div className={`bg-gradient-to-b ${content.bgGradient} p-6 pb-4 text-center relative border-b border-white/50`}>
                            <div className="flex justify-center mb-3">
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white shadow-sm border border-gray-100/50">
                                    <span className="text-[10px] font-black text-emerald-600 tracking-wider items-center uppercase">{content.badge}</span>
                                </div>
                            </div>

                            <h2 className="text-xl font-black text-gray-900 mb-1">{content.headline}</h2>
                            <p className="text-emerald-600 font-bold text-base flex items-center justify-center gap-1">
                                <span>{content.subheadline}</span>
                            </p>
                        </div>

                        {/* Centered Value Point */}
                        <div className="px-6 py-6 bg-white flex flex-col items-center">
                            <div className={`w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mb-3 ${content.iconColor}`}>
                                <Icon className="w-6 h-6" />
                            </div>
                            <div className="bg-emerald-50/50 px-4 py-2 rounded-xl border border-emerald-100/50 mb-6 w-full text-center">
                                <span className="text-emerald-800 font-bold text-sm">{content.valuePoint}</span>
                            </div>

                            {/* Actions Stacked - No Scroll Needed */}
                            <div className="w-full space-y-2.5">
                                <button
                                    onClick={onUpgrade}
                                    className={`w-full py-4 rounded-xl font-black text-base shadow-lg hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-white
                                    ${isSolo ? 'bg-gradient-to-r from-amber-500 to-orange-600' : 'bg-gradient-to-r from-emerald-600 to-teal-700'}
                                    `}
                                >
                                    <span>{content.cta}</span>
                                    <ArrowRight className="w-5 h-5 stroke-[2.5px]" />
                                </button>

                                <button
                                    onClick={onContinue}
                                    className="w-full py-2.5 font-bold text-gray-400 hover:text-gray-500 transition-all text-xs uppercase tracking-widest bg-transparent"
                                >
                                    Tidak, Kekal Pakej Asal
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );

    return createPortal(modalContent, document.body);
}
