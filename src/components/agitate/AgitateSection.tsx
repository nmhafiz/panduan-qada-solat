"use client";

import { AlertTriangle, Clock, HeartCrack, LucideIcon, HelpCircle, UserPlus, FileText, Smartphone } from "lucide-react";
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

interface AgitateCardProps {
    title: string;
    description: string;
    imageSrc: string;
    icon: React.ElementType;
    iconColorClass: string;
    delay: number;
}

function AgitateCard({ title, description, imageSrc, icon: Icon, iconColorClass, delay }: AgitateCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const cardRef = useRef(null);

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
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="group bg-[#16181d] rounded-2xl overflow-hidden border border-gray-800/50 hover:border-red-900/30 transition-all duration-500 hover:shadow-2xl hover:shadow-red-900/5"
        >
            <div className="relative h-64 overflow-hidden bg-black">
                <div className="absolute inset-0 bg-gradient-to-t from-[#16181d] via-transparent to-transparent z-10 opacity-90"></div>
                <GlitchImage src={imageSrc} alt={title} isHovered={isHovered} />
                <div className="absolute top-4 left-4 z-20 bg-black/40 backdrop-blur-md p-2 rounded-lg border border-white/5">
                    <Icon className={`w-5 h-5 ${iconColorClass}`} />
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
    return (
        <section className="bg-[#0f1115] text-white py-16 md:py-24 relative overflow-hidden">
            {/* Background Texture - Dark Islamic Pattern */}
            <div className="absolute inset-0 opacity-5 pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }}
            ></div>

            <div className="container mx-auto px-4 max-w-6xl relative z-10">
                <div className="text-center mb-16 md:mb-24">
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-red-500 font-semibold uppercase tracking-widest text-sm mb-4"
                    >
                        Tunggu Sekejap...
                    </motion.p>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-3xl md:text-5xl font-bold text-white mb-6 font-serif max-w-3xl mx-auto leading-tight"
                    >
                        Bayangkan <span className="text-red-600 italic">Risiko</span> Jika Anda Terus Bertangguh...
                    </motion.h2>
                    <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "100px" }}
                        className="h-1 bg-red-900 mx-auto rounded-full"
                    ></motion.div>
                </div>

                <div className="grid md:grid-cols-4 gap-6">
                    <AgitateCard
                        title="Dosa Berangkai"
                        description="Satu solat ditinggalkan tanpa uzur syarie, akan ditarik keberkatan dalam rezeki dan ketenangan hati."
                        imageSrc="/freepik__heavy-rain-falling-over-a-dark-gloomy-city-street-a__65352.png"
                        icon={HeartCrack}
                        iconColorClass="text-red-500"
                        delay={0.1}
                    />
                    <AgitateCard
                        title="Hutang Tak Terbayar"
                        description="Hutang dengan manusia kita takut, hutang dengan Pencipta? Makin lama makin bertimbun & berat."
                        imageSrc="/freepik__a-distressed-man-kneeling-in-prayer-inside-a-dimly__65353.png"
                        icon={HelpCircle}
                        iconColorClass="text-orange-500"
                        delay={0.2}
                    />
                    <AgitateCard
                        title="Sakaratul Maut"
                        description="Bayangkan saat nyawa di kerongkong, kita sesal tak ganti solat. Saat itu, segalanya sudah terlambat."
                        imageSrc="/freepik__an-old-ancient-clock-with-cracked-glass-placed-on-__65354.png"
                        icon={Clock}
                        iconColorClass="text-yellow-500"
                        delay={0.3}
                    />
                    <AgitateCard
                        title="Fitnah Kubur"
                        description="Soalan pertama di mahsyar adalah SOLAT. Adakah kita yakin mampu menjawab dengan hutang yang ada?"
                        imageSrc="/freepik__a-faint-light-at-the-end-of-a-dark-mysterious-ston__65355.png"
                        icon={AlertTriangle}
                        iconColorClass="text-red-600"
                        delay={0.4}
                    />
                </div>

                {/* Final Stir - Emotional Hook */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="mt-16 md:mt-24 bg-gradient-to-br from-[#1a1c22] to-black p-8 md:p-16 rounded-[2rem] border border-red-900/20 text-center relative overflow-hidden group shadow-2xl"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <HeartCrack className="w-32 h-32 text-red-900" />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold mb-6 text-red-500 italic">
                        &quot;Mati Tak Kenal Usia...&quot;
                    </h3>
                    <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-light mb-8">
                        Jangan biarkan penyesalan di akhirat menjadi <span className="text-white font-bold underline decoration-red-600 underline-offset-4">hadiah terakhir</span> anda untuk diri sendiri. Satu keputusan hari ini boleh merubah pengakhiran anda.
                    </p>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-6 mt-10">
                        <div className="flex items-center gap-3 text-stone-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
                            <span className="text-sm">742 orang memulakan qadha hari ini</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
