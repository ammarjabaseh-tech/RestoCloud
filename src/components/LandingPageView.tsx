import React, { useState } from "react";
import { ActivePortalView } from "../types";
import { 
  ArrowLeft, 
  ArrowRight,
  CheckCircle2, 
  Rocket, 
  Store, 
  Bot, 
  ShieldCheck, 
  CreditCard, 
  ChevronDown, 
  UtensilsCrossed, 
  Smartphone, 
  Zap,
  Globe
} from "lucide-react";

const landingTranslations = {
  ar: {
    brand: "ريستو كلاود (RestoCloud)",
    features: "المميزات",
    pricing: "الباقات",
    terms: "الشروط",
    login: "تسجيل الدخول",
    startFree: "ابدأ مجاناً",
    heroBadge: "المنصة الأذكى لإدارة مطعمك",
    heroTitle: "نظام مبيعات متكامل، مدعوم بالذكاء الاصطناعي",
    heroDesc: "منصة ريستو كلاود (RestoCloud) توفر لك نقاط بيع سريعة، منيو رقمي تفاعلي، وفواتير إلكترونية متوافقة مع متطلبات هيئة الزكاة (ZATCA)، لتنطلق بمطعمك نحو العالمية.",
    heroCta: "أنشئ حساب مطعمك الآن",
    heroExplore: "استكشف المزايا",
    sectionFeaturesTitle: "كل ما يحتاجه مطعمك في مكان واحد",
    sectionFeaturesDesc: "صممنا ريستو كلاود (RestoCloud) ليكون الحل الشامل الذي يغنيك عن عشرات البرامج المعقدة.",
    feat1Title: "تعدد الفروع والشركاء",
    feat1Desc: "أدر كافة فروع مطاعمك من لوحة تحكم سحابية واحدة بمعايير الأمان وتعدد الصلاحيات للمستخدمين.",
    feat2Title: "ذكاء اصطناعي لرفع الأرباح",
    feat2Desc: "تحليل المبيعات، كتابة أوصاف الأطباق بشكل جذاب، وتقديم توصيات ذكية لزيادة متوسط قيمة الفاتورة.",
    feat3Title: "فواتير ZATCA معتمدة",
    feat3Desc: "توليد تلقائي للباركود المشفر المتوافق مع المرحلة الأولى والثانية لهيئة الزكاة والضريبة والجمارك.",
    feat4Title: "نقطة بيع (POS) صاروخية",
    feat4Desc: "شاشة كاشير سريعة جداً ومصممة بدقة لتسريع عملية أخذ الطلبات أثناء أوقات الذروة المزدحمة.",
    feat5Title: "منيو رقمي (QR Code)",
    feat5Desc: "طاولات ذكية مع كود QR مخصص لكل طاولة لطلب الطعام مباشرة من هاتف العميل دون انتظار النادل.",
    feat6Title: "دفع إلكتروني آمن",
    feat6Desc: "متوافق مع بوابات الدفع المحلية والعالمية، ومدعوم لطباعة الإيصالات الحرارية مباشرة.",
    sectionPricingTitle: "باقات تناسب طموحك",
    sectionPricingDesc: "اختر الباقة المناسبة لحجم أعمالك، يمكنك الترقية في أي وقت.",
    planLite: "الرقمية (Lite Menu)",
    planLiteDesc: "خاصة بمطاعم الوجبات السريعة ومنافذ البيع البسيطة.",
    planLitePriceVal: "50",
    planLitePriceUnit: " $ / سنوياً",
    planLiteFeats: ["فرع واحد", "منيو رقمي متكامل مع باركود QR عام للمطعم", "إدارة وتعديل الأصناف والأسعار", "دعم فني عبر البريد الإلكتروني"],
    planLiteCta: "ابدأ الآن",
    planStarter: "البداية (Starter)",
    planStarterDesc: "مثالية للمطاعم الناشئة والكافيهات الصغيرة.",
    planStarterPriceVal: "299",
    planStarterPriceUnit: " $ / سنوياً",
    planStarterFeats: ["فرع واحد", "نقطة بيع واحدة (POS)", "منيو رقمي غير محدود", "فواتير إلكترونية مبسطة", "دعم فني عبر البريد"],
    planStarterCta: "ابدأ التجربة المجانية",
    planPro: "الاحترافية (Pro)",
    planProDesc: "للمطاعم المزدحمة التي تحتاج أتمتة وذكاء اصطناعي.",
    planProBadge: "الأكثر طلباً",
    planProPriceVal: "599",
    planProPriceUnit: " $ / سنوياً",
    planProFeats: ["عدد لا محدود من المستخدمين", "نقاط بيع لا محدودة", "مساعد الذكاء الاصطناعي الكامل", "تصدير البيانات والتقارير المتقدمة", "فواتير ZATCA B2B & B2C", "أولوية الدعم الفني المباشر"],
    planProCta: "اشترك الآن",
    rights: "جميع الحقوق محفوظة © {year} نظام ريستو كلاود (RestoCloud) لتقنية المعلومات.",
    privacy: "سياسة الخصوصية",
    termsOfUse: "شروط الاستخدام"
  },
  en: {
    brand: "RestoCloud Platform",
    features: "Features",
    pricing: "Pricing Plans",
    terms: "Terms",
    login: "Log In",
    startFree: "Start Free",
    heroBadge: "The smartest platform for your restaurant",
    heroTitle: "Integrated POS System, Powered by AI",
    heroDesc: "RestoCloud platform provides you with lightning-fast POS cashier screens, interactive digital QR menus, and electronic invoices compatible with ZATCA tax rules to scale your business.",
    heroCta: "Create Restaurant Account Now",
    heroExplore: "Explore Features",
    sectionFeaturesTitle: "Everything your restaurant needs in one place",
    sectionFeaturesDesc: "We designed RestoCloud to be the comprehensive solution replacing dozens of complicated legacy programs.",
    feat1Title: "Multi-branch Management",
    feat1Desc: "Manage all branches and partner roles from a single cloud-based dashboard with top-tier security standards.",
    feat2Title: "AI-Powered Profit Optimization",
    feat2Desc: "Analyze sales, write mouth-watering descriptions, and offer smart suggestions to boost average ticket value.",
    feat3Title: "ZATCA E-Invoicing",
    feat3Desc: "Automatic generation of encrypted QRs fully matching ZATCA phases 1 and 2 tax invoicing requirements.",
    feat4Title: "Ultra-fast POS Billing",
    feat4Desc: "A robust cashier terminal meticulously optimized for taking orders instantly during peak traffic hours.",
    feat5Title: "Digital QR Code Menu",
    feat5Desc: "Custom QR codes on dining tables allowing customers to place orders instantly from their phones without waiting.",
    feat6Title: "Secure Payments & Integrations",
    feat6Desc: "Compatible with regional and global gateways with thermal and network printer integrations out of the box.",
    sectionPricingTitle: "Plans That Match Your Ambition",
    sectionPricingDesc: "Choose the package suitable for your business volume. Upgrade anytime.",
    planLite: "Lite Menu Plan",
    planLiteDesc: "For fast food spots and quick service outlets.",
    planLitePriceVal: "$50",
    planLitePriceUnit: " / year",
    planLiteFeats: ["1 Branch", "General QR Digital Menu", "Dishes & Prices Control Panel", "Email Customer Support"],
    planLiteCta: "Start Now",
    planStarter: "Starter Plan",
    planStarterDesc: "Ideal for startups, coffee spots, and small diners.",
    planStarterPriceVal: "$299",
    planStarterPriceUnit: " / year",
    planStarterFeats: ["1 Active Branch", "1 Active POS Station", "Unlimited QR Menu Visits", "Basic E-Invoicing", "Email Customer Support"],
    planStarterCta: "Start Free Trial",
    planPro: "Pro Plan",
    planProDesc: "For busy restaurants needing automation and advanced AI advice.",
    planProBadge: "Most Popular",
    planProPriceVal: "$599",
    planProPriceUnit: " / year",
    planProFeats: ["Unlimited Employees", "Unlimited POS Stations", "Full AI Consulting Assistant", "Advanced CSV/Excel Export & Reports", "B2B & B2C Tax E-Invoices", "24/7 Priority Support"],
    planProCta: "Subscribe Now",
    rights: "All rights reserved &copy; {year} RestoCloud IT Systems.",
    privacy: "Privacy Policy",
    termsOfUse: "Terms of Use"
  },
  tr: {
    brand: "RestoCloud Platformu",
    features: "Özellikler",
    pricing: "Fiyatlandırma",
    terms: "Koşullar",
    login: "Giriş Yap",
    startFree: "Ücretsiz Başla",
    heroBadge: "Restoranınız için en akıllı platform",
    heroTitle: "Yapay Zeka Destekli Entegre Satış Noktası (POS)",
    heroDesc: "RestoCloud, işletmenizi büyütmek için hızlı POS kasa ekranları, QR tabanlı dijital menü ve vergi kurallarına uyumlu e-fatura sistemi sunar.",
    heroCta: "Restoran Hesabını Şimdi Oluştur",
    heroExplore: "Özellikleri Keşfet",
    sectionFeaturesTitle: "Restoranınızın ihtiyacı olan her şey tek yerde",
    sectionFeaturesDesc: "RestoCloud'u onlarca karmaşık eski programın yerini alacak kapsamlı bir çözüm olarak tasarladık.",
    feat1Title: "Çoklu Şube Yönetimi",
    feat1Desc: "Tüm şubeleri ve ortak rollerini, üst düzey güvenlik standartlarına sahip tek bir bulut panelinden yönetin.",
    feat2Title: "Yapay Zeka Destekli Kâr Artışı",
    feat2Desc: "Satışları analiz edin, iştah açıcı açıklamalar yazın ve sepet tutarını artırmak için akıllı kombo önerileri alın.",
    feat3Title: "Uyumlu E-Fatura Sistemi",
    feat3Desc: "Şifrelenmiş karekod faturaların yerel vergi yönetmeliklerine uygun olarak otomatik üretimi.",
    feat4Title: "Ultra Hızlı POS Kasa",
    feat4Desc: "Yoğun saatlerde siparişleri anında almak için titizlikle optimize edilmiş kasa arayüzü.",
    feat5Title: "Dijital QR Menü",
    feat5Desc: "Garson beklemeden doğrudan telefondan sipariş vermek için masalara özel tanımlanmış karekod standları.",
    feat6Title: "Güvenli Ödemeler & Entegrasyon",
    feat6Desc: "Yerel ve küresel ödeme altyapılarıyla uyumlu, termal yazıcı baskı destekli tam entegrasyon.",
    sectionPricingTitle: "Hedeflerinize Uygun Paketler",
    sectionPricingDesc: "İşletme hacminize en uygun paketi seçin. Dilediğiniz zaman yükseltin.",
    planLite: "Dijital Menü (Lite)",
    planLiteDesc: "Hızlı servis ve büfe tipi işletmeler için.",
    planLitePriceVal: "50 $",
    planLitePriceUnit: " / yıllık",
    planLiteFeats: ["1 Şube", "Genel QR Dijital Menü", "Ürün ve Fiyat Kontrol Paneli", "E-posta ile Teknik Destek"],
    planLiteCta: "Şimdi Başla",
    planStarter: "Başlangıç Paketi (Starter)",
    planStarterDesc: "Yeni kurulan restoranlar ve küçük kafeler için ideal.",
    planStarterPriceVal: "299 $",
    planStarterPriceUnit: " / yıllık",
    planStarterFeats: ["1 Aktif Şube", "1 Aktif POS Kasası", "Sınırsız QR Menü Ziyareti", "Temel E-Fatura Çözümü", "E-posta ile Teknik Destek"],
    planStarterCta: "Ücretsiz Denemeyi Başlat",
    planPro: "Profesyonel Paket (Pro)",
    planProDesc: "Otomasyon ve gelişmiş yapay zeka analizine ihtiyaç duyan yoğun işletmeler için.",
    planProBadge: "En Çok Tercih Edilen",
    planProPriceVal: "599 $",
    planProPriceUnit: " / yıllık",
    planProFeats: ["Sınırsız Kullanıcı", "Sınırsız POS Kasası", "Tam Yapay Zeka Danışmanlık Asistanı", "Gelişmiş CSV/Excel Dışa Aktarma & Raporlama", "B2B & B2C Detaylı E-Faturalar", "7/24 Öncelikli Teknik Destek"],
    planProCta: "Şimdi Katıl",
    rights: "Tüm hakları saklıdır &copy; {year} RestoCloud BT Sistemleri.",
    privacy: "Gizlilik Politikası",
    termsOfUse: "Kullanım Koşulları"
  }
};

