"use client";

import { useState, useEffect } from "react";
import { ShieldCheck, Truck, CheckCircle2, AlertCircle, BookOpen, Loader2 } from 'lucide-react';
import { useSearchParams } from "next/navigation";
import { formatPhone, formatName, formatEmail } from "@/lib/utils/formatters";
import { getStateFromPostcode, getCityFromPostcode } from "@/lib/data/states";

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

// Reusable Floating Label Component
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
    className
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
            placeholder=" " // Important for :placeholder-shown trick
            className="peer w-full p-4 pt-5 pb-2 border-2 border-gray-200 rounded-xl outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all bg-white font-medium text-gray-900"
        />
        <label
            htmlFor={name}
            className={`absolute left-4 top-4 text-gray-500 transition-all duration-200 pointer-events-none
        peer-focus:-translate-y-3 peer-focus:scale-75 peer-focus:text-green-600
        peer-[:not(:placeholder-shown)]:-translate-y-3 peer-[:not(:placeholder-shown)]:scale-75 peer-[:not(:placeholder-shown)]:text-gray-500
        origin-[0] font-medium
      `}
        >
            {label}
        </label>

        {/* Success Tick if filled */}
        {value && value.length > 2 && (
            <div className="absolute right-4 top-4 text-green-500 opacity-0 peer-focus:opacity-100 peer-[:not(:placeholder-shown)]:opacity-100 transition-opacity">
                <CheckCircle2 className="w-5 h-5" />
            </div>
        )}
    </div>
);

type PackageType = "solo" | "combo" | "family";
type PaymentMethod = "cod" | "online";

const PACKAGES = {
    solo: { name: "Pakej Jimat (1 Buku)", price: 49, id: "solo" },
    combo: { name: "Pakej Combo (2 Buku + Ebook)", price: 59, id: "combo" },
    family: { name: "Pakej Famili (3 Buku + Ebook)", price: 69, id: "family" },
};

