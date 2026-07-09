import React from "react";
import { ActivePortalView } from "../types";
import { ArrowLeft, CheckCircle2, Rocket, Store, Bot, ShieldCheck, CreditCard, ChevronDown, UtensilsCrossed, Smartphone, Zap } from "lucide-react";

interface LandingPageViewProps {
  onSelectView: (view: ActivePortalView) => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({ onSelectView }) => {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 font-sans selection:bg-indigo-500/30 overflow-x-hidden" dir="rtl">
      {/* Decorative Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/30 rounded-full blur-[128px] -z-10 animate-pulse pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-rose-600/20 rounded-full blur-[128px] -z-10 pointer-events-none" />

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
              <UtensilsCrossed className="w-6 h-6" />
            </div>
            <span className="text-xl font-black tracking-tight text-white">ريستو كلاود (RestoCloud)</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">المميزات</a>
            <a href="#pricing" className="hover:text-white transition-colors">الباقات</a>
            <button onClick={() => onSelectView('terms')} className="hover:text-white transition-colors">الشروط</button>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => onSelectView('auth_login')}
              className="text-sm font-bold text-slate-300 hover:text-white transition-colors hidden sm:block"
            >
              تسجيل الدخول
            </button>
            <button
              onClick={() => onSelectView('auth_signup')}
              className="group relative inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-white/10 border border-white/20 rounded-full hover:bg-white/20 transition-all overflow-hidden"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-500 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative z-10 flex items-center gap-2">
                ابدأ مجاناً <ArrowLeft className="w-4 h-4" />
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-semibold mb-8">
            <SparklesIcon className="w-4 h-4" /> المنصة الأذكى لإدارة مطعمك
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 mb-8 leading-[1.1]">
            نظام مبيعات متكامل،<br />مدعوم بالذكاء الاصطناعي
          </h1>
          <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            منصة ريستو كلاود (RestoCloud) توفر لك نقاط بيع سريعة، منيو رقمي تفاعلي، وفواتير إلكترونية متوافقة مع متطلبات هيئة الزكاة (ZATCA)، لتنطلق بمطعمك نحو العالمية.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onSelectView('auth_signup')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-bold text-lg hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
            >
              أنشئ حساب مطعمك الآن <Rocket className="w-5 h-5" />
            </button>
            <a
              href="#features"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-800 text-white font-bold text-lg hover:bg-slate-700 transition-all flex items-center justify-center gap-2 border border-slate-700"
            >
              استكشف المزايا <ChevronDown className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-slate-900/50 relative border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-4">كل ما يحتاجه مطعمك في مكان واحد</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">صممنا ريستو كلاود (RestoCloud) ليكون الحل الشامل الذي يغنيك عن عشرات البرامج المعقدة.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Store />}
              title="تعدد الفروع والشركاء"
              desc="أدر كافة فروع مطاعمك من لوحة تحكم سحابية واحدة بمعايير الأمان وتعدد الصلاحيات للمستخدمين."
              color="from-blue-500 to-cyan-500"
            />
            <FeatureCard
              icon={<Bot />}
              title="ذكاء اصطناعي لرفع الأرباح"
              desc="تحليل المبيعات، كتابة أوصاف الأطباق بشكل جذاب، وتقديم توصيات ذكية لزيادة متوسط قيمة الفاتورة."
              color="from-purple-500 to-pink-500"
            />
            <FeatureCard
              icon={<ShieldCheck />}
              title="فواتير ZATCA معتمدة"
              desc="توليد تلقائي للباركود المشفر المتوافق مع المرحلة الأولى والثانية لهيئة الزكاة والضريبة والجمارك."
              color="from-emerald-500 to-teal-500"
            />
            <FeatureCard
              icon={<Zap />}
              title="نقطة بيع (POS) صاروخية"
              desc="شاشة كاشير سريعة جداً ومصممة بدقة لتسريع عملية أخذ الطلبات أثناء أوقات الذروة المزدحمة."
              color="from-amber-500 to-orange-500"
            />
            <FeatureCard
              icon={<Smartphone />}
              title="منيو رقمي (QR Code)"
              desc="طاولات ذكية مع كود QR مخصص لكل طاولة لطلب الطعام مباشرة من هاتف العميل دون انتظار النادل."
              color="from-rose-500 to-red-500"
            />
            <FeatureCard
              icon={<CreditCard />}
              title="دفع إلكتروني آمن"
              desc="متوافق مع بوابات الدفع المحلية والعالمية، ومدعوم لطباعة الإيصالات الحرارية مباشرة."
              color="from-indigo-500 to-blue-500"
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-4">باقات تناسب طموحك</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">اختر الباقة المناسبة لحجم أعمالك، يمكنك الترقية في أي وقت.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Starter Plan */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-3xl p-8 flex flex-col hover:border-slate-500 transition-colors">
              <h3 className="text-2xl font-bold text-white mb-2">البداية (Starter)</h3>
              <p className="text-slate-400 text-sm mb-6">مثالية للمطاعم الناشئة والكافيهات الصغيرة.</p>
              <div className="mb-6">
                <span className="text-5xl font-black text-white">199</span>
                <span className="text-slate-400"> ر.س / شهرياً</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                {[
                  "فرع واحد",
                  "نقطة بيع واحدة (POS)",
                  "منيو رقمي غير محدود",
                  "فواتير إلكترونية مبسطة",
                  "دعم فني عبر البريد"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-300 text-sm font-medium">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" /> {item}
                  </li>
                ))}
              </ul>
              <button onClick={() => onSelectView('auth_signup')} className="w-full py-3 rounded-xl bg-slate-700 text-white font-bold hover:bg-slate-600 transition-colors">
                ابدأ التجربة المجانية
              </button>
            </div>

            {/* Pro Plan */}
            <div className="bg-gradient-to-b from-indigo-900/40 to-slate-900 border border-indigo-500/30 rounded-3xl p-8 flex flex-col relative shadow-2xl shadow-indigo-500/10 transform md:-translate-y-4">
              <div className="absolute top-0 right-8 -translate-y-1/2 bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-xs font-black px-4 py-1.5 rounded-full shadow-lg">
                الأكثر طلباً
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">الاحترافية (Pro)</h3>
              <p className="text-indigo-200 text-sm mb-6">للمطاعم المزدحمة التي تحتاج أتمتة وذكاء اصطناعي.</p>
              <div className="mb-6">
                <span className="text-5xl font-black text-white">399</span>
                <span className="text-indigo-200"> ر.س / شهرياً</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                {[
                  "عدد لا محدود من المستخدمين",
                  "نقاط بيع لا محدودة",
                  "مساعد الذكاء الاصطناعي الكامل",
                  "تصدير البيانات والتقارير المتقدمة",
                  "فواتير ZATCA B2B & B2C",
                  "أولوية الدعم الفني المباشر"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-white text-sm font-medium">
                    <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" /> {item}
                  </li>
                ))}
              </ul>
              <button onClick={() => onSelectView('auth_signup')} className="w-full py-3 rounded-xl bg-indigo-500 text-white font-bold hover:bg-indigo-400 transition-colors shadow-lg shadow-indigo-500/25">
                اشترك الآن
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-slate-950 py-12 text-center text-slate-500 text-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-center gap-3 mb-6">
            <UtensilsCrossed className="w-5 h-5 text-slate-400" />
            <span className="font-bold text-slate-300">ريستو كلاود (RestoCloud)</span>
          </div>
          <p className="mb-4">جميع الحقوق محفوظة &copy; {new Date().getFullYear()} نظام ريستو كلاود (RestoCloud) لتقنية المعلومات.</p>
          <div className="flex items-center justify-center gap-6">
            <button onClick={() => onSelectView('terms')} className="hover:text-white transition-colors">شروط الاستخدام</button>
            <button onClick={() => onSelectView('terms')} className="hover:text-white transition-colors">سياسة الخصوصية</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

function SparklesIcon(props: any) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  );
}

function FeatureCard({ icon, title, desc, color }: { icon: React.ReactNode, title: string, desc: string, color: string }) {
  return (
    <div className="bg-slate-800/40 border border-white/5 rounded-3xl p-6 hover:bg-slate-800/60 transition-colors group">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white mb-6 shadow-lg transform group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}