interface LandingPageViewProps {
  onSelectView: (view: ActivePortalView) => void;
  lang: 'ar' | 'en' | 'tr';
  onLangChange: (lang: 'ar' | 'en' | 'tr') => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({ 
  onSelectView, 
  lang, 
  onLangChange 
}) => {
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [activeVideo, setActiveVideo] = useState(0);
  
  const tutorials = [
    {
      title: lang === 'ar' ? "تصفح وطلب العميل من المنيو" : lang === 'tr' ? "Müşteri Menü Gezintisi & Sipariş" : "Customer Menu Browsing & Ordering",
      desc: lang === 'ar' ? "تجربة مسح الباركود، تصفح المنيو، وإتمام الطلب التفاعلي من هاتف العميل." : lang === 'tr' ? "Müşterinin masa barkodunu taraması ve sipariş vermesi." : "Interactive table QR scanning and customer checkout simulation.",
      thumbnail: "📱"
    },
    {
      title: lang === 'ar' ? "تخصيص الهوية والألوان لحظياً" : lang === 'tr' ? "Canlı Renk ve Marka Seçimi" : "Real-time Theme & Branding",
      desc: lang === 'ar' ? "تغيير شعار وألوان وتصميم المنيو وملاحظة التعديل فورياً." : lang === 'tr' ? "Menü renklerini değiştirin ve anında önizleyin." : "Change menu colors and see live updates instantly.",
      thumbnail: "🎨"
    },
    {
      title: lang === 'ar' ? "استقبال الطلبات على الواتساب" : lang === 'tr' ? "WhatsApp Sipariş Akışı" : "WhatsApp Order Receipts",
      desc: lang === 'ar' ? "محاكاة طريقة وصول تفاصيل الطلب والحساب إلى رقم الواتساب الخاص بك." : lang === 'tr' ? "Sipariş detaylarının WhatsApp'a ulaşma şekli." : "Simulate how structured orders and bills land on your WhatsApp.",
      thumbnail: "💬"
    },
    {
      title: lang === 'ar' ? "لوحة الإدارة وإضافة الأصناف" : lang === 'tr' ? "Ürün Ekleme & Kontrol Paneli" : "Item Manager & Admin Panel",
      desc: lang === 'ar' ? "تجربة إضافة وتعديل أسعار وصور الأطباق والوجبات بمرونة." : lang === 'tr' ? "Ürün ekleme ve menüyü kontrol etme." : "Simulate adding food items and updating prices.",
      thumbnail: "🍽️"
    },
    {
      title: lang === 'ar' ? "شاشة الكاشير ونقاط البيع السريعة" : lang === 'tr' ? "Hızlı POS Kasa Ekranı" : "Ultra-fast POS & Cashier Station",
      desc: lang === 'ar' ? "شاشة كاشير سريعة جداً لتسجيل الطلبات المباشرة والسفري بنقرة واحدة." : lang === 'tr' ? "Siparişleri hızlıca kaydetmek için POS kasası." : "A swift cashier console to checkout dine-in and takeaway orders.",
      thumbnail: "🖥️"
    },
    {
      title: lang === 'ar' ? "الفواتير الضريبية وطباعة الإيصالات" : lang === 'tr' ? "E-Fatura & Yazıcı Çözümleri" : "ZATCA E-Invoices & Receipt Printing",
      desc: lang === 'ar' ? "إصدار فواتير حرارية متوافقة مع هيئة الزكاة (ZATCA) مع رمز QR مشفر." : lang === 'tr' ? "Vergi kurallarına uyumlu fatura ve fiş yazdırma." : "Generate tax e-invoices with encrypted ZATCA QR codes.",
      thumbnail: "🖨️"
    },
    {
      title: lang === 'ar' ? "لوحة مبيعات وتقارير الفروع" : lang === 'tr' ? "Çoklu Şube Satış Raporları" : "Multi-branch Sales & Analytics",
      desc: lang === 'ar' ? "متابعة أرباح فروع مطعمك، مبيعاتك اليومية، وإحصائيات الطلبات." : lang === 'tr' ? "Şubelerinizin günlük kazançlarını ve satış raporlarını izleyin." : "Track daily earnings, orders, and branch sales statistics.",
      thumbnail: "📊"
    }
  ];
  const t = landingTranslations[lang] || landingTranslations['ar'];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 font-sans selection:bg-indigo-500/30 overflow-x-hidden" dir={(lang || 'ar') === 'ar' ? 'rtl' : 'ltr'}>
      {/* Decorative Background Glows */}
      <div className="hidden sm:block absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/30 rounded-full blur-[128px] -z-10 animate-pulse pointer-events-none" />
      <div className="hidden sm:block absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-rose-600/20 rounded-full blur-[128px] -z-10 pointer-events-none" />

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden border border-white/10 flex items-center justify-center shadow-lg shadow-indigo-500/25 shrink-0 bg-slate-900">
              <img src="/logo.jpg" alt="RestoCloud Logo" className="w-full h-full object-cover" />
            </div>
            <span className="text-lg sm:text-xl font-black tracking-tight text-white hidden sm:inline">{t.brand}</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">{t.features}</a>
            <a href="#pricing" className="hover:text-white transition-colors">{t.pricing}</a>
            <button onClick={() => onSelectView('terms')} className="hover:text-white transition-colors">{t.terms}</button>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowLangDropdown(!showLangDropdown)}
                className="flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold transition-all border border-white/10 bg-white/5 hover:bg-white/10 text-white cursor-pointer"
              >
                <Globe className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span>
                  {lang === 'ar' ? '🇸🇦 ' : lang === 'tr' ? '🇹🇷 ' : '🇬🇧 '}
                </span>
                <span className="hidden sm:inline">
                  {lang === 'ar' ? 'العربية' : lang === 'tr' ? 'Türkçe' : 'English'}
                </span>
                <ChevronDown className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-slate-400" />
              </button>

