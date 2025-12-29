"use client";


import { Star, BadgeCheck } from "lucide-react";

// --- Enhanced Data (18 Items for "Ribuan" Feel) ---
const testimonials = [
    { id: 1, name: "Hamba Allah", handle: "@hambaallah", text: "Alhamdulillah ustaz, lepas baca buku ni baru saya faham rupanya tak susah pun nak ganti solat. Rasa ringan beban.", date: "2 hari lepas", rating: 5, verified: true, gradient: "from-emerald-50" },
    { id: 2, name: "Pn. Salmah", handle: "@salmah_baker", text: "Suka part 'Kaedah Kiraan'. Tak payah pening ingat manual dah. Wajib ada satu kat rumah.", date: "Semalam", rating: 5, verified: true, gradient: "from-blue-50" },
    { id: 3, name: "Abang Long", handle: "@zulfikri_long", text: "Bahasa santai, tak berat. Sesuai untuk orang awam macam saya yang banyak jahil ni.", date: "Hari ini", rating: 5, verified: true, gradient: "from-amber-50" },
    { id: 4, name: "Kak Miah", handle: "@kakmiah_family", text: "Beli 3 set terus utk anak-anak. Biar faham awal, jangan jadi macam mak dia ni dah tua baru nak merangkak.", date: "minggu lepas", rating: 5, verified: true, gradient: "from-rose-50" },
    { id: 5, name: "Cikgu Razak", handle: "@cgrazak_math", text: "Penghantaran DHL laju. Intipati buku sangat padat tapi mudah hadam. Recommended seller!", date: "Baru tadi", rating: 5, verified: true, gradient: "from-indigo-50" },
    { id: 6, name: "Sister Nurul", handle: "@nurul_hijra", text: "Infografik cantik, tak mengantuk baca. Sesuai hadiahkan untuk kawan2 yang baru nak berubah.", date: "5 jam lepas", rating: 5, verified: true, gradient: "from-teal-50" },
    { id: 7, name: "En. Azman", handle: "@azman_biz", text: "Rasa macam beban 10 tahun hilang lepas baca bab 'Niat Qadha'. Rupanya Allah itu Maha Pengampun.", date: "Semalam", rating: 5, verified: true, gradient: "from-purple-50" },
    { id: 8, name: "Hajah Rokiah", handle: "@nenek_kiah", text: "Tulisan besar, senang orang tua nak baca. Terima kasih mudahkan urusan kami.", date: "3 hari lepas", rating: 5, verified: true, gradient: "from-orange-50" },
    { id: 9, name: "Farid Runner", handle: "@farid_rider", text: "Buku ni nipis tapi padat. Sambil tunggu order grab pun boleh baca. Terbaik.", date: "4 jam lepas", rating: 5, verified: true, gradient: "from-cyan-50" },
    { id: 10, name: "Ustaz Muda", handle: "@dakwah_santai", text: "Rujukan terbaik untuk basic fardhu ain. Saya guna untuk bahan usrah juga.", date: "Semalam", rating: 5, verified: true, gradient: "from-sky-50" },
    { id: 11, name: "Sarah Student", handle: "@sarah_study", text: "Penjelasan simple gila! Masuk akal & logical. Takde ayat berbelit.", date: "Hari ini", rating: 5, verified: true, gradient: "from-pink-50" },
    { id: 12, name: "Abg Lori", handle: "@trucker_life", text: "Dulu ingat qadha ni kena buat semua sekaligus. Rupanya boleh ansur. Baru semangat nak mula.", date: "2 hari lepas", rating: 5, verified: true, gradient: "from-lime-50" },
    { id: 13, name: "Mamashop Owner", handle: "@raju_muslim", text: "Sangat praktikal. Jadual tu saya photostat tampal kat dinding bilik.", date: "Semalam", rating: 5, verified: true, gradient: "from-emerald-50" },
    { id: 14, name: "Kak Tini", handle: "@tini_kitchen", text: "Menangis baca bab taubat tu. Rasa dekat sangat dengan Tuhan.", date: "1 jam lepas", rating: 5, verified: true, gradient: "from-rose-50" },
    { id: 15, name: "Bro Gym", handle: "@fit_muslim", text: "Tak heavy. Baca 10 minit dah faham point penting. Good job team penulis.", date: "Pagi tadi", rating: 5, verified: true, gradient: "from-blue-50" },
    { id: 16, name: "Anak Rantau", handle: "@perantau_kl", text: "Beli pos ke kampung untuk mak ayah. Diorang happy sangat.", date: "Kelmarin", rating: 5, verified: true, gradient: "from-amber-50" },
    { id: 17, name: "Cik Puan Boss", handle: "@lady_boss", text: "Design premium, content A+. Memang berbaloi harga tu.", date: "3 hari lepas", rating: 5, verified: true, gradient: "from-purple-50" },
    { id: 18, name: "Anonymous", handle: "@hamba_dosa", text: "Saya dah mula qadha 5 waktu sehari. Doakan saya istiqamah.", date: "Baru tadi", rating: 5, verified: true, gradient: "from-indigo-50" },
];

