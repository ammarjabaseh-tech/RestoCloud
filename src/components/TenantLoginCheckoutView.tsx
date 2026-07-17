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
  ArrowLeft,
  Check,
  Sparkles,
  AlertCircle,
  Building2,
  DollarSign,
  QrCode,
  Zap,
  HelpCircle,
  MapPin,
  ChevronDown
} from "lucide-react";

const checkoutTranslations = {
  ar: {
    portalBadge: "بوابة العملاء وأصحاب المطاعم (SaaS Client Portal)",
    portalTitle: "حجز مطعمك على دومينك الخاص وتفعيل الاشتراكات",
    portalDesc: "أنشئ مطعمك السحابي، اختر باقتك المفضلة، وادفع إلكترونياً بأمان عبر مدى أو فيزا. سيتم حجز دومينك الخاص (yourname.restocloud.app) ومراجعة طلبك من قبل إدارة المنصة لتفعليه فوراً.",
    btnRegisterTab: "حجز مطعم جديد والاشتراك",
    btnLoginTab: "تسجيل دخول أصحاب المطاعم",
    step1Title: "بيانات المطعم والدومين",
    step2Title: "اختيار باقة الاشتراك",
    step3Title: "الدفع الإلكتروني",
    step4Title: "تأكيد وتفعيل الحساب",
    subdomainLabel: "النطاق الفرعي المطلوب للمطعم (Subdomain) *",
    subdomainDesc: "سيكون هذا عنوان منيو زبائنك وموقع مطعمك الإلكتروني.",
    subdomainPlaceholder: "my-restaurant",
    subdomainTaken: "هذا الدومين الفرعي مستخدم بالفعل، يرجى اختيار دومين آخر",
    subdomainAvailable: "النطاق متاح للتعيين!",
    restaurantNameLabel: "اسم المطعم باللغة العربية *",
    restaurantNamePlaceholder: "شاورما المذاق الأصيل",
    phoneLabel: "رقم هاتف التواصل *",
    addressLabel: "عنوان المركز الرئيسي للمطعم *",
    addressPlaceholder: "الرياض، حي الملز، طريق صلاح الدين",
    logoLabel: "شعار المطعم (Emoji أو صورة) *",
    logoChooseFile: "أو اختر ملف شعار مخصص (PNG/JPG)",
    logoThemeColor: "لون المظهر العام (Branding Theme Color) *",
    logoCurrency: "عملة التعامل الافتراضية *",
    btnNext: "المتابعة للخطوة التالية",
    planChooseTitle: "اختر باقة الاشتراك المناسبة لمطعمك",
    planChooseDesc: "جميع الباقات تشمل تجربة مجانية لمدة 7 أيام. يمكنك الإلغاء أو الترقية في أي وقت.",
    btnPlanNext: "المتابعة لبيانات الدفع",
    btnPrev: "العودة للخطوة السابقة",
    billingTitle: "تفاصيل الفاتورة والدفع الآمن",
    billingStarter: "فاتورة حجز مطعم جديد واشتراك سحابي",
    billingPrice: "قيمة الباقة:",
    billingTax: "ضريبة القيمة المضافة (15%):",
    billingTotal: "المبلغ الإجمالي المستحق:",
    cardPaymentTitle: "الدفع الإلكتروني عبر بطاقة الائتمان أو مدى",
    cardHolderName: "اسم حامل البطاقة *",
    cardHolderPlaceholder: "أحمد بن عبد الله",
    cardNumber: "رقم البطاقة (16 رقم) *",
    cardExpiry: "تاريخ الانتهاء *",
    btnPay: "تأكيد الدفع والاشتراك الآن",
    btnPaying: "جاري معالجة الدفع بأمان...",
    successTitle: "تهانينا! تم إنشاء مطعمك بنجاح 🎉",
    successDesc: "لقد حجزنا نطاقك المخصص وجاري تشغيل سيرفر مطعمك الآن على العنوان التالي:",
    successCta: "الدخول للوحة التحكم ونقاط البيع الخاصة بمطعمك 🚀",
    loginTitle: "تسجيل الدخول للوحة تحكم مطعمك",
    loginDesc: "أدخل اسم النطاق الفرعي (Subdomain) أو البريد الإلكتروني لصاحب المطعم مع كلمة المرور للدخول.",
    loginInputLabel: "اسم الدومين الفرعي أو البريد الإلكتروني *",
    loginInputPlaceholder: "my-restaurant أو mail@domain.com",
    loginPasswordLabel: "كلمة المرور *",
    loginBtn: "دخول النظام",
    loginErr: "البريد الإلكتروني (أو النطاق) أو كلمة المرور غير صحيحة.",
    suspendedErr: "⚠️ هذا المطعم موقوف مؤقتاً من قبل الإدارة العامة. يرجى التواصل مع الدعم الفني.",
    pendingApproveTitle: "⏳ بانتظار موافقة الإدارة وتفعيل الدفع",
    pendingApproveDesc: "مطعمك مسجل بالفعل ولكن بانتظار تفعيل الدفع أو مراجعة الطلب من الإدارة. يرجى الانتظار أو مراجعة الدعم.",
    ownerNameLabel: "اسم مالك المطعم / المدير المسؤول *",
    ownerNamePlaceholder: "أحمد بن عبد الله",
    ownerEmailLabel: "البريد الإلكتروني للمالك (يستخدم لتسجيل الدخول) *",
    ownerEmailPlaceholder: "owner@restocloud.app",
    ownerPasswordLabel: "كلمة مرور المالك (لحماية حسابك) *",
    ownerPasswordPlaceholder: "أدخل كلمة مرور قوية",
    fillAllAlert: "يرجى تعبئة جميع الحقول المطلوبة للمتابعة",
    connectErr: "تعذر الاتصال بالخادم لإتمام العملية"
  },
  en: {
    portalBadge: "SaaS Client Portal",
    portalTitle: "Reserve Your Restaurant Subdomain & Activate Subscriptions",
    portalDesc: "Create your cloud restaurant, choose your plan, and pay securely via Mada or Visa. Your subdomain (yourname.restocloud.app) will be reserved and activated immediately.",
    btnRegisterTab: "Book New Restaurant & Subscribe",
    btnLoginTab: "Restaurant Owner Login",
    step1Title: "Restaurant Info & Subdomain",
    step2Title: "Select Subscription Plan",
    step3Title: "Electronic Payment",
    step4Title: "Confirm & Activate",
    subdomainLabel: "Requested Subdomain for Restaurant *",
    subdomainDesc: "This will be the web address for your customer menu and POS dashboard.",
    subdomainPlaceholder: "my-restaurant",
    subdomainTaken: "This subdomain is already taken, please choose another name",
    subdomainAvailable: "Subdomain is available for reservation!",
    restaurantNameLabel: "Restaurant Name *",
    restaurantNamePlaceholder: "Original Taste Gourmet",
    phoneLabel: "Contact Phone Number *",
    addressLabel: "Headquarters Address *",
    addressPlaceholder: "Riyadh, Al Malaz, Salah Al Din Rd",
    logoLabel: "Restaurant Logo (Emoji or Image) *",
    logoChooseFile: "Or choose a custom logo file (PNG/JPG)",
    logoThemeColor: "Branding Theme Color *",
    logoCurrency: "Default Currency *",
    btnNext: "Proceed to Next Step",
    planChooseTitle: "Choose the Perfect Plan for Your Venue",
    planChooseDesc: "All packages include a 7-day free trial. Cancel or upgrade anytime.",
    btnPlanNext: "Proceed to Payment",
    btnPrev: "Back to Previous Step",
    billingTitle: "Invoice Details & Secure Payment",
    billingStarter: "Invoice for cloud restaurant reservation and setup",
    billingPrice: "Plan price:",
    billingTax: "VAT (15%):",
    billingTotal: "Total Due:",
    cardPaymentTitle: "Pay Securely with Credit Card or Mada",
    cardHolderName: "Cardholder Name *",
    cardHolderPlaceholder: "John Doe",
    cardNumber: "Card Number (16 digits) *",
    cardExpiry: "Expiry Date *",
    btnPay: "Confirm Payment & Subscribe Now",
    btnPaying: "Processing secure payment...",
    successTitle: "Congratulations! Restaurant Setup Completed 🎉",
    successDesc: "We have reserved your domain name and your cloud restaurant is live at:",
    successCta: "Go to Control Panel & POS Dashboard 🚀",
    loginTitle: "Log In to Your Restaurant Panel",
    loginDesc: "Enter your restaurant subdomain name or owner email and password to log in.",
    loginInputLabel: "Subdomain Name or Owner Email *",
    loginInputPlaceholder: "my-restaurant or mail@domain.com",
    loginPasswordLabel: "Password *",
    loginBtn: "Enter Dashboard",
    loginErr: "Incorrect email, subdomain or password.",
    suspendedErr: "⚠️ This restaurant is suspended by the Platform Administrator. Contact support.",
    pendingApproveTitle: "⏳ Awaiting Approval & Activation",
    pendingApproveDesc: "Your restaurant is registered but awaits payment verification or management approval. Please contact support.",
    ownerNameLabel: "Restaurant Owner / Account Manager *",
    ownerNamePlaceholder: "John Doe",
    ownerEmailLabel: "Owner Email (Used for Login) *",
    ownerEmailPlaceholder: "owner@restocloud.app",
    ownerPasswordLabel: "Owner Password (To protect your account) *",
    ownerPasswordPlaceholder: "Enter a strong password",
    fillAllAlert: "Please fill out all required fields to proceed",
    connectErr: "Cannot connect to server to complete operation"
  },
  tr: {
    portalBadge: "SaaS Müşteri Paneli",
    portalTitle: "Restoranınızı Rezerv Edin & Aboneliği Etkinleştirin",
    portalDesc: "Bulut restoranınızı oluşturun, paketinizi seçin ve Mada/Visa ile güvenle ödeyin. Alt alan adınız (adiniz.restocloud.app) ayrılacak ve onay sonrası hemen kurulacaktır.",
    btnRegisterTab: "Yeni Restoran Kaydı & Ödeme",
    btnLoginTab: "Restoran Sahibi Girişi",
    step1Title: "Restoran Bilgileri & Domain",
    step2Title: "Abonelik Paketi Seçimi",
    step3Title: "Elektronik Ödeme",
    step4Title: "Doğrula & Etkinleştir",
    subdomainLabel: "Talep Edilen Restoran Alt Alan Adı (Subdomain) *",
    subdomainDesc: "Bu adres, müşterilerinizin dijital QR menüsü ve POS panel adresi olacaktır.",
    subdomainPlaceholder: "lezzet-sarayi",
    subdomainTaken: "Bu alt alan adı zaten kullanımda, lütfen başka bir isim seçin",
    subdomainAvailable: "Alan adı müsait!",
    restaurantNameLabel: "Restoran Adı *",
    restaurantNamePlaceholder: "Lezzet Sarayı Izgara",
    phoneLabel: "İletişim Telefon Numarası *",
    addressLabel: "Merkez Restoran Adresi *",
    addressPlaceholder: "İstanbul, Kadıköy, Merkez Cad.",
    logoLabel: "Restoran Logosu (Emoji veya Görsel) *",
    logoChooseFile: "Veya özel logo yükleyin (PNG/JPG)",
    logoThemeColor: "Kurumsal Tema Rengi *",
    logoCurrency: "Varsayılan Para Birimi *",
    btnNext: "Sonraki Adıma Geç",
    planChooseTitle: "Restoranınız için En Uygun Paketi Seçin",
    planChooseDesc: "Tüm paketler 7 günlük ücretsiz deneme sürümünü içerir. İstediğiniz zaman iptal edin veya yükseltin.",
    btnPlanNext: "Ödeme Bilgilerine Geç",
    btnPrev: "Önceki Adıma Dön",
    billingTitle: "Fatura Detayları & Güvenli Ödeme",
    billingStarter: "Yeni restoran bulut kurulumu ve faturalandırması",
    billingPrice: "Paket ücreti:",
    billingTax: "KDV (15%):",
    billingTotal: "Toplam Tutar:",
    cardPaymentTitle: "Kredi Kartı veya Banka Kartı ile Güvenli Ödeme",
    cardHolderName: "Kart Üzerindeki İsim *",
    cardHolderPlaceholder: "Ahmet Yılmaz",
    cardNumber: "Kart Numarası (16 Hane) *",
    cardExpiry: "Son Kullanma Tarihi *",
    btnPay: "Ödemeyi Onayla & Abone Ol",
    btnPaying: "Güvenli ödeme işleniyor...",
    successTitle: "Tebrikler! Restoran Kurulumu Tamamlandı 🎉",
    successDesc: "Özel alan adınız başarıyla ayrıldı ve restoranınız şu adreste yayında:",
    successCta: "Yönetim Paneline ve POS Kasasına Git 🚀",
    loginTitle: "Restoran Paneline Giriş Yapın",
    loginDesc: "Giriş yapmak için alt alan adınızı (subdomain) veya sahibi e-posta adresini ve şifrenizi girin.",
    loginInputLabel: "Domain Adı veya Sahibi E-postası *",
    loginInputPlaceholder: "restoran-adi veya eposta@domain.com",
    loginPasswordLabel: "Şifre *",
    loginBtn: "Sisteme Giriş Yap",
    loginErr: "E-posta, alan adı veya şifre hatalı.",
    suspendedErr: "⚠️ Bu restoran Genel Yönetim tarafından askıya alınmıştır. Lütfen destekle iletişime geçin.",
    pendingApproveTitle: "⏳ Onay ve Ödeme Etkinleştirme Bekleniyor",
    pendingApproveDesc: "Restoranınız kayıtlı ancak ödeme onayı veya yönetim onayı bekleniyor. Lütfen destekle irtibat kurun.",
    ownerNameLabel: "Restoran Sahibi / Sorumlu Yönetici *",
    ownerNamePlaceholder: "Ahmet Yılmaz",
    ownerEmailLabel: "Sahibinin E-posta Adresi (Giriş için kullanılır) *",
    ownerEmailPlaceholder: "sahip@restocloud.app",
    ownerPasswordLabel: "Yönetici Şifresi (Hesap koruması için) *",
    ownerPasswordPlaceholder: "Güçlü bir şifre girin",
    fillAllAlert: "Lütfen devam etmek için tüm zorunlu alanları doldurun",
    connectErr: "İşlemi tamamlamak için sunucuya bağlanılamadı"
  }
};

