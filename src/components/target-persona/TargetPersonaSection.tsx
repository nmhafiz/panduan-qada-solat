"use client";

import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import {
    CheckCircle2, XCircle,
    History, Calculator, Briefcase, HeartHandshake, Users, // Yes Icons
    Gamepad2, Armchair, ShieldAlert, Hourglass, PartyPopper, // No Icons
} from "lucide-react";

// --- Data (Updated Copywriting) ---
const suitableFor = [
    { text: "Pernah Jahiliah & Tinggal Solat", icon: History, sub: "Nak tebus balik masa lampau." },
    { text: "Buntu & Stress Kira Hutang", icon: Calculator, sub: "Tak jumpa formula yang tepat." },
    { text: "Sibuk Kerja Tapi Takut Mati", icon: Briefcase, sub: "Nak setelkan cara pantas & yakin." },
    { text: "Rasa 'Give Up' Sebab Banyak", icon: HeartHandshake, sub: "Perlukan harapan & method mudah." },
    { text: "Ibu Bapa Risaukan Anak", icon: Users, sub: "Nak didik anak qadha dari awal." }
];

const notSuitableFor = [
    { text: "Anggap Solat Benda Remeh", icon: Gamepad2 },
    { text: "Malas, Nak Selesai Tanpa Usaha", icon: Armchair },
    { text: "Perasan Suci & Tiada Hutang", icon: ShieldAlert },
    { text: "Suka Bertangguh 'Esok Ada'", icon: Hourglass },
    { text: "Lebih Rela Habiskan Duit Hiburan", icon: PartyPopper }
];

