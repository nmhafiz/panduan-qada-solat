"use client";
import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

export default function FloatingCTA() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 w-full bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-[0_-4px_20px_-1px_rgba(0,0,0,0.1)] z-[100] md:hidden animate-in slide-in-from-bottom duration-300">
            <div className="px-4 py-3 pb-[env(safe-area-inset-bottom)] flex items-center justify-between gap-4">
                <div>
                    <p className="text-xs text-gray-500 font-medium flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-yellow-500" />
                        <span className="text-green-600 font-bold">Edisi Terhad {new Date().getFullYear()}</span>
                    </p>
                    <p className="font-bold text-gray-900 leading-tight text-sm">Selesaikan Hutang Solat Anda</p>
                </div>
                <button
                    onClick={() => document.getElementById('checkout')?.scrollIntoView({ behavior: 'smooth' })}
                    aria-label="Pergi ke borang tempahan"
                    className="bg-green-600 active:bg-green-700 text-white px-5 py-3 rounded-xl font-bold text-sm shadow-lg shadow-green-500/30 whitespace-nowrap min-h-[44px]"
                >
                    Tempah Sekarang
                </button>
            </div>
        </div>
    );
}
