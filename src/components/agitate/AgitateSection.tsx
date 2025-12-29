"use client";

import { motion, useInView, Variants } from "framer-motion";
import Image from "next/image";
import { Hourglass, BatteryWarning, BrainCircuit } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";

// --- Sub-Components ---

// 1. Dark Rain Effect
function RainEffect({ isMobile }: { isMobile: boolean }) {

    if (isMobile) return (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-20">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 brightness-50"></div>
        </div>
    );

    return (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-30">
            {/* Rain Layers using refined CSS gradients */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-50"></div>

            {/* Falling Rain Animation - We can simulate this with a repeating gradient moving downwards */}
            <motion.div
                animate={{ backgroundPosition: ["0% 0%", "0% 100%"] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage: "linear-gradient(to bottom, transparent 95%, #ffffff 100%)",
                    backgroundSize: "2px 100px" // Long streaks
                }}
            />
            <motion.div
                animate={{ backgroundPosition: ["0% 0%", "0% 100%"] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }} // Slower layer
                className="absolute inset-0 opacity-5"
                style={{
                    backgroundImage: "linear-gradient(to bottom, transparent 90%, #a0a0a0 100%)",
                    backgroundSize: "1px 60px",
                    backgroundPositionX: "50%" // Offset
                }}
            />
        </div>
    );
}

// 2. Thunder Flash Effect (Subtle Lightning)
function ThunderEffect({ isMobile }: { isMobile: boolean }) {
    const [flash, setFlash] = useState(false);

    useEffect(() => {
        if (isMobile) return;

        const triggerThunder = () => {
            // Random delay between 5 to 15 seconds
            const delay = Math.random() * 10000 + 5000;
            const timer = setTimeout(() => {
                setFlash(true);
                setTimeout(() => setFlash(false), 150); // Quick flash duration
                triggerThunder(); // Recursively schedule next flash
            }, delay);
            return timer;
        };

        const timerId = triggerThunder();
        return () => clearTimeout(timerId);
    }, [isMobile]);

    if (isMobile) return null;

    return (
        <motion.div
            animate={{ opacity: flash ? 0.15 : 0 }}
            className="absolute inset-0 z-20 bg-white pointer-events-none mix-blend-overlay"
            transition={{ duration: 0.1 }}
        />
    );
}

// 3. Low Health Vignette (Pulsing Red Edges)
function VignetteEffect({ isMobile }: { isMobile: boolean }) {

    return (
        <motion.div
            animate={isMobile ? { opacity: 0.5 } : { opacity: [0.4, 0.7, 0.4] }}
            transition={isMobile ? { duration: 0 } : { duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 z-10 pointer-events-none"
            style={{
                background: "radial-gradient(circle at center, transparent 0%, transparent 60%, rgba(50, 0, 0, 0.4) 100%)"
            }}
        />
    );
}

// 4. Typewriter Text Effect
function TypewriterText({ text, delay = 0, isMobile }: { text: string, delay?: number, isMobile: boolean }) {
    const [displayedText, setDisplayedText] = useState(isMobile ? text : "");
    const ref = React.useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    useEffect(() => {
        if (isMobile) {
            setDisplayedText(text);
            return;
        }
        if (isInView) {
            let i = 0;
            const timer = setTimeout(() => {
                const interval = setInterval(() => {
                    setDisplayedText(text.slice(0, i + 1));
                    i++;
                    if (i === text.length) clearInterval(interval);
                }, 30); // Typing speed
                return () => clearInterval(interval);
            }, delay * 1000);
            return () => clearTimeout(timer);
        }
    }, [isInView, text, delay, isMobile]);

    return (
        <span ref={ref} className="font-mono text-gray-300">
            {displayedText}
            {!isMobile && (
                <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="inline-block w-[2px] h-[1em] bg-red-500 ml-1 align-middle"
                />
            )}
        </span>
    );
}

// 3. Glitch Image Component (Shared Aesthetic)
function GlitchImage({ src, alt, isHovered, isMobile }: { src: string; alt: string; isHovered: boolean, isMobile: boolean }) {
    const [delays, setDelays] = React.useState({ d1: 0, d2: 0 });

    React.useEffect(() => {
        setDelays({
            d1: Math.random() * 0.5,
            d2: Math.random() * 0.5
        });
    }, []);

    return (
        <div className="relative w-full h-full">
            {/* Cyan Channel - Glitch Layer 1 - Desktop Only */}
            {!isMobile && (
                <motion.div
                    animate={isHovered ? {
                        x: [-2, 2, -1, 0, 2],
                        y: [1, -1, 0, 2, -1],
                        opacity: [0.5, 0.8, 0.5]
                    } : { x: 0, y: 0, opacity: 0 }}
                    transition={{ duration: 0.2, repeat: Infinity, repeatDelay: delays.d1 }}
                    className="absolute inset-0 z-0 mix-blend-screen opacity-0"
                >
                    <div className="relative w-full h-full bg-cyan-900/50"> {/* Tint */}
                        <Image src={src} alt={alt} fill className="object-cover mix-blend-overlay opacity-70" />
                    </div>
                </motion.div>
            )}

            {/* Red Channel - Glitch Layer 2 - Desktop Only */}
            {!isMobile && (
                <motion.div
                    animate={isHovered ? {
                        x: [2, -2, 1, 0, -2],
                        y: [-1, 1, 0, -2, 1],
                        opacity: [0.5, 0.8, 0.5]
                    } : { x: 0, y: 0, opacity: 0 }}
                    transition={{ duration: 0.2, repeat: Infinity, repeatDelay: delays.d2 }}
                    className="absolute inset-0 z-0 mix-blend-screen opacity-0"
                >
                    <div className="relative w-full h-full bg-red-900/50"> {/* Tint */}
                        <Image src={src} alt={alt} fill className="object-cover mix-blend-overlay opacity-70" />
                    </div>
                </motion.div>
            )}

            {/* Main Image */}
            <Image
                src={src}
                alt={alt}
                fill
                quality={isMobile ? 70 : 85}
                className={`object-cover relative z-10 transform transition-all duration-500 ${isHovered ? 'scale-105' : 'scale-100'} ${isMobile ? '' : (isHovered ? 'saturate-100' : 'saturate-0')}`}
            />

            {/* Simple Mobile Jitter Effect Override */}
            {isMobile && isHovered && (
                <motion.div
                    animate={{ x: [-1, 1, -1], y: [1, -1, 1] }}
                    transition={{ duration: 0.1, repeat: Infinity }}
                    className="absolute inset-0 z-20 pointer-events-none border-2 border-red-500/20"
                />
            )}
        </div>
    );
}

interface AgitateCardProps {
    title: string;
    description: string;
    imageSrc: string;
    icon: React.ElementType;
    iconColorClass: string;
    isHeartbeat?: boolean;
    variants: Variants;
    isMobile: boolean;
}

function AgitateCard({ title, description, imageSrc, icon: Icon, iconColorClass, isHeartbeat, variants, isMobile }: AgitateCardProps) {
    const divRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!divRef.current) return;
        const rect = divRef.current.getBoundingClientRect();
        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        setOpacity(1);
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
        setOpacity(1);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    return (
        <motion.div
            variants={variants}
            initial="idle"
            whileInView="idle"
            animate={isHovered ? "hover" : "idle"}
            ref={divRef}
            onViewportEnter={() => {
                if (isMobile) setIsHovered(true);
            }}
            onViewportLeave={() => {
                if (isMobile) setIsHovered(false);
            }}
            viewport={{ margin: "-35% 0px -35% 0px", amount: "some" }}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="group relative bg-[#16181d] rounded-2xl overflow-hidden border border-gray-800/50 transition-all duration-500 hover:shadow-2xl hover:shadow-red-900/10 transform-gpu will-change-transform"
        >
            {/* Spotlight Gradient Overlay */}
            <div
                className="pointer-events-none absolute -inset-px transition duration-300 z-30"
                style={{
                    opacity,
                    background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(220, 38, 38, 0.15), transparent 40%)`,
                }}
            />

            <div className="relative h-56 overflow-hidden bg-black">
                <GlitchImage src={imageSrc} alt={title} isHovered={isHovered} isMobile={isMobile} />

                <div className="absolute inset-0 bg-gradient-to-t from-[#16181d] via-transparent to-transparent z-20 opacity-90"></div>

                <div className="absolute top-4 left-4 z-30 bg-black/70 md:bg-black/40 md:backdrop-blur-md p-2 rounded-lg border border-white/10 md:border-white/5">
                    {isHeartbeat ? (
                        <motion.div
                            animate={{ scale: [1, 1.2, 1, 1.2, 1] }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "easeInOut",
                                times: [0, 0.1, 0.2, 0.3, 1]
                            }}
                        >
                            <Icon className={`w-5 h-5 ${iconColorClass}`} />
                        </motion.div>
                    ) : (
                        <Icon className={`w-5 h-5 ${iconColorClass}`} />
                    )}
                </div>
            </div>
            <div className="p-6 md:p-8 relative z-20 -mt-12">
                <h3 className="text-xl font-bold text-gray-100 mb-3 group-hover:text-red-400 transition-colors">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                    {description}
                </p>
            </div>
        </motion.div>
    );
}

export default function AgitateSection() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: "easeOut" as const }
        }
    };

    return (
        <section className="bg-[#0f1115] text-white py-0 relative overflow-hidden">
            {/* Background Texture - Dark Islamic Pattern (Arabesque) - Increased Visibility */}
            <div className={`absolute inset-0 opacity-15 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] invert select-none ${isMobile ? 'scale-150' : ''}`}></div>

            {/* Dark Rain Overlay */}
            <RainEffect isMobile={isMobile} />
            <ThunderEffect isMobile={isMobile} />
            <VignetteEffect isMobile={isMobile} />

            {/* PART 1: THE EMOTIONAL SCENARIO (Dark Atmosphere) */}
            <div className="container mx-auto px-4 max-w-4xl py-12 md:py-24 relative z-10">
                {/* Cinematic Story Typography */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    className="text-center mb-8"
                >
                    <span className="inline-block py-1 px-3 rounded-full bg-red-950/80 border border-red-900/50 text-red-200 text-xs font-bold tracking-[0.2em] uppercase mb-8 shadow-lg shadow-red-900/20">
                        Realiti Kehidupan
                    </span>

                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 font-serif text-balance">
                        <span className="block text-gray-400 text-2xl md:text-3xl mb-2 font-sans font-medium tracking-normal">Bayangkan Jika Malam Ini...</span>
                        <span className="text-red-600 filter drop-shadow-lg">
                            Malam Terakhir Kita?
                        </span>
                    </h2>

                    <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "60%" }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="h-1 bg-red-800/50 mx-auto rounded-full mb-8"
                    ></motion.div>

                    <div className="max-w-3xl mx-auto space-y-6 text-lg md:text-xl text-gray-300 leading-relaxed font-light">
                        <p className="min-h-[3em]">
                            <TypewriterText
                                text="Lampu bilik dipadamkan... Mata terpejam rapat. Tiba-tiba dada rasa sempit... Nafas makin berat..."
                                delay={0.5}
                                isMobile={isMobile}
                            />
                        </p>
                        <p className="border-l-2 border-red-900/50 pl-6 italic text-gray-400">
                            &quot;Masa itu, harta menggunung tak guna. Anak isteri tak boleh tolong.<br />
                            Yang tinggal cuma kita... dan <span className="text-red-400 font-semibold decoration-red-900/50 underline decoration-1 underline-offset-4">hutang solat yang belum lunas.</span>&quot;
                        </p>
                    </div>
                </motion.div>

                {/* VISUAL SEPARATOR (Fading Line) */}
                <div className="flex justify-center mb-10">
                    <div className="h-16 w-px bg-gradient-to-b from-transparent via-red-900/50 to-transparent"></div>
                </div>



                {/* PART 2: THE LOGICAL REALITY (Dark Cards with Real Images) */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid md:grid-cols-3 gap-8"
                >
                    <AgitateCard
                        title="Tenaga Makin Susut"
                        description="Makin tua, lutut makin sakit. Nak sujud lama pun tak larat. Mampu ke nak qadha ribu-ribu rakaat masa tu?"
                        imageSrc="/agitate_aging.png"
                        icon={BatteryWarning}
                        iconColorClass="text-yellow-500/80"
                        isHeartbeat={true}
                        variants={itemVariants}
                        isMobile={isMobile}
                    />

                    <AgitateCard
                        title="Ingatan Makin Pudar"
                        description="&quot;Tadi dah solat ke belum?&quot; Nyanyuk datang tanpa signal. Masa tu air mata darah pun tak guna kalau dah lupa cara sujud."
                        imageSrc="/agitate_memory.png"
                        icon={BrainCircuit}
                        iconColorClass="text-blue-400/80"
                        isHeartbeat={true}
                        variants={itemVariants}
                        isMobile={isMobile}
                    />

                    <AgitateCard
                        title="Ajal Tak Menunggu"
                        description="Malaikat Maut takkan tangguh walau sesaat. Mulakan qadha SEKARANG adalah &quot;hujah&quot; terbaik kita di sana nanti."
                        imageSrc="/agitate_time.png"
                        icon={Hourglass}
                        iconColorClass="text-red-500/80 animate-spin-slow"
                        isHeartbeat={true}
                        variants={itemVariants}
                        isMobile={isMobile}
                    />
                </motion.div>
            </div>
            {/* BOTTOM WAVE DIVIDER (Transition to Solution Section) */}
            <div className="absolute bottom-0 left-0 w-full leading-none z-10 translate-y-1 h-16 md:h-24">
                <svg className="block w-full h-full" viewBox="0 0 1440 320" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                    <path fill="#fffbeb" fillOpacity="1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,197.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                </svg>
            </div>
        </section >
    );
}
