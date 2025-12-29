"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Star, Quote, Tv, CheckCircle2 } from "lucide-react";

export default function AuthorBioSection() {
    return (
        <section className="py-24 bg-stone-50 overflow-hidden relative">
            {/* --- Background Elements --- */}
            {/* Subtle Islamic Motif / Texture */}
            <div className="absolute inset-0 opacity-[0.4]" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, #d6d3d1 1px, transparent 0)`, backgroundSize: '24px 24px' }}></div>

            {/* Soft Ambient Glows */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-100/40 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-50/60 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>

            <div className="container mx-auto px-4 max-w-6xl relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-20 items-center">

                    {/* --- LEFT COLUMN: The "Architectural" Image --- */}
                    <div className="md:col-span-5 relative">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 30 }}
                            whileInView={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="relative mx-auto md:mx-0 max-w-[320px] md:max-w-none"
                        >
                            {/* Decorative Arch Border (Gold/Bronze) */}
                            <div className="absolute inset-0 rounded-t-[10rem] rounded-b-3xl border border-yellow-600/20 translate-x-3 translate-y-3 z-0 bg-stone-100/50"></div>

                            {/* Main Image Container (The Dome Mask) */}
                            <div className="relative z-10 rounded-t-[10rem] rounded-b-3xl overflow-hidden shadow-2xl shadow-emerald-900/10 border-4 border-white aspect-[3/4] md:aspect-[4/5] bg-stone-200 group">
                                <Image
                                    src="/ustazamarmirza.JPG"
                                    alt="Ustaz Amar Mirza"
                                    fill
                                    className="object-cover object-top hover:scale-105 transition-transform duration-1000 ease-out"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />
                                {/* Overlay Gradient for Depth */}
                                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/40 to-transparent opacity-60 pointer-events-none"></div>
                            </div>

                            {/* Floating "As Seen On" Badge */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 }}
                                className="absolute bottom-8 -left-4 md:-left-12 bg-white p-4 rounded-xl shadow-xl shadow-black/5 border border-stone-100 flex items-center gap-3 z-20 max-w-[200px]"
                            >
                                <div className="bg-rose-100 p-2 rounded-lg text-rose-600">
                                    <Tv className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold mb-0.5">Penampilan</p>
                                    <p className="text-sm font-bold text-gray-900 leading-tight">Astro Muallim Muda</p>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* --- RIGHT COLUMN: The "Editorial" Content --- */}
                    <div className="md:col-span-7 text-center md:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            {/* Authority Badges */}
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-6">
                                <span className="px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider rounded-full border border-emerald-100 flex items-center gap-1.5">
                                    <CheckCircle2 className="w-3.5 h-3.5" /> Bertauliah
                                </span>
                                <span className="px-3 py-1 bg-yellow-50 text-yellow-800 text-xs font-bold uppercase tracking-wider rounded-full border border-yellow-200 flex items-center gap-1.5">
                                    <Star className="w-3.5 h-3.5" /> Founder BeDaie
                                </span>
                            </div>

                            {/* Headlines */}
                            <h2 className="text-green-600 font-bold tracking-widest text-sm uppercase mb-3">Penulis & Pembimbing</h2>
                            <h3 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 font-serif leading-none tracking-tight">
                                Ustaz Amar <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-800 to-teal-600">Mirza</span>
                            </h3>

                            {/* Editorial Quote */}
                            <div className="relative mb-8 max-w-xl mx-auto md:mx-0">
                                <Quote className="absolute -top-4 -left-6 w-10 h-10 text-emerald-100 -z-10 rotate-180" />
                                <p className="text-xl md:text-2xl italic text-gray-700 font-serif leading-relaxed">
                                    &quot;Visi kami mudah: Kami tak nak ada satu pun rumah di Malaysia yang tertinggal dari didikan agama.&quot;
                                </p>
                            </div>

                            {/* Bio Copy */}
                            <div className="space-y-5 text-gray-600 leading-relaxed text-base md:text-lg mb-10 max-w-prose mx-auto md:mx-0">
                                <p>
                                    Beliau merupakan personaliti TV yang dikenali menerusi rancangan <strong>Astro Muallim Muda 2025</strong> dan pengasas platform pendidikan Islam digital, <strong>BeDaie</strong>.
                                </p>
                                <p>
                                    Dengan pengalaman membimbing lebih <strong>5,000 pelajar</strong>, beliau menggabungkan pendekatan tradisional buku dengan metodologi moden yang mudah difahami oleh masyarakat awam yang sibuk.
                                </p>
                            </div>

                            {/* Stats / Credentials Grid */}
                            <div className="grid grid-cols-3 gap-6 border-t border-stone-200 pt-8 max-w-lg mx-auto md:mx-0">
                                <div>
                                    <div className="text-3xl font-bold text-gray-900 font-serif">5k+</div>
                                    <div className="text-xs text-gray-500 uppercase tracking-wider mt-1 font-medium">Pelajar Dibimbing</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-gray-900 font-serif">4.8</div>
                                    <div className="text-xs text-gray-500 uppercase tracking-wider mt-1 font-medium">Rating Purata</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-gray-900 font-serif">10th</div>
                                    <div className="text-xs text-gray-500 uppercase tracking-wider mt-1 font-medium">Tahun Mengajar</div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
}
