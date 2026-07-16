import React from "react";
import { Tenant } from "../types";
import { getThemeClasses } from "../utils/theme";
import { RestaurantLogo } from "./RestaurantLogo";
import confetti from "canvas-confetti";
import { 
  Building2, 
  Store, 
  PlusCircle, 
  Globe, 
  CreditCard, 
  Settings, 
  Smartphone, 
  ShieldCheck, 
  Database, 
  Server, 
  Users, 
  TrendingUp, 
  CheckCircle2, 
  ArrowUpRight,
  ExternalLink,
  Sparkles,
  Clock,
  XCircle,
  AlertCircle,
  Phone,
  Mail,
  DollarSign,
  Check
} from "lucide-react";

interface SaaSPortalViewProps {
  tenants: Tenant[];
  onSelectTenant: (tenant: Tenant) => void;
  onSelectView: (view: any) => void;
  onOpenNewTenantModal: () => void;
  onUpdateTenant?: (updated: Tenant) => void;
  onDeleteTenant?: (id: string) => void;
}

export const SaaSPortalView: React.FC<SaaSPortalViewProps> = ({
  tenants,
  onSelectTenant,
  onSelectView,
  onOpenNewTenantModal,
  onUpdateTenant,
  onDeleteTenant
}) => {
  const pendingTenants = tenants.filter(t => t.status === "pending_approval" || t.status === "pending_payment");
  const activeTenants = tenants.filter(t => t.status !== "pending_approval" && t.status !== "pending_payment");

  const handleApproveTenant = async (tenant: Tenant) => {
    try {
      const res = await fetch(`/api/tenants/${tenant.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "active" })
      });
      if (res.ok) {
        const updated = await res.json();
        if (onUpdateTenant) onUpdateTenant(updated);
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      } else {
        alert("فشل في تفعيل المطعم");
      }
    } catch (e) {
      alert("خطأ في الاتصال بالسيرفر");
    }
  };

  const handleRejectTenant = async (tenant: Tenant) => {
    if (!window.confirm(`هل أنت متأكد من رفض وحذف طلب مطعم (${tenant.nameAr}) واسترجاع المبلغ؟`)) return;
    try {
      const res = await fetch(`/api/tenants/${tenant.id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        if (onDeleteTenant) onDeleteTenant(tenant.id);
      } else {
        alert("فشل في حذف المطعم");
      }
    } catch (e) {
      alert("خطأ في الاتصال بالسيرفر");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300" dir="rtl">
      
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white p-8 sm:p-10 shadow-2xl border border-slate-700">
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none translate-x-1/3 translate-y-1/3"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>نظام سحابي متعدد المستأجرين (Multi-Tenant SaaS Architecture)</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              بوابة إدارة منصة <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">ريستو كلاود (RestoCloud)</span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              تحكم كامل في جميع المطاعم المسجلة في المنصة. كل مطعم يمتلك نطاقاً فرعياً مستقلاً (Subdomain)، لوحة كاشير POS سريعة، قائمة طعام رقمية متجاوبة، وقاعدة بيانات معزولة جاهزة للتشغيل على سيرفرات VPS.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded border border-slate-700">
                <Server className="w-3.5 h-3.5 text-emerald-400" />
                Next.js & Express Engine
              </span>
              <span className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded border border-slate-700">
                <Database className="w-3.5 h-3.5 text-amber-400" />
                PostgreSQL DDL Ready
              </span>
              <span className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded border border-slate-700">
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                Subdomain Isolation
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 md:self-end shrink-0">
            <button
              onClick={onOpenNewTenantModal}
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold shadow-xl shadow-emerald-600/30 transition-all transform hover:-translate-y-0.5"
            >
              <PlusCircle className="w-5 h-5" />
              <span>إضافة مطعم جديد (SaaS Onboarding)</span>
            </button>
            <button
              onClick={() => onSelectView("postgres_export")}
              className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold transition-all"
            >
              <Database className="w-5 h-5 text-amber-400" />
              <span>تصدير سكربت PostgreSQL</span>
            </button>
          </div>
        </div>
      </div>

      {/* SaaS Live Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">المطاعم المسجلة (Tenants)</p>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">{tenants.length} <span className="text-xs font-normal text-emerald-600">+100% نشط</span></h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">إجمالي الطلبات اليوم</p>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">148 <span className="text-xs font-normal text-amber-600">طلب</span></h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">النطاقات الفرعية النشطة</p>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5" dir="ltr">*.restocloud.app</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">محرك المساعد الذكي AI</p>
            <h3 className="text-lg font-bold text-slate-900 mt-0.5 flex items-center gap-1.5 text-purple-600">
              <CheckCircle2 className="w-4 h-4" />
              <span>Gemini Pro Active</span>
            </h3>
          </div>
        </div>
      </div>

      {/* PENDING APPROVAL REQUESTS SECTION */}
      {pendingTenants.length > 0 && (
        <div className="bg-amber-50/70 dark:bg-amber-950/30 rounded-3xl p-6 sm:p-8 border-2 border-amber-300 dark:border-amber-800 space-y-6 shadow-md animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-200 dark:border-amber-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md animate-pulse shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-amber-900 dark:text-amber-200 flex items-center gap-2">
                  <span>⚡ طلبات حجز المطاعم المعلقة بانتظار موافقة الإدارة العامة</span>
                  <span className="bg-amber-500 text-white text-xs px-2.5 py-0.5 rounded-full font-bold">{pendingTenants.length}</span>
                </h2>
                <p className="text-xs text-amber-800/80 dark:text-amber-300 mt-0.5">
                  قام هؤلاء العملاء بدفع الرسوم وحجز دومين خاص لهم على المنصة. يرجى مراجعة الطلب والموافقة لتفعيل حساباتهم.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {pendingTenants.map((t) => (
              <div key={t.id} className="bg-white dark:bg-slate-900 rounded-2xl p-5 border-2 border-amber-400/80 dark:border-amber-700 shadow-sm flex flex-col justify-between gap-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-3xl shadow-xs shrink-0 overflow-hidden">
                        <RestaurantLogo logo={t.logo} />
                      </div>
                      <div>
                        <h3 className="text-base font-black text-slate-900 dark:text-white">{t.nameAr}</h3>
                        <div className="flex items-center gap-1 mt-1 text-xs text-slate-500 font-mono" dir="ltr">
                          <Globe className="w-3.5 h-3.5 text-amber-500" />
                          <span className="text-emerald-600 font-bold">{t.subdomain}</span>.restocloud.app
                        </div>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 font-bold text-[10px] rounded-full border border-amber-300 dark:border-amber-700 flex items-center gap-1">
                      <Clock className="w-3 h-3 animate-spin" />
                      <span>قيد المراجعة ⏳</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate">المالك: <strong>{t.ownerName}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-mono truncate">{t.phone}</span>
                    </div>
                    {t.ownerEmail && (
                      <div className="col-span-2 flex items-center gap-1.5 text-slate-600 dark:text-slate-300 truncate">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-mono text-[11px] truncate" dir="ltr">{t.ownerEmail}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-950/40 p-3 rounded-xl border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                    <span className="flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4 text-emerald-600" />
                      <span>الباقة: {t.subscriptionPlan === "starter" ? "المنطلق (Starter)" : "المحترف (Pro)"}</span>
                    </span>
                    <span className="text-emerald-600 text-sm font-black">${t.subscriptionAmount || 599} (سنوياً)</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => handleApproveTenant(t)}
                    className="w-full py-2.5 px-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-all transform hover:-translate-y-0.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>موافقة وتفعيل المطعم ✅</span>
                  </button>
                  <button
                    onClick={() => handleRejectTenant(t)}
                    className="w-full py-2.5 px-3 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>رفض واسترجاع المبلغ</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tenants Grid Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-indigo-600" />
              <span>المطاعم المشتركة والمفعلة في المنصة (Active Directory)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">اختر مطعماً للدخول إلى لوحة الكاشير، قائمة الطعام، أو الإدارة الخاصة به</p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 bg-slate-100 text-slate-700 rounded-lg">
            المطاعم المفعلة: {activeTenants.length}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeTenants.map((t) => {
            const theme = getThemeClasses(t.themeColor);
            return (
              <div
                key={t.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden group"
              >
                {/* Card Top Banner / Color Accent */}
                <div className={`h-3 w-full ${theme.primaryBg}`}></div>

                <div className="p-6 space-y-4 flex-1">
                  {/* Header info */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-3xl shadow-2xs transform group-hover:scale-105 transition-transform shrink-0 overflow-hidden">
                        <RestaurantLogo logo={t.logo} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                          {t.nameAr}
                        </h3>
                        <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500 font-mono" dir="ltr">
                          <Globe className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-indigo-600 font-semibold">{t.subdomain}</span>.restocloud.app
                        </div>
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>نشط</span>
                    </span>
                  </div>

                  {/* Slogan & details */}
                  <p className="text-xs text-slate-600 line-clamp-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    "{t.slogan || 'نكهات طازجة وجودة عالية كل يوم'}"
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 pt-1">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="text-slate-400">المالك:</span>
                      <span className="font-semibold text-slate-700 truncate">{t.ownerName}</span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="text-slate-400">الهاتف:</span>
                      <span className="font-mono text-slate-700">{t.phone}</span>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        onSelectTenant(t);
                        onSelectView("pos_dashboard");
                      }}
                      className={`w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white transition-all ${theme.primaryBg} ${theme.primaryHover} shadow-2xs`}
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>كاشير POS</span>
                    </button>

                    <button
                      onClick={() => {
                        onSelectTenant(t);
                        onSelectView("digital_menu");
                      }}
                      className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 transition-all shadow-2xs"
                    >
                      <Smartphone className="w-3.5 h-3.5 text-indigo-600" />
                      <span>المنيو الرقمي</span>
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      onSelectTenant(t);
                      onSelectView("admin_panel");
                    }}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 transition-colors"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>دخول لوحة إدارة المطعم (Admin Panel)</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
