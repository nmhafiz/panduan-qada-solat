"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

export default function ValueStackSection() {
    return (
        <section className="py-24 bg-emerald-900/5 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(#065f46 1px, transparent 1px)", backgroundSize: "32px 32px" }}></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-5xl font-bold text-gray-900 font-serif mb-4">
                        Berapa Nilai Sebenar?
                    </h2>
                    <p className="text-gray-600">
                        Kalau anda cari satu-satu di luar...
                    </p>
                </div>

                {/* RECEIPT CONTAINER */}
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-md mx-auto bg-white shadow-2xl relative transform rotate-1"
                >
                    {/* Receipt Texture Overlay */}
                    <div className="absolute inset-0 bg-[#fffdf5] opacity-50 pointer-events-none"></div>

                    {/* Top Detail */}
                    <div className="p-8 pb-4 text-center border-b-2 border-dashed border-gray-300 relative z-10">
                        <div className="w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                            <Check className="w-6 h-6" />
                        </div>
                        <h3 className="font-mono text-gray-500 text-sm uppercase tracking-widest">OFFICIAL RECEIPT</h3>
                        <p className="font-mono text-xs text-gray-400 mt-1">29/12/2025</p>
                    </div>

                    {/* Items List */}
                    <div className="p-8 space-y-4 font-mono text-gray-700 relative z-10 text-sm md:text-base">
                        <StackItem label="PANDUAN FIZIKAL" price="89.00" delay={0.2} />
                        <StackItem label="EBOOK SOLAT SUNAT (Bonus Beli 2)" price="59.00" delay={0.3} />
                        <StackItem label="POSTAGE (SM/SS)" price="10.00" delay={0.4} />

                        {/* Divider */}
                        <motion.div
                            initial={{ scaleX: 0 }}
                            whileInView={{ scaleX: 1 }}
                            transition={{ delay: 1.0, duration: 0.5 }}
                            className="h-0.5 bg-gray-800 my-6 origin-left"
                        ></motion.div>

                        {/* Total & Discount */}
                        <div className="flex justify-between items-center pt-2">
                            <span className="font-bold text-xl">TOTAL VALUE</span>
                            <div className="text-right">
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    transition={{ delay: 1.2 }}
                                    className="block text-2xl font-bold text-gray-400 line-through decoration-red-500 decoration-4"
                                >
                                    RM 158.00
                                </motion.span>
                            </div>
                        </div>
                    </div>

                    {/* FINAL PRICE HANDWRITTEN CIRCLE */}
                    <motion.div
                        initial={{ scale: 0, rotate: -10 }}
                        whileInView={{ scale: 1, rotate: -5 }}
                        transition={{
                            type: "spring",
                            stiffness: 200,
                            damping: 15,
                            delay: 1.5
                        }}
                        className="absolute bottom-8 right-8 z-20"
                    >
                        <div className="relative">
                            {/* Circle SVG */}
                            <svg className="absolute -inset-4 w-[140%] h-[140%] text-red-600 animate-pulse-slow" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3">
                                <path d="M10,50 Q25,25 50,10 T90,50 T50,90 T10,50" />
                            </svg>
                            <div className="bg-red-600 text-white font-bold text-4xl px-4 py-2 rotate-2 shadow-lg rounded-lg border-2 border-white transform hover:scale-105 transition-transform">
                                RM 49
                            </div>
                        </div>
                    </motion.div>

                    {/* Jagged Bottom Edge */}
                    <div
                        className="absolute -bottom-3 left-0 w-full h-4 bg-white bg-repeat-x"
                        style={{
                            maskImage: "url(\"data:image/svg+xml,%3Csvg width='20' height='10' viewBox='0 0 20 10' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h20v10L10 0 0 10V0z' fill='%23000'/%3E%3C/svg%3E\")",
                            WebkitMaskImage: "url(\"data:image/svg+xml,%3Csvg width='20' height='10' viewBox='0 0 20 10' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h20v10L10 0 0 10V0z' fill='%23000'/%3E%3C/svg%3E\")",
                            maskSize: "20px 10px",
                            WebkitMaskSize: "20px 10px"
                        }}
                    ></div>
                </motion.div>

                {/* CTA HINT */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 2.0 }}
                    className="text-center mt-12 text-sm text-emerald-800 font-medium bg-emerald-100/50 inline-block px-4 py-2 rounded-full mx-auto"
                >
                    *Tawaran terhad untuk cetakan pertama sahaja.
                </motion.div>
            </div>
        </section>
    );
}

function StackItem({ label, price, delay }: { label: string, price: string, delay: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay, duration: 0.3 }}
            className="flex justify-between items-center border-b border-dashed border-gray-200 pb-2 last:border-0"
        >
            <span className="flex-1 text-left">{label}</span>
            <span className="font-bold">
                {price === "PRICELESS" ? price : `RM ${price}`}
            </span>
        </motion.div>
    );
}