// Split into 3 Rows
const row1 = testimonials.slice(0, 6);
const row2 = testimonials.slice(6, 12);
const row3 = testimonials.slice(12, 18);

export default function TestimonialsSection() {
    return (
        <section id="testimonials" className="py-24 bg-stone-50 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

            {/* Soft Gradient Fade on Edges (Left & Right) */}
            <div className="absolute top-0 bottom-0 left-0 w-20 md:w-32 bg-gradient-to-r from-stone-50 to-transparent z-20 pointer-events-none"></div>
            <div className="absolute top-0 bottom-0 right-0 w-20 md:w-32 bg-gradient-to-l from-stone-50 to-transparent z-20 pointer-events-none"></div>

            <div className="relative z-10 mb-10 overflow-hidden">
                <div className="container mx-auto px-4 text-center mb-12">
                    <div className="inline-flex items-center gap-2 bg-white border border-gray-200 px-4 py-1.5 rounded-full shadow-sm mb-6 animate-fade-in-up">
                        <div className="flex -space-x-2">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="w-6 h-6 rounded-full bg-emerald-100 border-2 border-white flex items-center justify-center text-[10px]">⭐</div>
                            ))}
                        </div>
                        <span className="text-sm font-semibold text-gray-700">5.0/5.0 Rating Pelanggan</span>
                    </div>

                    <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 font-serif tracking-tight">
                        Bukan Seorang Dua... <br />
                        <span className="text-emerald-700">Tapi Ribuan Yang Dah Berjaya.</span>
                    </h2>
                    <p className="text-sm text-gray-400">
                        💡 Hover (atau tekan) kad untuk baca
                    </p>
                </div>

                {/* --- MARQUEE ROWS (CSS Driven) --- */}

                {/* Row 1: Left -> Right (Slow) */}
                <MarqueeRow items={row1} direction="left" speed={60} />

                {/* Row 2: Right -> Left (Fast) */}
                <MarqueeRow items={row2} direction="right" speed={45} />

                {/* Row 3: Left -> Right (Medium) */}
                <MarqueeRow items={row3} direction="left" speed={55} />

                {/* Visual Trust Indicator */}
                <div className="mt-12 text-center relative z-20">
                    <p className="text-gray-400 text-sm flex items-center justify-center gap-2">
                        <BadgeCheck className="w-4 h-4 text-emerald-500" />
                        Semua testimoni adalah dari pelanggan verified.
                    </p>
                </div>
            </div>
        </section>
    );
}

function MarqueeRow({ items, direction, speed = 40 }: { items: typeof testimonials, direction: 'left' | 'right', speed?: number }) {
    // Determine animation class
    const animationClass = direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right';

    // Duplicate items sufficient times to ensure overflow for all screen widths
    // 6 items * 300px = 1800px. On 4k screens we might need more.
    // 4 copies = 7200px (Safe)
    const loopedItems = [...items, ...items, ...items, ...items];

    return (
        <div className="flex mb-6 overflow-hidden group w-full">
            <div
                className={`flex gap-6 pl-6 w-max ${animationClass} pause-on-hover`}
                style={{ animationDuration: `${speed}s` }}
            >
                {loopedItems.map((item, idx) => (
                    <div
                        key={`${item.id}-${idx}`}
                        className="w-[300px] md:w-[380px] shrink-0 transition-transform duration-300 hover:scale-105 hover:z-30"
                    >
                        <TestimonialCard item={item} />
                    </div>
                ))}
            </div>
        </div>
    );
}

function TestimonialCard({ item }: { item: typeof testimonials[0] }) {
    return (
        <div className={`h-full p-5 rounded-2xl bg-white border border-gray-100 shadow-[0_4px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.1)] transition-all duration-300 relative overflow-hidden flex flex-col justify-between`}>
            {/* Subtle Gradient Top Area */}
            <div className={`absolute top-0 left-0 w-full h-20 bg-gradient-to-b ${item.gradient} to-white opacity-40`}></div>

            <div className="relative z-10">
                {/* Stars & Date */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex text-amber-400 gap-0.5">
                        {[...Array(item.rating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-gray-300">{item.date}</span>
                </div>

                {/* Content */}
                <p className="text-gray-700 text-sm leading-relaxed font-medium mb-4 line-clamp-4">
                    &quot;{item.text}&quot;
                </p>
            </div>

            {/* User Profile */}
            <div className="flex items-center gap-3 pt-3 border-t border-gray-50 mt-auto relative z-10">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 border border-white shadow-sm">
                    {item.name.charAt(0)}
                </div>
                <div>
                    <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-bold text-gray-900">{item.name}</h4>
                        {item.verified && (
                            <BadgeCheck className="w-3 h-3 text-emerald-500" />
                        )}
                    </div>
                    <p className="text-[10px] text-gray-400">{item.handle || "Verified Buyer"}</p>
                </div>
            </div>
        </div>
    );
}