              {showLangDropdown && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowLangDropdown(false)}
                  />
                  <div className={`absolute mt-2 w-36 bg-slate-800 rounded-xl shadow-xl border border-white/10 py-1.5 z-20 animate-in fade-in zoom-in-95 duration-150 ${lang === 'ar' ? 'left-0 text-right' : 'right-0 text-left'}`}>
                    <button
                      type="button"
                      onClick={() => {
                        onLangChange('ar');
                        setShowLangDropdown(false);
                      }}
                      className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs transition-colors hover:bg-slate-700 cursor-pointer ${
                        lang === 'ar' ? 'text-indigo-400 font-bold' : 'text-slate-300'
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
                      className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs transition-colors hover:bg-slate-700 cursor-pointer ${
                        lang === 'en' ? 'text-indigo-400 font-bold' : 'text-slate-300'
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
                      className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs transition-colors hover:bg-slate-700 cursor-pointer ${
                        lang === 'tr' ? 'text-indigo-400 font-bold' : 'text-slate-300'
                      }`}
                    >
                      <span>🇹🇷</span>
                      <span>Türkçe</span>
                    </button>
                  </div>
                </>
              )}
            </div>

            <button
              onClick={() => onSelectView('auth_login')}
              className="text-xs sm:text-sm font-bold text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              {t.login}
            </button>
            <button
              onClick={() => onSelectView('auth_signup')}
              className="group relative inline-flex items-center justify-center gap-1 sm:gap-2 px-3 py-1.5 sm:px-5 sm:py-2 text-[11px] sm:text-sm font-bold text-white bg-indigo-600 rounded-full hover:bg-indigo-500 transition-all overflow-hidden cursor-pointer"
            >
              <span className="relative z-10 flex items-center gap-1.5">
                {t.startFree} {lang === 'ar' ? <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" /> : <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />}
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 sm:pt-32 sm:pb-20 lg:pt-48 lg:pb-32 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs sm:text-sm font-semibold mb-6 sm:mb-8">
            <SparklesIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> {t.heroBadge}
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 mb-6 sm:mb-8 leading-[1.2]">
            {t.heroTitle}
          </h1>
          <p className="text-base md:text-lg text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            {t.heroDesc}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onSelectView('auth_signup')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-indigo-600 text-white font-bold text-lg hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-1 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{t.heroCta}</span>
              <Rocket className="w-5 h-5" />
            </button>
            <a
              href="#features"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-800 text-white font-bold text-lg hover:bg-slate-700 transition-all flex items-center justify-center gap-2 border border-slate-700"
            >
              <span>{t.heroExplore}</span>
              <ChevronDown className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-slate-900/50 relative border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-4">{t.sectionFeaturesTitle}</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">{t.sectionFeaturesDesc}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Store />}
              title={t.feat1Title}
              desc={t.feat1Desc}
              color="from-blue-500 to-cyan-500"
              lang={lang}
            />
            <FeatureCard
              icon={<Bot />}
              title={t.feat2Title}
              desc={t.feat2Desc}
              color="from-purple-500 to-pink-500"
              lang={lang}
            />
            <FeatureCard
              icon={<ShieldCheck />}
              title={t.feat3Title}
              desc={t.feat3Desc}
              color="from-emerald-500 to-teal-500"
              lang={lang}
            />
            <FeatureCard
              icon={<Zap />}
              title={t.feat4Title}
              desc={t.feat4Desc}
              color="from-amber-500 to-orange-500"
              lang={lang}
            />
            <FeatureCard
              icon={<Smartphone />}
              title={t.feat5Title}
              desc={t.feat5Desc}
              color="from-rose-500 to-red-500"
              lang={lang}
            />
            <FeatureCard
              icon={<CreditCard />}
              title={t.feat6Title}
              desc={t.feat6Desc}
              color="from-indigo-500 to-blue-500"
              lang={lang}
            />
          </div>
        </div>
      </section>

      
      {/* Video Tutorials Section */}
      <section id="tutorials" className="py-24 bg-slate-950/60 relative border-t border-white/5">
        {/* Glow light */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              {lang === 'ar' ? 'شرح المنيو وكيفية العمل' : lang === 'tr' ? 'Nasıl Çalışır & Video Rehberler' : 'How it Works & Video Guides'}
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              {lang === 'ar' ? 'شاهد شروحات سريعة توضح كيف تساهم منصتنا في تنظيم طلبات مطعمك ورفع أرباحك بضغطة زر' : lang === 'tr' ? 'Platformumuzun restoran siparişlerinizi nasıl düzenlediğini ve satışlarınızı nasıl artırdığını gösteren hızlı rehberleri izleyin' : 'Watch quick videos showing how our platform organizes your restaurant orders and boosts your sales easily'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left side: Video Player Mockup (5 cols) */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-[280px] h-[560px] bg-slate-900 rounded-[40px] p-3 border-4 border-slate-700 shadow-2xl shadow-indigo-500/10 flex flex-col overflow-hidden group">
                {/* Phone Speaker & Camera Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-5 w-32 bg-slate-700 rounded-b-xl z-20 flex items-center justify-center">
                  <div className="w-12 h-1 bg-slate-800 rounded-full" />
                  <div className="w-2.5 h-2.5 bg-slate-850 rounded-full ml-2" />
                </div>

                {/* Inner Screen */}
                <div className="relative flex-1 rounded-[32px] overflow-hidden bg-slate-950 flex items-center justify-center">
                  <PhoneSimulation activeIndex={activeVideo} lang={lang} />
                </div>
              </div>
            </div>

            {/* Right side: Interactive Tutorial list (7 cols) */}
            <div className="lg:col-span-7 space-y-2.5 max-h-[560px] overflow-y-auto pr-2 custom-scrollbar" dir={lang === "ar" ? "rtl" : "ltr"}>
              {tutorials.map((t, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveVideo(idx)}
                  className={`w-full p-3.5 rounded-2xl border text-right flex items-center gap-3 transition-all cursor-pointer ${
                    activeVideo === idx
                      ? "bg-gradient-to-l from-indigo-900/30 to-slate-800/80 border-indigo-500/40 shadow-lg shadow-indigo-500/5"
                      : "bg-slate-800/20 hover:bg-slate-800/40 border-white/5"
                  }`}
                >
                  {/* Play circle / Selected icon */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-md shrink-0 transition-all shadow-md ${
                    activeVideo === idx
                      ? "bg-indigo-600 text-white scale-105"
                      : "bg-slate-800/60 text-slate-400 group-hover:text-white"
                  }`}>
                    {t.thumbnail}
                  </div>

                  <div className="flex-1 space-y-1">
                    <h3 className={`text-base font-bold transition-colors ${
                      activeVideo === idx ? "text-white" : "text-slate-300"
                    }`}>
                      {t.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{t.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
{/* Pricing Section */}
      <section id="pricing" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-4">{t.sectionPricingTitle}</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">{t.sectionPricingDesc}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto items-stretch">
            {/* Lite Plan */}
            <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/80 rounded-3xl p-6 flex flex-col hover:border-slate-500 transition-colors">
              <h3 className="text-xl font-bold text-white mb-2">{t.planLite}</h3>
              <p className="text-slate-400 text-xs mb-6">{t.planLiteDesc}</p>
              <div className="mb-6">
                <span className="text-3xl sm:text-4xl font-black text-white">{t.planLitePriceVal}</span>
                <span className="text-slate-400 text-xs">{t.planLitePriceUnit}</span>
              </div>
              <ul className="space-y-3.5 mb-8 flex-1">
                {t.planLiteFeats.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-slate-300 text-xs font-semibold leading-relaxed">
                    <CheckCircle2 className="w-4.5 h-4.5 text-orange-400 shrink-0 mt-0.5" /> <span>{item}</span>
                  </li>
                ))}
              </ul>
              <button onClick={() => onSelectView('auth_signup')} className="w-full py-2.5 rounded-xl bg-slate-700 text-white font-bold text-xs hover:bg-slate-600 transition-colors cursor-pointer">
                {t.planLiteCta}
              </button>
            </div>

            {/* Starter Plan */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-3xl p-6 flex flex-col hover:border-slate-500 transition-colors">
              <h3 className="text-xl font-bold text-white mb-2">{t.planStarter}</h3>
              <p className="text-slate-400 text-xs mb-6">{t.planStarterDesc}</p>
              <div className="mb-6">
                <span className="text-3xl sm:text-4xl font-black text-white">{t.planStarterPriceVal}</span>
                <span className="text-slate-400 text-xs">{t.planStarterPriceUnit}</span>
              </div>
              <ul className="space-y-3.5 mb-8 flex-1">
                {t.planStarterFeats.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-slate-300 text-xs font-semibold leading-relaxed">
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 shrink-0 mt-0.5" /> <span>{item}</span>
                  </li>
                ))}
              </ul>
              <button onClick={() => onSelectView('auth_signup')} className="w-full py-2.5 rounded-xl bg-slate-700/80 text-white font-bold text-xs hover:bg-slate-600 transition-colors cursor-pointer">
                {t.planStarterCta}
              </button>
            </div>

