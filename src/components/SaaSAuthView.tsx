import React, { useState } from "react";
import { ActivePortalView } from "../types";
import { 
  ArrowLeft, 
  ArrowRight, 
  UtensilsCrossed, 
  Store, 
  Mail, 
  Lock, 
  User, 
  ChevronLeft,
  ChevronRight, 
  Phone, 
  MapPin, 
  X,
  Globe,
  ChevronDown
} from "lucide-react";

const authTranslations = {
  ar: {
    backToHome: "العودة للرئيسية",
    loginTitle: "مرحباً بعودتك!",
    signupTitle: "ابدأ رحلة النجاح لمطعمك",
    loginDesc: "سجل دخولك لإدارة مطعمك ونقاط البيع",
    signupDesc: "أنشئ حسابك الآن وجرب ريستو كلاود (RestoCloud) مجاناً",
    fullnameLabel: "اسمك الكامل",
    fullnamePlaceholder: "أحمد محمد",
    restaurantLabel: "اسم المطعم",
    restaurantPlaceholder: "مطعم مذاق الشام",
    phoneLabel: "رقم الهاتف",
    phonePlaceholder: "0500000000",
    addressLabel: "عنوان المطعم بالتفصيل",
    addressPlaceholder: "الرياض، حي العليا، طريق الملك فهد",
    emailLabel: "البريد الإلكتروني",
    emailPlaceholder: "admin@restaurant.com",
    passwordLabel: "كلمة المرور",
    passwordPlaceholder: "••••••••",
    changeEmail: "تغيير البريد",
    forgotPass: "نسيت كلمة المرور؟",
    forgotPassAlert: "🔑 لاستعادة كلمة المرور أو إعادة تعيينها، يرجى التواصل مع الإدارة العامة للمنصة (Super Admin) أو مدير النظام الخاص بمطعمك لإعادة تعيين كلمة مرور جديدة.",
    otpLabel: "رمز التحقق (OTP) من الإيميل",
    resendOtp: "إعادة إرسال رمز التحقق 🔄",
    btnProcessing: "جاري المعالجة...",
    btnVerifySignup: "تأكيد وإرسال رمز التحقق للبريد",
    btnLogin: "تسجيل الدخول",
    btnSendOtp: "إرسال رمز الدخول السريع",
    btnVerifyLogin: "تأكيد وتسجيل الدخول",
    noAccount: "ليس لديك حساب؟ ",
    haveAccount: "لديك حساب بالفعل؟ ",
    createAccountNow: "أنشئ حسابك الآن",
    loginNow: "سجل دخولك",
    agreeText: "بإنشائك للحساب، فأنت توافق على شروط الاستخدام وسياسة الخصوصية الخاصة بريستو كلاود (RestoCloud).",
    terms: "شروط الاستخدام",
    privacy: "سياسة الخصوصية",
    visualTitle: "أدِر مطعمك بذكاء، بأحدث تقنيات الـ SaaS السحابية",
    visualDesc: "انضم لمئات المطاعم التي غيرت طريقة عملها باستخدام نقطة البيع الأسرع والمدعومة بالذكاء الاصطناعي مع توافق تام لمتطلبات الفاتورة الإلكترونية ZATCA.",
    usersCount: "+100 مطعم نشط",
    methodPassword: "🔑 تسجيل بكلمة المرور",
    methodOtp: "✉️ التحقق عبر الإيميل (OTP)",
    enterEmailErr: "يرجى إدخال البريد الإلكتروني أولاً",
    pendingTitle: "تم استلام طلبك بنجاح!",
    pendingDesc: "حساب مطعمك الآن قيد المراجعة من قبل الإدارة. سيتم إرسال بريد إلكتروني لك فور الموافقة وتفعيل الحساب.",
    btnBackHome: "العودة للصفحة الرئيسية",
    verifyRegisterOtpTitle: "التحقق من البريد الإلكتروني",
    verifyRegisterOtpDesc: "لقد أرسلنا رمز تحقق (OTP) مكون من 6 أرقام إلى البريد الإلكتروني:",
    btnConfirmRegister: "تأكيد وتفعيل الحساب",
    otpSendFail: "فشل إرسال رمز التحقق",
    otpVerifyFail: "رمز التحقق غير صحيح",
    loginFail: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
    registerFail: "خطأ أثناء إنشاء حساب المطعم"
  },
  en: {
    backToHome: "Back to Home",
    loginTitle: "Welcome Back!",
    signupTitle: "Scale Your Restaurant Journey",
    loginDesc: "Log in to manage your dining branches and POS cashier points",
    signupDesc: "Create your account and try RestoCloud for free",
    fullnameLabel: "Your Full Name",
    fullnamePlaceholder: "John Doe",
    restaurantLabel: "Restaurant Name",
    restaurantPlaceholder: "Gourmet Bites",
    phoneLabel: "Phone Number",
    phonePlaceholder: "0500000000",
    addressLabel: "Detailed Address",
    addressPlaceholder: "Riyadh, Al Olaya District, King Fahd Rd",
    emailLabel: "Email Address",
    emailPlaceholder: "admin@restaurant.com",
    passwordLabel: "Password",
    passwordPlaceholder: "••••••••",
    changeEmail: "Change Email",
    forgotPass: "Forgot Password?",
    forgotPassAlert: "🔑 To reset your password, please contact the Platform Administration (Super Admin) or your restaurant system administrator to set a new password.",
    otpLabel: "Verification Code (OTP) from Email",
    resendOtp: "Resend verification code 🔄",
    btnProcessing: "Processing...",
    btnVerifySignup: "Confirm & Send Verification Code",
    btnLogin: "Log In",
    btnSendOtp: "Send Quick Login Code",
    btnVerifyLogin: "Confirm & Log In",
    noAccount: "Don't have an account? ",
    haveAccount: "Already have an account? ",
    createAccountNow: "Sign Up Now",
    loginNow: "Log In",
    agreeText: "By creating an account, you agree to RestoCloud's Terms of Use and Privacy Policy.",
    terms: "Terms of Use",
    privacy: "Privacy Policy",
    visualTitle: "Manage your restaurant smarter with the latest cloud SaaS tech",
    visualDesc: "Join hundreds of dining venues that transformed their operations using our lightning-fast POS cashier screens and AI consulting.",
    usersCount: "+100 Active Restaurants",
    methodPassword: "🔑 Password Login",
    methodOtp: "✉️ Email Verification (OTP)",
    enterEmailErr: "Please enter your email first",
    pendingTitle: "Application Submitted Successfully!",
    pendingDesc: "Your restaurant account is now under review. We will send you an email once your subscription is approved and activated.",
    btnBackHome: "Back to Home",
    verifyRegisterOtpTitle: "Email Verification",
    verifyRegisterOtpDesc: "We have sent a 6-digit verification code to your email address:",
    btnConfirmRegister: "Confirm & Activate Account",
    otpSendFail: "Failed to send verification code",
    otpVerifyFail: "Incorrect verification code",
    loginFail: "Incorrect email or password",
    registerFail: "Error during restaurant account creation"
  },
  tr: {
    backToHome: "Ana Sayfaya Dön",
    loginTitle: "Tekrar Hoş Geldiniz!",
    signupTitle: "Restoranınızın Başarı Yolculuğunu Başlatın",
    loginDesc: "Restoranınızı ve POS satış noktalarınızı yönetmek için giriş yapın",
    signupDesc: "Hesabınızı şimdi oluşturun ve RestoCloud'u ücretsiz deneyin",
    fullnameLabel: "Tam Adınız",
    fullnamePlaceholder: "Ahmet Yılmaz",
    restaurantLabel: "Restoran Adı",
    restaurantPlaceholder: "Lezzet Sarayı",
    phoneLabel: "Telefon Numarası",
    phonePlaceholder: "0500000000",
    addressLabel: "Detaylı Restoran Adresi",
    addressPlaceholder: "İstanbul, Kadıköy, Atatürk Cad.",
    emailLabel: "E-posta Adresi",
    emailPlaceholder: "admin@restoran.com",
    passwordLabel: "Şifre",
    passwordPlaceholder: "••••••••",
    changeEmail: "E-postayı Değiştir",
    forgotPass: "Şifremi Unuttum?",
    forgotPassAlert: "🔑 Şifrenizi sıfırlamak için lütfen Platform Yönetimi (Süper Admin) veya restoran yöneticinizle iletişime geçin.",
    otpLabel: "E-postaya Gönderilen Doğrulama Kodu (OTP)",
    resendOtp: "Doğrulama kodunu tekrar gönder 🔄",
    btnProcessing: "İşleniyor...",
    btnVerifySignup: "Doğrulama Kodunu Gönder",
    btnLogin: "Giriş Yap",
    btnSendOtp: "Hızlı Giriş Kodu Gönder",
    btnVerifyLogin: "Doğrula ve Giriş Yap",
    noAccount: "Hesabınız yok mu? ",
    haveAccount: "Zaten bir hesabınız var mı? ",
    createAccountNow: "Şimdi Kaydolun",
    loginNow: "Giriş Yap",
    agreeText: "Hesap oluşturarak RestoCloud Kullanım Koşulları ve Gizlilik Politikasını kabul etmiş olursunuz.",
    terms: "Kullanım Koşulları",
    privacy: "Gizlilik Politikası",
    visualTitle: "Restoranınızı en son bulut SaaS teknolojisiyle daha akıllı yönetin",
    visualDesc: "Yapay zeka destekli hızlı POS ekranlarımızla operasyonlarını dönüştüren yüzlerce restorana katılın.",
    usersCount: "+100 Aktif Restoran",
    methodPassword: "🔑 Şifre ile Giriş",
    methodOtp: "✉️ E-posta Doğrulama (OTP)",
    enterEmailErr: "Lütfen önce e-posta adresinizi girin",
    pendingTitle: "Başvurunuz Başarıyla Alındı!",
    pendingDesc: "Restoran hesabınız şu anda inceleme aşamasındadır. Hesabınız onaylanıp etkinleştirildiğinde size bir e-posta göndereceğiz.",
    btnBackHome: "Ana Sayfaya Dön",
    verifyRegisterOtpTitle: "Doğrulama Kodunu (OTP) Girin",
    verifyRegisterOtpDesc: "Kaydı onaylamak için e-posta adresinize 6 haneli bir doğrulama kodu gönderdik:",
    btnConfirmRegister: "Doğrula ve Hesabı Oluştur",
    otpSendFail: "Doğrulama kodu gönderilemedi",
    otpVerifyFail: "Geçersiz doğrulama kodu",
    loginFail: "E-posta veya şifre hatalı",
    registerFail: "Restoran hesabı oluşturulurken hata"
  }
};

