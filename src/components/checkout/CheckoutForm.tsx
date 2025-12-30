"use client";

import { useState, useEffect } from "react";
import {
    ShieldCheck,
    Truck,
    CheckCircle2,
    AlertCircle,
    Loader2,
    CreditCard,
    Sparkles,
    Lock,
    ChevronRight,
    Smartphone,
    MapPin,
    BookOpen
} from 'lucide-react';
import { useSearchParams } from "next/navigation";
import { formatPhone, formatName, formatEmail } from "@/lib/utils/formatters";
import { getStateFromPostcode, getCityFromPostcode } from "@/lib/data/states";
import { motion, AnimatePresence } from "framer-motion";
import UpsellModal from "./UpsellModal";


// Simple custom hook to avoid external dependency
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
}

// Reusable Floating Label Component (Emerald Style)
const FloatingInput = ({
    label,
    name,
    value,
    onChange,
    onBlur,
    type = "text",
    required = false,
    maxLength,
    inputMode,
    className,
    icon: Icon,
    autoComplete
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
}: any) => (
    <div className={`relative ${className || ''}`}>
        <input
            type={type}
            name={name}
            id={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            required={required}
            maxLength={maxLength}
            inputMode={inputMode}
            autoComplete={autoComplete}
            placeholder=" " // Important for :placeholder-shown trick
            className="peer w-full p-4 pl-12 pt-5 pb-2 border-2 border-stone-200 rounded-xl outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all bg-white font-medium text-gray-900 group-hover:border-emerald-200"
        />
        {/* Icon */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 peer-focus:text-emerald-600 transition-colors">
            {Icon && <Icon className="w-5 h-5" />}
        </div>

        <label
            htmlFor={name}
            className={`absolute left-12 top-4 text-gray-500 transition-all duration-200 pointer-events-none
        peer-focus:-translate-y-3 peer-focus:scale-75 peer-focus:text-emerald-600
        peer-[:not(:placeholder-shown)]:-translate-y-3 peer-[:not(:placeholder-shown)]:scale-75 peer-[:not(:placeholder-shown)]:text-gray-500
        origin-[0] font-medium z-10
      `}
        >
            {label}
        </label>

        {/* Success Tick if filled */}
        {value && value.length > 2 && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500 opacity-0 peer-focus:opacity-100 peer-[:not(:placeholder-shown)]:opacity-100 transition-opacity">
                <CheckCircle2 className="w-5 h-5" />
            </div>
        )}
    </div>
);

type PackageType = "solo" | "combo" | "family";
type PaymentMethod = "cod" | "online";

const PACKAGES = {
    solo: { name: "Pakej Jimat (1 Buku)", price: 49, id: "solo", badge: null, bookCount: 1 },
    combo: { name: "Pakej Combo (2 Buku + Ebook)", price: 59, id: "combo", badge: "Paling Popular", bookCount: 2 },
    family: { name: "Pakej Famili (3 Buku + Ebook)", price: 69, id: "family", badge: "Sesuai Utk Wakaf & Lebih Jimat", bookCount: 3 },
};

export default function CheckoutForm() {
    const searchParams = useSearchParams();
    const pkgParam = searchParams.get("pkg");

    const [selectedPackage, setSelectedPackage] = useState<PackageType>("combo");
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("online");
    const [quantity, setQuantity] = useState<number>(1);
    const [isLoaded, setIsLoaded] = useState(false);

    // Auto-select package from URL
    useEffect(() => {
        if (pkgParam && (pkgParam === "solo" || pkgParam === "combo" || pkgParam === "family")) {
            // eslint-disable-next-line
            setSelectedPackage(pkgParam as PackageType);
        }
    }, [pkgParam]);

    // Reset quantity when package changes
    useEffect(() => {
        // eslint-disable-next-line
        setQuantity(1);
    }, [selectedPackage]);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showUpsell, setShowUpsell] = useState(false);
    const [hasUpsellShown, setHasUpsellShown] = useState(false); // Global flag for current session
    const [isShaking, setIsShaking] = useState(false); // For invalid form shake effect
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        address: "",
        postcode: "",
        city: "",
        state: "",
    });

    // 1. LocalStorage Persistence (Sticky Form) & Hydration Fix
    useEffect(() => {
        const savedData = localStorage.getItem("checkout_draft");
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                // eslint-disable-next-line
                setFormData(prev => ({ ...prev, ...parsed }));
            } catch {
                console.error("Failed to load draft");
            }
        }
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("checkout_draft", JSON.stringify(formData));
        }
    }, [formData, isLoaded]);


    const [sessionId, setSessionId] = useState("");

    useEffect(() => {
        // eslint-disable-next-line
        setSessionId(`sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
    }, []);

    // Auto-Save Draft to Server (Backup)
    const debouncedFormData = useDebounce(formData, 1500);

    useEffect(() => {
        if ((debouncedFormData.phone || debouncedFormData.email) && sessionId) {
            fetch("/api/order/draft", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    sessionId,
                    packageId: selectedPackage,
                    quantity,
                    amount: PACKAGES[selectedPackage].price * quantity,
                    paymentMethod,
                    customer: debouncedFormData,
                    timestamp: new Date().toISOString()
                }),
            }).catch(err => console.error("Draft save failed", err));
        }
    }, [debouncedFormData, selectedPackage, paymentMethod, quantity, sessionId]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // 2. Smart Address Parser (Magic Fill)
    const handleAddressBlur = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const text = e.target.value;
        const postcodeMatch = text.match(/\b\d{5}\b/); // Find 5-digit postcode

        if (postcodeMatch) {
            const extractedPostcode = postcodeMatch[0];
            const detectedState = getStateFromPostcode(extractedPostcode);
            const detectedCity = getCityFromPostcode(extractedPostcode);

            setFormData(prev => ({
                ...prev,
                postcode: extractedPostcode, // Auto-fill postcode
                address: text,
                state: detectedState || prev.state, // Auto-fill state if found
                city: detectedCity ? detectedCity.toUpperCase() : prev.city // Auto-fill city if found
            }));
        }
    };

    const handlePostcodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/\D/g, '').slice(0, 5);
        let newState = formData.state;
        let newCity = formData.city;

        if (val.length === 5) {
            const detectedState = getStateFromPostcode(val);
            if (detectedState) newState = detectedState;

            const detectedCity = getCityFromPostcode(val);
            if (detectedCity) newCity = detectedCity.toUpperCase();
        }

        setFormData({ ...formData, postcode: val, state: newState, city: newCity });
    };

    const handleQuantityChange = (type: 'increment' | 'decrement') => {
        if (type === 'increment') {
            setQuantity(prev => Math.min(prev + 1, 10));
        } else {
            setQuantity(prev => Math.max(prev - 1, 1));
        }
    };

    const handleUpsellUpgrade = () => {
        const upgradeMap = { 'solo': 'combo', 'combo': 'family' };
        if (selectedPackage === 'solo' || selectedPackage === 'combo') {
            const nextPkg = upgradeMap[selectedPackage] as PackageType;
            setSelectedPackage(nextPkg);
            // Crucial: We bypass another submit click and go straight to processing
            // with the NEW package. This is a "One-Click Upgrade & Pay".
            setHasUpsellShown(true);
            setShowUpsell(false);
            setTimeout(() => processOrder(nextPkg), 100);
        }
    };

    const handleUpsellContinue = () => {
        setHasUpsellShown(true);
        setShowUpsell(false);
        setTimeout(() => processOrder(), 100);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Check Validation FIRST
        if (!isFormValid) {
            setIsShaking(true);
            setTimeout(() => setIsShaking(false), 500);

            // Find first invalid field to focus (Optional enhancement)
            const firstInvalid = !formData.name ? 'name' :
                !formData.phone ? 'phone' :
                    !formData.email ? 'email' :
                        !formData.address ? 'address' :
                            !formData.postcode ? 'postcode' : 'state';

            const element = document.getElementById(firstInvalid);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                element.focus();
            }

            return;
        }

        if (!hasUpsellShown && (selectedPackage === 'solo' || selectedPackage === 'combo')) {
            setShowUpsell(true);
            return;
        }

        await processOrder();
    };

    const processOrder = async (overridePkg?: PackageType) => {
        setIsSubmitting(true);
        // console.log("🚀 Starting Order Process...");

        const currentPkg = overridePkg || selectedPackage;

        // Clear local storage on submit to prevent stale data for next order
        localStorage.removeItem("checkout_draft");

        const totalAmount = PACKAGES[currentPkg].price * quantity;

        try {
            const response = await fetch("/api/order/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    sessionId,
                    packageId: currentPkg,
                    description: `${PACKAGES[currentPkg].name} (x${quantity})`,
                    quantity,
                    amount: totalAmount,
                    paymentMethod,
                    customer: formData,
                }),
            });

            const result = await response.json();
            console.log("✅ Order Result:", result);

            if (result.paymentUrl) {
                // console.log("🔄 Redirecting to:", result.paymentUrl);
                window.location.href = result.paymentUrl;
            } else if (result.redirectUrl) {
                window.location.href = result.redirectUrl;
            } else if (result.success) {
                alert("Tempahan diterima! Semak email/WhatsApp anda.");
                setIsSubmitting(false);
            } else {
                alert(`Ralat: ${result.error || JSON.stringify(result)}`);
                setIsSubmitting(false);
            }

        } catch (error: unknown) {
            console.error("❌ Checkout Error:", error);
            alert("Ada masalah sambungan. Sila cuba lagi.");
            setIsSubmitting(false);
        }
    };

    // Calculate Summary Values
    const totalBooks = PACKAGES[selectedPackage].bookCount * quantity;
    // Assuming 'Original Price' anchor is RM 89 per book as per copy logic
    const retailPricePerBook = 89;
    // Ebook Value RM 99 (only for combo/family)
    const ebookValue = selectedPackage !== 'solo' ? 99 : 0;

    // Total Retail Value = (Books * 89) + Ebook Value
    const totalRetailValue = (totalBooks * retailPricePerBook) + ebookValue;
    const totalToPay = PACKAGES[selectedPackage].price * quantity;
    const totalSavings = totalRetailValue - totalToPay;

    // Validation Check
    const isFormValid =
        formData.name.length > 2 &&
        formData.phone.length > 8 &&
        formData.email.includes('@') &&
        formData.address.length > 5 &&
        formData.postcode.length === 5 &&
        formData.state !== "";

    // Prevent hydration flicker
    if (!isLoaded) return null;

    return (
        <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-emerald-900/10 border border-white/50 p-6 md:p-10 max-w-2xl mx-auto relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-600"></div>
            <div className="absolute top-10 right-10 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="text-center mb-10 relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-4">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Secure Checkout
                </div>
                <h3 className="text-3xl font-serif font-bold text-gray-900 mb-3">Lengkapkan Tempahan</h3>
                <p className="text-gray-500 text-sm max-w-sm mx-auto">Data anda dilindungi enkripsi 256-bit SSL. Insurans penghantaran disediakan untuk setiap tempahan.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10 relative z-10">

                {/* Section 1: Pilih Pakej */}
                <div>
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">1</div>
                        <label className="text-gray-900 font-bold uppercase tracking-wide text-sm">Pilih Pakej Anda</label>
                    </div>

                    <div className="space-y-4">
                        {(Object.keys(PACKAGES) as PackageType[]).map((pkgKey) => {
                            const pkg = PACKAGES[pkgKey];
                            const isSelected = selectedPackage === pkgKey;
                            const showQuantitySelector = isSelected && pkgKey === 'family';

                            return (
                                <motion.div
                                    key={pkg.id}
                                    className="relative"
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                >
                                    <label className={`
                                        relative flex items-stretch p-0 rounded-2xl cursor-pointer transition-all duration-300 overflow-hidden
                                        ${isSelected
                                            ? 'bg-gradient-to-br from-emerald-900 to-teal-900 text-white shadow-lg shadow-emerald-900/30 border-2 border-transparent'
                                            : 'bg-white border-2 border-stone-100 hover:border-emerald-200 text-gray-600 shadow-sm hover:shadow-md'
                                        }
                                    `}>
                                        {/* Info Section (Left) */}
                                        <div className="flex-1 p-5 flex items-start gap-4">
                                            <div className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors shrink-0 ${isSelected ? 'border-emerald-400' : 'border-gray-300'}`}>
                                                {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />}
                                            </div>

                                            <div className="flex-1">
                                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                                    <span className={`font-bold text-lg leading-tight ${isSelected ? 'text-white' : 'text-gray-900'}`}>{pkg.name}</span>
                                                    {pkg.badge && (
                                                        <span className={`text-[9px] uppercase font-black px-2 py-0.5 rounded-full whitespace-nowrap ${isSelected ? 'bg-amber-400 text-amber-900' : 'bg-emerald-100 text-emerald-800'}`}>
                                                            {pkg.badge}
                                                        </span>
                                                    )}
                                                </div>
                                                {pkgKey !== 'solo' && (
                                                    <div className={`text-[11px] font-bold flex items-center gap-1.5 ${isSelected ? 'text-emerald-300' : 'text-emerald-600'}`}>
                                                        <Sparkles className="w-3.5 h-3.5" />
                                                        <span>BONUS: Ebook (RM99)</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Price Sidebar (Right) */}
                                        <div className={`w-28 flex flex-col items-center justify-center border-l transition-colors ${isSelected ? 'bg-white/10 border-white/10' : 'bg-gray-50 border-stone-100'}`}>
                                            <div className={`font-black text-2xl ${isSelected ? 'text-white' : 'text-emerald-700'}`}>RM{pkg.price}</div>
                                            {isSelected && <div className="text-[9px] font-bold uppercase tracking-tighter text-emerald-300 opacity-80">PROMO</div>}
                                        </div>

                                        <input
                                            type="radio"
                                            name="package"
                                            value={pkgKey}
                                            checked={isSelected}
                                            onChange={() => setSelectedPackage(pkgKey)}
                                            className="hidden"
                                        />
                                    </label>

                                    <AnimatePresence>
                                        {showQuantitySelector && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                                animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                                                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                                className="overflow-hidden bg-emerald-50 rounded-xl border border-emerald-200"
                                            >
                                                <div className="p-4 flex items-center justify-between">
                                                    <div className="flex items-center gap-2 text-emerald-800">
                                                        <div className="bg-white p-1.5 rounded-lg shadow-sm">
                                                            <Smartphone className="w-4 h-4" />
                                                        </div>
                                                        <span className="text-sm font-bold">Kuantiti Set (Wakaf/Family):</span>
                                                    </div>
                                                    <div className="flex items-center gap-3 bg-white rounded-lg shadow-sm border border-emerald-200 p-1">
                                                        <button type="button" onClick={() => handleQuantityChange('decrement')} disabled={quantity <= 1} className="w-8 h-8 flex items-center justify-center hover:bg-emerald-50 rounded-md text-emerald-700 font-bold disabled:opacity-30">-</button>
                                                        <span className="w-8 text-center font-bold text-gray-900">{quantity}</span>
                                                        <button type="button" onClick={() => handleQuantityChange('increment')} disabled={quantity >= 10} className="w-8 h-8 flex items-center justify-center bg-emerald-100 hover:bg-emerald-200 rounded-md text-emerald-700 font-bold disabled:opacity-30">+</button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Section 2: Maklumat Penghantaran */}
                <div>
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">2</div>
                        <label className="text-gray-900 font-bold uppercase tracking-wide text-sm">Butiran Penghantaran</label>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <FloatingInput
                                label="Nama Penuh"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                onBlur={(e: React.FocusEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value ? formatName(e.target.value) : '' })}
                                required
                                autoComplete="name"
                            />
                        </div>
                        <div>
                            <FloatingInput
                                label="No. WhatsApp"
                                name="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleChange}
                                onBlur={(e: React.FocusEvent<HTMLInputElement>) => setFormData({ ...formData, phone: e.target.value ? formatPhone(e.target.value) : '' })}
                                required
                                autoComplete="tel"
                            />
                        </div>
                        <div>
                            <FloatingInput
                                label="Email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                onBlur={(e: React.FocusEvent<HTMLInputElement>) => setFormData({ ...formData, email: e.target.value ? formatEmail(e.target.value) : '' })}
                                required
                                autoComplete="email"
                            />
                        </div>
                        <div className="md:col-span-2 relative group">
                            <textarea
                                required
                                name="address"
                                rows={3}
                                id="address"
                                placeholder=" "
                                value={formData.address}
                                onChange={handleChange}
                                onBlur={handleAddressBlur} // Smart Address Parsing on Blur
                                autoComplete="street-address"
                                className="peer w-full p-4 pl-12 pt-5 pb-2 border-2 border-stone-200 rounded-xl outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all bg-white font-medium text-gray-900 resize-none group-hover:border-emerald-200"
                            ></textarea>
                            {/* Icon for Address */}
                            <div className="absolute left-4 top-6 text-gray-400 peer-focus:text-emerald-600 transition-colors">
                                <MapPin className="w-5 h-5" />
                            </div>
                            <label className="absolute left-12 top-4 text-gray-500 transition-all duration-200 pointer-events-none peer-focus:-translate-y-3 peer-focus:scale-75 peer-focus:text-emerald-600 peer-[:not(:placeholder-shown)]:-translate-y-3 peer-[:not(:placeholder-shown)]:scale-75 peer-[:not(:placeholder-shown)]:text-gray-500 origin-[0] font-medium z-10">Alamat Penuh</label>
                        </div>
                        <div className="grid grid-cols-2 gap-4 md:col-span-2">
                            <div>
                                <FloatingInput
                                    label="Poskod"
                                    name="postcode"
                                    inputMode="numeric"
                                    maxLength={5}
                                    value={formData.postcode}
                                    onChange={handlePostcodeChange}
                                    required
                                    autoComplete="postal-code"
                                />
                            </div>
                            <div className="relative group">
                                <select
                                    name="state"
                                    required
                                    value={formData.state}
                                    onChange={handleChange}
                                    autoComplete="address-level1"
                                    className="w-full p-4 border-2 border-stone-200 rounded-xl bg-white outline-none focus:border-emerald-500 font-medium h-14 appearance-none group-hover:border-emerald-200 transition-colors text-sm"
                                >
                                    <option value="">Negeri</option>
                                    <option value="Johor">Johor</option>
                                    <option value="Kedah">Kedah</option>
                                    <option value="Kelantan">Kelantan</option>
                                    <option value="Melaka">Melaka</option>
                                    <option value="Negeri Sembilan">Negeri Sembilan</option>
                                    <option value="Pahang">Pahang</option>
                                    <option value="Perak">Perak</option>
                                    <option value="Perlis">Perlis</option>
                                    <option value="Pulau Pinang">Pulau Pinang</option>
                                    <option value="Sabah">Sabah</option>
                                    <option value="Sarawak">Sarawak</option>
                                    <option value="Selangor">Selangor</option>
                                    <option value="Terengganu">Terengganu</option>
                                    <option value="Kuala Lumpur">W.P. Kuala Lumpur</option>
                                    <option value="Labuan">W.P. Labuan</option>
                                    <option value="Putrajaya">W.P. Putrajaya</option>
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                    <ChevronRight className="w-4 h-4 rotate-90" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div >

                {/* Section 3: Pembayaran */}
                < div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-200" >
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-sm">3</div>
                        <label className="text-gray-900 font-bold uppercase tracking-wide text-sm">Pilih Cara Bayaran:</label>
                    </div>

                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                        {/* COD Option */}
                        <label className={`
                            relative cursor-pointer p-4 rounded-2xl border-2 text-left transition-all duration-300 group flex flex-col justify-between min-h-[140px]
                            ${paymentMethod === 'cod'
                                ? 'border-emerald-600 bg-white shadow-xl shadow-emerald-900/10 ring-1 ring-emerald-600 z-10'
                                : 'border-slate-200 hover:border-emerald-100 bg-white/50 text-gray-500 hover:bg-white'
                            }
                        `}>
                            <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="hidden" />

                            <div className="flex items-start justify-between">
                                <div className={`p-2 rounded-lg ${paymentMethod === 'cod' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-gray-400'}`}>
                                    <Truck className="w-5 h-5" />
                                </div>
                                {paymentMethod === 'cod' && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                            </div>

                            <div>
                                <div className={`font-bold text-sm leading-tight mb-1 ${paymentMethod === 'cod' ? 'text-gray-900' : 'text-gray-600'}`}>COD (Bayar Tunai)</div>
                                <div className="flex gap-1 opacity-40 grayscale group-hover:opacity-100 group-hover:grayscale-0 transition-all">
                                    <span className="text-[8px] font-bold border border-slate-200 px-1 rounded uppercase">DHL</span>
                                    <span className="text-[8px] font-bold border border-slate-200 px-1 rounded uppercase">Ninja</span>
                                    <span className="text-[8px] font-bold border border-slate-200 px-1 rounded uppercase">J&T</span>
                                </div>
                            </div>
                        </label>

                        {/* Online Banking Option */}
                        <label className={`
                            relative cursor-pointer p-4 rounded-2xl border-2 text-left transition-all duration-300 group flex flex-col justify-between min-h-[140px]
                            ${paymentMethod === 'online'
                                ? 'border-blue-600 bg-white shadow-xl shadow-blue-900/10 ring-1 ring-blue-600 z-10'
                                : 'border-slate-200 hover:border-blue-100 bg-white/50 text-gray-500 hover:bg-white'
                            }
                        `}>
                            <input type="radio" name="payment" value="online" checked={paymentMethod === 'online'} onChange={() => setPaymentMethod('online')} className="hidden" />

                            <div className="flex items-start justify-between">
                                <div className={`p-2 rounded-lg ${paymentMethod === 'online' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-gray-400'}`}>
                                    <CreditCard className="w-5 h-5" />
                                </div>
                                <div className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded-full ${paymentMethod === 'online' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700'}`}>
                                    Paling Laju
                                </div>
                            </div>

                            <div>
                                <div className={`font-bold text-sm leading-tight mb-1 ${paymentMethod === 'online' ? 'text-gray-900' : 'text-gray-600'}`}>Online Banking</div>
                                <div className="flex gap-1 opacity-40 grayscale group-hover:opacity-100 group-hover:grayscale-0 transition-all">
                                    <span className="text-[8px] font-bold border border-slate-200 px-1 rounded">FPX</span>
                                    <span className="text-[8px] font-bold border border-slate-200 px-1 rounded">E-Wallet</span>
                                </div>
                            </div>
                        </label>
                    </div>

                    <AnimatePresence mode="wait">
                        {paymentMethod === 'cod' && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="mt-4 p-4 bg-yellow-50 text-yellow-900 text-sm rounded-xl border border-yellow-200 flex items-start gap-3"
                            >
                                <AlertCircle className="w-5 h-5 flex-shrink-0 text-yellow-600 mt-0.5" />
                                <div>
                                    <p className="font-bold mb-1">Penting untuk COD:</p>
                                    <p className="opacity-90 leading-relaxed">Sila pastikan ada waris di rumah untuk terima barang dan sediakan wang tunai <strong>RM{PACKAGES[selectedPackage].price * quantity}</strong>.</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div >

                {/* Ringkasan Pesanan (NEW) */}
                <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100">
                    <h4 className="text-emerald-800 font-bold mb-4 uppercase text-xs tracking-wider border-b border-emerald-200 pb-2">Ringkasan Pesanan</h4>

                    <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">Buku Fizikal Diterima:</span>
                            <span className="font-bold text-gray-900 flex items-center gap-1">
                                <BookOpen className="w-4 h-4 text-emerald-600" />
                                {totalBooks} Unit
                            </span>
                        </div>

                        {selectedPackage !== 'solo' && (
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600">Bonus Ebook:</span>
                                <span className="font-bold text-emerald-600 flex items-center gap-1">
                                    <Sparkles className="w-4 h-4" />
                                    1x Ebook Solat Sunat
                                </span>
                            </div>
                        )}

                        <div className="flex justify-between items-center text-sm pt-2 border-t border-emerald-100/50">
                            <span className="text-emerald-700 font-medium">Nilai Penjimatan Anda:</span>
                            <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200 text-xs">
                                Jimat RM{totalSavings}
                            </span>
                        </div>
                    </div>

                    {/* Dynamic Ebook Notice */}
                    {selectedPackage !== 'solo' && (
                        paymentMethod === 'online' ? (
                            <div className="mt-4 p-3 bg-blue-50 rounded-xl flex items-start gap-2 border border-blue-100">
                                <Sparkles className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                <p className="text-xs text-blue-800 leading-relaxed">
                                    <strong>Akses Pantas (Online):</strong> Ebook Bonus akan dihantar terus ke email <em>{formData.email || 'anda'}</em> <strong>serta-merta</strong> selepas pembayaran berjaya. Tak perlu tunggu buku fizikal sampai! ⚡️
                                </p>
                            </div>
                        ) : (
                            <div className="mt-4 p-3 bg-amber-50 rounded-xl flex items-start gap-2 border border-amber-100">
                                <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-xs text-amber-900 leading-relaxed mb-2">
                                        <strong>Nota COD:</strong> Link Ebook hanya akan dihantar <strong>selepas</strong> anda terima buku dan bayar pada posmen nanti.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod('online')}
                                        className="text-xs font-bold text-white bg-amber-600 px-3 py-1.5 rounded-lg shadow-sm hover:bg-amber-700 hover:shadow-md transition-all flex items-center gap-1"
                                    >
                                        Nak baca serta-merta? Tukar ke Online Banking
                                        <ChevronRight className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        )
                    )}
                </div>

                {/* Total & Submit */}
                <div className="pt-2">
                    {/* Sticky Summary Bar Effect */}
                    <div className="bg-emerald-900 text-white p-6 rounded-2xl shadow-xl shadow-emerald-900/30 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all duration-700 pointer-events-none"></div>

                        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                            <div className="text-center md:text-left">
                                <div className="text-emerald-300 text-sm font-medium uppercase tracking-wider mb-1">Jumlah Perlu Bayar</div>
                                <div className="text-4xl font-extrabold tracking-tight">RM{PACKAGES[selectedPackage].price * quantity}</div>
                            </div>
                            <div className="text-right hidden md:block">
                                <div className="text-sm text-emerald-200">{PACKAGES[selectedPackage].name}</div>
                                <div className="text-xs text-emerald-400">Total: {totalBooks} Buku {selectedPackage !== 'solo' && '+ Ebook Bonus'}</div>
                            </div>
                        </div>

                        <motion.button
                            animate={isShaking ? { x: [0, -10, 10, -10, 10, 0] } : {}}
                            disabled={isSubmitting}
                            type="submit"
                            className={`
                                w-full font-bold text-xl py-5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-3 relative overflow-hidden group/btn
                                ${isFormValid
                                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:shadow-emerald-500/30 hover:scale-[1.01] active:scale-[0.99] cursor-pointer border border-emerald-500/50'
                                    : 'bg-emerald-800 text-emerald-100/50 cursor-pointer border border-emerald-700/50 hover:bg-emerald-700/50'
                                }
                            `}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-6 h-6 animate-spin text-white" />
                                    <span>Sedang Proses...</span>
                                </>
                            ) : !isFormValid ? (
                                <>
                                    <span>Lengkapkan Maklumat</span>
                                    <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse shadow-[0_0_8px_rgba(248,113,113,0.8)]"></div>
                                </>
                            ) : (
                                <>
                                    <span>TERUSKAN TEMPAHAN</span>
                                    <ChevronRight className="w-6 h-6 border-2 border-white/30 rounded-full p-0.5 group-hover/btn:border-white transition-colors" />

                                    {/* Shine Effect */}
                                    <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 group-hover/btn:animate-shine pointer-events-none" />
                                </>
                            )}
                        </motion.button>

                        <p className="text-center text-emerald-400/60 text-[10px] mt-4 uppercase tracking-widest font-medium">Click to Secure Your Order</p>
                    </div>

                    {/* Trust Footnote */}
                    <div className="mt-8 flex flex-col items-center justify-center gap-3 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-1.5">
                                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="text-xs font-bold text-gray-600">256-Bit SSL Encrypted</span>
                            </div>
                            <div className="h-3 w-px bg-gray-300"></div>
                            <div className="flex items-center gap-1.5">
                                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                                <span className="text-xs font-bold text-gray-600">Privacy Protected</span>
                            </div>
                        </div>
                    </div>
                </div>

            </form>

            <UpsellModal
                isOpen={showUpsell}
                currentPackage={selectedPackage}
                onClose={() => setShowUpsell(false)}
                onUpgrade={handleUpsellUpgrade}
                onContinue={handleUpsellContinue}
            />


        </div>
    );
}

