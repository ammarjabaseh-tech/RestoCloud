import React, { useState } from "react";
import { Tenant, ThemeColor } from "../types";
import { getThemeClasses } from "../utils/theme";
import { RestaurantLogo } from "./RestaurantLogo";
import confetti from "canvas-confetti";
import {
  Store,
  Globe,
  CreditCard,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Lock,
  User,
  Phone,
  Mail,
  Key,
  Upload,
  Image,
  ArrowRight,
  Check,
  Sparkles,
  AlertCircle,
  Building2,
  DollarSign,
  QrCode,
  Zap,
  HelpCircle,
  MapPin
} from "lucide-react";

interface TenantLoginCheckoutViewProps {
  tenants: Tenant[];
  onTenantCreated: (newTenant: Tenant) => void;
  onSelectTenant: (tenant: Tenant) => void;
  onNavigateToSaaSPortal: () => void;
}

export const TenantLoginCheckoutView: React.FC<TenantLoginCheckoutViewProps> = ({
  tenants,
  onTenantCreated,
  onSelectTenant,
  onNavigateToSaaSPortal
}) => {
  const [activeTab, setActiveTab] = useState<"register" | "login">("register");
  
  // Register Wizard State
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [nameAr, setNameAr] = useState("");
  const [subdomain, setSubdomain] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [password, setPassword] = useState("");
  const [logo, setLogo] = useState("🍽️");
  const [themeColor, setThemeColor] = useState<ThemeColor>("emerald");
  const [currency, setCurrency] = useState("ر.س");
  
  // Plan Selection
  const [selectedPlan, setSelectedPlan] = useState<"starter" | "pro" | "enterprise">("pro");
  
  // Payment Form
  const [paymentMethod, setPaymentMethod] = useState<"mada" | "visa" | "apple" | "stc">("mada");
  const [cardNumber, setCardNumber] = useState("4588 2300 1199 8820");
  const [cardExpiry, setCardExpiry] = useState("08/28");
  const [cardCvv, setCardCvv] = useState("892");
  const [cardName, setCardName] = useState("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [createdTenantResult, setCreatedTenantResult] = useState<Tenant | null>(null);

  // Login State
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggedInPendingTenant, setLoggedInPendingTenant] = useState<Tenant | null>(null);

  // Subdomain Validation
  const cleanSubdomain = subdomain.toLowerCase().replace(/[^a-z0-9]/g, "");
  const isSubdomainTaken = tenants.some(t => t.subdomain.toLowerCase() === cleanSubdomain && cleanSubdomain !== "");

  const emojis = ["🍽️", "🥙", "🍔", "🍕", "☕", "🍗", "🌮", "🍣", "🥗", "🍰", "🍩", "🍜", "🦞", "🥩", "🥐", "👑", "🔥", "🌟", "🍷", "🍹", "🍦", "🧁"];
  
  const colors: { id: ThemeColor; name: string; bg: string }[] = [
    { id: "emerald", name: "زمردي", bg: "bg-emerald-600" },
    { id: "amber", name: "ذهبي", bg: "bg-amber-600" },
    { id: "rose", name: "وردي", bg: "bg-rose-600" },
    { id: "indigo", name: "نيلي", bg: "bg-indigo-600" },
    { id: "violet", name: "بنفسجي", bg: "bg-violet-600" },
    { id: "slate", name: "فحمي", bg: "bg-slate-700" },
    { id: "cyan", name: "سماوي", bg: "bg-cyan-600" },
    { id: "orange", name: "برتقالي", bg: "bg-orange-600" }
  ];

  const plans = {
    starter: {
      name: "باقة المنطلق (Starter)",
      price: 199,
      features: [
        "منيو إلكتروني رقمي مع باركود QR",
        "حتى 500 طلب شهرياً",
        "استضافة على نطاق فرعي (*.sufra.app)",
        "لوحة تحكم أساسية للمنتجات والأقسام",
        "دعم فني عبر البريد الإلكتروني"
      ],
      badge: "مناسب للبوفيهات والكافيهات الصغيرة",
      color: "from-blue-500 to-cyan-600",
      popular: false
    },
    pro: {
      name: "باقة المحترف (Pro)",
      price: 399,
      features: [
        "نظام كاشير ونقطة بيع متكاملة (POS)",
        "طلبات وفواتير غير محدودة",
        "إدارة الطاولات الصالات والصيانة",
        "ستوديو طباعة باركود وستاندات الطاولات",
        "تقارير المبيعات والأرباح اليومية",
        "دعم فني سريع عبر الواتساب"
      ],
      badge: "🔥 الباقة الأكثر طلباً للمطاعم",
      color: "from-emerald-500 to-teal-600",
      popular: true
    },
    enterprise: {
      name: "باقة الشركات (Enterprise)",
      price: 799,
      features: [
        "جميع مميزات باقة المحترف (Pro)",
        "مساعد الذكاء الاصطناعي AI لتقليل التكاليف",
        "تصدير قواطع بيانات PostgreSQL وسيرفرات VPS",
        "ربط بوابات دفع مخصصة ومحاسبة",
        "مدير حساب مخصص ودعم 24/7 VIP"
      ],
      badge: "للسلاسل والمطاعم الكبرى",
      color: "from-purple-600 to-indigo-600",
      popular: false
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

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameAr || !cleanSubdomain || !phone || !address || !ownerName || !ownerEmail || !password) {
      alert("يرجى تعبئة جميع الحقول المطلوبة للمتابعة");
      return;
    }
    if (isSubdomainTaken) {
      alert("هذا الدومين الفرعي مستخدم بالفعل، يرجى اختيار دومين آخر");
      return;
    }
    setStep(3);
  };

  const handleCompletePaymentAndSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingPayment(true);

    // Simulate secure payment processing via Mada/Visa/Apple Pay
    setTimeout(async () => {
      try {
        const selectedPlanObj = plans[selectedPlan];
        const res = await fetch("/api/tenants", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nameAr,
            subdomain: cleanSubdomain,
            themeColor,
            logo,
            phone,
            address,
            ownerName,
            slogan: "مطعم مسجل حديثاً عبر بوابة الاشتراك والدفع",
            status: "pending_approval", // Requires platform admin approval!
            ownerEmail,
            password,
            subscriptionPlan: selectedPlan,
            subscriptionAmount: selectedPlanObj.price,
            subscriptionDate: new Date().toISOString().split('T')[0],
            currency
          })
        });

        if (!res.ok) {
          const err = await res.json();
          alert(err.error || "حدث خطأ أثناء حجز المطعم");
          setIsProcessingPayment(false);
          return;
        }

        const newTenant = await res.json();
        setIsProcessingPayment(false);
        setCreatedTenantResult(newTenant);
        setStep(4);
        
        // Trigger celebratory confetti
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });

        onTenantCreated(newTenant);
      } catch (err) {
        alert("تعذر الاتصال بالخادم لإتمام العملية");
        setIsProcessingPayment(false);
      }
    }, 1800);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoggedInPendingTenant(null);

    if (!loginIdentifier || !loginPassword) {
      setLoginError("يرجى إدخال البريد الإلكتروني (أو النطاق) وكلمة المرور.");
      return;
    }

    const cleanId = loginIdentifier.trim().toLowerCase();
    const found = tenants.find(
      t => t.subdomain.toLowerCase() === cleanId || 
           (t.ownerEmail && t.ownerEmail.toLowerCase() === cleanId) ||
           t.ownerName.toLowerCase().includes(cleanId) ||
           t.nameAr.toLowerCase().includes(cleanId)
    );

    if (!found) {
      setLoginError("لم يتم العثور على مطعم مسجل بهذا النطاق أو البريد الإلكتروني.");
      return;
    }

    // Verify status
    if (found.status === "pending_approval" || found.status === "pending_payment") {
      setLoggedInPendingTenant(found);
      return;
    }

    if (found.status === "suspended") {
      setLoginError("⚠️ هذا المطعم موقوف مؤقتاً من قبل الإدارة العامة. يرجى التواصل مع الدعم الفني.");
      return;
    }

    // Active -> Sign in and switch to tenant!
    onSelectTenant(found);
  };

  const currentPlanObj = plans[selectedPlan];
  const vatAmount = Number((currentPlanObj.price * 0.15).toFixed(2));
  const totalWithVat = Number((currentPlanObj.price + vatAmount).toFixed(2));

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20 animate-in fade-in duration-300" dir="rtl">
      
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>بوابة العملاء وأصحاب المطاعم (SaaS Client Portal)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug">
            حجز مطعمك على دومينك الخاص وتفعيل الاشتراكات
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            أنشئ مطعمك السحابي، اختر باقتك المفضلة، وادفع إلكترونياً بأمان عبر مدى أو فيزا. سيتم حجز دومينك الخاص (<span className="font-mono text-emerald-400">yourname.sufra.app</span>) ومراجعة طلبك من قبل إدارة المنصة لتفعليه فوراً.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0 z-10">
          <button
            onClick={() => {
              setActiveTab("register");
              setStep(1);
            }}
            className={`px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-sm ${
              activeTab === "register" ? "bg-emerald-500 text-white shadow-emerald-500/30 scale-105 ring-2 ring-white/20" : "bg-white/10 hover:bg-white/20 text-white"
            }`}
          >
            <Store className="w-4 h-4" />
            <span>حجز مطعم جديد والاشتراك</span>
          </button>
          <button
            onClick={() => setActiveTab("login")}
            className={`px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-sm ${
              activeTab === "login" ? "bg-indigo-600 text-white shadow-indigo-500/30 scale-105 ring-2 ring-white/20" : "bg-white/10 hover:bg-white/20 text-white"
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>تسجيل دخول أصحاب المطاعم</span>
          </button>
        </div>
      </div>

      {/* TAB 1: NEW RESTAURANT RESERVATION & CHECKOUT WIZARD */}
      {activeTab === "register" && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg p-6 sm:p-8 space-y-8">
          
          {/* Stepper Progress Header */}
          {step < 4 && (
            <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
              <div className="flex items-center justify-between max-w-2xl mx-auto">
                <div className={`flex items-center gap-2.5 ${step >= 1 ? "text-emerald-600 font-bold" : "text-slate-400"}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${step >= 1 ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20" : "bg-slate-200 text-slate-600"}`}>
                    {step > 1 ? <Check className="w-4 h-4" /> : "1"}
                  </div>
                  <span className="text-xs sm:text-sm">بيانات المطعم والدومين</span>
                </div>
                
                <div className={`h-1 flex-1 mx-4 rounded ${step >= 2 ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-800"}`} />

                <div className={`flex items-center gap-2.5 ${step >= 2 ? "text-emerald-600 font-bold" : "text-slate-400"}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${step >= 2 ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20" : "bg-slate-200 text-slate-600"}`}>
                    {step > 2 ? <Check className="w-4 h-4" /> : "2"}
                  </div>
                  <span className="text-xs sm:text-sm">اختيار باقة الاشتراك</span>
                </div>

                <div className={`h-1 flex-1 mx-4 rounded ${step >= 3 ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-800"}`} />

                <div className={`flex items-center gap-2.5 ${step >= 3 ? "text-emerald-600 font-bold" : "text-slate-400"}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${step >= 3 ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20" : "bg-slate-200 text-slate-600"}`}>
                    3
                  </div>
                  <span className="text-xs sm:text-sm">الدفع الإلكتروني</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 1: RESTAURANT & DOMAIN DETAILS FORM */}
          {step === 1 && (
            <form onSubmit={handleProceedToPayment} className="space-y-6 max-w-3xl mx-auto">
              <div className="text-center space-y-1">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">الخطوة 1: أدخل بيانات مطعمك واحجز دومينك الخاص</h2>
                <p className="text-xs text-slate-500">سيكون الدومين الخاص بك متاحاً فوراً لعملائك لطلب الطعام وعرض المنيو الرقمي</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Store className="w-4 h-4 text-emerald-600" />
                    <span>اسم المطعم باللغة العربية *</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: مطعم بيتزا رويال"
                    value={nameAr}
                    onChange={(e) => setNameAr(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-indigo-600" />
                    <span>النطاق الفرعي (Subdomain) بالإنجليزية *</span>
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      required
                      placeholder="pizzaroyal"
                      value={subdomain}
                      onChange={(e) => setSubdomain(e.target.value)}
                      className={`w-full pl-28 pr-4 py-3 rounded-xl border text-sm font-mono font-bold focus:outline-none ${
                        isSubdomainTaken 
                          ? "border-rose-500 bg-rose-50/50 text-rose-900 dark:text-rose-200" 
                          : cleanSubdomain ? "border-emerald-500 bg-emerald-50/30 text-emerald-900 dark:text-emerald-200" : "border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                      }`}
                      dir="ltr"
                    />
                    <span className="absolute left-3 text-xs font-mono text-slate-400 pointer-events-none">.sufra.app</span>
                  </div>
                  {cleanSubdomain && (
                    <div className="mt-1.5 flex items-center gap-1.5 text-xs font-bold">
                      {isSubdomainTaken ? (
                        <span className="text-rose-600 flex items-center gap-1">❌ هذا الدومين محجوز مسبقاً، اختر اسماً آخر</span>
                      ) : (
                        <span className="text-emerald-600 flex items-center gap-1">✅ دومين رائع ومتاح للحجز الفوري! (https://{cleanSubdomain}.sufra.app)</span>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-slate-500" />
                    <span>اسم مالك المطعم / المسؤول *</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: عبد الله السعيد"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-slate-500" />
                    <span>رقم الجوال (للتواصل وإرسال الإشعارات) *</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="0500000000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    dir="ltr"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-slate-500" />
                      <span>عنوان المطعم بالتفصيل *</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: الرياض، حي العليا، طريق الملك فهد"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4 text-emerald-600" />
                      <span>البلد والعملة الافتراضية *</span>
                    </label>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    >
                      <option value="ر.س">المملكة العربية السعودية (ر.س)</option>
                      <option value="د.إ">الإمارات العربية المتحدة (د.إ)</option>
                      <option value="د.ك">الكويت (د.ك)</option>
                      <option value="ر.ق">قطر (ر.ق)</option>
                      <option value="د.ب">البحرين (د.ب)</option>
                      <option value="ر.ع">سلطنة عمان (ر.ع)</option>
                      <option value="ج.م">جمهورية مصر العربية (ج.م)</option>
                      <option value="د.أ">المملكة الأردنية الهاشمية (د.أ)</option>
                      <option value="د.ع">العراق (د.ع)</option>
                      <option value="$">الولايات المتحدة / عملة دولية ($)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-slate-500" />
                    <span>البريد الإلكتروني لتسجيل الدخول *</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="admin@pizzaroyal.com"
                    value={ownerEmail}
                    onChange={(e) => setOwnerEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Key className="w-4 h-4 text-slate-500" />
                    <span>كلمة المرور (لحساب صاحب المطعم) *</span>
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Logo Selection Box */}
              <div className="space-y-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Image className="w-4 h-4 text-emerald-600" />
                      <span>شعار المطعم (Logo Options)</span>
                    </label>
                    <p className="text-[11px] text-slate-500 mt-0.5">اختر رمز تعبيري أو ارفع صورة شعارك الخاص.</p>
                  </div>
                  <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
                    <span className="text-xs text-slate-500 font-bold">المعاينة:</span>
                    <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-700 border flex items-center justify-center text-lg overflow-hidden">
                      <RestaurantLogo logo={logo} />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                  <div className="sm:col-span-7">
                    <input
                      type="text"
                      placeholder="رابط صورة أو اكتب رمز (مثال: ✨ أو PR)"
                      value={logo}
                      onChange={(e) => setLogo(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-xs font-mono"
                      dir="ltr"
                    />
                  </div>
                  <div className="sm:col-span-5 flex items-end">
                    <label className="w-full cursor-pointer bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all text-center">
                      <Upload className="w-3.5 h-3.5" />
                      <span>📂 رفع صورة من جهازك</span>
                      <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                    </label>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1 max-h-28 overflow-y-auto">
                  {emojis.map((em) => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => setLogo(em)}
                      className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center transition-transform hover:scale-110 overflow-hidden shrink-0 ${
                        logo === em ? "bg-emerald-500 text-white shadow-md ring-2 ring-emerald-600 scale-110" : "bg-white dark:bg-slate-700 hover:bg-slate-100 shadow-2xs"
                      }`}
                    >
                      <RestaurantLogo logo={em} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme Color Picker */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">اختر لون السمة البصرية الأساسي للمطعم</label>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {colors.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setThemeColor(c.id)}
                      className={`py-2 px-2 rounded-xl text-center font-bold text-xs transition-all flex flex-col items-center gap-1.5 border ${
                        themeColor === c.id ? "border-slate-900 dark:border-white ring-2 ring-emerald-500 shadow-sm bg-slate-100 dark:bg-slate-800 scale-105" : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50"
                      }`}
                    >
                      <span className={`w-5 h-5 rounded-full ${c.bg} shadow-2xs`} />
                      <span className="text-[11px] truncate w-full">{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubdomainTaken || !cleanSubdomain || !nameAr}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transform hover:-translate-y-0.5 transition-all"
                >
                  <span>التالي: اختيار باقة الاشتراك</span>
                  <ArrowRight className="w-4 h-4 rotate-180" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: CHOOSE SUBSCRIPTION PLAN */}
          {step === 2 && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="text-center space-y-1">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">الخطوة 2: اختر باقة الاشتراك الأنسب لاحتياجك</h2>
                <p className="text-xs text-slate-500">اختر الباقة، يمكنك ترقية اشتراكك في أي وقت من لوحة التحكم بعد التفعيل</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(Object.keys(plans) as Array<keyof typeof plans>).map((planKey) => {
                  const p = plans[planKey];
                  const isSelected = selectedPlan === planKey;
                  return (
                    <div
                      key={planKey}
                      onClick={() => setSelectedPlan(planKey)}
                      className={`relative cursor-pointer rounded-3xl p-6 border-2 transition-all flex flex-col justify-between ${
                        isSelected
                          ? "border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20 shadow-xl scale-105 ring-2 ring-emerald-500/30"
                          : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md"
                      }`}
                    >
                      {p.popular && (
                        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[11px] font-black px-3.5 py-1 rounded-full shadow-sm">
                          🔥 الباقة الأكثر طلباً
                        </div>
                      )}

                      <div className="space-y-4">
                        <div className="space-y-1">
                          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 block">{p.badge}</span>
                          <h3 className="text-lg font-black text-slate-900 dark:text-white">{p.name}</h3>
                        </div>

                        <div className="flex items-baseline gap-1 py-2 border-y border-slate-100 dark:border-slate-800">
                          <span className="text-3xl font-black text-slate-900 dark:text-white">{p.price}</span>
                          <span className="text-xs font-bold text-slate-500">ر.س / شهرياً</span>
                        </div>

                        <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                          {p.features.map((f, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
                        <button
                          type="button"
                          className={`w-full py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
                            isSelected
                              ? "bg-emerald-600 text-white shadow-md"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                          }`}
                        >
                          {isSelected ? (
                            <>
                              <Check className="w-4 h-4" />
                              <span>الباقة المختارة حالياً</span>
                            </>
                          ) : (
                            <span>اختيار هذه الباقة</span>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-all w-full sm:w-auto text-center"
                >
                  الرجوع للخطوة السابقة
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transform hover:-translate-y-0.5 transition-all w-full sm:w-auto"
                >
                  <span>التالي: الدفع الإلكتروني وتأكيد الحجز</span>
                  <ArrowRight className="w-4 h-4 rotate-180" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: ONLINE PAYMENT CHECKOUT */}
          {step === 3 && (
            <form onSubmit={handleCompletePaymentAndSubscribe} className="space-y-6 max-w-3xl mx-auto">
              <div className="text-center space-y-1">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center justify-center gap-2">
                  <CreditCard className="w-5 h-5 text-emerald-600" />
                  <span>الخطوة 3: إتمام الدفع الإلكتروني وحجز النطاق</span>
                </h2>
                <p className="text-xs text-slate-500">بوابة دفع مشفرة وآمنة 100% متوافقة مع معايير البنك المركزي ومؤسسة النقد</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* Left: Invoice Summary */}
                <div className="md:col-span-5 bg-slate-50 dark:bg-slate-800/60 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-4 h-fit">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <Store className="w-4 h-4 text-indigo-600" />
                    <span>ملخص طلب حجز المطعم</span>
                  </h3>

                  <div className="space-y-2 text-xs border-b border-slate-200 dark:border-slate-700 pb-3">
                    <div className="flex justify-between">
                      <span className="text-slate-500">اسم المطعم:</span>
                      <span className="font-bold text-slate-900 dark:text-white">{nameAr}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">النطاق المحجوز:</span>
                      <span className="font-mono font-bold text-emerald-600" dir="ltr">{cleanSubdomain}.sufra.app</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">المسؤول:</span>
                      <span className="font-bold text-slate-900 dark:text-white">{ownerName}</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs border-b border-slate-200 dark:border-slate-700 pb-3">
                    <div className="flex justify-between font-bold text-slate-800 dark:text-slate-200">
                      <span>{currentPlanObj.name}</span>
                      <span>{currentPlanObj.price} ر.س</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>ضريبة القيمة المضافة (15%):</span>
                      <span>{vatAmount} ر.س</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-baseline pt-1">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">الإجمالي المستحق:</span>
                    <span className="text-xl font-black text-emerald-600">{totalWithVat} ر.س</span>
                  </div>

                  <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-2xl p-3 text-amber-800 dark:text-amber-300 text-[11px] leading-relaxed flex items-start gap-2">
                    <Clock className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                    <span>
                      بعد إتمام الدفع، سيكون مطعمك في حالة <strong>بانتظار موافقة الإدارة العامة</strong> حتى يتم مراجعة الحجز واعتماده من مالك المنصة.
                    </span>
                  </div>
                </div>

                {/* Right: Payment Method & Credit Card Form */}
                <div className="md:col-span-7 space-y-4">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">اختر وسيلة الدفع</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {[
                      { id: "mada", name: "مدى mada", icon: "💳", color: "border-emerald-500 bg-emerald-50/30" },
                      { id: "visa", name: "فيزا / ماستر", icon: "🌐", color: "border-blue-500 bg-blue-50/30" },
                      { id: "apple", name: "Apple Pay", icon: "🍏", color: "border-slate-800 bg-slate-100 dark:bg-slate-800" },
                      { id: "stc", name: "STC Pay", icon: "📱", color: "border-purple-500 bg-purple-50/30" }
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setPaymentMethod(m.id as any)}
                        className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                          paymentMethod === m.id ? `${m.color} ring-2 ring-emerald-500 font-black shadow-sm` : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 font-medium text-slate-600"
                        }`}
                      >
                        <span className="text-xl">{m.icon}</span>
                        <span className="text-xs">{m.name}</span>
                      </button>
                    ))}
                  </div>

                  {paymentMethod === "apple" ? (
                    <div className="p-6 bg-slate-900 text-white rounded-3xl text-center space-y-3 border border-slate-700">
                      <div className="text-3xl">🍏 Pay</div>
                      <p className="text-xs text-slate-300">اضغط على زر إتمام الدفع أدناه للمصادقة عبر Apple Pay بصمة الوجه أو الإصبع</p>
                    </div>
                  ) : paymentMethod === "stc" ? (
                    <div className="p-6 bg-purple-900 text-white rounded-3xl text-center space-y-3 border border-purple-700">
                      <div className="text-3xl">📱 STC Pay</div>
                      <p className="text-xs text-purple-200">سيتم إرسال طلب دفع إلى رقم الجوال المسجل في الخطوة الأولى: <span className="font-mono font-bold">{phone}</span></p>
                    </div>
                  ) : (
                    <div className="space-y-3 p-4 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">رقم البطاقة (Card Number)</label>
                        <input
                          type="text"
                          required
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          placeholder="4588 •••• •••• ••••"
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-sm font-mono font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                          dir="ltr"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">تاريخ الانتهاء (MM/YY)</label>
                          <input
                            type="text"
                            required
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            placeholder="08/28"
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-sm font-mono text-center focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                            dir="ltr"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">رمز الأمان (CVV)</label>
                          <input
                            type="password"
                            required
                            maxLength={4}
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            placeholder="•••"
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-sm font-mono text-center focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                            dir="ltr"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">اسم حامل البطاقة (Cardholder Name)</label>
                        <input
                          type="text"
                          required
                          value={cardName || ownerName}
                          onChange={(e) => setCardName(e.target.value)}
                          placeholder="ABDULLAH ALSAEED"
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-sm font-bold uppercase focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                          dir="ltr"
                        />
                      </div>
                    </div>
                  )}

                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <button
                      type="button"
                      disabled={isProcessingPayment}
                      onClick={() => setStep(2)}
                      className="px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-50 transition-all w-full sm:w-auto text-center"
                    >
                      الرجوع
                    </button>
                    <button
                      type="submit"
                      disabled={isProcessingPayment}
                      className="w-full sm:w-auto flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transform hover:-translate-y-0.5 transition-all"
                    >
                      {isProcessingPayment ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>جاري خصم المبلغ وتأكيد الحجز...</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-5 h-5 text-white" />
                          <span>إتمام الدفع ({totalWithVat} ر.س) وإرسال طلب الاعتماد</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

              </div>
            </form>
          )}

          {/* STEP 4: SUCCESS & PENDING APPROVAL STATUS */}
          {step === 4 && createdTenantResult && (
            <div className="max-w-2xl mx-auto text-center space-y-6 py-4">
              <div className="w-20 h-20 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-4xl mx-auto shadow-lg border-2 border-emerald-500 animate-bounce">
                ✅
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                  🎉 تم دفع الرسوم وحجز مطعمك بنجاح!
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  لقد تم إنشاء حساب مطعم <span className="font-bold text-indigo-600">{createdTenantResult.nameAr}</span> وحجز النطاق الفرعي <span className="font-mono font-bold text-emerald-600" dir="ltr">{createdTenantResult.subdomain}.sufra.app</span> بنجاح.
                </p>
              </div>

              {/* Status Alert Badge */}
              <div className="bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-700 p-6 rounded-3xl text-right space-y-3 shadow-sm">
                <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-black text-sm">
                  <Clock className="w-5 h-5 text-amber-600 shrink-0 animate-pulse" />
                  <span>حالة حسابك الآن: بانتظار موافقة الإدارة العامة (Pending Approval) ⏳</span>
                </div>
                <p className="text-xs text-amber-900/80 dark:text-amber-200 leading-relaxed">
                  حسب نظام المنصة، يتطلب تشغيل المطعم وبث المنيو للعملاء موافقة مالك المنصة (Super Admin). لقد وصل إشعار بحجزك ودفعك للإدارة، وبمجرد الضغط على زر "موافقة وتفعيل" من لوحة الإدارة العامة، سيعمل كاشيرك ودومينك فوراً!
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs space-y-2 text-right">
                <div className="flex justify-between">
                  <span className="text-slate-500">البريد الإلكتروني المسجل:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white" dir="ltr">{ownerEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">رقم طلب الاشتراك:</span>
                  <span className="font-mono font-bold text-indigo-600">#SUB-{Date.now().toString().slice(-4)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">المبلغ المدفوع:</span>
                  <span className="font-bold text-emerald-600">{totalWithVat} ر.س ({plans[selectedPlan].name})</span>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("login");
                    setLoginIdentifier(ownerEmail || cleanSubdomain);
                  }}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>الذهاب لصفحة تسجيل الدخول لمتابعة حالة الحساب</span>
                </button>
                <button
                  type="button"
                  onClick={onNavigateToSaaSPortal}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2"
                >
                  <Store className="w-4 h-4" />
                  <span>دخول الإدارة العامة (Super Admin) لتفعيل المطعم</span>
                </button>
              </div>
            </div>
          )}

        </div>
      )}

      {/* TAB 2: RESTAURANT OWNER LOGIN */}
      {activeTab === "login" && (
        <div className="max-w-md mx-auto bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-3xl mx-auto border border-indigo-100 dark:border-indigo-800 shadow-xs">
              🔐
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">تسجيل دخول أصحاب المطاعم</h2>
            <p className="text-xs text-slate-500">أدخل البريد الإلكتروني أو الدومين الخاص بمطعمك وكلمة المرور</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {loginError && (
              <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-indigo-600" />
                <span>البريد الإلكتروني أو الدومين الفرعي *</span>
              </label>
              <input
                type="text"
                required
                placeholder="مثال: tarek@tulum-sushi.com أو sushi"
                value={loginIdentifier}
                onChange={(e) => setLoginIdentifier(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Key className="w-4 h-4 text-indigo-600" />
                <span>كلمة المرور *</span>
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                dir="ltr"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <span>تسجيل الدخول للمطعم</span>
              <ArrowRight className="w-4 h-4 rotate-180" />
            </button>
          </form>

          {/* If Logged into a PENDING APPROVAL TENANT */}
          {loggedInPendingTenant && (
            <div className="bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-400 dark:border-amber-700 p-5 rounded-3xl space-y-3 text-right animate-in zoom-in-95 duration-200">
              <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300 font-black text-sm">
                <Clock className="w-5 h-5 text-amber-600 shrink-0 animate-spin" />
                <span>مطعمك بانتظار موافقة الإدارة العامة ⏳</span>
              </div>

              <div className="text-xs text-amber-900/90 dark:text-amber-200 space-y-1.5 leading-relaxed">
                <p>أهلاً بك <strong>{loggedInPendingTenant.ownerName}</strong> في مطعم <strong>{loggedInPendingTenant.nameAr}</strong>.</p>
                <p>لقد تم استلام دفعة الاشتراك بنجاح وحجز الدومين <span className="font-mono font-bold" dir="ltr">{loggedInPendingTenant.subdomain}.sufra.app</span>.</p>
                <p className="font-bold text-indigo-700 dark:text-indigo-400">حسابك الآن قيد المراجعة والموافقة من الإدارة العامة (Super Admin). بمجرد الضغط على زر "موافقة وتفعيل المطعم" من لوحة الإدارة، سيتم فتح الكاشير والمنيو الفوري لك!</p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={onNavigateToSaaSPortal}
                  className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Store className="w-3.5 h-3.5 text-emerald-400" />
                  <span>👉 تجربة الموافقة الآن من شاشة الإدارة العامة (Super Admin)</span>
                </button>
              </div>
            </div>
          )}

          {/* Quick Demo Accounts Helper */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
            <span className="text-[11px] font-bold text-slate-400 block text-center">أو اختر حساب تجريبي جاهز للمعاينة السريعة:</span>
            <div className="space-y-1.5">
              <button
                type="button"
                onClick={() => {
                  setLoginIdentifier("tarek@tulum-sushi.com");
                  setLoginPassword("12345678");
                }}
                className="w-full p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 hover:bg-amber-100 dark:hover:bg-amber-900/50 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-300 text-xs font-bold flex items-center justify-between transition-all"
              >
                <span className="flex items-center gap-1.5">
                  <span className="text-base">🍣</span>
                  <span>تولوم سوشي (م. طارق)</span>
                </span>
                <span className="bg-amber-500 text-white px-2 py-0.5 rounded text-[10px]">بانتظار الموافقة ⏳</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setLoginIdentifier("shami");
                  setLoginPassword("shami123");
                }}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-between transition-all"
              >
                <span className="flex items-center gap-1.5">
                  <span className="text-base">🥙</span>
                  <span>مذاق الشام (أبو وليد)</span>
                </span>
                <span className="bg-emerald-500 text-white px-2 py-0.5 rounded text-[10px]">مطعم نشط ومفعل ✅</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