interface SaaSAuthViewProps {
  mode: "login" | "signup";
  onSelectView: (view: ActivePortalView) => void;
  onLoginSuccess: (isSuperAdmin: boolean, user?: any, tenant?: any) => void;
  onSignupSubmit?: (data: { name: string; restaurantName: string; email: string }) => void;
  lang: 'ar' | 'en' | 'tr';
  onLangChange: (lang: 'ar' | 'en' | 'tr') => void;
}

export const SaaSAuthView: React.FC<SaaSAuthViewProps> = ({ 
  mode, 
  onSelectView, 
  onLoginSuccess, 
  onSignupSubmit,
  lang,
  onLangChange
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [showPendingMsg, setShowPendingMsg] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [loginMethod, setLoginMethod] = useState<"password" | "otp">("password");
  const [otpStep, setOtpStep] = useState<"request" | "verify">("request");
  const [otpCode, setOtpCode] = useState("");
  const [otpSentMsg, setOtpSentMsg] = useState<string | null>(null);
  const [showRegisterOtpModal, setShowRegisterOtpModal] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);

  const t = authTranslations[lang] || authTranslations['ar'];

  // Send OTP helper for both signup and login
  const handleSendOtp = async (actionType: "signup" | "login") => {
    if (!email) {
      setError(t.enterEmailErr);
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError(lang === 'ar' ? "يرجى كتابة بريد إلكتروني صحيح وصالح (مثال: name@example.com)" : "Please enter a valid email address (e.g. name@example.com)");
      return;
    }
    setLoading(true);
    setError(null);
    setOtpSentMsg(null);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, actionType })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t.otpSendFail);
      
      setOtpSentMsg(data.message);
      if (actionType === "login") {
        setOtpStep("verify");
      } else {
        setShowRegisterOtpModal(true);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyRegisterOtpAndSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const cleanEmailUser = email.split("@")[0].replace(/[^a-z0-9]/g, "");
      const slug = cleanEmailUser || `restaurant-${Date.now()}`;
      
      const res = await fetch("/api/tenants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nameAr: restaurantName,
          subdomain: slug,
          ownerName: name,
          ownerEmail: email,
          password: password,
          phone: phone,
          address: address,
          status: "pending_approval",
          themeColor: "emerald",
          subscriptionPlan: "starter",
          subscriptionAmount: 199,
          otpCode: otpCode
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t.registerFail);

      setShowRegisterOtpModal(false);
      setShowPendingMsg(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === "signup") {
      await handleSendOtp("signup");
      return;
    }

    setLoading(true);
    try {
      if (loginMethod === "otp") {
        const res = await fetch("/api/auth/login-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, code: otpCode })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || t.otpVerifyFail);
        
        onLoginSuccess(false, data.user, data.tenant);
      } else {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || t.loginFail);

        if (data.isSuperAdmin) {
          onLoginSuccess(true);
        } else {
          onLoginSuccess(false, data.user, data.tenant);
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans selection:bg-indigo-500/30" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Side Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 sm:p-12 xl:p-24 relative bg-white shadow-2xl z-10">
        
        {/* Header Controls (Return Home & Language) */}
        <div className={`absolute top-4 sm:top-8 ${lang === 'ar' ? 'right-4 sm:right-8' : 'left-4 sm:left-8'} flex items-center gap-2 sm:gap-4`}>
          <button
            onClick={() => onSelectView("landing_page")}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
          >
            {lang === 'ar' ? <ArrowRight className="w-4 h-4 shrink-0" /> : <ArrowLeft className="w-4 h-4 shrink-0" />}
            <span className="hidden sm:inline">{t.backToHome}</span>
          </button>

          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowLangDropdown(!showLangDropdown)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <span>
                {lang === 'ar' ? '🇸🇦' : lang === 'tr' ? '🇹🇷' : '🇬🇧'}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showLangDropdown && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowLangDropdown(false)}
                />
                <div className={`absolute mt-2 w-36 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-20 animate-in fade-in zoom-in-95 duration-150 ${lang === 'ar' ? 'left-0 text-right' : 'right-0 text-left'}`}>
                  <button
                    type="button"
                    onClick={() => {
                      onLangChange('ar');
                      setShowLangDropdown(false);
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs transition-colors hover:bg-slate-50 cursor-pointer ${
                      lang === 'ar' ? 'text-indigo-600 bg-indigo-50/50 font-bold' : 'text-slate-700'
                    }`}
                  >
                    <span>🇸🇦</span>
                    <span>العربية</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onLangChange('en');
                      setShowLangDropdown(false);
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs transition-colors hover:bg-slate-50 cursor-pointer ${
                      lang === 'en' ? 'text-indigo-600 bg-indigo-50/50 font-bold' : 'text-slate-700'
                    }`}
                  >
                    <span>🇬🇧</span>
                    <span>English</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onLangChange('tr');
                      setShowLangDropdown(false);
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs transition-colors hover:bg-slate-50 cursor-pointer ${
                      lang === 'tr' ? 'text-indigo-600 bg-indigo-50/50 font-bold' : 'text-slate-700'
                    }`}
                  >
                    <span>🇹🇷</span>
                    <span>Türkçe</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="w-full max-w-md mt-24 sm:mt-12">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-xl shadow-indigo-500/20 mb-8">
            <UtensilsCrossed className="w-8 h-8" />
          </div>

          <h2 className="text-3xl font-black text-slate-900 mb-2">
            {mode === "login" ? t.loginTitle : t.signupTitle}
          </h2>
          <p className="text-slate-500 mb-8 font-medium">
            {mode === "login" ? t.loginDesc : t.signupDesc}
          </p>

          {showPendingMsg ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Store className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-emerald-800 mb-2">{t.pendingTitle}</h3>
              <p className="text-emerald-700 text-sm font-medium mb-6 leading-relaxed">
                {t.pendingDesc}
              </p>
              <button
                onClick={() => onSelectView("landing_page")}
                className="w-full py-3 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors cursor-pointer"
              >
                {t.btnBackHome}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-sm text-center font-bold">
                  {error}
                </div>
              )}
              {mode === "signup" && (
                <>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">{t.fullnameLabel}</label>
                    <div className="relative">
                      <User className={`absolute ${lang === 'ar' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400`} />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className={`w-full py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium ${lang === 'ar' ? 'pl-4 pr-12' : 'pr-4 pl-12'}`}
                        placeholder={t.fullnamePlaceholder}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">{t.restaurantLabel}</label>
                    <div className="relative">
                      <Store className={`absolute ${lang === 'ar' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400`} />
                      <input
                        type="text"
                        required
                        value={restaurantName}
                        onChange={e => setRestaurantName(e.target.value)}
                        className={`w-full py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium ${lang === 'ar' ? 'pl-4 pr-12' : 'pr-4 pl-12'}`}
                        placeholder={t.restaurantPlaceholder}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">{t.phoneLabel}</label>
                    <div className="relative">
                      <Phone className={`absolute ${lang === 'ar' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400`} />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        className={`w-full py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium font-mono ${lang === 'ar' ? 'pl-4 pr-12 text-right' : 'pr-4 pl-12 text-left'}`}
                        placeholder={t.phonePlaceholder}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">{t.addressLabel}</label>
                    <div className="relative">
                      <MapPin className={`absolute ${lang === 'ar' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400`} />
                      <input
                        type="text"
                        required
                        value={address}
                        onChange={e => setAddress(e.target.value)}
                        className={`w-full py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium ${lang === 'ar' ? 'pl-4 pr-12' : 'pr-4 pl-12'}`}
                        placeholder={t.addressPlaceholder}
                      />
                    </div>
                  </div>
                </>
              )}
              {/* Login Method Toggle */}
              {mode === "login" && (
                <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl mb-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setLoginMethod("password");
                      setError(null);
                      setOtpSentMsg(null);
                    }}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      loginMethod === "password"
                        ? "bg-white text-slate-800 shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    {t.methodPassword}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginMethod("otp");
                      setOtpStep("request");
                      setError(null);
                      setOtpSentMsg(null);
                    }}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      loginMethod === "otp"
                        ? "bg-white text-slate-800 shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    {t.methodOtp}
                  </button>
                </div>
              )}

              {otpSentMsg && (
                <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold text-center leading-relaxed">
                  {otpSentMsg}
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">{t.emailLabel}</label>
                <div className="relative">
                  <Mail className={`absolute ${lang === 'ar' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400`} />
                  <input
                    type="text"
                    required
                    disabled={mode === "login" && loginMethod === "otp" && otpStep === "verify"}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className={`w-full py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium disabled:opacity-60 ${lang === 'ar' ? 'pl-4 pr-12' : 'pr-4 pl-12'}`}
                    placeholder={t.emailPlaceholder}
                  />
                  {mode === "login" && loginMethod === "otp" && otpStep === "verify" && (
                    <button
                      type="button"
                      onClick={() => {
                        setOtpStep("request");
                        setOtpSentMsg(null);
                        setError(null);
                      }}
                      className={`absolute ${lang === 'ar' ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 text-xs font-bold text-indigo-600 hover:underline cursor-pointer`}
                    >
                      {t.changeEmail}
                    </button>
                  )}
                </div>
              </div>

              {/* Password field */}
              {((mode === "login" && loginMethod === "password") || mode === "signup") && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-sm font-bold text-slate-700">{t.passwordLabel}</label>
                    {mode === "login" && (
                      <button
                        type="button"
                        onClick={() => alert(t.forgotPassAlert)}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline bg-transparent border-0 p-0 cursor-pointer"
                      >
                        {t.forgotPass}
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className={`absolute ${lang === 'ar' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400`} />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className={`w-full py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium ${lang === 'ar' ? 'pl-4 pr-12' : 'pr-4 pl-12'}`}
                      placeholder={t.passwordPlaceholder}
                    />
                  </div>
                </div>
              )}

              {/* OTP Code input field */}
              {mode === "login" && loginMethod === "otp" && otpStep === "verify" && (
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">{t.otpLabel}</label>
                  <div className="relative">
                    <Lock className={`absolute ${lang === 'ar' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400`} />
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={otpCode}
                      onChange={e => setOtpCode(e.target.value.replace(/[^0-9]/g, ""))}
                      className={`w-full py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono font-black text-lg tracking-[8px] text-center ${lang === 'ar' ? 'pl-4 pr-12' : 'pr-4 pl-12'}`}
                      placeholder="123456"
                    />
                  </div>
                  <div className={`mt-2 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                    <button
                      type="button"
                      onClick={() => handleSendOtp("login")}
                      className="text-xs font-bold text-indigo-600 hover:underline cursor-pointer"
                    >
                      {t.resendOtp}
                    </button>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-black hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all mt-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <span>
                  {loading ? (
                    t.btnProcessing
                  ) : mode === "signup" ? (
                    t.btnVerifySignup
                  ) : loginMethod === "password" ? (
                    t.btnLogin
                  ) : otpStep === "request" ? (
                    t.btnSendOtp
                  ) : (
                    t.btnVerifyLogin
                  )}
                </span>
                {lang === 'ar' ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
              </button>

              <p className="mt-6 text-center text-sm font-medium text-slate-500">
                {mode === "login" ? t.noAccount : t.haveAccount}
                <button
                  type="button"
                  onClick={() => onSelectView(mode === "login" ? "auth_signup" : "auth_login")}
                  className="font-bold text-indigo-600 hover:text-indigo-700 underline underline-offset-4 cursor-pointer"
                >
                  {mode === "login" ? t.createAccountNow : t.loginNow}
                </button>
              </p>

              {mode === "signup" && (
                <p className="text-center text-[11px] text-slate-400">
                  {t.agreeText}
                </p>
              )}
            </form>
          )}
        </div>
      </div>

      {/* Side Visual Graphic */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative overflow-hidden flex-col items-center justify-center p-12 text-center">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1974&auto=format&fit=crop')] bg-cover bg-center opacity-20" />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-slate-900 via-indigo-900/80 to-slate-900 mix-blend-multiply" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/30 rounded-full blur-[100px] animate-pulse" />

        <div className="relative z-10 max-w-lg">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-3xl mx-auto mb-8 border border-white/20 flex items-center justify-center text-white shadow-2xl">
            <Store className="w-10 h-10" />
          </div>
          <h3 className="text-3xl font-black text-white mb-6 leading-relaxed">
            {t.visualTitle}
          </h3>
          <p className="text-indigo-100 text-lg leading-loose font-medium">
            {t.visualDesc}
          </p>

          <div className="mt-12 flex items-center justify-center gap-4">
            <div className="flex -space-x-4 space-x-reverse">
              <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-emerald-500 flex items-center justify-center text-xs font-bold text-white shadow-sm">👨‍🍳</div>
              <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-amber-500 flex items-center justify-center text-xs font-bold text-white shadow-sm">👩‍💼</div>
              <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-rose-500 flex items-center justify-center text-xs font-bold text-white shadow-sm">👨‍💼</div>
            </div>
            <div className={`text-slate-200 text-sm ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
              <div className="font-bold text-white">{t.usersCount}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Registration OTP Modal */}
      {showRegisterOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative space-y-6">
            <button
              onClick={() => setShowRegisterOtpModal(false)}
              className="absolute top-4 left-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto text-xl">
                ✉️
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">{t.verifyRegisterOtpTitle}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                {t.verifyRegisterOtpDesc}
                <br />
                <span className="font-bold text-slate-800 dark:text-slate-200">{email}</span>
              </p>
            </div>

            {otpSentMsg && (
              <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-xs font-semibold text-center leading-relaxed">
                {otpSentMsg}
              </div>
            )}

            <form onSubmit={handleVerifyRegisterOtpAndSignup} className="space-y-4">
              <div>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otpCode}
                  onChange={e => setOtpCode(e.target.value.replace(/[^0-9]/g, ""))}
                  className="w-full py-3 rounded-2xl border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono font-black text-2xl tracking-[12px] text-center text-slate-900 dark:text-white"
                  placeholder="123456"
                />
              </div>

              <button
                type="submit"
                disabled={loading || otpCode.length < 6}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-black hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <span>{loading ? t.btnProcessing : t.btnConfirmRegister}</span>
                {lang === 'ar' ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => handleSendOtp("signup")}
                  className="text-xs font-bold text-indigo-600 hover:underline cursor-pointer"
                >
                  {t.resendOtp}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
