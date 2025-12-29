"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import { motion, animate, useScroll, useTransform, useSpring } from "framer-motion";
import React from "react";


function Counter({ from, to }: { from: number; to: number }) {
    const nodeRef = React.useRef<HTMLSpanElement>(null);

    React.useEffect(() => {
        const node = nodeRef.current;
        if (!node) return;

        const controls = animate(from, to, {
            duration: 2.5,
            ease: "easeOut",
            onUpdate(value) {
                node.textContent = Math.round(value).toLocaleString() + "+";
            }
        });

        return () => controls.stop();
    }, [from, to]);

    return <span ref={nodeRef} className="text-xl font-bold text-white" />;
}

export default function HeroSection() {
    const [isLooping, setIsLooping] = React.useState(false);
    const videoRef = React.useRef<HTMLVideoElement>(null);

    // Scroll-Linked Animation for Mobile/Touch
    const { scrollY } = useScroll();
    // Map scroll pixels (0 to 500) to rotation degrees (0 to 15)
    const rotateXScroll = useTransform(scrollY, [0, 500], [0, 15]);
    const rotateYScroll = useTransform(scrollY, [0, 500], [0, -15]);
    // Smooth out the scroll effect
    const smoothRotateX = useSpring(rotateXScroll, { stiffness: 100, damping: 30 });
    const smoothRotateY = useSpring(rotateYScroll, { stiffness: 100, damping: 30 });

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            const video = videoRef.current;
            const timeLeft = video.duration - video.currentTime;

            // Trigger Fade OUT (to Green) slightly before end (e.g. 1.2s)
            // We lock state to true to avoid re-renders
            if (timeLeft < 1.2 && !isLooping) {
                setIsLooping(true);
            }

            // Trigger Fade IN (to Video) after loop restart (e.g. 0.8s into new loop)
            // This assumes video has looped
            if (video.currentTime > 0.8 && video.currentTime < 2.0 && isLooping) {
                setIsLooping(false);
            }
        }
    };

    return (
        <section className="relative bg-[#052e16] text-white pt-20 md:pt-28 pb-24 overflow-hidden bg-noise">
            {/* 1. Video Background */}
            <div className="absolute inset-0 w-full h-full z-0">
                <video
                    ref={videoRef}
                    autoPlay
                    loop
                    muted
                    playsInline
                    onTimeUpdate={handleTimeUpdate}
                    className="w-full h-full object-cover opacity-60 scale-110"
                >
                    <source src="/mosque_compressed.mp4" type="video/mp4" />
                </video>

                {/* Loop Mask Overlay - CSS Transition handles the smooth pulse */}
                <div
                    className={`absolute inset-0 bg-[#052e16] pointer-events-none transition-opacity duration-[1500ms] ease-in-out z-10 ${isLooping ? "opacity-100" : "opacity-0"
                        }`}
                ></div>

                {/* Sparkling Dust Particles in God Rays */}
                <div className="absolute inset-0 z-10 pointer-events-none">
                    <motion.div
                        initial={{ opacity: 0, y: 0 }}
                        animate={{ opacity: [0, 1, 0], y: -50, x: 20 }}
                        transition={{ duration: 5, repeat: Infinity, ease: "linear", delay: 0 }}
                        className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full blur-[1px] opacity-50"
                    />
                    <motion.div
                        initial={{ opacity: 0, y: 0 }}
                        animate={{ opacity: [0, 0.8, 0], y: -80, x: -20 }}
                        transition={{ duration: 7, repeat: Infinity, ease: "linear", delay: 1 }}
                        className="absolute top-1/3 left-1/3 w-1.5 h-1.5 bg-emerald-200 rounded-full blur-[2px] opacity-40"
                    />
                    <motion.div
                        initial={{ opacity: 0, y: 0 }}
                        animate={{ opacity: [0, 0.6, 0], y: -40, x: 10 }}
                        transition={{ duration: 6, repeat: Infinity, ease: "linear", delay: 2.5 }}
                        className="absolute top-1/2 left-1/4 w-1 h-1 bg-yellow-100 rounded-full blur-[1px] opacity-30"
                    />
                </div>

                {/* Dark Overlay for Readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/90 via-emerald-950/80 to-emerald-900/60 mix-blend-multiply z-0"></div>
                <div className="absolute inset-0 bg-black/20 z-0"></div>

                {/* Bottom Gradient Fade to Solid Green (Seamless Transition) */}
                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-b from-transparent to-[#052e16] z-20"></div>
            </div>

            {/* 2. Omni-present 'Nur' Glow (Top Center) */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[500px] bg-emerald-400/20 blur-[100px] rounded-full pointer-events-none z-0"></div>

            <div className="container mx-auto px-4 max-w-6xl relative z-10">
                <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20 md:justify-between">

                    {/* Left: Copywriting */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: { opacity: 0 },
                            visible: {
                                opacity: 1,
                                transition: {
                                    staggerChildren: 0.15,
                                    delayChildren: 0.2
                                }
                            }
                        }}
                        className="flex-1 text-center md:text-left pt-6"
                    >
                        {/* Hero Headline */}
                        {/* Hero Headline */}
                        <div className="mb-8 md:mb-12 space-y-4 md:space-y-6">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                            >
                                <span className="inline-block py-1.5 px-4 rounded-full bg-emerald-900/40 backdrop-blur-md border border-emerald-500/30 text-emerald-100 text-xs md:text-sm font-bold tracking-[0.2em] uppercase mb-4 shadow-lg shadow-emerald-900/20">
                                    Edisi Terkini {new Date().getFullYear()}
                                </span>
                                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.1] md:leading-tight font-serif tracking-tight text-white drop-shadow-lg text-balance">
                                    Selesaikan Hutang Solat <br className="hidden md:block" />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-400 filter drop-shadow-md">
                                        Dengan Tenang & Yakin
                                    </span>
                                </h1>
                            </motion.div>

                            <motion.p
                                variants={{
                                    hidden: { opacity: 0, x: -20 },
                                    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
                                }}
                                className="text-lg md:text-xl text-gray-300 mb-10 leading-relaxed max-w-2xl mx-auto md:mx-0 font-light border-l-0 md:border-l-2 border-emerald-600/50 md:pl-6"
                            >
                                Kita tak tahu bila ajal menjemput. Jangan biarkan ia jadi penyesalan terbesar di sana nanti. Mulakan langkah qadha anda hari ini dengan panduan yang jelas.
                            </motion.p>

                            <motion.div
                                variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
                                }}
                                className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
                            >
                                {/* Gold/Premium CTA */}
                                <Link href="#pricing" className="group relative inline-flex items-center justify-center gap-3 bg-gradient-to-b from-yellow-400 to-yellow-600 text-yellow-950 font-bold text-lg px-8 py-4 rounded-xl shadow-[0_0_20px_rgba(234,179,8,0.3)] hover:shadow-[0_0_30px_rgba(234,179,8,0.5)] hover:scale-105 transition-all duration-300 ring-1 ring-yellow-400/50">
                                    <span className="relative z-10">Dapatkan Kitab Panduan</span>
                                    <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                                    <div className="absolute inset-0 bg-white/20 blur opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
                                </Link>

                                {/* Secondary Button - Visible Glassy Style */}
                                <Link href="#preview" className="inline-flex items-center justify-center gap-2 bg-emerald-900/40 border border-emerald-500/30 text-emerald-100 hover:bg-emerald-800/60 hover:text-white hover:border-emerald-400/50 hover:shadow-[0_0_15px_rgba(52,211,153,0.1)] backdrop-blur-sm font-medium text-lg px-8 py-4 rounded-xl transition-all duration-300 group">
                                    <span className="group-hover:tracking-wider transition-all duration-300">Lihat Isi Kandungan</span>
                                </Link>
                            </motion.div>
                        </div>

                        {/* Trust Signals */}
                        <motion.div
                            variants={{
                                hidden: { opacity: 0 },
                                visible: { opacity: 1, transition: { delay: 0.8, duration: 0.8 } }
                            }}
                            className="mt-12 flex items-center justify-center md:justify-start gap-8 border-t border-emerald-800/50 pt-8"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-900/50 rounded-full text-emerald-400 ring-1 ring-emerald-800">
                                    <CheckCircle2 className="w-5 h-5" />
                                </div>
                                <div className="flex flex-col text-left">
                                    <Counter from={0} to={30000} />
                                    <span className="text-xs text-emerald-400/80 uppercase tracking-wider">Naskhah Terjual</span>
                                </div>
                            </div>
                            <div className="w-px h-10 bg-emerald-800/50"></div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-900/50 rounded-full text-emerald-400 ring-1 ring-emerald-800">
                                    <ShieldCheck className="w-5 h-5" />
                                </div>
                                <div className="flex flex-col text-left">
                                    <span className="text-xl font-bold text-white">Disemak</span>
                                    <span className="text-xs text-emerald-400/80 uppercase tracking-wider">Panel Agamawan</span>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Right: Book Visuals - 3D Magnetic Tilt */}
                    {/* Right: Book Visuals - 3D Magnetic Tilt */}
                    <div
                        className="flex-1 w-full max-w-md relative z-10 px-0 mt-10 md:mt-0 perspective-1000"
                        onMouseMove={(e) => {
                            const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
                            const x = (e.clientX - left - width / 2) / 25;
                            const y = (e.clientY - top - height / 2) / 25;
                            e.currentTarget.style.setProperty("--rotate-x", `${-y}deg`);
                            e.currentTarget.style.setProperty("--rotate-y", `${x}deg`);
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.setProperty("--rotate-x", "0deg");
                            e.currentTarget.style.setProperty("--rotate-y", "0deg");
                        }}
                        style={{ "--rotate-x": "0deg", "--rotate-y": "0deg" } as React.CSSProperties}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, delay: 0.4 }}
                            className="relative group perspective-1000"
                        >
                            {/* Mystic Glow Behind Book */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-br from-emerald-500/20 via-yellow-500/10 to-transparent blur-3xl rounded-full pointer-events-none"></div>

                            {/* Floating Book Container */}
                            <motion.div
                                style={{
                                    // Combine Mouse Hover (CSS Vars) + Scroll (MotionValues)
                                    // CSS Vars default to 0deg. MotionValues add to it.
                                    rotateX: smoothRotateX,
                                    rotateY: smoothRotateY,
                                    // We keep the mouse interaction as a separate transform that composes 
                                    // via the parent or we blend them here?
                                    // Actually, better to apply scroll rotation to THIS container, 
                                    // and keep the CSS vars on the parent perspective wrapper or inline here?
                                    // The previous code had:  transform: "rotateX(var(--rotate-x)) rotateY(var(--rotate-y))",
                                    // We can't easily mix MotionValues and CSS string transforms in 'style' prop if we want both.
                                    // BUT, we can use a MotionValue for the CSS variable if we registered it, OR simpler:
                                    // use the MotionValues as the primary rotation, and let the mouse effect work via the PARENT `onMouseMove` 
                                    // applying the variables to specific sub-elements or just allow scroll to dominate on mobile 
                                    // (where mouse doesn't exist) and mouse to work on desktop (where scroll effect is subtle).
                                    // Let's TRY to combine them by applying Scroll Rotation to the wrapper div or this div.

                                    // COMPROMISE: We will apply the Scroll Rotation directly to this motion.div 
                                    // AND we will add the CSS variables references to the transform manually if possible.
                                    // Framer Motion handles `rotateX` style prop as a transform. 
                                    // If we pass `rotateX` it overrides the `transform` string.
                                    // So we need to inject the variable string into the Motion Value or use a `transformTemplate`.
                                }}
                                transformTemplate={({ rotateX, rotateY }) => {
                                    return `rotateX(calc(${rotateX} + var(--rotate-x))) rotateY(calc(${rotateY} + var(--rotate-y)))`;
                                }}
                                animate={{
                                    y: [0, -20, 0],
                                }}
                                transition={{
                                    y: {
                                        duration: 6,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }
                                }}
                                className="relative z-10 transform-style-3d transition-transform duration-200 ease-out"
                            >

                                <Image
                                    src="/bukuqadhasolat.png"
                                    alt="Kitab Panduan Qadha Solat"
                                    width={600}
                                    height={800}
                                    priority
                                    className="relative w-full h-auto drop-shadow-[0_35px_60px_rgba(0,0,0,0.6)]"
                                />

                                {/* Reflection/Gloss - Enhanced */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-r-xl mix-blend-overlay"></div>
                            </motion.div>

                            {/* Premium Badge - Floating independently for parallax feel */}
                            <motion.div
                                animate={{ y: [0, 15, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                                className="absolute -bottom-6 -right-2 md:-right-8 bg-gradient-to-br from-yellow-600 to-yellow-800 text-white p-1 rounded-full shadow-2xl z-20"
                            >
                                <div className="bg-[#052e16] rounded-full w-24 h-24 flex flex-col items-center justify-center border border-yellow-500/30 backdrop-blur-sm">
                                    <span className="text-[10px] text-yellow-400/80 uppercase tracking-widest mb-1">Edisi</span>
                                    <span className="text-2xl font-serif font-bold text-white italic">{new Date().getFullYear()}</span>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </div>
            {/* 3. Scroll Guide - "More Below" Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: [0, 10, 0] }}
                transition={{
                    opacity: { delay: 2, duration: 1 },
                    y: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
                }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20 pointer-events-none"
            >
                <span className="text-[10px] text-emerald-400/60 uppercase tracking-widest font-medium">Scroll</span>
                <div className="w-[1px] h-8 bg-gradient-to-b from-emerald-400/0 via-emerald-400/50 to-emerald-400/0"></div>
            </motion.div>
        </section >
    );
}
