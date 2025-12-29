"use client";

import React from 'react';
import { CheckCircle } from 'lucide-react';

export default function InsideLookSection() {
    return (
        <section id="preview" className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
                    {/* Left: Text Content */}
                    <div className="md:w-1/2 md:order-1 text-center md:text-left">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                            Design Dalaman Yang <span className="text-emerald-600">Mesra Pembaca</span>
                        </h2>
                        <p className="text-gray-600 mb-8 leading-relaxed">
                            Kami faham anda sibuk dan tak suka baca buku tebal yang menyakitkan mata. Sebab itu kami design buku ini supaya:
                        </p>

                        <ul className="space-y-4">
                            {[
                                "Tulisan Besar & Jelas (Tak perlu kanta pembesar)",
                                "Pochart & Infografik (Senang faham sekali pandang)",
                                "Ruang Nota Tambahan (Untuk catatan kuliah/faedah)",
                                "Bahasa Santai & Tak Terlalu Formal"
                            ].map((item, idx) => (
                                <li key={idx} className="flex items-start gap-3 bg-blue-50 p-3 rounded-lg text-blue-900 font-medium text-left">
                                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Right: Phone Frame with Video */}
                    <div className="md:w-1/2 order-1 md:order-2 flex flex-col items-center">

                        {/* Phone Frame */}
                        <div className="relative mx-auto border-gray-900 border-[8px] rounded-[2.5rem] h-[500px] w-[280px] shadow-2xl bg-gray-800 overflow-hidden">
                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-xl z-20"></div> {/* Notch */}

                            {/* Screen Content */}
                            <div className="w-full h-full bg-gray-900 relative">
                                <video
                                    src="/videoqadasolatpromo.mp4"
                                    controls
                                    className="w-full h-full object-cover"
                                    poster="/bukuqadhasolat.png"
                                >
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                        </div>

                        {/* Footer Text */}
                        <p className="text-center text-xs text-gray-500 mt-6 md:max-w-xs leading-relaxed">
                            *Tonton video untuk lihat isi dalam buku dengan lebih jelas (1 minit).
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