export default function CheckoutForm() {
    const searchParams = useSearchParams();
    const pkgParam = searchParams.get("pkg");

    const [selectedPackage, setSelectedPackage] = useState<PackageType>("combo");
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
    const [quantity, setQuantity] = useState<number>(1);

    // Auto-select package from URL
    useEffect(() => {
        if (pkgParam && (pkgParam === "solo" || pkgParam === "combo" || pkgParam === "family")) {
            setSelectedPackage(pkgParam as PackageType);
        }
    }, [pkgParam]);

    // Reset quantity when package changes (optional, but good for UX)
    useEffect(() => {
        setQuantity(1);
    }, [selectedPackage]);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        address: "",
        postcode: "",
        city: "",
        state: "",
    });

    // Generate Session ID once on mount to track this specific visitor session
    const [sessionId, setSessionId] = useState("");

    useEffect(() => {
        // Create a simple unique ID for this session (e.g., "sess_17xxxx")
        setSessionId(`sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
    }, []);

    // Auto-Save Draft Logic with Debounce
    const debouncedFormData = useDebounce(formData, 1500);

    useEffect(() => {
        if ((debouncedFormData.phone || debouncedFormData.email) && sessionId) {
            // Only save if meaningful data exists
            fetch("/api/order/draft", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    sessionId, // <--- UNIQUE ID (Prevention of Duplicates)
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const totalAmount = PACKAGES[selectedPackage].price * quantity;

        try {
            // API Call will go here
            const response = await fetch("/api/order/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    sessionId, // <--- Link Order to Draft
                    packageId: selectedPackage,
                    quantity,
                    amount: totalAmount,
                    paymentMethod,
                    customer: formData,
                }),
            });

            const result = await response.json();

            if (result.paymentUrl) {
                window.location.href = result.paymentUrl;
            } else if (result.success) {
                alert("Tempahan diterima! Semak email/WhatsApp anda.");
                // Redirect to success page
            } else {
                alert("Ralat: " + result.error);
            }

        } catch (error) {
            alert("Ada masalah sambungan. Sila cuba lagi.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 md:p-8 max-w-2xl mx-auto relative overflow-hidden">
            {/* Decorative Top Gradient Line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-50"></div>

            <div className="text-center mb-8 relative z-10">
                <h3 className="text-2xl font-serif font-bold text-gray-900 mb-2">Lengkapkan Tempahan</h3>
                <p className="text-gray-500 text-sm">Data anda dilindungi & selamat. (Insurans penghantaran disediakan)</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">

                {/* Section 1: Pilih Pakej */}
                <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                    <label className="block text-gray-700 font-bold mb-4 uppercase tracking-wide text-sm">1. Sahkan Pakej Anda:</label>
                    <div className="space-y-3">
                        {(Object.keys(PACKAGES) as PackageType[]).map((pkgKey) => {
                            const pkg = PACKAGES[pkgKey];
                            const isSelected = selectedPackage === pkgKey;
                            const showQuantitySelector = isSelected && pkgKey === 'family';

                            return (
                                <div key={pkg.id} className={`transition-all duration-300 ${isSelected ? 'transform scale-[1.01]' : ''}`}>
                                    <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${isSelected ? 'border-green-600 bg-green-50 shadow-md ' + (showQuantitySelector ? 'rounded-b-none border-b-0' : '') : 'border-gray-200 hover:border-green-300'}`}>
                                        <div className="flex items-center gap-3">
                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-green-600' : 'border-gray-300'}`}>
                                                {isSelected && <div className="w-3 h-3 rounded-full bg-green-600" />}
                                            </div>
                                            <div>
                                                <span className="block font-bold text-gray-900">{pkg.name}</span>
                                                {pkgKey !== 'solo' && <span className="text-xs text-green-700 font-semibold flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Free Ebook Bonus</span>}
                                            </div>
                                        </div>
                                        <div className="font-bold text-lg text-green-700">RM{pkg.price}</div>
                                        <input
                                            type="radio"
                                            name="package"
                                            value={pkgKey}
                                            checked={isSelected}
                                            onChange={() => setSelectedPackage(pkgKey)}
                                            className="hidden"
                                        />
                                    </label>

                                    {/* Quantity Selector - Only for Selected Family Package */}
                                    {showQuantitySelector && (
                                        <div className="bg-green-50 border-2 border-green-600 border-t-0 p-4 rounded-b-xl flex items-center justify-between animate-in slide-in-from-top-2">
                                            <span className="text-sm font-bold text-green-800">Kuantiti Set: <span className="text-xs font-normal text-green-600 block">(Untuk Wakaf / Keluarga Besar)</span></span>
                                            <div className="flex items-center gap-3 bg-white rounded-lg shadow-sm border border-green-200 p-1">
                                                <button
                                                    type="button"
                                                    onClick={() => handleQuantityChange('decrement')}
                                                    className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-md text-gray-600 font-bold disabled:opacity-50"
                                                    disabled={quantity <= 1}
                                                >
                                                    -
                                                </button>
                                                <span className="w-8 text-center font-bold text-lg">{quantity}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleQuantityChange('increment')}
                                                    className="w-8 h-8 flex items-center justify-center bg-green-100 hover:bg-green-200 rounded-md text-green-700 font-bold disabled:opacity-50"
                                                    disabled={quantity >= 10}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Section 2: Maklumat Diri */}
                <div>
                    <label className="block text-gray-700 font-bold mb-4 uppercase tracking-wide text-sm">2. Maklumat Penghantaran:</label>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <FloatingInput
                                label="Nama Penuh"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                onBlur={(e: any) => setFormData({ ...formData, name: formatName(e.target.value) })}
                                required
                            />
                        </div>
                        <div>
                            <FloatingInput
                                label="No. Telefon (WhatsApp)"
                                name="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleChange}
                                onBlur={(e: any) => setFormData({ ...formData, phone: formatPhone(e.target.value) })}
                                required
                            />
                        </div>
                        <div>
                            <FloatingInput
                                label="Alamat Email (Penting)"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                onBlur={(e: any) => setFormData({ ...formData, email: formatEmail(e.target.value) })}
                                required
                            />
                        </div>
                        <div className="md:col-span-2 relative">
                            <textarea
                                required
                                name="address"
                                rows={3}
                                id="address"
                                placeholder=" "
                                value={formData.address}
                                onChange={handleChange}
                                className="peer w-full p-4 pt-5 pb-2 border-2 border-gray-200 rounded-xl outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all bg-white font-medium text-gray-900"
                            ></textarea>
                            <label
                                htmlFor="address"
                                className="absolute left-4 top-4 text-gray-500 transition-all duration-200 pointer-events-none
                                peer-focus:-translate-y-3 peer-focus:scale-75 peer-focus:text-green-600
                                peer-[:not(:placeholder-shown)]:-translate-y-3 peer-[:not(:placeholder-shown)]:scale-75 peer-[:not(:placeholder-shown)]:text-gray-500
                                origin-[0] font-medium"
                            >
                                Alamat Penuh (Rumah/Pejabat)
                            </label>
                        </div>
                        <div>
                            <FloatingInput
                                label="Poskod"
                                name="postcode"
                                inputMode="numeric"
                                maxLength={5}
                                value={formData.postcode}
                                onChange={handlePostcodeChange}
                                required
                            />
                        </div>
                        <div>
                            <FloatingInput
                                label="Bandar"
                                name="city"
                                value={formData.city}
                                onChange={(e: any) => setFormData({ ...formData, city: e.target.value.toUpperCase() })}
                                required
                            />
                        </div>
                        <div className="md:col-span-2 relative">
                            <select
                                name="state"
                                required
                                value={formData.state}
                                onChange={handleChange}
                                className="w-full p-4 border-2 border-gray-200 rounded-xl bg-white outline-none focus:border-green-500 font-medium h-14 appearance-none"
                            >
                                <option value="">Pilih Negeri</option>
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
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="m6 9 6 6 6-6" /></svg>
                            </div>
                        </div>
                    </div>
                </div >

                {/* Section 3: Pembayaran */}
                < div className="bg-gray-50 p-5 rounded-xl border border-gray-200" >
                    <label className="block text-gray-700 font-bold mb-4 uppercase tracking-wide text-sm">3. Kaedah Bayaran:</label>

                    <div className="grid grid-cols-2 gap-4">
                        <label className={`cursor-pointer p-4 rounded-xl border-2 text-center transition-all ${paymentMethod === 'cod' ? 'border-green-600 bg-green-50 text-green-900 shadow-md ring-1 ring-green-600' : 'border-gray-200 hover:border-gray-300 text-gray-600 bg-white'}`}>
                            <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="hidden" />
                            <Truck className={`w-8 h-8 mx-auto mb-2 ${paymentMethod === 'cod' ? 'text-green-600' : 'text-gray-400'}`} />
                            <div className="font-bold text-sm">Barang Sampai Baru Bayar (COD)</div>
                        </label>

                        <label className={`cursor-pointer p-4 rounded-xl border-2 text-center transition-all ${paymentMethod === 'online' ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-md ring-1 ring-blue-600' : 'border-gray-200 hover:border-gray-300 text-gray-600 bg-white'}`}>
                            <input type="radio" name="payment" value="online" checked={paymentMethod === 'online'} onChange={() => setPaymentMethod('online')} className="hidden" />
                            <ShieldCheck className={`w-8 h-8 mx-auto mb-2 ${paymentMethod === 'online' ? 'text-blue-600' : 'text-gray-400'}`} />
                            <div className="font-bold text-sm">Online Banking (FPX)</div>
                        </label>
                    </div>

                    {
                        paymentMethod === 'cod' && (
                            <div className="mt-4 space-y-3 animate-in fade-in slide-in-from-top-1">
                                <div className="p-3 bg-yellow-50 text-yellow-800 text-sm rounded-lg border border-yellow-200 flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                    <p>Pastikan anda sediakan wang tunai <strong>RM{PACKAGES[selectedPackage].price * quantity}</strong> apabila posmen sampai nanti. <strong>DHL</strong> akan call sebelum hantar.</p>
                                </div>

                                {/* eBook Delivery Notice for COD */}
                                {selectedPackage !== 'solo' && (
                                    <div className="p-3 bg-blue-50 text-blue-800 text-sm rounded-lg border border-blue-200 flex items-start gap-2">
                                        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                        <p><strong>Nota Penting:</strong> Bonus Ebook akan dihantar ke email anda secara manual <u>selepas</u> barang disahkan 'Delivered' & dibayar kepada kurier. Harap maklum.</p>
                                    </div>
                                )}

                                {/* High Value COD Warning */}
                                {(PACKAGES[selectedPackage].price * quantity) > 200 && (
                                    <div className="p-3 bg-red-50 text-red-800 text-sm rounded-lg border border-red-200 flex items-start gap-2">
                                        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                        <p><strong>Perhatian:</strong> Untuk tempahan COD melebihi RM200, sila pastikan anda benar-benar komited untuk terima barang bagi mengelakkan kerugian kos penghantaran. Terima kasih.</p>
                                    </div>
                                )}
                            </div>
                        )
                    }
                </div >

                {/* Order Summary & Submit */}
                <div className="border-t border-gray-200 pt-6">
                    <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200 shadow-sm">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-600 font-medium">Pakej Pilihan:</span>
                            <span className="text-gray-900 font-bold">{PACKAGES[selectedPackage].name}</span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-600 font-medium">Harga Unit:</span>
                            <span className="text-gray-900">RM{PACKAGES[selectedPackage].price}</span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-600 font-medium">Kuantiti:</span>
                            <span className="text-gray-900 font-bold">x {quantity} Set</span>
                        </div>

                        {/* Highlights Total Books Received */}
                        <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-200 border-dashed">
                            <span className="text-green-700 font-bold flex items-center gap-1.5">
                                <BookOpen className="w-4 h-4" />
                                Jumlah Buku Diterima:
                            </span>
                            <span className="text-green-700 font-extrabold text-lg">
                                {selectedPackage === 'family' ? 3 * quantity : (selectedPackage === 'combo' ? 2 * quantity : 1 * quantity)} Unit
                            </span>
                        </div>

                        <div className="flex justify-between items-center pt-1">
                            <span className="text-lg font-bold text-gray-900">Total Perlu Bayar:</span>
                            <span className="text-2xl font-extrabold text-green-700">RM{PACKAGES[selectedPackage].price * quantity}</span>
                        </div>
                    </div>

                    <button
                        disabled={isSubmitting}
                        type="submit"
                        aria-busy={isSubmitting}
                        className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-bold text-xl py-5 rounded-xl shadow-xl shadow-green-500/20 hover:shadow-green-500/40 transition-all transform hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-green-500/20 min-h-[60px] flex items-center justify-center gap-3"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-6 h-6 animate-spin" />
                                <span>Memproses Tempahan...</span>
                            </>
                        ) : (
                            `TERUSKAN TEMPAHAN - RM${PACKAGES[selectedPackage].price * quantity}`
                        )}
                    </button>

                    {/* Trust Badges */}
                    <div className="flex items-center justify-center gap-4 text-xs text-gray-400 grayscale opacity-70">
                        <div className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> SSL Secure Payment</div>
                        <span>|</span>
                        <div className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Money Back Guarantee</div>
                    </div>
                </div >

            </form >
        </div >
    );
}
