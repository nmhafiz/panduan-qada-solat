"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        handleScroll(); // Check on mount
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Tentang Buku", href: "#preview" },
        { name: "Masalah", href: "#problem" },
        { name: "Testimoni", href: "#testimonials" },
        { name: "FAQ", href: "#faq" },
    ];

    // Smooth Scroll Helper - Prevents URL Hash Update
    const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        const targetId = href.replace("#", "");
        const element = document.getElementById(targetId);

        if (element) {
            const headerOffset = 80;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.scrollY - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    };

    return (
        <>
            {/* 
              PUC-STYLE FLOATING ISLAND NAVBAR 
              - Parent nav stays full-width, child container animates.
              - Uses CSS transitions for smoother performance.
            */}
            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out flex justify-center ${isScrolled ? 'py-4' : 'py-6'}`}
            >
                <div
                    className={`transition-all duration-500 ease-in-out flex items-center justify-between mx-4 ${isScrolled
                        ? 'w-[95%] max-w-4xl bg-white/90 backdrop-blur-xl border border-emerald-100 rounded-full px-6 py-3 shadow-lg shadow-emerald-900/10'
                        : 'w-full max-w-7xl bg-transparent px-4 rounded-[0px] border-transparent'
                        }`}
                >
                    {/* Logo */}
                    <Link href="/" className="relative z-50 group flex items-center gap-2">
                        <span className={`text-xl md:text-2xl font-serif font-bold tracking-tight transition-colors duration-300 ${isScrolled ? "text-emerald-950" : "text-white"}`}>
                            Panduan<span className={`font-sans font-extrabold ml-1 transition-colors duration-300 ${isScrolled ? "text-green-600" : "text-emerald-300"}`}>Qadha</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation with Spotlight Effect */}
                    <div className="hidden md:flex items-center gap-2">
                        {navLinks.map((link, index) => (
                            <a
                                key={link.name}
                                href={link.href}
                                onClick={(e) => handleSmoothScroll(e, link.href)}
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                                className={`relative px-4 py-2 text-sm font-medium transition-all hover:tracking-wide cursor-pointer ${isScrolled ? "text-gray-600 hover:text-emerald-950" : "text-white/80 hover:text-white"
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
                                <span className={`absolute -bottom-1 left-0 w-0 h-[2px] transition-all duration-300 group-hover:w-full ${isScrolled ? 'bg-green-600' : 'bg-emerald-300'}`}></span>
                            </a>
                        ))}

                        <div className={`h-4 w-[1px] mx-2 ${isScrolled ? 'bg-gray-200' : 'bg-white/20'}`}></div>

                        {/* CTA Button */}
                        <a
                            href="#pricing"
                            onClick={(e) => handleSmoothScroll(e, "#pricing")}
                            className={`
                                px-6 py-2 rounded-full font-bold text-sm transition-all transform hover:scale-110 hover:shadow-lg cursor-pointer
                                ${isScrolled
                                    ? "bg-green-600 text-white hover:bg-green-700 shadow-md shadow-green-600/20"
                                    : "bg-white text-green-700 hover:bg-green-50"
                                }
                            `}
                        >
                            Dapatkan eBook
                        </a>
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        className={`md:hidden relative z-50 w-10 h-10 flex items-center justify-center rounded-full transition-colors border ${isMobileMenuOpen
                            ? "bg-gray-100 text-emerald-950 border-gray-200"
                            : isScrolled ? "hover:bg-gray-100 text-emerald-950 border-gray-200" : "text-white hover:bg-white/10 border-white/10"
                            }`}
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay - PUC Style Full Screen */}
            <div
                className={`fixed inset-0 z-40 bg-emerald-950/95 backdrop-blur-2xl transition-all duration-500 ease-in-out flex flex-col items-center justify-center md:hidden ${isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'
                    }`}
            >
                {/* Decorative Blobs */}
                <div className="absolute top-[-20%] right-[-10%] w-[300px] h-[300px] bg-emerald-500/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] bg-yellow-500/20 rounded-full blur-[100px]" />

                <div className="flex flex-col items-center gap-8 relative z-10 w-full px-8">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            onClick={(e) => {
                                setIsMobileMenuOpen(false);
                                handleSmoothScroll(e, link.href);
                            }}
                            className="text-3xl font-bold text-white hover:text-emerald-300 transition-colors font-serif cursor-pointer"
                        >
                            {link.name}
                        </a>
                    ))}

                    <div className="w-16 h-[1px] bg-white/10 my-4"></div>

                    <a
                        href="#pricing"
                        onClick={(e) => {
                            setIsMobileMenuOpen(false);
                            handleSmoothScroll(e, "#pricing");
                        }}
                        className="w-full max-w-xs bg-gradient-to-r from-amber-400 to-amber-600 text-emerald-950 py-4 rounded-xl font-bold text-xl tracking-widest uppercase shadow-lg shadow-amber-500/30 active:scale-95 transition-transform text-center flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <ShoppingBag className="w-5 h-5" />
                        Tempah Sekarang
                    </a>
                </div>
            </div>
        </>
    );
}
