"use client";

import { AlertTriangle, Clock, HeartCrack, LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import React, { useRef, useState } from "react";

// --- Sub-Components ---

function GlitchImage({ src, alt, isHovered }: { src: string; alt: string; isHovered: boolean }) {
    const [delays, setDelays] = React.useState({ d1: 0, d2: 0 });

    React.useEffect(() => {
        setDelays({
            d1: Math.random() * 0.5,
            d2: Math.random() * 0.5
        });
    }, []);

    return (
        <div className="relative w-full h-full">
            {/* Cyan Channel - Glitch Layer 1 */}
            <motion.div
                animate={isHovered ? {
                    x: [-2, 2, -1, 0, 2],
                    y: [1, -1, 0, 2, -1],
                    opacity: [0.5, 0.8, 0.5]
                } : { x: 0, y: 0, opacity: 0 }}
                transition={{ duration: 0.2, repeat: Infinity, repeatDelay: delays.d1 }}
                className="absolute inset-0 z-0 mix-blend-screen opacity-0"
            >
                <div className="relative w-full h-full bg-cyan-900/50">
                    <Image src={src} alt={alt} fill className="object-cover mix-blend-overlay opacity-70" />
                </div>
            </motion.div>

            {/* Red Channel - Glitch Layer 2 */}
            <motion.div
                animate={isHovered ? {
                    x: [2, -2, 1, 0, -2],
                    y: [-1, 1, 0, -2, 1],
                    opacity: [0.5, 0.8, 0.5]
                } : { x: 0, y: 0, opacity: 0 }}
                transition={{ duration: 0.2, repeat: Infinity, repeatDelay: delays.d2 }}
                className="absolute inset-0 z-0 mix-blend-screen opacity-0"
            >
                <div className="relative w-full h-full bg-red-900/50">
                    <Image src={src} alt={alt} fill className="object-cover mix-blend-overlay opacity-70" />
                </div>
            </motion.div>

            {/* Main Image */}
            <Image
                src={src}
                alt={alt}
                fill
                className={`object-cover relative z-10 transform transition-transform duration-1000 ${isHovered ? 'saturate-100 scale-110' : 'saturate-0 scale-100'}`}
            />
        </div>
    );
}

function SmokeEffect() {
    return (
        <motion.div
            className="absolute bottom-0 left-0 w-full h-full pointer-events-none z-10 mix-blend-soft-light"
            initial={{ opacity: 0.3 }}
            animate={{ opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}
        >
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent"></div>
            <motion.div
                animate={{ y: [0, -50, 0], x: [0, 10, 0], opacity: [0, 0.4, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-0 left-10 w-40 h-40 bg-gray-500/20 rounded-full blur-[50px]"
            />
            <motion.div
                animate={{ y: [0, -70, 0], x: [0, -20, 0], opacity: [0, 0.3, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear", delay: 2 }}
                className="absolute bottom-10 right-10 w-56 h-56 bg-gray-600/20 rounded-full blur-[60px]"
            />
        </motion.div>
    );
}

interface ProblemCardProps {
    title: string;
    description: string;
    imageSrc: string;
    icon: LucideIcon;
    iconColorClass: string;
    isHeartbeat?: boolean;
    delay: number;
}

function ProblemCard({ title, description, imageSrc, icon: Icon, iconColorClass, isHeartbeat, delay }: ProblemCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ margin: "-35% 0px -35% 0px", amount: "some" }}
            onViewportEnter={() => {
                if (window.innerWidth < 768) setIsHovered(true);
            }}
            onViewportLeave={() => {
                if (window.innerWidth < 768) setIsHovered(false);
            }}
            transition={{ delay, duration: 0.5, ease: "easeOut" }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="group relative bg-[#16181d] rounded-2xl overflow-hidden border border-gray-800/50 transition-all duration-500 hover:shadow-2xl hover:shadow-red-900/10"
        >
            {/* Spotlight Gradient Overlay */}
            <div
                className="pointer-events-none absolute -inset-px transition duration-500 z-30"
                style={{
                    opacity: isHovered ? 1 : 0,
                    background: `radial-gradient(600px circle at ${position.x || 0}px ${position.y || 0}px, rgba(220, 38, 38, 0.15), transparent 40%)`,
                }}
            />

            <div className="relative h-56 overflow-hidden bg-black">
                <SmokeEffect />
                <GlitchImage src={imageSrc} alt={title} isHovered={isHovered} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#16181d] via-transparent to-transparent z-10 opacity-90"></div>

                <div className="absolute top-4 left-4 z-20 bg-black/40 backdrop-blur-md p-2 rounded-lg border border-white/5">
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
                <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
            </div>
        </motion.div>
    );
}

export default function ProblemSection() {
    return (
        <section className="py-16 md:py-24 bg-[#0f1115] text-white overflow-hidden relative font-sans">
            <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] z-20 pointer-events-none">
                <svg
                    className="relative block w-[calc(100%+2px)] h-[50px] md:h-[100px] -translate-y-[1px]"
                    viewBox="0 0 1200 120"
                    preserveAspectRatio="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#052e16"></path>
                </svg>
            </div>

            <div className="absolute inset-0 opacity-5 pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }}
            ></div>

            <div className="container mx-auto px-4 max-w-4xl relative z-10 pt-10">
                <div className="text-center mb-16">
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-red-500 font-semibold uppercase tracking-widest text-sm mb-3"
                    >
                        Jujur Dengan Diri Sendiri...
                    </motion.p>
                    <motion.h2
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-3xl md:text-5xl font-bold text-white mb-4 font-serif text-balance"
                    >
                        Pernah Tak Anda Rasa <span className="text-red-600">Perasaan Ini?</span>
                    </motion.h2>
                    <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "60%" }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="h-1 bg-red-800/50 mx-auto rounded-full"
                    ></motion.div>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-12">
                    <ProblemCard
                        title="Rasa Bersalah"
                        description="Setiap kali nak tidur, terfikir dosa lama yang bertimbun. Rasa macam tak layak nak masuk syurga."
                        imageSrc="/freepik__a-malay-muslim-man-sitting-comfortably-on-a-prayer__47709.png"
                        icon={HeartCrack}
                        iconColorClass="text-red-500/90"
                        isHeartbeat={true}
                        delay={0.1}
                    />

                    <ProblemCard
                        title="Takut Mati Mengejut"
                        description="Risau kalau Allah tarik nyawa sekarang, sempat ke nak ganti semua hutang solat tu?"
                        imageSrc="/freepik__an-hourglass-with-sand-running-out-fast-placed-on-__47710.png"
                        icon={AlertTriangle}
                        iconColorClass="text-yellow-500/90"
                        isHeartbeat={true}
                        delay={0.2}
                    />

                    <ProblemCard
                        title="Keliru Mengira"
                        description="&quot;Dah berapa rakaat aku hutang sebenarnya?&quot; Tak tahu nak mula dari mana sebab tak ada rekod."
                        imageSrc="/freepik__close-up-of-malay-hands-holding-a-notebook-and-pen__47711.png"
                        icon={Clock}
                        iconColorClass="text-blue-400/90"
                        isHeartbeat={false}
                        delay={0.3}
                    />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="relative z-20 mt-8 max-w-4xl mx-auto px-4"
                >
                    <div className="bg-gradient-to-br from-red-950/80 to-black p-8 md:p-12 rounded-2xl text-center relative overflow-hidden shadow-2xl border border-red-900/30 backdrop-blur-sm">
                        <div className="relative z-10">
                            <h3 className="text-xl md:text-2xl font-bold mb-4 leading-tight text-white font-serif">
                                &quot;Solat adalah perkara pertama yang akan disoal di kubur nanti.&quot;
                            </h3>
                            <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto font-light">
                                Jangan sampai terlambat. Mula gerakkan langkah hari ini.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
