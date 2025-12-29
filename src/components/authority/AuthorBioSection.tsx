"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Award, Users } from "lucide-react";

export default function AuthorBioSection() {
    return (
        <section className="py-20 bg-white border-y border-gray-100 overflow-hidden relative">
            <div className="container mx-auto px-4 max-w-5xl relative z-10">
                <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
                    {/* Avatar/Image Area */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className="flex-shrink-0 relative"
                    >
                        <div className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-gradient-to-tr from-gray-200 to-white border-8 border-white shadow-2xl overflow-hidden flex items-center justify-center relative z-10 group">
                            <Image
                                src="/ustazamarmirza.JPG"
                                alt="Ustaz Amar Mirza"
                                width={256}
                                height={256}
                                className="w-full h-full object-cover object-top hover:scale-110 transition-transform duration-700 ease-out filter contrast-110 brightness-105 saturate-[0.85] sepia-[0.05]"
                            />
                            {/* Premium Gloss Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-black/0 via-white/10 to-white/30 pointer-events-none rounded-full"></div>
                        </div>
                        {/* Decorative blob behind */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-100 rounded-full blur-3xl -z-10"></div>
                    </motion.div>

                    {/* Bio Text */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className="text-center md:text-left flex-1"
                    >
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
                            <span className="bg-yellow-50 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full border border-yellow-200 flex items-center gap-1">
                                <Award className="w-3 h-3" /> Penulis Berpengalaman
                            </span>
                            <span className="bg-blue-50 text-blue-800 text-xs font-bold px-3 py-1 rounded-full border border-blue-200 flex items-center gap-1">
                                <Users className="w-3 h-3" /> 30,000+ Pembaca
                            </span>
                        </div>

                        <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 font-serif">
                            Ustaz Amar Mirza
                        </h3>
                        <p className="text-lg text-green-600 font-medium mb-6">
                            Terbitan Dakwah Digital Network
                        </p>

                        <div className="space-y-4 text-gray-600 leading-relaxed text-base">
                            <p>
                                Beliau merupakan pengasas <strong>BeDaie</strong> dan juga peserta rancangan realiti TV <strong>Astro Muallim Muda 2025</strong>.
                            </p>
                            <p>
                                Dengan pengalaman membimbing lebih <strong>5,000 pelajar</strong> dari pelbagai latar belakang, beliau sangat memahami kekangan masyarakat moden untuk belajar agama dan menyelesaikan hutang solat.
                            </p>
                            <p>
                                <span className="italic block border-l-4 border-green-500 pl-4 py-1 text-gray-500 mt-4 bg-gray-50 rounded-r-lg">
                                    &quot;Visi kami mudah: Kami tak nak ada satu pun rumah di Malaysia yang tertinggal dari didikan agama. Panduan ini adalah sebahagian daripada usaha kecil kami untuk bantu anda kembali sujud dengan tenang.&quot;
                                </span>
                            </p>
                        </div>

                        {/* Stats Row */}
                        <div className="mt-8 grid grid-cols-3 gap-4 border-t border-gray-100 pt-6">
                            <div>
                                <h4 className="font-bold text-2xl text-gray-900">5,000+</h4>
                                <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">Pelajar Dibimbing</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-2xl text-gray-900">4.8/5</h4>
                                <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">Rating BeDaie</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-2xl text-gray-900">100%</h4>
                                <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">Patuh Syariah</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