            {/* Pro Plan */}
            <div className="bg-gradient-to-b from-indigo-900/40 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 flex flex-col relative shadow-2xl shadow-indigo-500/10 hover:border-indigo-500 transition-colors">
              <div className={`absolute top-0 ${lang === 'ar' ? 'right-6' : 'left-6'} -translate-y-1/2 bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-[10px] font-black px-3.5 py-1 rounded-full shadow-lg`}>
                {t.planProBadge}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{t.planPro}</h3>
              <p className="text-indigo-200 text-xs mb-6">{t.planProDesc}</p>
              <div className="mb-6">
                <span className="text-3xl sm:text-4xl font-black text-white">{t.planProPriceVal}</span>
                <span className="text-indigo-200 text-xs">{t.planProPriceUnit}</span>
              </div>
              <ul className="space-y-3.5 mb-8 flex-1">
                {t.planProFeats.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-white text-xs font-semibold leading-relaxed">
                    <CheckCircle2 className="w-4.5 h-4.5 text-indigo-400 shrink-0 mt-0.5" /> <span>{item}</span>
                  </li>
                ))}
              </ul>
              <button onClick={() => onSelectView('auth_signup')} className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/25 cursor-pointer">
                {t.planProCta}
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
            <span className="font-bold text-slate-300">{t.brand}</span>
          </div>
          <p className="mb-4">{t.rights.replace("{year}", new Date().getFullYear().toString())}</p>
          <div className="flex items-center justify-center gap-6">
            <button onClick={() => onSelectView('terms')} className="hover:text-white transition-colors cursor-pointer">{t.termsOfUse}</button>
            <button onClick={() => onSelectView('terms')} className="hover:text-white transition-colors cursor-pointer">{t.privacy}</button>
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


