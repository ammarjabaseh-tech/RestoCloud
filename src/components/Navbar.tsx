import React from "react";
import { Tenant, ActivePortalView, TenantUser } from "../types";
import { getThemeClasses } from "../utils/theme";
import { RestaurantLogo } from "./RestaurantLogo";
import { 
  Building2, 
  Store, 
  Settings, 
  Smartphone, 
  Database, 
  Sparkles, 
  ChevronDown, 
  PlusCircle, 
  Globe, 
  ShieldCheck,
  CreditCard,
  Users,
  FileText,
  LogOut,
  ChefHat
} from "lucide-react";

const navTranslations = {
  ar: {
    saDashboard: "لوحة تحكم السوبر أدمن",
    pos: "كاشير POS",
    admin: "لوحة الإدارة",
    menu: "المنيو الرقمي (QR)",
    ai: "المساعد الذكي",
    kds: "شاشة المطبخ (KDS)",
    saasOnboard: "🚀 حجز مطعم والدفع",
    saasPortal: "بوابة SaaS",
    saasSubs: "اشتراكات SaaS",
    postgres: "PostgreSQL / VPS",
    logout: "تسجيل الخروج",
    registeredRestaurants: "المطاعم المسجلة (المستأجرون)",
    restaurantsCount: "مطاعم",
    addNewRestaurant: "إضافة مطعم جديد (SaaS Onboarding)"
  },
  en: {
    saDashboard: "Super Admin Dashboard",
    pos: "POS Cashier",
    admin: "Admin Dashboard",
    menu: "Digital Menu (QR)",
    ai: "AI Assistant",
    kds: "Kitchen Screen (KDS)",
    saasOnboard: "🚀 Book Restaurant & Pay",
    saasPortal: "SaaS Portal",
    saasSubs: "SaaS Subscriptions",
    postgres: "PostgreSQL / VPS",
    logout: "Log Out",
    registeredRestaurants: "Registered Restaurants (Tenants)",
    restaurantsCount: "Restaurants",
    addNewRestaurant: "Add New Restaurant (SaaS Onboarding)"
  },
  tr: {
    saDashboard: "Süper Admin Paneli",
    pos: "POS Kasa",
    admin: "Yönetim Paneli",
    menu: "Dijital Menü (QR)",
    ai: "Yapay Zeka Asistanı",
    kds: "Mutfak Ekranı (KDS)",
    saasOnboard: "🚀 Rezervasyon & Ödeme",
    saasPortal: "SaaS Portalı",
    saasSubs: "SaaS Abonelikleri",
    postgres: "PostgreSQL / VPS",
    logout: "Çıkış Yap",
    registeredRestaurants: "Kayıtlı Restoranlar (Kiracılar)",
    restaurantsCount: "Restoranlar",
    addNewRestaurant: "Yeni Restoran Ekle (SaaS Kayıt)"
  }
};

