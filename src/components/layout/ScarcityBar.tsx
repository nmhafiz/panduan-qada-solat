"use client";
import React, { useState, useEffect } from 'react';
import { Users } from 'lucide-react';

export default function ScarcityBar() {
    const [activeUsers, setActiveUsers] = useState(24);

    // Simulate "Real Data" fluctuation
    useEffect(() => {
        const timer = setInterval(() => {
            // Randomly add or remove 1-2 users to make it feel alive
            const change = Math.floor(Math.random() * 5) - 2; // -2 to +2
            setActiveUsers(prev => {
                const newValue = prev + change;
                // Keep it realistic between 18 and 45
                return newValue < 18 ? 18 : newValue > 45 ? 45 : newValue;
            });
        }, 5000); // Update every 5 seconds

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="bg-yellow-400 text-yellow-900 text-center py-2 px-4 shadow-md relative z-50 animate-in slide-in-from-top duration-300">
            <p className="text-sm md:text-base font-bold flex items-center justify-center gap-2">
                <Users className="w-5 h-5" />
                <span><span className="bg-black text-yellow-400 px-2 rounded-md mx-1 tabular-nums transition-all duration-300">{activeUsers}</span> Orang Sedang Membaca Laman Ini. Stok Pakej Combo Laju Susut!</span>
            </p>
        </div>
    );
}