export default function TargetPersonaSection() {
    const [activeTab, setActiveTab] = useState<'suitable' | 'notSuitable'>('suitable');

    // State for Smart Floating Pill
    const [showFixedPill, setShowFixedPill] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);
    const staticPillRef = useRef<HTMLDivElement>(null);

    // Initial check and Scroll Listener to toggle Fixed Pill
    useEffect(() => {
        const handleScroll = () => {
            if (!staticPillRef.current || !sectionRef.current) return;

            const staticRect = staticPillRef.current.getBoundingClientRect();
            const sectionRect = sectionRef.current.getBoundingClientRect();

            // Show fixed pill if:
            // 1. We have scrolled PAST the static pill (top < 120 approx navbar height)
            // 2. We are still inside the section (bottom > 150 to avoid it disappearing too late)
            const scrolledPastStatic = staticRect.top < 110;
            const stillInSection = sectionRect.bottom > 200;

            setShowFixedPill(scrolledPastStatic && stillInSection);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Swipe Logic (Updated to use Drag)
    const onDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        const swipeThreshold = 50;
        if (info.offset.x > swipeThreshold && activeTab === 'notSuitable') {
            setActiveTab('suitable');
        } else if (info.offset.x < -swipeThreshold && activeTab === 'suitable') {
            setActiveTab('notSuitable');
        }
    };

    return (
        <section
            ref={sectionRef}
            className="py-24 relative transition-colors duration-700 bg-stone-50"
        >
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Texture/Noise Overlay */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

                {/* 1. Mobile Immersive Background (Single Color) */}
                <div className={`absolute inset-0 md:hidden transition-colors duration-700 ${activeTab === 'notSuitable' ? 'bg-rose-50' : 'bg-emerald-50/50'}`}></div>

                {/* 2. Desktop Split Background (Atmosphere) */}
                <div className="hidden md:flex absolute inset-0 flex-row">
                    <div className="h-full w-1/2 bg-stone-100/50 order-1"></div> { /* Neutral Stone Left */}
                    <div className="h-full w-1/2 bg-emerald-50/30 order-2"></div> { /* Soft Emerald Right */}
                </div>

                {/* Center Line visual */}
                <div className="absolute inset-y-0 left-1/2 w-px bg-gradient-to-b from-transparent via-stone-300 to-transparent hidden md:block"></div>
            </div>

            <div className="container mx-auto px-4 max-w-6xl relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-10 md:mb-16"
                >
                    <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 font-serif tracking-tight">
                        Terus Terang. <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-700 to-red-600">Adakah Ini Diri Anda?</span>
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed hidden md:block font-medium">
                        Kami tak mampu bantu semua orang. Sila cermin diri anda. Jika anda berada di sebelah <span className="font-bold text-emerald-700">KANAN</span>, buku ini adalah jawapannya.
                    </p>

                </motion.div>

                {/* --- SMART FLOATING PILL SYSTEM --- */}

                {/* 1. STATIC PILL (Initial View - Part of Flow) */}
                {/* Changed from 'sticky' to 'relative' so it scrolls naturally with text initially */}
                <div ref={staticPillRef} className={`md:hidden relative z-40 mx-auto max-w-[340px] mb-8 transition-opacity duration-300 ${showFixedPill ? 'opacity-0' : 'opacity-100'}`}>
                    <div className="relative bg-white/90 backdrop-blur-md rounded-full shadow-lg border border-white/50 p-1.5 ring-1 ring-black/5">
                        <div className="flex relative z-10">
                            <button onClick={() => setActiveTab('suitable')} className={`flex-1 relative z-10 py-3 px-2 rounded-full text-sm font-bold transition-all duration-300 ${activeTab === 'suitable' ? 'text-emerald-900' : 'text-gray-400'}`}>
                                {activeTab === 'suitable' && <motion.div layoutId="staticTab" className="absolute inset-0 bg-emerald-100/90 rounded-full shadow-sm border border-emerald-200" />}
                                <span className="relative z-20 flex items-center justify-center gap-2"><CheckCircle2 className={`w-4 h-4 ${activeTab === 'suitable' ? 'text-emerald-600' : 'text-gray-300'}`} /> WAJIB Beli</span>
                            </button>
                            <button onClick={() => setActiveTab('notSuitable')} className={`flex-1 relative z-10 py-3 px-2 rounded-full text-sm font-bold transition-all duration-300 ${activeTab === 'notSuitable' ? 'text-rose-900' : 'text-gray-400'}`}>
                                {activeTab === 'notSuitable' && <motion.div layoutId="staticTab" className="absolute inset-0 bg-rose-100/90 rounded-full shadow-sm border border-rose-200" />}
                                <span className="relative z-20 flex items-center justify-center gap-2"><XCircle className={`w-4 h-4 ${activeTab === 'notSuitable' ? 'text-rose-600' : 'text-gray-300'}`} /> JANGAN Beli</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* 2. FIXED FLOATING PILL (Appears when scrolled past) */}
                <AnimatePresence>
                    {showFixedPill && (
                        <motion.div
                            initial={{ y: -100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -100, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 260, damping: 20 }}
                            className="md:hidden fixed top-24 left-0 right-0 z-[60] flex justify-center pointer-events-none"
                        >
                            <div className="pointer-events-auto bg-white/95 backdrop-blur-xl rounded-full shadow-[0_10px_40px_-5px_rgba(0,0,0,0.15)] border border-white/60 p-1.5 ring-1 ring-black/5 mx-4 w-full max-w-[340px]">
                                <div className="flex relative z-10">
                                    <button onClick={() => setActiveTab('suitable')} className={`flex-1 relative z-10 py-3 px-2 rounded-full text-sm font-bold transition-all duration-300 ${activeTab === 'suitable' ? 'text-emerald-900' : 'text-gray-400'}`}>
                                        {activeTab === 'suitable' && <motion.div layoutId="fixedTab" className="absolute inset-0 bg-emerald-100/90 rounded-full shadow-sm border border-emerald-200" />}
                                        <span className="relative z-20 flex items-center justify-center gap-2"><CheckCircle2 className={`w-4 h-4 ${activeTab === 'suitable' ? 'text-emerald-600' : 'text-gray-300'}`} /> WAJIB Beli</span>
                                    </button>
                                    <button onClick={() => setActiveTab('notSuitable')} className={`flex-1 relative z-10 py-3 px-2 rounded-full text-sm font-bold transition-all duration-300 ${activeTab === 'notSuitable' ? 'text-rose-900' : 'text-gray-400'}`}>
                                        {activeTab === 'notSuitable' && <motion.div layoutId="fixedTab" className="absolute inset-0 bg-rose-100/90 rounded-full shadow-sm border border-rose-200" />}
                                        <span className="relative z-20 flex items-center justify-center gap-2"><XCircle className={`w-4 h-4 ${activeTab === 'notSuitable' ? 'text-rose-600' : 'text-gray-300'}`} /> JANGAN Beli</span>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Mobile Swipe Hint - Subtle Animation */}
                <div className="md:hidden mt-[-10px] mb-6 flex items-center justify-center gap-2 text-[10px] text-gray-400 font-medium animate-pulse tracking-widest uppercase">
                    <motion.span animate={{ x: [-3, 3, -3] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                        ← Swipe Kiri / Kanan →
                    </motion.span>
                </div>

                {/* --- CONTENT AREA --- */}

                {/* 1. MOBILE VIEW (Tabbed - One Column at a time with Drag) */}
                <div className="md:hidden min-h-[400px] touch-pan-y">
                    <AnimatePresence mode="wait">
                        {activeTab === 'notSuitable' ? (
                            <motion.div
                                key="mobile-ghost"
                                initial={{ opacity: 0, x: -20, scale: 0.95 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, x: -20, scale: 0.95 }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                drag="x"
                                dragConstraints={{ left: 0, right: 0 }}
                                dragElastic={0.2}
                                onDragEnd={onDragEnd}
                                className="h-full"
                            >
                                <GhostColumn animateCards={false} isMobile={true} />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="mobile-identity"
                                initial={{ opacity: 0, x: 20, scale: 0.95 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, x: 20, scale: 0.95 }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                drag="x"
                                dragConstraints={{ left: 0, right: 0 }}
                                dragElastic={0.2}
                                onDragEnd={onDragEnd}
                                className="h-full"
                            >
                                <IdentityColumn animateCards={false} isMobile={true} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* 2. DESKTOP VIEW (Grid - Side by Side) */}
                <div className="hidden md:grid md:grid-cols-2 gap-12 lg:gap-20 items-stretch">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="h-full"
                    >
                        <GhostColumn animateCards={true} />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="h-full"
                    >
                        <IdentityColumn animateCards={true} />
                    </motion.div>
                </div>

            </div>
        </section>
    );
}

// --- COLUMN WRAPPERS (Reusable Content) ---

function GhostColumn({ animateCards = true, isMobile = false }: { animateCards?: boolean, isMobile?: boolean }) {
    return (
        <div className={`space-y-4 md:space-y-6 flex flex-col h-full ${isMobile ? 'px-1' : ''}`}>
            {/* Header Card: Solid Warning Style for strong differentiation */}
            <div className={`flex flex-col md:flex-row items-center gap-3 md:gap-4 mb-2 md:mb-6 p-6 bg-rose-600 md:bg-rose-50 text-center md:text-left rounded-3xl border border-rose-600 md:border-rose-100 shadow-xl shadow-rose-900/10 md:shadow-sm relative overflow-hidden group`}>
                {/* Visual Noise/Texture specific to header (Optional, kep simple for now) */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/5 pointer-events-none md:hidden"></div>

                <div className="bg-white/20 md:bg-rose-100/80 p-3 rounded-2xl md:shadow-inner rotate-3 backdrop-blur-sm relative z-10">
                    <XCircle className="w-8 h-8 text-white md:text-rose-600" />
                </div>
                <div className="relative z-10">
                    <h3 className="text-lg md:text-xl font-bold text-white md:text-rose-800 leading-tight font-serif">JANGAN BELI Jika...</h3>
                    <p className="text-sm text-rose-100 md:text-rose-700/70 font-medium">Kami tak dapat bantu golongan ini.</p>
                </div>
            </div>

            <div className="space-y-3 flex-1">
                {notSuitableFor.map((item, idx) => (
                    <GhostCard key={idx} text={item.text} icon={item.icon} delay={idx * 0.05} animate={animateCards} />
                ))}
            </div>
        </div>
    );
}

function IdentityColumn({ animateCards = true, isMobile = false }: { animateCards?: boolean, isMobile?: boolean }) {
    return (
        <div className="space-y-4 md:space-y-6 relative flex flex-col h-full">
            {/* Glow Effect (Desktop Only) */}
            {!isMobile && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-emerald-200/20 blur-[100px] -z-10 rounded-full hidden md:block"></div>
            )}

            {/* Header Card: Solid Success Style */}
            <div className={`flex flex-col md:flex-row items-center gap-3 md:gap-4 mb-2 md:mb-6 p-6 bg-gradient-to-br from-emerald-600 to-teal-700 md:from-white/80 md:to-white/80 md:backdrop-blur-md text-center md:text-left rounded-3xl border border-emerald-600 md:border-emerald-100/50 shadow-xl shadow-emerald-900/20 md:shadow-sm relative overflow-hidden`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full -mr-10 -mt-10 pointer-events-none md:hidden"></div>

                {/* Desktop Decoration */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-200/30 blur-2xl rounded-full -mr-10 -mt-10 pointer-events-none hidden md:block"></div>

                <div className="bg-white/20 md:bg-emerald-100 p-3 rounded-2xl md:shadow-inner -rotate-2 relative z-10 backdrop-blur-sm">
                    <CheckCircle2 className="w-8 h-8 text-white md:text-emerald-600" />
                </div>
                <div className="relative z-10">
                    <h3 className="text-lg md:text-xl font-bold text-white md:text-emerald-900 leading-tight font-serif">WAJIB DAPATKAN Jika...</h3>
                    <p className="text-sm text-emerald-100 md:text-emerald-800/70 font-medium">Anda akan dapat manfaat sebenar.</p>
                </div>
            </div>

            <div className="space-y-3 md:space-y-4 flex-1">
                {suitableFor.map((item, idx) => (
                    <IdentityCard
                        key={idx}
                        text={item.text}
                        sub={item.sub}
                        icon={item.icon}
                        delay={0.1 + (idx * 0.1)}
                        animate={animateCards}
                        isMobile={isMobile}
                    />
                ))}
            </div>
        </div>
    );
}


// --- ITEM CARD COMPONENTS ---

// --- ITEM CARD COMPONENTS ---

function GhostCard({ text, icon: Icon, delay, animate = true }: { text: string, icon: React.ElementType, delay: number, animate?: boolean }) {
    return (
        <motion.div
            initial={animate ? { opacity: 0, filter: "blur(4px)" } : { opacity: 1, filter: "blur(0px)" }}
            whileInView={animate ? { opacity: 1, filter: "blur(0px)" } : undefined}
            transition={{ delay, duration: 0.8 }}
            className={`flex flex-col md:flex-row items-center md:items-center gap-4 p-5 rounded-2xl border border-transparent hover:border-rose-200 hover:bg-white/80 transition-all duration-300 md:opacity-80 hover:opacity-100 group cursor-default text-center md:text-left bg-white/40 md:bg-white/50 ${animate ? 'backdrop-blur-sm' : ''} md:backdrop-blur-sm`}
        >
            <div className="shrink-0 text-rose-300 group-hover:text-rose-500 transition-colors bg-stone-100 group-hover:bg-rose-50 p-3 rounded-xl">
                <Icon className="w-6 h-6 md:w-5 md:h-5" />
            </div>
            <p className="text-base text-gray-500 font-medium group-hover:text-rose-800 transition-colors leading-relaxed">{text}</p>
        </motion.div>
    );
}

function IdentityCard({ text, sub, icon: Icon, delay, animate = true, isMobile = false }: { text: string, sub: string, icon: React.ElementType, delay: number, animate?: boolean, isMobile?: boolean }) {
    return (
        <motion.div
            initial={animate ? { opacity: 0, y: 15 } : { opacity: 1, y: 0 }}
            whileInView={animate ? { opacity: 1, y: 0 } : undefined}
            transition={{ delay, duration: 0.6, ease: "easeOut" }}
            whileHover={{ scale: 1.01, y: -2 }}
            className={`flex flex-col md:flex-row items-center md:items-start gap-4 p-5 md:p-6 bg-white rounded-2xl ${isMobile ? 'shadow-lg shadow-emerald-900/5 border-emerald-100/60' : 'shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] border-stone-100'} hover:shadow-[0_20px_40px_-12px_rgba(16,185,129,0.1)] border hover:border-emerald-200 transition-all duration-300 group cursor-default relative overflow-hidden text-center md:text-left`}
        >
            {/* Side Accent line */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-400 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <div className="mt-0 md:mt-1 shrink-0 w-14 h-14 md:w-12 md:h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500 shadow-sm border border-emerald-100/50 group-hover:border-emerald-500 group-hover:shadow-emerald-200 group-hover:rotate-6">
                <Icon className="w-7 h-7 md:w-6 md:h-6" />
            </div>

            <div className="w-full">
                <h4 className="text-gray-800 font-bold text-lg group-hover:text-emerald-900 transition-colors leading-tight mb-1">
                    {text}
                </h4>
                <p className="text-sm text-gray-500 group-hover:text-emerald-700/80 font-medium">
                    {sub}
                </p>
            </div>

            {/* Soft Checkmark */}
            <div className={`hidden md:block absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-2 group-hover:translate-x-0 ${isMobile ? '!block opacity-100' : ''}`}>
                <CheckCircle2 className={`w-5 h-5 text-emerald-500 ${isMobile ? 'opacity-30' : ''}`} />
            </div>
        </motion.div>
    );
}
