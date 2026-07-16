import React, { useState } from "react";
import { ThemeColor, Tenant } from "../types";
import { Store, Globe, Palette, X, Sparkles, Check, Building2, Phone, MapPin, User, Upload, Image } from "lucide-react";
import { RestaurantLogo } from "./RestaurantLogo";

interface SaaSOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTenantCreated: (tenant: Tenant) => void;
}

export const SaaSOnboardingModal: React.FC<SaaSOnboardingModalProps> = ({
  isOpen,
  onClose,
  onTenantCreated
}) => {
  const [nameAr, setNameAr] = useState("");
  const [subdomain, setSubdomain] = useState("");
  const [themeColor, setThemeColor] = useState<ThemeColor>("emerald");
  const [logo, setLogo] = useState("🍽️");
  const [ownerName, setOwnerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("الرياض، المملكة العربية السعودية");
  const [slogan, setSlogan] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleNameChange = (val: string) => {
    setNameAr(val);
    if (!subdomain && val.length > 2) {
      // Auto suggest subdomain
      const suggested = val
        .replace(/[^\w\s]/gi, "")
        .replace(/\s+/g, "")
        .toLowerCase()
        .substring(0, 10);
      if (/^[a-z0-9]+$/.test(suggested)) {
        setSubdomain(suggested);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameAr || !subdomain) {
      setError("يرجى إدخال اسم المطعم والنطاق الفرعي (Subdomain)");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/tenants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nameAr,
          subdomain,
          themeColor,
          logo,
          ownerName: ownerName || "المدير العام",
          phone: phone || "0500000000",
          address,
          slogan,
          bypassOTP: true
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "فشل في إنشاء المطعم");
      }

      onTenantCreated(data);
      onClose();
    } catch (err: any) {
      setError(err.message || "حدث خطأ ما");
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("حجم الصورة كبير جداً، يرجى اختيار صورة أقل من 2 ميجابايت.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setLogo(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const emojis = ["🍽️", "🥙", "🍔", "🍕", "☕", "🍗", "🌮", "🍣", "🥗", "🍰", "🍩", "🍜", "🦞", "🥩", "🥐", "👑", "🔥", "🌟", "🍷", "🍹", "🍦", "🧁", "🍳", "🍿", "🧆", "🥘", "🌯", "🍵", "🥤", "🧋", "👨‍🍳", "🌶️", "🧄", "🫒", "🥑", "🧀"];
  const colors: { id: ThemeColor; name: string; bg: string }[] = [
    { id: "emerald", name: "زمردي (Emerald)", bg: "bg-emerald-600" },
    { id: "amber", name: "ذهبي (Amber)", bg: "bg-amber-600" },
    { id: "rose", name: "وردي (Rose)", bg: "bg-rose-600" },
    { id: "indigo", name: "نيلي (Indigo)", bg: "bg-indigo-600" },
    { id: "violet", name: "بنفسجي (Violet)", bg: "bg-violet-600" },
    { id: "slate", name: "رمادي فاخر (Slate)", bg: "bg-slate-800" },
    { id: "cyan", name: "سماوي (Cyan)", bg: "bg-cyan-600" },
    { id: "orange", name: "برتقالي (Orange)", bg: "bg-orange-600" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-800 text-right" dir="rtl">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">إضافة مطعم جديد (SaaS Onboarding)</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">تجهيز لوحة كاشير POS، منيو رقمي، وقاعدة بيانات فورية</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-3 bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 rounded-xl text-sm font-medium border border-rose-200 dark:border-rose-800 flex items-center gap-2">
              <span className="font-bold">تنبيه:</span> {error}
            </div>
          )}

          {/* Name and Subdomain */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Store className="w-4 h-4 text-emerald-600" />
                <span>اسم المطعم بالعربية *</span>
              </label>
              <input
                type="text"
                required
                placeholder="مثال: مطعم ومشويات الديوان"
                value={nameAr}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-emerald-600" />
                <span>النطاق الفرعي (Subdomain) *</span>
              </label>
              <div className="flex items-center" dir="ltr">
                <span className="bg-slate-100 dark:bg-slate-800 border border-r-0 border-slate-300 dark:border-slate-700 text-slate-500 px-3 py-2.5 rounded-l-xl text-sm font-mono">
                  .restocloud.app
                </span>
                <input
                  type="text"
                  required
                  placeholder="diwan"
                  value={subdomain}
                  onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ""))}
                  className="w-full px-4 py-2.5 rounded-r-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">سيكون رابط المنيو: {subdomain || 'name'}.restocloud.app</p>
            </div>
          </div>

          {/* Owner and Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <User className="w-4 h-4 text-emerald-600" />
                <span>اسم صاحب المطعم / المدير</span>
              </label>
              <input
                type="text"
                placeholder="مثال: خالد محمد عبد الله"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-emerald-600" />
                <span>رقم الجوال</span>
              </label>
              <input
                type="text"
                placeholder="05xxxxxxxx"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Slogan & Address */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>شعار المطعم (Slogan) أو نوع المطبخ</span>
            </label>
            <input
              type="text"
              placeholder="مثال: أشهى المأكولات التراثية والمشاوي الطازجة يومياً"
              value={slogan}
              onChange={(e) => setSlogan(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Logo Selection & Customization */}
          <div className="space-y-4 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200 dark:border-slate-700">
              <div>
                <label className="block text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Image className="w-4 h-4 text-emerald-600" />
                  <span>شعار المطعم (Logo Options)</span>
                </label>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  اختر رمز تعبيري، أو اكتب اختصار مخصص، أو ارفع صورة شعارك الخاص.
                </p>
              </div>

              {/* Live Preview Badge */}
              <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs shrink-0">
                <span className="text-xs text-slate-500 font-bold">المعاينة:</span>
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 flex items-center justify-center text-xl overflow-hidden shadow-sm">
                  <RestaurantLogo logo={logo} />
                </div>
              </div>
            </div>

            {/* Option 1: File Upload / Image URL / Custom Text */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 pt-1">
              <div className="sm:col-span-7">
                <input
                  type="text"
                  placeholder="اكتب رمز شعارك أو اختصاره (مثال: ✨ أو KF)"
                  value={logo?.startsWith("data:") || logo?.startsWith("http") ? "" : logo}
                  onChange={(e) => setLogo(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-5 flex items-end">
                <label className="w-full cursor-pointer bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all text-center">
                  <Upload className="w-3.5 h-3.5 shrink-0" />
                  <span>📂 رفع صورة من جهازك</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Option 2: Ready Emojis */}
            <div className="pt-1">
              <div className="flex flex-wrap gap-1.5 p-2.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 max-h-36 overflow-y-auto">
                {emojis.map((em) => (
                  <button
                    key={em}
                    type="button"
                    onClick={() => setLogo(em)}
                    className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center transition-transform hover:scale-110 overflow-hidden shrink-0 ${
                      logo === em ? "bg-emerald-500 text-white shadow-md ring-2 ring-emerald-600 scale-110" : "bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-white hover:bg-slate-100 shadow-2xs"
                    }`}
                  >
                    <RestaurantLogo logo={em} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Color Palette */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-emerald-600" />
              <span>اللون الأساسي للعلامة التجارية (Brand Theme)</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {colors.map((col) => (
                <button
                  key={col.id}
                  type="button"
                  onClick={() => setThemeColor(col.id)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all ${
                    themeColor === col.id 
                      ? "border-slate-900 dark:border-white ring-2 ring-emerald-500 shadow-md bg-slate-100 dark:bg-slate-800 font-bold" 
                      : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full ${col.bg} shadow-sm flex items-center justify-center text-white`}>
                    {themeColor === col.id && <Check className="w-3 h-3 stroke-[3]" />}
                  </span>
                  <span className="text-xs text-slate-800 dark:text-slate-200">{col.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg shadow-emerald-600/25 transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>جاري إنشاء المستأجر...</span>
                </>
              ) : (
                <>
                  <Store className="w-4 h-4" />
                  <span>إنشاء المطعم واللوحة فوراً</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
