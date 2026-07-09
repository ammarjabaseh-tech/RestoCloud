import React, { useState } from "react";
import { ActivePortalView } from "../types";
import { ArrowRight, UtensilsCrossed, Store, Mail, Lock, User, ChevronRight, Phone, MapPin, X } from "lucide-react";

interface SaaSAuthViewProps {
  mode: "login" | "signup";
  onSelectView: (view: ActivePortalView) => void;
  onLoginSuccess: (isSuperAdmin: boolean, user?: any, tenant?: any) => void;
  onSignupSubmit?: (data: { name: string; restaurantName: string; email: string }) => void;
}

export const SaaSAuthView: React.FC<SaaSAuthViewProps> = ({ mode, onSelectView, onLoginSuccess, onSignupSubmit }) => {
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

  // Send OTP helper for both signup and login
  const handleSendOtp = async (actionType: "signup" | "login") => {
    if (!email) {
      setError("يرجى إدخال البريد الإلكتروني أولاً");
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
      if (!res.ok) throw new Error(data.error || "فشل إرسال رمز التحقق");
      
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
      // Generate English subdomain slug from email or name
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
      if (!res.ok) throw new Error(data.error || "خطأ أثناء إنشاء حساب المطعم");

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
      // Step 1: Send registration OTP
      await handleSendOtp("signup");
      return;
    }

    // Login logic
    setLoading(true);
    try {
      if (loginMethod === "otp") {
        // Login via OTP verification
        const res = await fetch("/api/auth/login-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, code: otpCode })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "رمز التحقق غير صحيح");
        
        onLoginSuccess(false, data.user, data.tenant);
      } else {
        // Standard password login
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "البريد الإلكتروني أو كلمة المرور غير صحيحة");

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
    <div className="min-h-screen bg-slate-50 flex font-sans selection:bg-indigo-500/30" dir="rtl">

      {/* Right Side: Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 sm:p-12 xl:p-24 relative bg-white shadow-2xl z-10">

        <button
          onClick={() => onSelectView("landing_page")}
          className="absolute top-8 right-8 flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-800 transition-colors"
        >
          <ArrowRight className="w-4 h-4" /> العودة للرئيسية
        </button>

        <div className="w-full max-w-md">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-xl shadow-indigo-500/20 mb-8">
            <UtensilsCrossed className="w-8 h-8" />
          </div>

          <h2 className="text-3xl font-black text-slate-900 mb-2">
            {mode === "login" ? "مرحباً بعودتك!" : "ابدأ رحلة النجاح لمطعمك"}
          </h2>
          <p className="text-slate-500 mb-8 font-medium">
            {mode === "login"
              ? "سجل دخولك لإدارة مطعمك ونقاط البيع"
              : "أنشئ حسابك الآن وجرب ريستو كلاود (RestoCloud) مجاناً"}
          </p>

          {showPendingMsg ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Store className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-emerald-800 mb-2">تم استلام طلبك بنجاح!</h3>
              <p className="text-emerald-700 text-sm font-medium mb-6 leading-relaxed">
                حساب مطعمك الآن قيد المراجعة من قبل الإدارة. سيتم إرسال بريد إلكتروني لك فور الموافقة وتفعيل الحساب.
              </p>
              <button
                onClick={() => onSelectView("landing_page")}
                className="w-full py-3 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors"
              >
                العودة للصفحة الرئيسية
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
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">اسمك الكامل</label>
                    <div className="relative">
                      <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full pl-4 pr-12 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium"
                        placeholder="أحمد محمد"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">اسم المطعم</label>
                    <div className="relative">
                      <Store className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={restaurantName}
                        onChange={e => setRestaurantName(e.target.value)}
                        className="w-full pl-4 pr-12 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium"
                        placeholder="مطعم مذاق الشام"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">رقم الهاتف</label>
                    <div className="relative">
                      <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        className="w-full pl-4 pr-12 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium text-right font-mono"
                        placeholder="0500000000"
                        dir="ltr"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">عنوان المطعم بالتفصيل</label>
                    <div className="relative">
                      <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={address}
                        onChange={e => setAddress(e.target.value)}
                        className="w-full pl-4 pr-12 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium"
                        placeholder="الرياض، حي العليا، طريق الملك فهد"
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
                    🔑 تسجيل بكلمة المرور
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
                    ✉️ التحقق عبر الإيميل (OTP)
                  </button>
                </div>
              )}

              {otpSentMsg && (
                <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold text-center leading-relaxed">
                  {otpSentMsg}
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">البريد الإلكتروني</label>
                <div className="relative">
                  <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    required
                    disabled={mode === "login" && loginMethod === "otp" && otpStep === "verify"}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-4 pr-12 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium disabled:opacity-60"
                    placeholder="admin@restaurant.com"
                  />
                  {mode === "login" && loginMethod === "otp" && otpStep === "verify" && (
                    <button
                      type="button"
                      onClick={() => {
                        setOtpStep("request");
                        setOtpSentMsg(null);
                        setError(null);
                      }}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-indigo-600 hover:underline cursor-pointer"
                    >
                      تغيير البريد
                    </button>
                  )}
                </div>
              </div>

              {/* Password field - only for password login/signup */}
              {((mode === "login" && loginMethod === "password") || mode === "signup") && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-sm font-bold text-slate-700">كلمة المرور</label>
                    {mode === "login" && (
                      <button
                        type="button"
                        onClick={() => alert("🔑 لاستعادة كلمة المرور أو إعادة تعيينها، يرجى التواصل مع الإدارة العامة للمنصة (Super Admin) أو مدير النظام الخاص بمطعمك لإعادة تعيين كلمة مرور جديدة.")}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline bg-transparent border-0 p-0 cursor-pointer"
                      >
                        نسيت كلمة المرور؟
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full pl-4 pr-12 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              )}

              {/* OTP Code input field for passwordless login verification */}
              {mode === "login" && loginMethod === "otp" && otpStep === "verify" && (
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">رمز التحقق (OTP) من الإيميل</label>
                  <div className="relative">
                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={otpCode}
                      onChange={e => setOtpCode(e.target.value.replace(/[^0-9]/g, ""))}
                      className="w-full pl-4 pr-12 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-mono font-black text-lg tracking-[8px] text-center"
                      placeholder="123456"
                    />
                  </div>
                  <div className="mt-2 text-right">
                    <button
                      type="button"
                      onClick={() => handleSendOtp("login")}
                      className="text-xs font-bold text-indigo-600 hover:underline cursor-pointer"
                    >
                      إعادة إرسال رمز التحقق 🔄
                    </button>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-black hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all mt-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? (
                  "جاري المعالجة..."
                ) : mode === "signup" ? (
                  "تأكيد وإرسال رمز التحقق للبريد"
                ) : loginMethod === "password" ? (
                  "تسجيل الدخول"
                ) : otpStep === "request" ? (
                  "إرسال رمز الدخول السريع"
                ) : (
                  "تأكيد وتسجيل الدخول"
                )}
                <ChevronRight className="w-5 h-5" />
              </button>

              <p className="mt-6 text-center text-sm font-medium text-slate-500">
                {mode === "login" ? "ليس لديك حساب؟ " : "لديك حساب بالفعل؟ "}
                <button
                  type="button"
                  onClick={() => onSelectView(mode === "login" ? "auth_signup" : "auth_login")}
                  className="font-bold text-indigo-600 hover:text-indigo-700 underline underline-offset-4 cursor-pointer"
                >
                  {mode === "login" ? "أنشئ حسابك الآن" : "سجل دخولك"}
                </button>
              </p>

              {mode === "signup" && (
                <p className="text-center text-[11px] text-slate-400">
                  بإنشائك للحساب، فأنت توافق على{" "}
                  <button type="button" onClick={() => onSelectView("terms")} className="underline cursor-pointer">شروط الاستخدام</button>
                  {" "}و{" "}
                  <button type="button" onClick={() => onSelectView("terms")} className="underline cursor-pointer">سياسة الخصوصية</button>
                  {" "}الخاصة بريستو كلاود (RestoCloud).
                </p>
              )}
            </form>
          )}
        </div>
      </div>

      {/* Left Side: Visual */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative overflow-hidden flex-col items-center justify-center p-12 text-center">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1974&auto=format&fit=crop')] bg-cover bg-center opacity-20" />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-slate-900 via-indigo-900/80 to-slate-900 mix-blend-multiply" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/30 rounded-full blur-[100px] animate-pulse" />

        <div className="relative z-10 max-w-lg">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-3xl mx-auto mb-8 border border-white/20 flex items-center justify-center text-white shadow-2xl">
            <Store className="w-10 h-10" />
          </div>
          <h3 className="text-3xl font-black text-white mb-6 leading-relaxed">
            أدِر مطعمك بذكاء،<br />بأحدث تقنيات الـ SaaS السحابية
          </h3>
          <p className="text-indigo-100 text-lg leading-loose font-medium">
            انضم لمئات المطاعم التي غيرت طريقة عملها باستخدام نقطة البيع الأسرع والمدعومة بالذكاء الاصطناعي مع توافق تام لمتطلبات الفاتورة الإلكترونية ZATCA.
          </p>

          <div className="mt-12 flex items-center justify-center gap-4">
            <div className="flex -space-x-4 space-x-reverse">
              <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-emerald-500 flex items-center justify-center text-xs font-bold text-white shadow-sm">👨‍🍳</div>
              <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-amber-500 flex items-center justify-center text-xs font-bold text-white shadow-sm">👩‍💼</div>
              <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-rose-500 flex items-center justify-center text-xs font-bold text-white shadow-sm">👨‍💼</div>
            </div>
            <div className="text-right text-sm text-indigo-200">
              <div className="font-bold text-white">+500 مطعم وكافيه</div>
              يستخدمون ريستو كلاود (RestoCloud) يومياً
            </div>
          </div>
        </div>
      </div>

      {/* Glassmorphic Registration OTP Verification Modal */}
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
              <h3 className="text-xl font-black text-slate-900 dark:text-white">التحقق من البريد الإلكتروني</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                لقد أرسلنا رمز تحقق (OTP) مكون من 6 أرقام إلى البريد الإلكتروني:
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
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-350 mb-1.5 text-center">أدخل الرمز هنا:</label>
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
                {loading ? "جاري التحقق..." : "تأكيد وتفعيل الحساب"}
                <ChevronRight className="w-5 h-5" />
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => handleSendOtp("signup")}
                  className="text-xs font-bold text-indigo-600 hover:underline cursor-pointer"
                >
                  إعادة إرسال الرمز 🔄
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
