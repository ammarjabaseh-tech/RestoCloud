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

interface NavbarProps {
  tenants: Tenant[];
  currentTenant: Tenant;
  onSelectTenant: (tenant: Tenant) => void;
  activeView: ActivePortalView;
  onSelectView: (view: ActivePortalView) => void;
  onOpenNewTenantModal: () => void;
  currentUser: TenantUser | null;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  tenants,
  currentTenant,
  onSelectTenant,
  activeView,
  onSelectView,
  onOpenNewTenantModal,
  currentUser,
  onLogout
}) => {
  const [showTenantDropdown, setShowTenantDropdown] = React.useState(false);
  const theme = getThemeClasses(currentTenant.themeColor);

  if (activeView === 'super_admin_dashboard') {
    return (
      <header className="bg-white text-slate-800 sticky top-0 z-40 border-b border-slate-200 shadow-sm print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2 font-bold text-lg sm:text-xl tracking-tight text-slate-900">
              <Store className="w-5 h-5 text-indigo-600" />
              لوحة تحكم السوبر أدمن
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white text-slate-800 sticky top-0 z-40 border-b border-slate-200 shadow-sm print:hidden font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-13">
          
          {/* Right Section: Brand & Tenant Switcher */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 font-bold text-base tracking-tight text-slate-900">
              <span className="bg-indigo-600 text-white font-bold px-2 py-1 rounded-lg text-xs flex items-center gap-1 shadow-sm">
                <Store className="w-3.5 h-3.5 text-white" />
                ريستو كلاود (RestoCloud)
              </span>
            </div>

            <div className="h-5 w-px bg-slate-200 mx-0.5 hidden sm:block"></div>

            {/* Current Tenant Selector */}
            <div className="relative">
              {currentUser ? (
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-semibold border border-slate-200 bg-slate-50 text-slate-800 shadow-xs">
                  <span className="w-5 h-5 flex items-center justify-center text-base overflow-hidden rounded shrink-0">
                    <RestaurantLogo logo={currentTenant.logo} />
                  </span>
                  <span className="max-w-[110px] sm:max-w-[150px] truncate font-bold">{currentTenant.nameAr}</span>
                  <span className="text-[9px] bg-white px-1.5 py-0.2 rounded text-indigo-600 font-mono border border-slate-100 shadow-3xs" dir="ltr">
                    {currentTenant.subdomain}
                  </span>
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
                    <span className="max-w-[110px] sm:max-w-[150px] truncate font-bold">{currentTenant.nameAr}</span>
                    <span className="text-[9px] bg-white px-1.5 py-0.2 rounded text-indigo-600 font-mono border border-slate-100 shadow-3xs" dir="ltr">
                      {currentTenant.subdomain}
                    </span>
                    <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${showTenantDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {showTenantDropdown && (
                    <>
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setShowTenantDropdown(false)}
                      />
                      <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-20 text-right animate-in fade-in zoom-in-95 duration-150">
                        <div className="px-3 py-2 text-xs font-bold text-slate-500 border-b border-slate-100 mb-1 flex items-center justify-between">
                          <span>المطاعم المسجلة (المستأجرون)</span>
                          <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md text-[10px] font-semibold">
                            {tenants.length} مطاعم
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
                            <span>إضافة مطعم جديد (SaaS Onboarding)</span>
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
          <nav className="flex items-center gap-1 overflow-x-auto py-1">
            {(!currentUser || currentUser.permissions.canManagePOS) && (
              <button
                onClick={() => onSelectView("pos_dashboard")}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  activeView === "pos_dashboard"
                    ? `${theme.primaryBg} text-white font-bold shadow-sm`
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>كاشير POS</span>
              </button>
            )}

            {(!currentUser || currentUser.permissions.canManageMenu) && (
              <button
                onClick={() => onSelectView("admin_panel")}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  activeView === "admin_panel"
                    ? `${theme.primaryBg} text-white font-bold shadow-sm`
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Settings className="w-3.5 h-3.5" />
                <span>لوحة الإدارة</span>
              </button>
            )}


            <button
              onClick={() => onSelectView("digital_menu")}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                activeView === "digital_menu"
                  ? `${theme.primaryBg} text-white font-bold shadow-sm`
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>المنيو الرقمي (QR)</span>
            </button>

            {(!currentUser || currentUser.permissions.canViewReports) && (
              <button
                onClick={() => onSelectView("ai_assistant")}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  activeView === "ai_assistant"
                    ? "bg-indigo-600 text-white font-bold shadow-sm"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>المساعد الذكي</span>
              </button>
            )}

            {currentUser && (
              <button
                onClick={() => onSelectView("kitchen_display")}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  activeView === "kitchen_display"
                    ? `${theme.primaryBg} text-white font-bold shadow-sm`
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <ChefHat className="w-3.5 h-3.5 text-amber-500" />
                <span>شاشة المطبخ (KDS)</span>
              </button>
            )}

            {!currentUser && (
              <>
                <button
                  onClick={() => onSelectView("tenant_login")}
                  className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-[10px] font-bold transition-all whitespace-nowrap ${
                    activeView === "tenant_login"
                      ? "bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-500/30 scale-102"
                      : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300"
                  }`}
                >
                  <span>🚀 حجز مطعم والدفع</span>
                </button>

                <button
                  onClick={() => onSelectView("saas_portal")}
                  className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-[10px] font-medium transition-all whitespace-nowrap ${
                    activeView === "saas_portal"
                      ? "bg-slate-100 text-slate-900 font-bold border border-slate-300"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                  }`}
                >
                  <Building2 className="w-3 h-3" />
                  <span>بوابة SaaS</span>
                </button>

                <button
                  onClick={() => onSelectView("saas_subscriptions")}
                  className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-[10px] font-medium transition-all whitespace-nowrap ${
                    activeView === "saas_subscriptions"
                      ? "bg-purple-100 text-purple-900 font-bold border border-purple-300"
                      : "text-purple-600 hover:bg-purple-50 hover:text-purple-800"
                  }`}
                >
                  <FileText className="w-3 h-3" />
                  <span>اشتراكات SaaS</span>
                </button>

                <button
                  onClick={() => onSelectView("postgres_export")}
                  className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-[10px] font-medium transition-all whitespace-nowrap ${
                    activeView === "postgres_export"
                      ? "bg-slate-100 text-slate-900 font-bold border border-slate-300"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                  }`}
                  title="تصدير قاعدة بيانات PostgreSQL لسيرفر VPS"
                >
                  <Database className="w-3 h-3" />
                  <span>PostgreSQL / VPS</span>
                </button>
              </>
            )}
            
            {currentUser && (
              <button
                onClick={onLogout}
                className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 hover:text-rose-700 border border-rose-200 transition-all whitespace-nowrap cursor-pointer"
                title="تسجيل خروج المستخدم الحالي"
              >
                <LogOut className="w-3 h-3" />
                <span>تسجيل الخروج</span>
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};
