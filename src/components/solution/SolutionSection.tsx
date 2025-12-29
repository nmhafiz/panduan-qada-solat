"use client";

import Image from "next/image";
import { Zap, Sparkles } from "lucide-react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";

export default function SolutionSection() {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Dampen mouse movement for premium feel
    const springX = useSpring(x, { stiffness: 150, damping: 25 });
    const springY = useSpring(y, { stiffness: 150, damping: 25 });

    const rotateX = useTransform(springY, [-100, 100], [10, -10]);
    const rotateY = useTransform(springX, [-100, 100], [-10, 10]);

    return (
        <section className="py-24 bg-gradient-to-b from-amber-50 via-white to-white overflow-hidden relative">
            {/* Background Atmosphere */}
            <DivineRays />
            <SerenityParticles />

            <div className="container mx-auto px-4 max-w-6xl relative z-10">
                <div className="flex flex-col-reverse md:flex-row items-center gap-12 lg:gap-20">

                    {/* Left: The "Holy Grail" Book (3D Interactive) */}
                    <motion.div
                        className="flex-1 w-full max-w-md perspective-1000"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        style={{ perspective: 1000 }}
                    >
                        <motion.div
                            style={{ x, y, rotateX, rotateY, z: 100 }}
                            onMouseMove={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                const centerX = rect.left + rect.width / 2;
                                const centerY = rect.top + rect.height / 2;
                                x.set((e.clientX - centerX) / 3); // Sensitivity
                                y.set((e.clientY - centerY) / 3);
                            }}
                            onMouseLeave={() => {
                                x.set(0);
                                y.set(0);
                            }}
                            animate={{
                                y: [0, -15, 0], // Gentle Levitation
                            }}
                            transition={{
                                y: { duration: 6, repeat: Infinity, ease: "easeInOut" } // Levitation loop
                            }}
                            className="relative group cursor-grab active:cursor-grabbing transform-style-3d transform-gpu will-change-transform"
                        >
                            {/* Halo Glow */}
                            <div className="absolute inset-0 bg-amber-200 blur-[60px] opacity-40 group-hover:opacity-60 transition-opacity duration-500 rounded-full scale-110 -z-10"></div>

                            {/* Book Container with Depth */}
                            <div className="relative rounded-2xl shadow-2xl shadow-amber-900/20 overflow-hidden border-[6px] border-white/80 transform-style-3d">
                                <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 to-transparent z-20 pointer-events-none mix-blend-overlay"></div>
                                <Image
                                    src="/bukuqadhasolat.png"
                                    alt="Buku Panduan Qadha Solat"
                                    width={500}
                                    height={700}
                                    className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105"
                                    quality={75}
                                />
                                {/* Gloss Reflection */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                            </div>

                            {/* Floating Badge - "Peace of Mind" */}
                            <motion.div
                                animate={{ y: [0, -8, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                className="absolute -bottom-6 right-2 md:-bottom-8 md:-right-8 bg-white/90 backdrop-blur-md border border-amber-100 p-3 md:p-4 rounded-xl shadow-xl flex items-center gap-3 transform translate-z-20 scale-90 md:scale-100"
                            >
                                <div className="bg-amber-100 p-2 rounded-full">
                                    <Sparkles className="w-5 h-5 text-amber-600" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-amber-800 uppercase tracking-widest">DIJAMIN</p>
                                    <p className="text-sm font-bold text-gray-800">Tenang & Mudah</p>
                                </div>
                            </motion.div>
                        </motion.div>
                    </motion.div>

                    {/* Right: Content (Hope & Clarity) */}
                    <div className="flex-1 text-center md:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <span className="inline-block py-1 px-4 rounded-full bg-amber-100 text-amber-700 text-xs font-bold tracking-[0.2em] uppercase mb-6 border border-amber-200">
                                Jalan Keluar
                            </span>
                            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 font-serif leading-[1.1]">
                                Jangan Risau... <br />
                                <span className="relative inline-block">
                                    <span className="absolute inset-0 bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-400 opacity-30 blur-lg animate-pulse"></span>
                                    <motion.span
                                        animate={{ backgroundPosition: ["0% center", "200% center"] }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                        className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-amber-300 to-amber-600 bg-[length:200%_auto]"
                                    >
                                        Ada Sinar Harapan.
                                    </motion.span>
                                </span>
                            </h2>
                            <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed font-light">
                                Kita mungkin tak mampu putar balik masa, tapi kita masih ada peluang untuk <b className="text-amber-800 font-semibold">perbetulkan masa depan.</b> Buku ini bukan sekadar panduan, ia adalah teman perjalanan anda untuk kembali tenang.
                            </p>
                        </motion.div>

                        {/* Animated Checklist */}
                        <div className="space-y-4 mb-10">
                            {[
                                { text: "Panduan Kiraan Otomatik", sub: "Tak perlu pening tekan kalkulator." },
                                { text: "Bahasa Paling Santai", sub: "Budak 10 tahun pun boleh faham." },
                                { text: "Infografik 'Step-by-Step'", sub: "Tengok gambar je dah faham." },
                                { text: "Jadual Qadha Praktikal", sub: "Sesuai untuk orang sibuk bekerja." }
                            ].map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 * idx }}
                                    className="flex items-start gap-4 p-3 rounded-lg hover:bg-white/50 transition-colors group"
                                >
                                    <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white shadow-lg shadow-green-500/30 overflow-hidden relative">
                                        <AnimatedCheckmark delay={0.4 + (idx * 0.2)} />
                                    </div>
                                    <div className="text-left">
                                        <h4 className="font-bold text-gray-800 text-base group-hover:text-green-700 transition-colors">{item.text}</h4>
                                        <p className="text-sm text-gray-500">{item.sub}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* CTA Enhancement */}
                        {/* CTA Enhancement - Functional Button */}
                        <motion.button
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1 }}
                            onClick={() => {
                                const element = document.getElementById("preview");
                                if (element) {
                                    element.scrollIntoView({ behavior: "smooth" });
                                }
                            }}
                            className="inline-flex items-center gap-2 text-amber-700 font-semibold group cursor-pointer hover:gap-4 transition-all focus:outline-none"
                            aria-label="Lihat kandungan dalam buku"
                        >
                            <span>Lihat Kandungan Dalam Buku</span>
                            <Zap className="w-4 h-4 fill-amber-500" />
                        </motion.button>
                    </div>
                </div>
            </div>
        </section>
    );
}

