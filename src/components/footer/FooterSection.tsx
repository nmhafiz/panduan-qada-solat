"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";

export default function FooterSection() {
    const currentYear = 2026;

    return (
        <footer className="bg-gray-900 text-white py-16 pb-32 md:pb-16 border-t border-gray-800">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">

                    {/* Brand Info */}
                    <div>
                        <h4 className="text-2xl font-bold font-serif mb-2">Panduan Qadha Solat</h4>
                        <p className="text-gray-400 text-sm max-w-sm">
                            Platform dakwah digital yang membawakan solusi agama santai & mudah faham untuk masyarakat.
                        </p>
                    </div>

                    {/* Links */}
                    <div className="flex flex-col md:flex-row gap-4 md:gap-6 text-sm text-gray-400">
                        <a
                            href="https://wa.me/60179949054?text=Salam%2C%20saya%20nak%20tanya%20tentang%20Buku%20Panduan%20Qadha%20Solat."
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-green-400 transition-colors flex items-center gap-2"
                            aria-label="Hubungi kami melalui WhatsApp"
                        >
                            <MessageCircle className="w-4 h-4" />
                            Hubungi Kami
                        </a>
                        <Link href="#faq" className="hover:text-white transition-colors">
                            Soalan Lazim
                        </Link>
                        <Link href="#testimonials" className="hover:text-white transition-colors">
                            Testimoni
                        </Link>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
                    <p>&copy; {currentYear} Panduan Qadha Solat. Hak Cipta Terpelihara.</p>
                    <p>
                        Web Design by <a href="https://sahabatxpert.my" target="_blank" rel="noopener noreferrer" className="text-green-500 font-bold hover:text-green-400 transition-colors">SahabatXpert.my</a>
                    </p>
                </div>
            </div>
        </footer>
    );
}