interface NavbarProps {
  tenants: Tenant[];
  currentTenant: Tenant;
  onSelectTenant: (tenant: Tenant) => void;
  activeView: ActivePortalView;
  onSelectView: (view: ActivePortalView) => void;
  onOpenNewTenantModal: () => void;
  currentUser: TenantUser | null;
  onLogout: () => void;
  lang: 'ar' | 'en' | 'tr';
  onLangChange: (lang: 'ar' | 'en' | 'tr') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  tenants,
  currentTenant,
  onSelectTenant,
  activeView,
  onSelectView,
  onOpenNewTenantModal,
  currentUser,
  onLogout,
  lang,
  onLangChange
}) => {
  const [showTenantDropdown, setShowTenantDropdown] = React.useState(false);
  const [showLangDropdown, setShowLangDropdown] = React.useState(false);
  const theme = getThemeClasses(currentTenant.themeColor);

  const getRestaurantMenuUrl = () => {
    const host = window.location.host;
    const protocol = window.location.protocol;
    
    const getBaseDomain = () => {
      const parts = host.split('.');
      if (parts.length > 2) {
        if (parts[0] !== 'www' && parts[0] !== 'sa' && parts[0] !== 'admin') {
          return parts.slice(1).join('.');
        }
      } else if (parts.length === 2 && parts[1] === 'localhost') {
        return parts[1];
      }
      return host;
    };
    
    const isIPAddress = (hostStr: string) => {
      const ip = hostStr.split(':')[0];
      return /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(ip);
    };

    if (isIPAddress(host)) {
      return `${protocol}//${host}/menu?tenant=${currentTenant.subdomain}`;
    } else {
      return `${protocol}//${currentTenant.subdomain}.${getBaseDomain()}/menu`;
    }
  };

  if (activeView === 'super_admin_dashboard') {
    return (
      <header className="bg-white text-slate-800 sticky top-0 z-40 border-b border-slate-200 shadow-sm print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2 font-bold text-lg sm:text-xl tracking-tight text-slate-900">
              <Store className="w-5 h-5 text-indigo-600" />
              {navTranslations[lang].saDashboard}
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white text-slate-800 sticky top-0 z-40 border-b border-slate-200 shadow-sm print:hidden font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 py-3 min-h-[64px]">
          
          {/* Right Section: Brand & Tenant Switcher */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg overflow-hidden border border-slate-200/80 shadow-3xs flex items-center justify-center shrink-0">
                <img src="/logo.jpg" alt="RestoCloud Logo" className="w-full h-full object-cover" />
              </div>
              <span className="font-extrabold text-sm text-slate-900">ريستو كلاود <span className="text-[10px] text-slate-400 font-normal hidden sm:inline">(RestoCloud)</span></span>
            </div>

            <div className="h-5 w-px bg-slate-200 mx-0.5 hidden sm:block"></div>

            {/* Current Tenant Selector */}
            <div className="relative">
              {currentUser ? (
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-semibold border border-slate-200 bg-slate-50 text-slate-800 shadow-xs">
                  <span className="w-5 h-5 flex items-center justify-center text-base overflow-hidden rounded shrink-0">
                    <RestaurantLogo logo={currentTenant.logo} />
                  </span>
                  <span className="max-w-[80px] sm:max-w-[150px] truncate font-bold">{currentTenant.nameAr}</span>
                  <a
                    href={getRestaurantMenuUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-1 rounded-full border border-indigo-200/50 transition-colors shadow-3xs"
                    title="فتح المنيو الرقمي للزبائن"
                  >
                    <span className="hidden md:inline">{currentTenant.subdomain}.resto-cloud.com</span>
                    <span className="hidden sm:inline md:hidden">{currentTenant.subdomain}</span>
                    <span className="sm:hidden">🔗</span>
                    <span className="hidden sm:inline text-[9px]">🔗</span>
                  </a>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => setShowTenantDropdown(!showTenantDropdown)}
                    className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-semibold transition-all duration-200 border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 shadow-xs cursor-pointer"
                  >
                    <span className="w-5 h-5 flex items-center justify-center text-base overflow-hidden rounded shrink-0">
                      <RestaurantLogo logo={currentTenant.logo} />
                    </span>
                    <span className="max-w-[80px] sm:max-w-[150px] truncate font-bold">{currentTenant.nameAr}</span>
                    <a
                      href={getRestaurantMenuUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[9px] bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded text-indigo-700 hover:text-indigo-900 font-bold font-mono border border-indigo-200 transition-all shadow-3xs flex items-center gap-0.5"
                      onClick={(e) => e.stopPropagation()} // Prevent dropdown toggle
                      title="فتح المنيو الرقمي للزبائن"
                    >
                      <span className="hidden md:inline">🔗 {currentTenant.subdomain}.resto-cloud.com</span>
                      <span className="hidden sm:inline md:hidden">🔗 {currentTenant.subdomain}</span>
                      <span className="sm:hidden">🔗</span>
                    </a>
                    <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${showTenantDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {showTenantDropdown && (
                    <>
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setShowTenantDropdown(false)}
                      />
                      <div className={`absolute mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-20 animate-in fade-in zoom-in-95 duration-150 ${lang === 'ar' ? 'right-0 text-right' : 'left-0 text-left'}`}>
                        <div className="px-3 py-2 text-xs font-bold text-slate-500 border-b border-slate-100 mb-1 flex items-center justify-between">
                          <span>{navTranslations[lang].registeredRestaurants}</span>
                          <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md text-[10px] font-semibold">
                            {tenants.length} {navTranslations[lang].restaurantsCount}
                          </span>
                        </div>

                        <div className="max-h-60 overflow-y-auto divide-y divide-slate-50">
                          {tenants.map((t) => (
                            <button
                              key={t.id}
                              onClick={() => {
                                onSelectTenant(t);
                                setShowTenantDropdown(false);
                              }}
                              className={`w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-slate-50 transition-colors ${
                                currentTenant.id === t.id ? "bg-indigo-50/70 text-indigo-700 font-bold border-r-4 border-indigo-600" : "text-slate-700 font-medium"
                              }`}
                            >
                              <div className="flex items-center gap-2 truncate">
                                <span className="w-5 h-5 flex items-center justify-center text-base overflow-hidden rounded shrink-0">
                                  <RestaurantLogo logo={t.logo} />
                                </span>
                                <span className="truncate">{t.nameAr}</span>
                              </div>
                              <span className="text-[10px] font-mono bg-slate-100 px-1 rounded text-slate-500">
                                {t.subdomain}
                              </span>
                            </button>
                          ))}
                        </div>

                        <div className="border-t border-slate-100 mt-1 pt-1 px-2">
                          <button
                            onClick={() => {
                              setShowTenantDropdown(false);
                              onOpenNewTenantModal();
                            }}
                            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors text-xs font-bold border border-indigo-200/60 cursor-pointer"
                          >
                            <PlusCircle className="w-3.5 h-3.5" />
                            <span>{navTranslations[lang].addNewRestaurant}</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Left Section: Navigation Tabs */}
          <nav className="flex items-center gap-1.5 overflow-x-auto py-1 no-scrollbar justify-center flex-wrap max-w-full lg:max-w-2xl lg:mx-auto">
            {(!currentUser || currentUser.permissions.canManagePOS) && currentTenant?.subscriptionPlan !== "lite" && (
              <button
                onClick={() => onSelectView("pos_dashboard")}
                className={`flex items-center gap-0.5 sm:gap-1 px-1.5 py-1 sm:px-2.5 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold transition-all whitespace-nowrap ${
                  activeView === "pos_dashboard"
                    ? `${theme.primaryBg} text-white font-bold shadow-sm`
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">{navTranslations[lang].pos}</span>
              </button>
            )}

            {(!currentUser || currentUser.permissions.canManageMenu) && (
              <button
                onClick={() => onSelectView("admin_panel")}
                className={`flex items-center gap-0.5 sm:gap-1 px-1.5 py-1 sm:px-2.5 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold transition-all whitespace-nowrap ${
                  activeView === "admin_panel"
                    ? `${theme.primaryBg} text-white font-bold shadow-sm`
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Settings className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">{navTranslations[lang].admin}</span>
              </button>
            )}


            <button
              onClick={() => onSelectView("digital_menu")}
              className={`flex items-center gap-0.5 sm:gap-1 px-1.5 py-1 sm:px-2.5 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold transition-all whitespace-nowrap ${
                activeView === "digital_menu"
                  ? `${theme.primaryBg} text-white font-bold shadow-sm`
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">{navTranslations[lang].menu}</span>
            </button>

            {(!currentUser || currentUser.permissions.canViewReports) && currentTenant?.subscriptionPlan !== "lite" && (
              <button
                onClick={() => onSelectView("ai_assistant")}
                className={`flex items-center gap-0.5 sm:gap-1 px-1.5 py-1 sm:px-2.5 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold transition-all whitespace-nowrap ${
                  activeView === "ai_assistant"
                    ? "bg-indigo-600 text-white font-bold shadow-sm"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden lg:inline">{navTranslations[lang].ai}</span>
              </button>
            )}

            {currentUser && currentTenant?.subscriptionPlan !== "lite" && (
              <button
                onClick={() => onSelectView("kitchen_display")}
                className={`flex items-center gap-0.5 sm:gap-1 px-1.5 py-1 sm:px-2.5 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold transition-all whitespace-nowrap ${
                  activeView === "kitchen_display"
                    ? `${theme.primaryBg} text-white font-bold shadow-sm`
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <ChefHat className="w-3.5 h-3.5 text-amber-500" />
                <span className="hidden lg:inline">{navTranslations[lang].kds}</span>
              </button>
            )}

            {!currentUser && (
              <>
                <button
                  onClick={() => onSelectView("tenant_login")}
                  className={`flex items-center gap-0.5 sm:gap-1 px-1.5 py-1 sm:px-2 sm:py-1.5 rounded-lg text-[9px] sm:text-[10px] font-bold transition-all whitespace-nowrap ${
                    activeView === "tenant_login"
                      ? "bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-500/30 scale-102"
                      : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300"
                  }`}
                >
                  <span className="hidden lg:inline">{navTranslations[lang].saasOnboard}</span>
                  <span className="sm:hidden">🚀 {lang === 'ar' ? 'حجز' : lang === 'tr' ? 'Rez.' : 'Book'}</span>
                </button>

                <button
                  onClick={() => onSelectView("saas_portal")}
                  className={`flex items-center gap-0.5 sm:gap-1 px-1.5 py-1 sm:px-2 sm:py-1.5 rounded-lg text-[9px] sm:text-[10px] font-medium transition-all whitespace-nowrap ${
                    activeView === "saas_portal"
                      ? "bg-slate-100 text-slate-900 font-bold border border-slate-300"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                  }`}
                >
                  <Building2 className="w-3 h-3" />
                  <span className="hidden lg:inline">{navTranslations[lang].saasPortal}</span>
                </button>

                <button
                  onClick={() => onSelectView("saas_subscriptions")}
                  className={`flex items-center gap-0.5 sm:gap-1 px-1.5 py-1 sm:px-2 sm:py-1.5 rounded-lg text-[9px] sm:text-[10px] font-medium transition-all whitespace-nowrap ${
                    activeView === "saas_subscriptions"
                      ? "bg-purple-100 text-purple-900 font-bold border border-purple-300"
                      : "text-purple-600 hover:bg-purple-50 hover:text-purple-800"
                  }`}
                >
                  <FileText className="w-3 h-3" />
                  <span className="hidden lg:inline">{navTranslations[lang].saasSubs}</span>
                </button>

                <button
                  onClick={() => onSelectView("postgres_export")}
                  className={`flex items-center gap-0.5 sm:gap-1 px-1.5 py-1 sm:px-2 sm:py-1.5 rounded-lg text-[9px] sm:text-[10px] font-medium transition-all whitespace-nowrap ${
                    activeView === "postgres_export"
                      ? "bg-slate-100 text-slate-900 font-bold border border-slate-300"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                  }`}
                  title="تصدير قاعدة بيانات PostgreSQL لسيرفر VPS"
                >
                  <Database className="w-3 h-3" />
                  <span className="hidden lg:inline">{navTranslations[lang].postgres}</span>
                </button>
              </>
            )}
          </nav>

          <div className="flex items-center gap-1 shrink-0">
            {/* Global Language Selector Dropdown */}
            <div className="relative shrink-0 mx-1">
              <button
                type="button"
                onClick={() => setShowLangDropdown(!showLangDropdown)}
                className="w-8 h-8 rounded-xl flex items-center justify-center border border-slate-200 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 shadow-3xs cursor-pointer"
                title={lang === 'ar' ? 'تغيير اللغة' : 'Change Language'}
              >
                <span className="text-sm leading-none shrink-0">
                  {lang === 'ar' ? '🇸🇦' : lang === 'tr' ? '🇹🇷' : '🇬🇧'}
                </span>
              </button>

              {showLangDropdown && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowLangDropdown(false)}
                  />
                  <div className={`absolute mt-2 w-36 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-20 animate-in fade-in zoom-in-95 duration-150 ${lang === 'ar' ? 'left-0 text-left' : 'right-0 text-right'}`}>
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
                      className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs transition-colors hover:bg-slate-550 cursor-pointer ${
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

            {currentUser && (
              <button
                onClick={onLogout}
                className="w-8 h-8 rounded-xl flex items-center justify-center border border-rose-200 bg-rose-50 hover:bg-rose-100 hover:text-rose-700 text-rose-600 dark:border-rose-900/40 dark:bg-rose-950/20 dark:hover:bg-rose-900/40 transition-all shadow-3xs cursor-pointer"
                title={lang === 'ar' ? 'تسجيل الخروج' : 'Log Out'}
              >
                <LogOut className="w-4 h-4 shrink-0" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
