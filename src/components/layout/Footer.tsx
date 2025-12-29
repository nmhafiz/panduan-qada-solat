import React from 'react';

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-400 py-12">
            <div className="container mx-auto px-4 text-center">
                <h3 className="text-white font-bold text-xl mb-4">Galeri Mukmin</h3>
                <p className="mb-8 text-sm max-w-md mx-auto">
                    Membantu umat Islam menyempurnakan ibadah dengan panduan yang mudah, tepat, dan praktikal.
                </p>

                <div className="flex justify-center gap-6 text-sm mb-8 border-t border-gray-800 pt-8 max-w-lg mx-auto">
                    <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                    <a href="#" className="hover:text-white transition-colors">Contact Us</a>
                </div>

                <p className="text-xs text-gray-600">
                    © {new Date().getFullYear()} Galeri Mukmin. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