// --- Sub-Components ---

// 1. Divine Rays (Rotating Light Beams)
function DivineRays() {
    return (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] pointer-events-none z-0 opacity-40">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                className="w-full h-full bg-[conic-gradient(from_90deg_at_50%_50%,rgba(251,191,36,0.1)_0deg,transparent_60deg,rgba(251,191,36,0.1)_120deg,transparent_180deg,rgba(251,191,36,0.1)_240deg,transparent_300deg)]"
            />
        </div>
    );
}

// 2. Serenity Particles (Floating Gold Dust)
function SerenityParticles() {
    // Generate fixed particles to avoid hydration mismatch
    const particles = Array.from({ length: 15 }).map((_, i) => ({
        id: i,
        left: `${(i * 7) % 100}%`,
        delay: i * 0.5,
        duration: 5 + (i % 5)
    }));

    return (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    initial={{ y: "110vh", opacity: 0 }}
                    animate={{ y: "-10vh", opacity: [0, 1, 0] }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        delay: p.delay,
                        ease: "linear"
                    }}
                    className="absolute w-1 h-1 bg-amber-400 rounded-full blur-[1px]"
                    style={{ left: p.left }}
                />
            ))}
        </div>
    );
}

// 3. Animated Checkmark
function AnimatedCheckmark({ delay }: { delay: number }) {
    return (
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 stroke-white stroke-[3] fill-none">
            <motion.path
                d="M5 13l4 4L19 7"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: delay, ease: "easeOut" }}
            />
        </svg>
    );
}