interface TenantLoginCheckoutViewProps {
  tenants: Tenant[];
  onTenantCreated: (newTenant: Tenant) => void;
  onSelectTenant: (tenant: Tenant) => void;
  onNavigateToSaaSPortal: () => void;
  lang: 'ar' | 'en' | 'tr';
  onLangChange?: (lang: 'ar' | 'en' | 'tr') => void;
}

export const TenantLoginCheckoutView: React.FC<TenantLoginCheckoutViewProps> = ({
  tenants,
  onTenantCreated,
  onSelectTenant,
  onNavigateToSaaSPortal,
  lang,
  onLangChange
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
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  
  // Plan Selection
  const [selectedPlan, setSelectedPlan] = useState<"lite" | "starter" | "pro">("pro");
  
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

  const t = checkoutTranslations[lang];

  // Subdomain Validation
  const cleanSubdomain = subdomain.toLowerCase().replace(/[^a-z0-9]/g, "");
  const isSubdomainTaken = tenants.some(tenantObj => tenantObj.subdomain.toLowerCase() === cleanSubdomain && cleanSubdomain !== "");

  const emojis = ["🍽️", "🥙", "🍔", "🍕", "☕", "🍗", "🌮", "🍣", "🥗", "🍰", "🍩", "🍜", "🦞", "🥩", "🥐", "👑", "🔥", "🌟", "🍷", "🍹", "🍦", "🧁"];
  
  const colors: { id: ThemeColor; name: string; bg: string }[] = [
    { id: "emerald", name: lang === 'ar' ? "زمردي" : lang === 'tr' ? "Zümrüt" : "Emerald", bg: "bg-emerald-600" },
    { id: "amber", name: lang === 'ar' ? "ذهبي" : lang === 'tr' ? "Altın" : "Amber", bg: "bg-amber-600" },
    { id: "rose", name: lang === 'ar' ? "وردي" : lang === 'tr' ? "Gül" : "Rose", bg: "bg-rose-600" },
    { id: "indigo", name: lang === 'ar' ? "نيلي" : lang === 'tr' ? "İndigo" : "Indigo", bg: "bg-indigo-600" },
    { id: "violet", name: lang === 'ar' ? "بنفسجي" : lang === 'tr' ? "Menekşe" : "Violet", bg: "bg-violet-600" },
    { id: "slate", name: lang === 'ar' ? "فحمي" : lang === 'tr' ? "Kömür" : "Slate", bg: "bg-slate-700" },
    { id: "cyan", name: lang === 'ar' ? "سماوي" : lang === 'tr' ? "Camgöbeği" : "Cyan", bg: "bg-cyan-600" },
    { id: "orange", name: lang === 'ar' ? "برتقالي" : lang === 'tr' ? "Turuncu" : "Orange", bg: "bg-orange-600" }
  ];

  const plans = {
    lite: {
      name: lang === 'ar' ? "باقة المنيو الرقمي (Lite Menu)" : lang === 'tr' ? "Dijital Menü Paketi (Lite)" : "Lite Menu Plan",
      price: 50,
      features: lang === 'ar' ? [
        "منيو إلكتروني رقمي متكامل مع باركود QR عام",
        "إدارة المنتجات والأقسام والأسعار بمرونة",
        "تنسيق ودعم كامل للهواتف والأجهزة",
        "رابط فرعي خاص بمطعمك (*.restocloud.app)",
        "دعم فني عبر البريد الإلكتروني"
      ] : lang === 'tr' ? [
        "Genel QR Kod Menü Standı",
        "Kategori, ürün ve fiyat yönetimi",
        "Mobil ve tablet uyumlu modern tasarım",
        "Özel alt alan adı (*.restocloud.app)",
        "E-posta ile teknik destek"
      ] : [
        "General QR code digital menu",
        "Product, categories & pricing control panel",
        "Fully mobile & tablet responsive layout",
        "Subdomain hosting (*.restocloud.app)",
        "Email customer support"
      ],
      badge: lang === 'ar' ? "مثالية لمطاعم الوجبات السريعة والبوفيهات" : lang === 'tr' ? "Hızlı servis ve büfeler için ideal" : "Ideal for fast food & quick service kiosks",
      color: "from-amber-500 to-orange-600",
      popular: false
    },
    starter: {
      name: lang === 'ar' ? "باقة المنطلق (Starter)" : lang === 'tr' ? "Başlangıç Paketi (Starter)" : "Starter Plan",
      price: 299,
      features: lang === 'ar' ? [
        "منيو إلكتروني رقمي مع باركود QR",
        "حتى 500 طلب شهرياً",
        "استضافة على نطاق فرعي (*.restocloud.app)",
        "لوحة تحكم أساسية للمنتجات والأقسام",
        "دعم فني عبر البريد الإلكتروني"
      ] : lang === 'tr' ? [
        "Dijital QR Kod Menü Standı",
        "Aylık 500 siparişe kadar",
        "Alt alan adı üzerinde barındırma (*.restocloud.app)",
        "Ürünler ve kategoriler için temel panel",
        "E-posta ile teknik destek"
      ] : [
        "Digital QR code menu with tables standee",
        "Up to 500 orders monthly",
        "Hosting on subdomain (*.restocloud.app)",
        "Basic control panel for products & categories",
        "Email customer support"
      ],
      badge: lang === 'ar' ? "مناسب للبوفيهات والكافيهات الصغيرة" : lang === 'tr' ? "Küçük kafeler ve büfeler için ideal" : "Best for small coffee spots & startups",
      color: "from-blue-500 to-cyan-600",
      popular: false
    },
    pro: {
      name: lang === 'ar' ? "باقة المحترف (Pro)" : lang === 'tr' ? "Profesyonel Paket (Pro)" : "Pro Plan",
      price: 599,
      features: lang === 'ar' ? [
        "نظام كاشير ونقطة بيع متكاملة (POS)",
        "طلبات وفواتير غير محدودة",
        "إدارة الطاولات الصالات والصيانة",
        "ستوديو طباعة باركود وستاندات الطاولات",
        "تقارير المبيعات والأرباح اليومية",
        "دعم فني سريع عبر الواتساب"
      ] : lang === 'tr' ? [
        "Gelişmiş POS Kasa Terminali",
        "Sınırsız sipariş ve faturalandırma",
        "Salon ve masa düzeni yönetimi",
        "Masa standı QR barkod tasarım stüdyosu",
        "Günlük satış ve kâr analiz raporları",
        "WhatsApp üzerinden hızlı teknik destek"
      ] : [
        "Cashier POS terminal integration",
        "Unlimited orders & invoicing",
        "Tables, halls & maintenance layout",
        "Table QR stands & barcode designer studio",
        "Daily sales & profit analytics reporting",
        "Fast WhatsApp customer support"
      ],
      badge: lang === 'ar' ? "🔥 الباقة الأكثر طلباً للمطاعم" : lang === 'tr' ? "🔥 En çok tercih edilen restoran paketi" : "🔥 Most popular for active restaurants",
      color: "from-emerald-500 to-teal-600",
      popular: true
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert(lang === 'ar' ? "حجم الصورة كبير جداً، يرجى اختيار صورة أقل من 2 ميجابايت." : "Image size too large, please select an image under 2MB.");
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
      alert(t.fillAllAlert);
      return;
    }
    if (isSubdomainTaken) {
      alert(t.subdomainTaken);
      return;
    }
    setStep(3);
  };

  const handleCompletePaymentAndSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingPayment(true);

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
            slogan: lang === 'ar' ? "مطعم مسجل حديثاً عبر بوابة الاشتراك والدفع" : "New restaurant registered via Portal",
            status: "trial", 
            ownerEmail,
            password,
            subscriptionPlan: selectedPlan,
            subscriptionAmount: selectedPlanObj.price,
            subscriptionDate: new Date().toISOString().split('T')[0],
            currency,
            bypassOTP: true
          })
        });

        if (!res.ok) {
          const err = await res.json();
          alert(err.error || (lang === 'ar' ? "حدث خطأ أثناء حجز المطعم" : "Error booking restaurant"));
          setIsProcessingPayment(false);
          return;
        }

        const newTenant = await res.json();
        setIsProcessingPayment(false);
        setCreatedTenantResult(newTenant);
        setStep(4);
        
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });

        onTenantCreated(newTenant);
      } catch (err) {
        alert(t.connectErr);
        setIsProcessingPayment(false);
      }
    }, 1800);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoggedInPendingTenant(null);

    if (!loginIdentifier || !loginPassword) {
      setLoginError(lang === 'ar' ? "يرجى إدخال البريد الإلكتروني (أو النطاق) وكلمة المرور." : "Please enter subdomain or email and password.");
      return;
    }

    const cleanId = loginIdentifier.trim().toLowerCase();
    const found = tenants.find(
      tenantObj => tenantObj.subdomain.toLowerCase() === cleanId || 
            (tenantObj.ownerEmail && tenantObj.ownerEmail.toLowerCase() === cleanId) ||
            tenantObj.ownerName.toLowerCase().includes(cleanId) ||
            tenantObj.nameAr.toLowerCase().includes(cleanId)
    );

    if (!found) {
      setLoginError(t.loginErr);
      return;
    }

    if (found.status === "pending_approval" || found.status === "pending_payment") {
      setLoggedInPendingTenant(found);
      return;
    }

    if (found.status === "suspended") {
      setLoginError(t.suspendedErr);
      return;
    }

    onSelectTenant(found);
  };

  const currentPlanObj = plans[selectedPlan];
  const vatAmount = Number((currentPlanObj.price * 0.15).toFixed(2));
  const totalWithVat = Number((currentPlanObj.price + vatAmount).toFixed(2));

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20 animate-in fade-in duration-300" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        {/* Floating Language dropdown inside checkout top left */}
        {onLangChange && (
          <div className={`absolute top-4 ${lang === 'ar' ? 'left-4' : 'right-4'} z-20`}>
            <button
              type="button"
              onClick={() => setShowLangDropdown(!showLangDropdown)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-bold transition-all border border-white/20 bg-white/5 hover:bg-white/10 text-white cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>
                {lang === 'ar' ? '🇸🇦 العربية' : lang === 'tr' ? '🇹🇷 Türkçe' : '🇬🇧 English'}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showLangDropdown && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowLangDropdown(false)}
                />
                <div className={`absolute mt-2 w-32 bg-slate-900 rounded-xl border border-white/10 py-1 z-20 text-xs ${lang === 'ar' ? 'left-0 text-right' : 'right-0 text-left'}`}>
                  <button
                    type="button"
                    onClick={() => {
                      onLangChange('ar');
                      setShowLangDropdown(false);
                    }}
                    className="w-full px-3 py-1.5 text-slate-300 hover:bg-slate-800 text-right cursor-pointer"
                  >
                    🇸🇦 العربية
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onLangChange('en');
                      setShowLangDropdown(false);
                    }}
                    className="w-full px-3 py-1.5 text-slate-300 hover:bg-slate-800 text-left cursor-pointer"
                  >
                    🇬🇧 English
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onLangChange('tr');
                      setShowLangDropdown(false);
                    }}
                    className="w-full px-3 py-1.5 text-slate-300 hover:bg-slate-800 text-left cursor-pointer"
                  >
                    🇹🇷 Türkçe
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.portalBadge}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug">
            {t.portalTitle}
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            {t.portalDesc}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0 z-10">
          <button
            onClick={() => {
              setActiveTab("register");
              setStep(1);
            }}
            className={`px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer ${
              activeTab === "register" ? "bg-emerald-500 text-white shadow-emerald-500/30 scale-105 ring-2 ring-white/20" : "bg-white/10 hover:bg-white/20 text-white"
            }`}
          >
            <Store className="w-4 h-4" />
            <span>{t.btnRegisterTab}</span>
          </button>
          <button
            onClick={() => setActiveTab("login")}
            className={`px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer ${
              activeTab === "login" ? "bg-indigo-600 text-white shadow-indigo-500/30 scale-105 ring-2 ring-white/20" : "bg-white/10 hover:bg-white/20 text-white"
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>{t.btnLoginTab}</span>
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
                  <span className="text-xs sm:text-sm">{t.step1Title}</span>
                </div>
                
                <div className={`h-1 flex-1 mx-4 rounded ${step >= 2 ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-800"}`} />

                <div className={`flex items-center gap-2.5 ${step >= 2 ? "text-emerald-600 font-bold" : "text-slate-400"}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${step >= 2 ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20" : "bg-slate-200 text-slate-600"}`}>
                    {step > 2 ? <Check className="w-4 h-4" /> : "2"}
                  </div>
                  <span className="text-xs sm:text-sm">{t.step2Title}</span>
                </div>

                <div className={`h-1 flex-1 mx-4 rounded ${step >= 3 ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-800"}`} />

                <div className={`flex items-center gap-2.5 ${step >= 3 ? "text-emerald-600 font-bold" : "text-slate-400"}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${step >= 3 ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20" : "bg-slate-200 text-slate-600"}`}>
                    3
                  </div>
                  <span className="text-xs sm:text-sm">{t.step3Title}</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 1: Restaurant Info & Owner Details */}
          {step === 1 && (
            <form onSubmit={handleProceedToPayment} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Right Side: Restaurant Brand details */}
                <div className="space-y-5">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white border-b pb-2 flex items-center gap-2">
                    <Store className="w-4 h-4 text-emerald-600" />
                    <span>{lang === 'ar' ? 'تفاصيل هوية المطعم' : 'Restaurant Brand Details'}</span>
                  </h3>
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-350 mb-1.5">{t.subdomainLabel}</label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={subdomain}
                        onChange={(e) => setSubdomain(e.target.value)}
                        placeholder={t.subdomainPlaceholder}
                        className={`w-full py-3 rounded-xl border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-mono font-bold ${lang === 'ar' ? 'pl-24 pr-4 text-left' : 'pr-24 pl-4 text-left'}`}
                      />
                      <span className={`absolute top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 font-mono ${lang === 'ar' ? 'left-4' : 'right-4'}`}>
                        .restocloud.app
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">{t.subdomainDesc}</p>
                    {cleanSubdomain && (
                      <div className="mt-1 text-xs font-bold">
                        {isSubdomainTaken ? (
                          <span className="text-rose-600">❌ {t.subdomainTaken}</span>
                        ) : (
                          <span className="text-emerald-600">✅ {t.subdomainAvailable}</span>
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-350 mb-1.5">{t.restaurantNameLabel}</label>
                    <input
                      type="text"
                      required
                      value={nameAr}
                      onChange={(e) => setNameAr(e.target.value)}
                      placeholder={t.restaurantNamePlaceholder}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-semibold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-350 mb-1.5">{t.phoneLabel}</label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="05xxxxxxx"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-bold text-left font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-350 mb-1.5">{t.logoCurrency}</label>
                      <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-bold"
                      >
                        <option value="ر.س">ر.س (SAR)</option>
                        <option value="₺">₺ (TRY)</option>
                        <option value="$">$ (USD)</option>
                        <option value="€">€ (EUR)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-350 mb-1.5">{t.addressLabel}</label>
                    <div className="relative">
                      <MapPin className={`absolute ${lang === 'ar' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400`} />
                      <input
                        type="text"
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder={t.addressPlaceholder}
                        className={`w-full py-3 rounded-xl border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-semibold ${lang === 'ar' ? 'pl-4 pr-10' : 'pr-4 pl-10'}`}
                      />
                    </div>
                  </div>
                </div>

                {/* Left Side: Owner Profile Details */}
                <div className="space-y-5">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white border-b pb-2 flex items-center gap-2">
                    <User className="w-4 h-4 text-emerald-600" />
                    <span>{lang === 'ar' ? 'بيانات مالك ومسؤول المطعم' : 'Restaurant Owner Profile'}</span>
                  </h3>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-350 mb-1.5">{t.ownerNameLabel}</label>
                    <input
                      type="text"
                      required
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      placeholder={t.ownerNamePlaceholder}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-350 mb-1.5">{t.ownerEmailLabel}</label>
                    <input
                      type="email"
                      required
                      value={ownerEmail}
                      onChange={(e) => setOwnerEmail(e.target.value)}
                      placeholder={t.ownerEmailPlaceholder}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-bold text-left font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-350 mb-1.5">{t.ownerPasswordLabel}</label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t.ownerPasswordPlaceholder}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-mono"
                    />
                  </div>

                  {/* Logo Selector */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-350 mb-1.5">{t.logoLabel}</label>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl border flex items-center justify-center text-2xl shrink-0">
                        {logo.startsWith("data:") ? (
                          <img src={logo} alt="Logo" className="w-full h-full object-cover rounded-xl" />
                        ) : (
                          logo
                        )}
                      </div>
                      
                      <div className="flex-1">
                        {/* Emojis selection banner */}
                        <div className="flex gap-1 overflow-x-auto pb-1.5 max-w-[280px] no-scrollbar">
                          {emojis.map((em) => (
                            <button
                              key={em}
                              type="button"
                              onClick={() => setLogo(em)}
                              className="text-lg p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors shrink-0"
                            >
                              {em}
                            </button>
                          ))}
                        </div>
                        
                        <label className="block text-[10px] text-slate-500 hover:text-emerald-600 font-bold cursor-pointer">
                          <span>{t.logoChooseFile}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Branding Color selector */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-350 mb-1.5">{t.logoThemeColor}</label>
                    <div className="flex items-center gap-2 flex-wrap">
                      {colors.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => setThemeColor(c.id)}
                          className={`w-6 h-6 rounded-full ${c.bg} hover:scale-110 transition-transform relative`}
                          title={c.name}
                        >
                          {themeColor === c.id && (
                            <Check className="w-3.5 h-3.5 text-white absolute inset-0 m-auto" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t flex justify-end">
                <button
                  type="submit"
                  className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-xl hover:shadow-lg hover:shadow-emerald-500/20 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>{t.btnNext}</span>
                  {lang === 'ar' ? <ArrowLeft className="w-4.5 h-4.5" /> : <ArrowRight className="w-4.5 h-4.5" />}
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Subscription Plans Selector */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center max-w-xl mx-auto space-y-2">
                <h3 className="text-lg font-black text-slate-900 dark:text-white">{t.planChooseTitle}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{t.planChooseDesc}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(Object.keys(plans) as Array<"lite" | "starter" | "pro">).map((planKey) => {
                  const p = plans[planKey];
                  const isSelected = selectedPlan === planKey;
                  return (
                    <div
                      key={planKey}
                      onClick={() => setSelectedPlan(planKey)}
                      className={`relative bg-slate-50 dark:bg-slate-950/40 rounded-3xl p-6 border-2 transition-all cursor-pointer flex flex-col ${
                        isSelected
                          ? "border-emerald-500 bg-white dark:bg-slate-900 shadow-lg ring-2 ring-emerald-500/20"
                          : "border-slate-200 dark:border-slate-800 hover:border-slate-400"
                      }`}
                    >
                      {p.popular && (
                        <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[10px] font-black px-3.5 py-1 rounded-full shadow-md whitespace-nowrap">
                          {p.badge}
                        </div>
                      )}
                      
                      <div className="mb-4">
                        <span className="text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-350 px-2 py-0.5 rounded font-black uppercase">
                          {planKey}
                        </span>
                        <h4 className="text-base font-black text-slate-950 dark:text-white mt-2">{p.name}</h4>
                        <p className="text-[10px] text-slate-400 mt-1">{!p.popular ? p.badge : ""}</p>
                      </div>

                      <div className="mb-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                        <span className="text-3xl font-black text-slate-950 dark:text-white">${p.price}</span>
                        <span className="text-xs text-slate-400"> / {lang === 'ar' ? 'سنوياً' : lang === 'tr' ? 'yıllık' : 'year'}</span>
                      </div>

                      <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 font-medium mb-6 flex-1">
                        {p.features.map((feat, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                        <span className="text-xs font-bold text-slate-400">
                          {isSelected ? (lang === 'ar' ? 'تم اختيار الباقة' : 'Selected') : (lang === 'ar' ? 'اضغط لاختيار الباقة' : 'Click to select')}
                        </span>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isSelected ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-300"}`}>
                          {isSelected && <Check className="w-3 h-3 text-white" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-6 border-t flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-6 py-3 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  {t.btnPrev}
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-xl hover:shadow-lg hover:shadow-emerald-500/20 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>{t.btnPlanNext}</span>
                  {lang === 'ar' ? <ArrowLeft className="w-4.5 h-4.5" /> : <ArrowRight className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Invoice Summary & Payment processing */}
          {step === 3 && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              
              {/* Left Column: Bill details */}
              <div className="md:col-span-5 bg-slate-50 dark:bg-slate-950/40 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-6">
                <div className="space-y-1">
                  <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-indigo-600" />
                    <span>{t.billingTitle}</span>
                  </h3>
                  <p className="text-xs text-slate-400">{t.billingStarter}</p>
                </div>

                <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-150 dark:border-slate-850 space-y-2">
                  <div className="text-xs font-bold text-slate-800 dark:text-white">{nameAr}</div>
                  <div className="text-[10px] text-slate-400 font-mono">{cleanSubdomain}.restocloud.app</div>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
                    <span>{t.billingPrice}</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">${currentPlanObj.price}</span>
                  </div>
                  <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
                    <span>{t.billingTax}</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">${vatAmount}</span>
                  </div>
                  
                  <div className="h-px bg-slate-200 dark:bg-slate-800 my-2" />
                  
                  <div className="flex justify-between text-sm font-black text-slate-900 dark:text-white">
                    <span>{t.billingTotal}</span>
                    <span className="font-mono text-emerald-600 text-base">${totalWithVat}</span>
                  </div>
                </div>

                <div className="rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 p-4 flex gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0" />
                  <p className="text-[10px] text-amber-800 dark:text-amber-300 leading-relaxed font-semibold">
                    {lang === 'ar' ? '🔒 هذا الدفع آمن كلياً ومشفر 256-بت. لا يتم حفظ بيانات بطاقتك أبداً على سيرفراتنا ويتم معالجتها مباشرة عبر وسيط دفع محلي معتمد.' : '🔒 Payments are 256-bit encrypted and processed directly via accredited regional gateways.'}
                  </p>
                </div>
              </div>

              {/* Right Column: Cards info */}
              <form onSubmit={handleCompletePaymentAndSubscribe} className="md:col-span-7 space-y-5">
                <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2 border-b pb-2">
                  <CreditCard className="w-5 h-5 text-emerald-600" />
                  <span>{t.cardPaymentTitle}</span>
                </h3>

                {/* Gateway buttons */}
                <div className="grid grid-cols-4 gap-3">
                  {(["mada", "visa", "apple", "stc"] as const).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`py-3.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        paymentMethod === method
                          ? "border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/20 shadow-2xs"
                          : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-950"
                      }`}
                    >
                      <span className="text-base">
                        {method === "mada" ? "💳 Mada" : method === "visa" ? "💳 Visa" : method === "apple" ? "🍎 Apple" : "📱 STC"}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-350 mb-1.5">{t.cardHolderName}</label>
                    <input
                      type="text"
                      required
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder={t.cardHolderPlaceholder}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-350 mb-1.5">{t.cardNumber}</label>
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold font-mono tracking-wider text-left"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-350 mb-1.5">{t.cardExpiry}</label>
                      <input
                        type="text"
                        required
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-center font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-350 mb-1.5">CVV *</label>
                      <input
                        type="password"
                        required
                        maxLength={3}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="•••"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-center font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t flex justify-between items-center gap-4">
                  <button
                    type="button"
                    disabled={isProcessingPayment}
                    onClick={() => setStep(2)}
                    className="px-6 py-3 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs rounded-xl transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {t.btnPrev}
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessingPayment}
                    className="flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-xl hover:shadow-lg hover:shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    {isProcessingPayment ? (
                      <>
                        <Clock className="w-4 h-4 animate-spin" />
                        <span>{t.btnPaying}</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>{t.btnPay}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 4: Success confirmation screen */}
          {step === 4 && createdTenantResult && (
            <div className="text-center max-w-xl mx-auto space-y-6 py-12 animate-in zoom-in-95 duration-300">
              <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto text-4xl shadow-xl shadow-emerald-500/10">
                🎉
              </div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">{t.successTitle}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {t.successDesc}
                </p>
              </div>

              <div className="p-5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 text-center font-mono">
                <a
                  href={`http://${createdTenantResult.subdomain}.resto-cloud.com`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
                >
                  🔗 {createdTenantResult.subdomain}.resto-cloud.com
                </a>
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => onSelectTenant(createdTenantResult)}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{t.successCta}</span>
                  {lang === 'ar' ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: RESTAURANT OWNER LOGIN */}
      {activeTab === "login" && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg p-6 sm:p-8 max-w-xl mx-auto space-y-6">
          
          <div className="space-y-1">
            <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-indigo-600" />
              <span>{t.loginTitle}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t.loginDesc}
            </p>
          </div>

          {loginError && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-150 text-rose-600 text-xs font-bold text-center">
              {loginError}
            </div>
          )}

          {loggedInPendingTenant ? (
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-2xl p-6 text-center space-y-4">
              <Clock className="w-12 h-12 text-amber-600 mx-auto animate-pulse" />
              <h4 className="font-black text-amber-800 dark:text-amber-300">{t.pendingApproveTitle}</h4>
              <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed font-semibold">
                {t.pendingApproveDesc}
                <br />
                <span className="font-bold font-mono">({loggedInPendingTenant.subdomain}.resto-cloud.com)</span>
              </p>
              <button
                type="button"
                onClick={() => setLoggedInPendingTenant(null)}
                className="px-4 py-2 bg-white dark:bg-slate-900 border text-xs font-bold rounded-lg cursor-pointer"
              >
                {lang === 'ar' ? 'العودة للمحاولة مجدداً' : 'Try Again'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-350 mb-1.5">{t.loginInputLabel}</label>
                <div className="relative">
                  <Mail className={`absolute ${lang === 'ar' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400`} />
                  <input
                    type="text"
                    required
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder={t.loginInputPlaceholder}
                    className={`w-full py-3 rounded-xl border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold ${lang === 'ar' ? 'pl-4 pr-10 text-right' : 'pr-4 pl-10 text-left'}`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-350 mb-1.5">{t.loginPasswordLabel}</label>
                <div className="relative">
                  <Key className={`absolute ${lang === 'ar' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400`} />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full py-3 rounded-xl border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono ${lang === 'ar' ? 'pl-4 pr-10' : 'pr-4 pl-10'}`}
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm rounded-xl shadow-md hover:shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{t.loginBtn}</span>
                  {lang === 'ar' ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