const PhoneSimulation: React.FC<{ activeIndex: number; lang: string }> = ({ activeIndex, lang }) => {
  const [cartCount, setCartCount] = useState(0);
  const [orderSent, setOrderSent] = useState(false);
  const [brandingColor, setBrandingColor] = useState("emerald");
  const [itemsList, setItemsList] = useState([
    { name: lang === 'ar' ? "برجر كلاسيك" : "Classic Burger", price: 25 },
    { name: lang === 'ar' ? "بطاطس مقرمشة" : "Crispy Fries", price: 10 }
  ]);
  const [newItemName, setNewItemName] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");
  const [posCart, setPosCart] = useState<{ name: string; price: number; qty: number }[]>([]);
  const [posPaid, setPosPaid] = useState(false);
  const [branch, setBranch] = useState("riyadh");

  React.useEffect(() => {
    setOrderSent(false);
    setCartCount(0);
    setPosCart([]);
    setPosPaid(false);
  }, [activeIndex]);

  const getColorHex = (col: string) => {
    if (col === "violet") return "#8b5cf6";
    if (col === "rose") return "#f43f5e";
    return "#10b981";
  };

  const activeThemeColor = getColorHex(brandingColor);

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 font-sans text-right relative select-none">
      {/* Top Header Simulation bar */}
      <div className="h-10 bg-slate-900 border-b border-white/5 flex items-center justify-between px-4 pt-3 shrink-0 text-slate-400 text-[10px]">
        <div className="flex items-center gap-1">
          <span>🔋 100%</span>
        </div>
        <div className="w-14 h-3 bg-slate-950 rounded-full" />
        <div className="flex items-center gap-1 font-mono">
          <span>12:00 PM</span>
        </div>
      </div>

      {/* Screen Content */}
      <div className="flex-1 overflow-y-auto p-3 text-slate-200 text-xs flex flex-col">
        {activeIndex === 0 && (
          <div className="flex-1 flex flex-col space-y-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="text-[9px] bg-indigo-500/20 text-indigo-400 font-bold px-1.5 py-0.5 rounded-full">طاولة 4</span>
              <h4 className="font-bold text-white text-[11px]">🍔 برجر شو (Burger Show)</h4>
            </div>

            <div className="space-y-1.5">
              <div className="bg-slate-900 p-2 rounded-xl border border-white/5 flex items-center justify-between gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setCartCount(c => c + 1);
                    setOrderSent(false);
                  }}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-2.5 py-1 rounded-lg text-[10px] cursor-pointer"
                >
                  {lang === 'ar' ? 'أضف +' : 'Add +'}
                </button>
                <div className="text-right">
                  <div className="font-bold text-white text-[11px]">{lang === 'ar' ? 'كلاسيك برجر 🍔' : 'Classic Burger 🍔'}</div>
                  <div className="text-[10px] text-slate-400">25 ر.س</div>
                </div>
              </div>

              <div className="bg-slate-900 p-2 rounded-xl border border-white/5 flex items-center justify-between gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setCartCount(c => c + 1);
                    setOrderSent(false);
                  }}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-2.5 py-1 rounded-lg text-[10px] cursor-pointer"
                >
                  {lang === 'ar' ? 'أضف +' : 'Add +'}
                </button>
                <div className="text-right">
                  <div className="font-bold text-white text-[11px]">{lang === 'ar' ? 'بطاطس مقرمشة 🍟' : 'Crispy Fries 🍟'}</div>
                  <div className="text-[10px] text-slate-400">10 ر.س</div>
                </div>
              </div>
            </div>

            <div className="mt-auto pt-3">
              {orderSent ? (
                <div className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 p-2.5 rounded-xl text-center font-bold text-[9px] animate-in zoom-in-95">
                  🎉 {lang === 'ar' ? 'تم إرسال الطلب بنجاح إلى الواتساب!' : 'Order sent to WhatsApp!'}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    if (cartCount > 0) setOrderSent(true);
                  }}
                  disabled={cartCount === 0}
                  className={`w-full py-2 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                    cartCount > 0 ? "bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-90 cursor-pointer" : "bg-slate-800 text-slate-500 cursor-not-allowed"
                  }`}
                >
                  <span>🛒 {lang === 'ar' ? 'إرسال الطلب عبر الواتساب' : 'Send Order to WhatsApp'}</span>
                  {cartCount > 0 && <span className="bg-white text-emerald-600 font-black rounded-full w-4 h-4 flex items-center justify-center text-[10px]">{cartCount}</span>}
                </button>
              )}
            </div>
          </div>
        )}

        {activeIndex === 1 && (
          <div className="flex-1 flex flex-col space-y-3">
            <div className="bg-slate-900 p-2.5 rounded-xl border border-white/5 space-y-2">
              <span className="text-[9px] text-slate-400 block font-bold">{lang === 'ar' ? 'اختر لون الهوية للمنيو:' : 'Choose Menu Theme Color:'}</span>
              <div className="flex gap-2 justify-end">
                {["emerald", "violet", "rose"].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setBrandingColor(c)}
                    className={`w-5 h-5 rounded-full border cursor-pointer transition-all ${
                      c === "emerald" ? "bg-emerald-500" : c === "violet" ? "bg-violet-500" : "bg-rose-500"
                    } ${brandingColor === c ? "ring-2 ring-white scale-110 border-black" : "border-white/10 hover:scale-105"}`}
                  />
                ))}
              </div>
            </div>

            <div className="flex-1 border rounded-2xl p-2.5 flex flex-col space-y-2" style={{ borderColor: activeThemeColor + "40" }}>
              <div className="text-center py-1.5 rounded-xl" style={{ backgroundColor: activeThemeColor + "15" }}>
                <h5 className="font-bold text-[10px]" style={{ color: activeThemeColor }}>
                  {lang === 'ar' ? 'معاينة المنيو الخاص بك' : 'Your Menu Live Preview'}
                </h5>
              </div>
              <div className="bg-slate-900/60 p-2 rounded-xl border border-white/5 flex items-center justify-between">
                <span className="text-[9px] font-bold text-white px-2 py-0.5 rounded-md" style={{ backgroundColor: activeThemeColor }}>
                  {lang === 'ar' ? 'طلب' : 'Order'}
                </span>
                <span className="font-bold text-white text-[10px]">🍔 برجر لحم فاخر</span>
              </div>
            </div>
          </div>
        )}

        {activeIndex === 2 && (
          <div className="flex-1 flex flex-col space-y-2">
            <div className="bg-[#075e54] p-2 rounded-lg flex items-center justify-between text-white text-[9px] shrink-0">
              <span className="text-[8px] text-emerald-200">Online</span>
              <span className="font-bold">برجر شو (RestoCloud) 🍔</span>
            </div>

            <div className="flex-1 bg-slate-900/80 rounded-xl p-2 space-y-2 flex flex-col justify-end">
              <div className="bg-[#056162] text-white p-2 rounded-xl text-[9px] max-w-[90%] self-end space-y-1 text-right shadow-sm leading-relaxed">
                <div className="font-bold border-b border-white/10 pb-0.5 text-[8px] text-emerald-300">
                  {lang === 'ar' ? '💬 طلب جديد من طاولة 4' : '💬 New Order - Table 4'}
                </div>
                <div className="font-mono text-[8px] text-slate-100">
                  🍔 1x كلاسيك برجر (25 ر.س)<br />
                  🍟 1x بطاطس مقرمشة (10 ر.س)<br />
                  ---------------------<br />
                  💰 المجموع الإجمالي: 35 ر.س
                </div>
              </div>
              
              <div className="bg-[#262d31] text-slate-300 p-2 rounded-xl text-[9px] max-w-[85%] self-start text-right shadow-sm">
                👨‍🍳 {lang === 'ar' ? 'مرحباً بك! تم استلام طلبك وجاري تحضيره في المطبخ.' : 'Hello! We received your order and are preparing it.'}
              </div>
            </div>
          </div>
        )}

        {activeIndex === 3 && (
          <div className="flex-1 flex flex-col space-y-3">
            <div className="bg-slate-900 p-2.5 rounded-xl border border-white/5 space-y-2">
              <span className="text-[9px] font-bold text-white block">{lang === 'ar' ? 'إضافة طبق جديد للمنيو:' : 'Add New Dish:'}</span>
              <div className="space-y-1.5">
                <input
                  type="text"
                  placeholder={lang === 'ar' ? "اسم الوجبة (مثال: شاورما)" : "Item Name"}
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="w-full px-2 py-1 bg-slate-950 border border-white/10 rounded-lg text-[9px] text-right focus:outline-none"
                />
                <input
                  type="number"
                  placeholder={lang === 'ar' ? "السعر (مثال: 15)" : "Price"}
                  value={newItemPrice}
                  onChange={(e) => setNewItemPrice(e.target.value)}
                  className="w-full px-2 py-1 bg-slate-950 border border-white/10 rounded-lg text-[9px] text-right focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newItemName && newItemPrice) {
                      setItemsList([...itemsList, { name: newItemName, price: Number(newItemPrice) }]);
                      setNewItemName("");
                      setNewItemPrice("");
                    }
                  }}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-1 rounded-lg text-[9px] cursor-pointer"
                >
                  {lang === 'ar' ? 'حفظ الصنف الجديد' : 'Save New Item'}
                </button>
              </div>
            </div>

            <div className="flex-1 bg-slate-900/40 border border-white/5 rounded-xl p-2 max-h-[90px] overflow-y-auto space-y-1">
              <span className="text-[8px] text-slate-500 font-bold block mb-1">{lang === 'ar' ? 'قائمة الطعام الحالية:' : 'Current Menu:'}</span>
              {itemsList.map((item, idx) => (
                <div key={idx} className="bg-slate-950 p-1 rounded-lg border border-white/5 flex items-center justify-between text-[9px]">
                  <span className="text-slate-400 font-mono">{item.price} ر.س</span>
                  <span className="font-bold text-white">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeIndex === 4 && (
          <div className="flex-1 flex flex-col space-y-2">
            <div className="grid grid-cols-3 gap-1 shrink-0">
              {[{ name: "🍔 برجر", p: 25 }, { name: "🍟 بطاطس", p: 10 }, { name: "🥤 كولا", p: 5 }].map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    const existing = posCart.find(c => c.name === item.name);
                    if (existing) {
                      setPosCart(posCart.map(c => c.name === item.name ? { ...c, qty: c.qty + 1 } : c));
                    } else {
                      setPosCart([...posCart, { name: item.name, price: item.p, qty: 1 }]);
                    }
                    setPosPaid(false);
                  }}
                  className="bg-slate-900 hover:bg-slate-800 p-1.5 rounded-lg border border-white/5 text-center text-[9px] font-bold text-slate-200 cursor-pointer"
                >
                  <div>{item.name}</div>
                  <div className="text-[8px] text-slate-500">{item.p} ر.س</div>
                </button>
              ))}
            </div>

            <div className="flex-1 bg-white text-slate-900 rounded-xl p-2 flex flex-col overflow-y-auto font-mono text-[8px] space-y-1">
              <span className="font-black text-center border-b border-dashed border-slate-300 pb-1 text-[9px] text-slate-800">
                {lang === 'ar' ? 'فاتورة كاشير سريعة' : 'POS Cashier Slip'}
              </span>
              
              <div className="flex-1 space-y-0.5 max-h-[80px] overflow-y-auto">
                {posCart.length === 0 ? (
                  <div className="text-center text-slate-400 pt-3">{lang === 'ar' ? 'انقر على الأصناف بالأعلى' : 'Click items above'}</div>
                ) : (
                  posCart.map((c, i) => (
                    <div key={i} className="flex justify-between">
                      <span>{c.price * c.qty} ر.س</span>
                      <span className="text-right">{c.name} x{c.qty}</span>
                    </div>
                  ))
                )}
              </div>

              {posCart.length > 0 && (
                <div className="border-t border-dashed border-slate-300 pt-1">
                  <div className="flex justify-between font-black text-slate-950">
                    <span>{posCart.reduce((sum, item) => sum + (item.price * item.qty), 0)} ر.س</span>
                    <span>{lang === 'ar' ? 'المجموع:' : 'TOTAL:'}</span>
                  </div>

                  {posPaid ? (
                    <div className="bg-emerald-500 text-white font-bold p-1 rounded-md text-center text-[8px] mt-1">
                      🎉 {lang === 'ar' ? 'تم الدفع وطباعة الفاتورة!' : 'Paid & Printed!'}
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setPosPaid(true)}
                      className="w-full bg-slate-900 hover:bg-slate-850 text-white font-bold py-1 rounded-md text-[8px] mt-1 cursor-pointer"
                    >
                      💳 {lang === 'ar' ? 'دفع وطباعة' : 'Checkout & Print'}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {activeIndex === 5 && (
          <div className="flex-1 flex flex-col items-center justify-center p-2 space-y-3">
            <div className="bg-white text-slate-900 p-3 rounded-xl shadow-md border border-slate-200 w-full max-w-[180px] font-mono text-[8px] space-y-1.5 text-center animate-in slide-in-from-top-12 duration-550">
              <div className="font-black text-[9px] text-slate-800">🧾 {lang === 'ar' ? 'فاتورة ضريبية مبسطة' : 'Simplified Tax Invoice'}</div>
              <div className="text-slate-500 text-[7px]">{lang === 'ar' ? 'الرقم الضريبي: ٣١٠٥٢٩١٨٤' : 'VAT ID: 310529184'}</div>
              
              <div className="border-y border-dashed border-slate-200 py-1 space-y-0.5 text-right px-1">
                <div className="flex justify-between"><span>٢٥.٠٠ ر.س</span><span>برجر كلاسيك x١</span></div>
                <div className="flex justify-between"><span>٣.٧٥ ر.س</span><span>ضريبة القيمة المضافة ١٥٪</span></div>
              </div>

              <div className="flex justify-between font-black text-slate-950 px-1">
                <span>٢٨.٧٥ ر.س</span>
                <span>{lang === 'ar' ? 'الإجمالي:' : 'TOTAL:'}</span>
              </div>

              <div className="flex justify-center pt-2">
                <div className="w-14 h-14 bg-slate-100 border border-slate-200 p-1 flex flex-wrap gap-0.5 justify-center items-center">
                  {Array.from({ length: 49 }).map((_, idx) => (
                    <div
                      key={idx}
                      className={`w-1 h-1 ${
                        (idx % 2 === 0 && idx % 3 === 0) || idx < 7 || idx % 7 === 0 || idx > 42 ? "bg-slate-900" : "bg-slate-200"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="text-[6px] text-slate-400 font-sans">{lang === 'ar' ? 'متوافق مع متطلبات هيئة الزكاة والجمارك' : 'ZATCA Phase 2 Compliant'}</div>
            </div>
          </div>
        )}

        {activeIndex === 6 && (
          <div className="flex-1 flex flex-col space-y-2.5">
            <div className="flex items-center justify-between shrink-0 bg-slate-900 p-1.5 rounded-lg border border-white/5">
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="bg-slate-950 border border-white/10 rounded-md text-[8px] text-white p-1 focus:outline-none"
              >
                <option value="riyadh">📍 {lang === 'ar' ? 'فرع الرياض' : 'Riyadh Branch'}</option>
                <option value="jeddah">📍 {lang === 'ar' ? 'فرع جدة' : 'Jeddah Branch'}</option>
              </select>
              <span className="text-[9px] text-slate-400 font-bold">{lang === 'ar' ? 'مراقبة أرباح الفروع:' : 'Branch Sales Monitor:'}</span>
            </div>

            <div className="flex-1 bg-slate-900 p-2.5 rounded-xl border border-white/5 flex flex-col space-y-2">
              <div className="flex justify-between items-end border-b border-white/5 pb-1">
                <span className="text-[8px] text-emerald-400 font-black">+18.5%</span>
                <div className="text-right">
                  <div className="text-[7px] text-slate-500">{lang === 'ar' ? 'مبيعات اليوم' : 'Today Sales'}</div>
                  <div className="font-bold text-white text-[10px] font-mono">
                    {branch === "riyadh" ? "١٢,٨٥٠ ر.س" : "٨,٤٠٠ ر.س"}
                  </div>
                </div>
              </div>

              <div className="flex-1 flex items-end justify-between gap-1.5 px-2 pt-4 h-16">
                {[30, 45, 60, 40, 75, 90, 65].map((val, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full bg-gradient-to-t from-indigo-600 to-violet-400 rounded-t-md transition-all duration-500"
                      style={{ height: `${branch === "riyadh" ? val * 0.75 : val * 0.5}px` }}
                    />
                    <span className="text-[5px] text-slate-500 font-mono">D{idx+1}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


function FeatureCard({ icon, title, desc, color, lang }: { icon: React.ReactNode, title: string, desc: string, color: string, lang: string }) {
  return (
    <div className={`bg-slate-800/40 border border-white/5 rounded-3xl p-6 hover:bg-slate-800/60 transition-colors group ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white mb-6 shadow-lg transform group-hover:scale-110 transition-transform ${lang === 'ar' ? 'mr-0 ml-auto' : 'ml-0 mr-auto'}`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}
