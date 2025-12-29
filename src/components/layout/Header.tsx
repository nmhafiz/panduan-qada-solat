"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 30);
        };

        window.addEventListener("scroll", handleScroll);
        window.addEventListener("resize", checkMobile);
        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", checkMobile);
        };
    }, []);

    const navLinks = [
        { name: "Tentang Buku", href: "#preview" },
        { name: "Masalah", href: "#problem" },
        { name: "Testimoni", href: "#testimonials" },
        { name: "FAQ", href: "#faq" },
    ];

    return (
        <>
            {/* 
              FLOATING GLASS ISLAND NAVBAR 
              - Transitions from full transparency to a floating capsule.
              - Uses 'bg-noise' for texture.
            */}
            <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none md:pt-4">
                <motion.header
                    initial={{ y: -100, opacity: 0 }}
                    animate={{
                        y: 0,
                        opacity: 1,
                        width: isScrolled ? "min(900px, 95%)" : "100%",
                        borderRadius: isScrolled ? "50px" : "0px",
                        background: isScrolled ? (isMobile ? "rgba(255, 255, 255, 0.98)" : "rgba(255, 255, 255, 0.85)") : "transparent",
                        backdropFilter: isScrolled && !isMobile ? "blur(20px)" : "blur(0px)",
                        border: isScrolled ? "1px solid rgba(255, 255, 255, 0.2)" : "1px solid transparent",
                        marginTop: isScrolled ? "20px" : "0px",
                        paddingTop: isScrolled ? "12px" : "24px",
                        paddingBottom: isScrolled ? "12px" : "24px",
                        paddingLeft: isScrolled ? "24px" : "32px",
                        paddingRight: isScrolled ? "24px" : "32px",
                        boxShadow: isScrolled ? "0 0 0 1px rgba(0,0,0,0.05), 0 25px 50px -12px rgba(6, 78, 59, 0.25)" : "none"
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 120,
                        damping: 30,
                        mass: 1
                    }}
                    className="pointer-events-auto bg-noise"
                >
                    <div className="flex items-center justify-between gap-8 whitespace-nowrap w-full max-w-7xl mx-auto px-4">

                        {/* Logo */}
                        <Link href="/" className="relative z-50 group">
                            <span className={`text-xl md:text-2xl font-serif font-bold tracking-tight transition-colors duration-300 ${isScrolled ? "text-emerald-950" : "text-white"}`}>
                                Panduan<span className={`font-sans font-extrabold ml-1 transition-colors duration-300 ${isScrolled ? "text-green-600" : "text-emerald-300"}`}>Qadha</span>
                            </span>
                        </Link>

                        {/* Desktop Navigation with Spotlight Effect */}
                        <nav className="hidden md:flex items-center gap-2">
                            {navLinks.map((link, index) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onMouseEnter={() => setHoveredIndex(index)}
                                    onMouseLeave={() => setHoveredIndex(null)}
                                    className={`relative px-4 py-2 text-sm font-medium transition-colors duration-300 ${isScrolled ? "text-gray-600 hover:text-emerald-950" : "text-white/80 hover:text-white"
                                        }`}
                                >
                                    {hoveredIndex === index && (
                                        <motion.div
                                            layoutId="hover-pill"
                                            className={`absolute inset-0 rounded-full ${isScrolled ? "bg-gray-100" : "bg-white/10"}`}
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                    <span className="relative z-10">{link.name}</span>
                                </Link>
                            ))}
                        </nav>

                        {/* CTA Button */}
                        <div className="hidden md:flex items-center">
                            <Link
                                href="#pricing"
                                className={`
                                    relative overflow-hidden px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 transform hover:scale-105
                                    ${isScrolled
                                        ? "bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-600/20"
                                        : "bg-white text-green-700 hover:bg-green-50 shadow-lg shadow-white/10"
                                    }
                                `}
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    Dapatkan eBook
                                </span>
                            </Link>
                        </div>

                        {/* Mobile Toggle */}
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            className={`md:hidden relative z-50 p-2 rounded-full transition-colors ${isMobileMenuOpen
                                ? "bg-gray-100 text-emerald-950"
                                : isScrolled ? "hover:bg-gray-100 text-emerald-950" : "text-white hover:bg-white/10"
                                }`}
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </motion.button>
                    </div>
                </motion.header>
            </div>

            {/* Mobile Menu Overlay - "Expanding Sheet" */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/80 z-40 md:hidden"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />

                        {/* Menu Content */}
                        <motion.div
                            initial={{ y: "-100%", opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: "-100%", opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 left-0 right-0 bg-white z-40 md:hidden rounded-b-[2rem] overflow-hidden shadow-2xl bg-noise border-b border-white/20"
                        >
                            <div className="pt-32 pb-10 px-6 flex flex-col gap-2">
                                {navLinks.map((link, idx) => (
                                    <motion.div
                                        key={link.name}
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.1 + (idx * 0.05) }}
                                    >
                                        <Link
                                            href={link.href}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="block py-4 px-4 text-xl font-serif font-medium text-gray-800 border-b border-gray-100 last:border-0 hover:bg-gray-50 rounded-xl transition-colors"
                                        >
                                            {link.name}
                                        </Link>
                                    </motion.div>
                                ))}

                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="mt-6"
                                >
                                    <Link
                                        href="#pricing"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="w-full bg-green-600 text-white text-center py-4 rounded-xl font-bold text-lg shadow-lg shadow-green-600/20 active:scale-95 transition-transform flex items-center justify-center gap-2"
                                    >
                                        <ShoppingBag className="w-5 h-5" />
                                        Tempah Sekarang
                                    </Link>
                                </motion.div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
