import React, { useState } from "react";
import { Tenant, ThemeColor } from "../types";
import { RestaurantLogo } from "./RestaurantLogo";
import { 
  Store, Check, X, Pause, Play, Trash2, Plus, Edit, Search, 
  DollarSign, ExternalLink, ShieldAlert, Award, Calendar, Phone, 
  MapPin, Globe, Grid, AlertCircle, RefreshCw
} from "lucide-react";

interface SuperAdminDashboardProps {
  tenants: Tenant[];
  onSelectView: (view: any) => void;
  onRefreshTenants: () => Promise<void>;
  onVisitTenant: (tenant: Tenant) => void;
}

export const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({ 
  tenants, 
  onSelectView, 
  onRefreshTenants,
  onVisitTenant
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);

  // Form Fields State
  const [formData, setFormData] = useState({
    nameAr: "",
    subdomain: "",
    themeColor: "emerald" as ThemeColor,
    logo: "🍽️",
    phone: "",
    address: "",
    ownerName: "",
    ownerEmail: "",
    password: "",
    slogan: "",
    status: "trial" as Tenant["status"],
    subscriptionPlan: "starter" as Tenant["subscriptionPlan"],
    subscriptionAmount: 299,
    currency: "ر.س",
  });

  // Calculate Statistics
  const stats = {
    total: tenants.length,
    pending: tenants.filter(t => t.status === "pending_approval" || t.status === "pending_payment").length,
    active: tenants.filter(t => t.status === "active").length,
    trial: tenants.filter(t => t.status === "trial").length,
    suspended: tenants.filter(t => t.status === "suspended").length,
    totalRevenue: tenants
      .filter(t => t.status === "active")
      .reduce((sum, t) => sum + (t.subscriptionAmount || 0), 0)
  };

  // Filtered tenants
  const filteredTenants = tenants.filter(t => {
    const matchesSearch = 
      t.nameAr.toLowerCase().includes(searchTerm.toLowerCase()) || 
      t.subdomain.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (t.ownerEmail && t.ownerEmail.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (t.ownerName && t.ownerName.toLowerCase().includes(searchTerm.toLowerCase()));

    if (statusFilter === "all") return matchesSearch;
    if (statusFilter === "pending") {
      return matchesSearch && (t.status === "pending_approval" || t.status === "pending_payment");
    }
    return matchesSearch && t.status === statusFilter;
  });

  const resetForm = () => {
    setFormData({
      nameAr: "",
      subdomain: "",
      themeColor: "emerald",
      logo: "🍽️",
      phone: "",
      address: "",
      ownerName: "",
      ownerEmail: "",
      password: "",
      slogan: "",
      status: "trial",
      subscriptionPlan: "starter",
      subscriptionAmount: 299,
      currency: "ر.س",
    });
  };

  // Handlers for API requests
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/tenants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "حدث خطأ أثناء إضافة المطعم");

      await onRefreshTenants();
      setShowAddModal(false);
      resetForm();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTenant) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/tenants/${selectedTenant.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "حدث خطأ أثناء تعديل المطعم");

      await onRefreshTenants();
      setShowEditModal(false);
      setSelectedTenant(null);
      resetForm();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (tenantId: string, newStatus: Tenant["status"]) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/tenants/${tenantId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      if (!res.ok) throw new Error("فشل تحديث حالة المطعم");
      await onRefreshTenants();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTenant = async (tenantId: string) => {
    if (!confirm("هل أنت متأكد من رغبتك في حذف هذا المطعم نهائياً؟ سيتم حذف جميع الفروع والقوائم والطلبات الخاصة به.")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/tenants/${tenantId}`, {
        method: "DELETE"
      });
      if (!res.ok) throw new Error("فشل حذف المطعم");
      await onRefreshTenants();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setFormData({
      nameAr: tenant.nameAr || "",
      subdomain: tenant.subdomain || "",
      themeColor: tenant.themeColor || "emerald",
      logo: tenant.logo || "🍽️",
      phone: tenant.phone || "",
      address: tenant.address || "",
      ownerName: tenant.ownerName || "",
      ownerEmail: tenant.ownerEmail || "",
      password: "", // do not populate password
      slogan: tenant.slogan || "",
      status: tenant.status || "trial",
      subscriptionPlan: tenant.subscriptionPlan || "starter",
      subscriptionAmount: tenant.subscriptionAmount || 299,
      currency: tenant.currency || "ر.س",
    });
    setShowEditModal(true);
  };

  const getStatusBadge = (status: Tenant["status"]) => {
    switch (status) {
      case "active":
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">نشط</span>;
      case "trial":
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">تجريبي</span>;
      case "suspended":
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">موقوف</span>;
      case "pending_approval":
      case "pending_payment":
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse">معلق للموافقة</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-slate-500/10 text-slate-400">غير معروف</span>;
    }
  };

  const getPlanBadge = (plan: Tenant["subscriptionPlan"]) => {
    switch (plan) {
      case "lite":
        return <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">الرقمية (Lite)</span>;
      case "starter":
        return <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-slate-800 text-slate-300 border border-slate-700">الأساسية</span>;
      case "pro":
        return <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">الاحترافية</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative overflow-hidden" dir="rtl">
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none"></div>

      {/* Navbar Header */}
      <header className="bg-slate-900/40 border-b border-slate-800/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-wide text-slate-100">ريستو كلاود (RestoCloud) <span className="text-xs font-medium text-indigo-400">سوبر أدمن</span></h1>
              <p className="text-[10px] text-slate-400">لوحة التحكم السحابية المركزية</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={async () => {
                setLoading(true);
                await onRefreshTenants();
                setLoading(false);
              }}
              className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-800/50 transition-colors text-slate-400 hover:text-slate-200"
              title="تحديث البيانات"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-indigo-400" : ""}`} />
            </button>
            <button 
              onClick={() => {
                localStorage.removeItem("isSuperAdmin");
                onSelectView("landing_page");
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 border border-slate-800 bg-slate-900/50 hover:bg-slate-800/50 transition-colors"
            >
              خروج من لوحة التحكم
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 relative z-10">
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-sm">
            <p className="text-xs font-semibold text-slate-400 mb-1">إجمالي المطاعم</p>
            <p className="text-3xl font-black text-slate-100">{stats.total}</p>
          </div>
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-sm">
            <p className="text-xs font-semibold text-slate-400 mb-1">طلبات معلقة</p>
            <p className="text-3xl font-black text-amber-400">{stats.pending}</p>
          </div>
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-sm">
            <p className="text-xs font-semibold text-slate-400 mb-1">مطاعم نشطة</p>
            <p className="text-3xl font-black text-emerald-400">{stats.active}</p>
          </div>
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-sm">
            <p className="text-xs font-semibold text-slate-400 mb-1">فترات تجريبية</p>
            <p className="text-3xl font-black text-blue-400">{stats.trial}</p>
          </div>
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 col-span-2 lg:col-span-1 backdrop-blur-sm bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border-indigo-500/20">
            <p className="text-xs font-semibold text-indigo-300 mb-1">الدخل الشهري المتوقع</p>
            <p className="text-2xl font-black text-indigo-400 flex items-center gap-1">
              <DollarSign className="w-5 h-5" />
              {stats.totalRevenue.toLocaleString()} <span className="text-[10px] font-medium text-slate-400">ر.س</span>
            </p>
          </div>
        </div>

        {/* Filter and Search Section */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-900/30 border border-slate-800/60 rounded-2xl p-4 backdrop-blur-sm">
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <button 
              onClick={() => setStatusFilter("all")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${statusFilter === "all" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/10" : "bg-slate-900/50 hover:bg-slate-800/50 text-slate-400"}`}
            >
              الكل ({stats.total})
            </button>
            <button 
              onClick={() => setStatusFilter("pending")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${statusFilter === "pending" ? "bg-amber-600 text-white shadow-lg shadow-amber-600/10" : "bg-slate-900/50 hover:bg-slate-800/50 text-slate-400"}`}
            >
              المعلقة للموافقة ({stats.pending})
            </button>
            <button 
              onClick={() => setStatusFilter("active")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${statusFilter === "active" ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/10" : "bg-slate-900/50 hover:bg-slate-800/50 text-slate-400"}`}
            >
              النشطة ({stats.active})
            </button>
            <button 
              onClick={() => setStatusFilter("trial")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${statusFilter === "trial" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/10" : "bg-slate-900/50 hover:bg-slate-800/50 text-slate-400"}`}
            >
              التجريبية ({stats.trial})
            </button>
            <button 
              onClick={() => setStatusFilter("suspended")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${statusFilter === "suspended" ? "bg-rose-600 text-white shadow-lg shadow-rose-600/10" : "bg-slate-900/50 hover:bg-slate-800/50 text-slate-400"}`}
            >
              الموقوفة ({stats.suspended})
            </button>
          </div>

          <div className="flex gap-3 w-full md:w-auto items-center">
            <div className="relative flex-1 md:w-64">
              <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-500">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="ابحث عن مطعم، مالك، إيميل..."
                className="w-full rounded-xl border border-slate-800 bg-slate-950/40 py-2 pr-9 pl-4 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              onClick={() => {
                resetForm();
                setShowAddModal(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/10 transition-colors whitespace-nowrap cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              إضافة مطعم جديد
            </button>
          </div>
        </div>

        {/* Tenant Table Grid */}
        <div className="bg-slate-900/20 border border-slate-800/80 rounded-2xl overflow-hidden backdrop-blur-sm">
          {filteredTenants.length === 0 ? (
            <div className="p-12 text-center">
              <AlertCircle className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-base font-bold text-slate-300">لا توجد نتائج مطابقة</h3>
              <p className="text-xs text-slate-500 mt-1">تأكد من كتابة الكلمة الصحيحة أو تغيير الفلتر</p>
            </div>
          ) : (
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="border-b border-slate-800/80 bg-slate-900/30 text-xs font-bold text-slate-400">
                    <th className="p-4">المطعم</th>
                    <th className="p-4">المالك</th>
                    <th className="p-4">الباقة والاشتراك</th>
                    <th className="p-4">الحالة</th>
                    <th className="p-4 text-center">الإجراءات والتحكم</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {filteredTenants.map(t => (
                    <tr key={t.id} className="hover:bg-slate-900/10 transition-colors text-xs text-slate-300">
                      {/* Brand Info */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-xl overflow-hidden shrink-0">
                            <RestaurantLogo logo={t.logo || "🍽️"} />
                          </div>
                          <div>
                            <div className="font-bold text-slate-200 text-sm flex items-center gap-1.5">
                              {t.nameAr}
                              {getPlanBadge(t.subscriptionPlan)}
                            </div>
                            <div className="text-[10px] text-slate-500 font-mono mt-0.5 flex items-center gap-1 text-left" dir="ltr">
                              <Globe className="w-3 h-3 text-slate-600" />
                              {t.subdomain}.localhost:3000
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Owner Details */}
                      <td className="p-4">
                        <div>
                          <div className="font-semibold text-slate-200">{t.ownerName || "غير محدد"}</div>
                          <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                            <span>{t.ownerEmail}</span>
                            {t.phone && (
                              <>
                                <span className="text-slate-700">•</span>
                                <span>{t.phone}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Subscription details */}
                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="font-bold text-indigo-400">
                            ${t.subscriptionAmount || 0} / سنة
                          </div>
                          {t.subscriptionDate && (
                            <div className="text-[10px] text-slate-500 flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-slate-600" />
                              تاريخ التجديد: {t.subscriptionDate}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        {getStatusBadge(t.status)}
                      </td>

                      {/* Actions */}
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          {/* Pending approvals quick actions */}
                          {(t.status === "pending_approval" || t.status === "pending_payment") && (
                            <>
                              <button
                                onClick={() => handleStatusChange(t.id, "active")}
                                className="p-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all cursor-pointer"
                                title="قبول وتفعيل المطعم"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleStatusChange(t.id, "trial")}
                                className="p-1.5 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400 hover:bg-blue-500 hover:text-white transition-all cursor-pointer"
                                title="تفعيل كنسخة تجريبية"
                              >
                                <Award className="w-4 h-4" />
                              </button>
                            </>
                          )}

                          {/* Active / Suspended toggle */}
                          {t.status === "active" && (
                            <button
                              onClick={() => handleStatusChange(t.id, "suspended")}
                              className="p-1.5 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400 hover:bg-amber-500 hover:text-white transition-all cursor-pointer"
                              title="إيقاف مؤقت للخدمة"
                            >
                              <Pause className="w-4 h-4" />
                            </button>
                          )}
                          {t.status === "suspended" && (
                            <button
                              onClick={() => handleStatusChange(t.id, "active")}
                              className="p-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all cursor-pointer"
                              title="إعادة تفعيل الخدمة"
                            >
                              <Play className="w-4 h-4" />
                            </button>
                          )}

                          {/* General Actions */}
                          <button
                            onClick={() => openEdit(t)}
                            className="p-1.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-all cursor-pointer"
                            title="تعديل الإعدادات والاشتراك"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                           <button
                            onClick={() => window.open(`${window.location.origin}/?preview_tenant=${t.id}`, "_blank")}
                            className="p-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all text-center flex items-center justify-center cursor-pointer"
                            title="زيارة لوحة مبيعات المطعم في علامة تبويب جديدة"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDeleteTenant(t.id)}
                            className="p-1.5 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-400 hover:bg-rose-500 hover:text-white transition-all cursor-pointer"
                            title="حذف نهائي"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Add Tenant Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto" dir="rtl">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative">
            <button 
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 left-4 text-slate-400 hover:text-slate-200 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-black text-slate-100 mb-6 flex items-center gap-2">
              <Store className="w-5 h-5 text-indigo-500" />
              إضافة مطعم جديد للنظام
            </h2>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">اسم المطعم باللغة العربية</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: شاورما ع الكيف"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/40 py-2.5 px-4 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                    value={formData.nameAr}
                    onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">النطاق الفرعي (Subdomain)</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-600 text-xs font-mono">
                      .localhost
                    </span>
                    <input
                      type="text"
                      required
                      placeholder="shawarma-el-keif"
                      className="w-full rounded-xl border border-slate-800 bg-slate-950/40 py-2.5 pr-4 pl-16 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all text-left"
                      dir="ltr"
                      value={formData.subdomain}
                      onChange={(e) => setFormData({ ...formData, subdomain: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">اسم المالك</label>
                  <input
                    type="text"
                    required
                    placeholder="أحمد محمد"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/40 py-2.5 px-4 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                    value={formData.ownerName}
                    onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">البريد الإلكتروني للمالك</label>
                  <input
                    type="email"
                    required
                    placeholder="owner@example.com"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/40 py-2.5 px-4 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all text-left"
                    dir="ltr"
                    value={formData.ownerEmail}
                    onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">كلمة المرور الافتراضية</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/40 py-2.5 px-4 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">رقم الهاتف</label>
                  <input
                    type="text"
                    placeholder="050XXXXXXXX"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/40 py-2.5 px-4 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all text-left"
                    dir="ltr"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">أيقونة أو شعار المطعم</label>
                  <input
                    type="text"
                    placeholder="مثال: 🍔، 🍕، 🍲"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/40 py-2.5 px-4 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all text-center"
                    value={formData.logo?.startsWith("data:") || formData.logo?.startsWith("http") ? "" : formData.logo}
                    onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">اللون الافتراضي للهوية</label>
                  <select
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 px-4 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    value={formData.themeColor}
                    onChange={(e) => setFormData({ ...formData, themeColor: e.target.value as ThemeColor })}
                  >
                    <option value="emerald">أخضر (Emerald)</option>
                    <option value="amber">برتقالي ذهبي (Amber)</option>
                    <option value="rose">وردي أحمر (Rose)</option>
                    <option value="indigo">نيلي (Indigo)</option>
                    <option value="violet">بنفسجي (Violet)</option>
                    <option value="slate">رمادي حديدي (Slate)</option>
                    <option value="cyan">سماوي (Cyan)</option>
                    <option value="orange">برتقالي (Orange)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">شعار تسويقي (Slogan)</label>
                  <input
                    type="text"
                    placeholder="نكهات لذيذة وجودة لا تضاهى"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/40 py-2.5 px-4 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                    value={formData.slogan}
                    onChange={(e) => setFormData({ ...formData, slogan: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">العنوان</label>
                  <input
                    type="text"
                    placeholder="الرياض، طريق الملك فهد"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/40 py-2.5 px-4 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">البلد والعملة الرسمية</label>
                  <select
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 px-4 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 mb-2"
                    value={
                      ["ر.س", "د.إ", "د.ك", "ر.ق", "د.ب", "ر.ع", "ج.م", "د.أ", "د.ع", "$"].includes(formData.currency)
                        ? formData.currency
                        : "custom"
                    }
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val !== "custom") {
                        setFormData({ ...formData, currency: val });
                      } else {
                        setFormData({ ...formData, currency: "" });
                      }
                    }}
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
                    <option value="custom">عملة مخصصة أخرى...</option>
                  </select>

                  {!["ر.س", "د.إ", "د.ك", "ر.ق", "د.ب", "ر.ع", "ج.م", "د.أ", "د.ع", "$"].includes(formData.currency) && (
                    <input
                      type="text"
                      placeholder="رمز العملة المخصصة (مثال: د.ت)"
                      className="w-full rounded-xl border border-slate-800 bg-slate-950/40 py-2 px-4 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-sans"
                      value={formData.currency}
                      onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-800/80 pt-4 mt-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">نوع الاشتراك</label>
                  <select
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 px-4 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    value={formData.subscriptionPlan}
                    onChange={(e) => setFormData({ ...formData, subscriptionPlan: e.target.value as Tenant["subscriptionPlan"] })}
                  >
                    <option value="lite">الرقمية (Lite)</option>
                    <option value="starter">الأساسية (Starter)</option>
                    <option value="pro">الاحترافية (Pro)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">قيمة الاشتراك السنوي ($)</label>
                  <input
                    type="number"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/40 py-2.5 px-4 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all text-left"
                    dir="ltr"
                    value={formData.subscriptionAmount}
                    onChange={(e) => setFormData({ ...formData, subscriptionAmount: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">حالة النظام للمطعم</label>
                  <select
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 px-4 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as Tenant["status"] })}
                  >
                    <option value="active">نشط (Active)</option>
                    <option value="trial">تجريبي (Trial)</option>
                    <option value="pending_approval">معلق للموافقة (Pending Approval)</option>
                    <option value="suspended">موقوف الخدمة (Suspended)</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-800 text-slate-400 hover:bg-slate-800/40 text-xs font-bold transition-all cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/10 transition-all cursor-pointer"
                >
                  {loading ? "جاري الحفظ..." : "تأكيد الإضافة"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Tenant Modal */}
      {showEditModal && selectedTenant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto" dir="rtl">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative">
            <button 
              onClick={() => setShowEditModal(false)}
              className="absolute top-4 left-4 text-slate-400 hover:text-slate-200 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-black text-slate-100 mb-6 flex items-center gap-2">
              <Edit className="w-5 h-5 text-indigo-500" />
              تعديل بيانات واشتراك: <span className="text-indigo-400 font-bold">{selectedTenant.nameAr}</span>
            </h2>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">اسم المطعم باللغة العربية</label>
                  <input
                    type="text"
                    required
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/40 py-2.5 px-4 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                    value={formData.nameAr}
                    onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">النطاق الفرعي (Subdomain)</label>
                  <input
                    type="text"
                    disabled
                    className="w-full rounded-xl border border-slate-800/80 bg-slate-950/20 py-2.5 px-4 text-xs text-slate-500 text-left font-mono cursor-not-allowed"
                    dir="ltr"
                    value={formData.subdomain}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">اسم المالك</label>
                  <input
                    type="text"
                    required
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/40 py-2.5 px-4 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                    value={formData.ownerName}
                    onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">البريد الإلكتروني للمالك</label>
                  <input
                    type="email"
                    required
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/40 py-2.5 px-4 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all text-left"
                    dir="ltr"
                    value={formData.ownerEmail}
                    onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">كلمة المرور الجديدة (اختياري)</label>
                  <input
                    type="password"
                    placeholder="اتركه فارغاً لعدم التغيير"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/40 py-2.5 px-4 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">رقم الهاتف</label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/40 py-2.5 px-4 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all text-left"
                    dir="ltr"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">أيقونة أو شعار المطعم</label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/40 py-2.5 px-4 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all text-center"
                    value={formData.logo?.startsWith("data:") || formData.logo?.startsWith("http") ? "" : formData.logo}
                    onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">اللون الافتراضي للهوية</label>
                  <select
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 px-4 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    value={formData.themeColor}
                    onChange={(e) => setFormData({ ...formData, themeColor: e.target.value as ThemeColor })}
                  >
                    <option value="emerald">أخضر (Emerald)</option>
                    <option value="amber">برتقالي ذهبي (Amber)</option>
                    <option value="rose">وردي أحمر (Rose)</option>
                    <option value="indigo">نيلي (Indigo)</option>
                    <option value="violet">بنفسجي (Violet)</option>
                    <option value="slate">رمادي حديدي (Slate)</option>
                    <option value="cyan">سماوي (Cyan)</option>
                    <option value="orange">برتقالي (Orange)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">شعار تسويقي (Slogan)</label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/40 py-2.5 px-4 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                    value={formData.slogan}
                    onChange={(e) => setFormData({ ...formData, slogan: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">العنوان</label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/40 py-2.5 px-4 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">البلد والعملة الرسمية</label>
                  <select
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 px-4 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 mb-2"
                    value={
                      ["ر.س", "د.إ", "د.ك", "ر.ق", "د.ب", "ر.ع", "ج.م", "د.أ", "د.ع", "$"].includes(formData.currency)
                        ? formData.currency
                        : "custom"
                    }
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val !== "custom") {
                        setFormData({ ...formData, currency: val });
                      } else {
                        setFormData({ ...formData, currency: "" });
                      }
                    }}
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
                    <option value="custom">عملة مخصصة أخرى...</option>
                  </select>

                  {!["ر.س", "د.إ", "د.ك", "ر.ق", "د.ب", "ر.ع", "ج.م", "د.أ", "د.ع", "$"].includes(formData.currency) && (
                    <input
                      type="text"
                      placeholder="رمز العملة المخصصة (مثال: د.ت)"
                      className="w-full rounded-xl border border-slate-800 bg-slate-950/40 py-2 px-4 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-sans"
                      value={formData.currency}
                      onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-800/80 pt-4 mt-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">نوع الاشتراك</label>
                  <select
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 px-4 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    value={formData.subscriptionPlan}
                    onChange={(e) => setFormData({ ...formData, subscriptionPlan: e.target.value as Tenant["subscriptionPlan"] })}
                  >
                    <option value="lite">الرقمية (Lite)</option>
                    <option value="starter">الأساسية (Starter)</option>
                    <option value="pro">الاحترافية (Pro)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">قيمة الاشتراك السنوي ($)</label>
                  <input
                    type="number"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/40 py-2.5 px-4 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all text-left"
                    dir="ltr"
                    value={formData.subscriptionAmount}
                    onChange={(e) => setFormData({ ...formData, subscriptionAmount: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">حالة النظام للمطعم</label>
                  <select
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 px-4 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as Tenant["status"] })}
                  >
                    <option value="active">نشط (Active)</option>
                    <option value="trial">تجريبي (Trial)</option>
                    <option value="pending_approval">معلق للموافقة (Pending Approval)</option>
                    <option value="suspended">موقوف الخدمة (Suspended)</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-800 text-slate-400 hover:bg-slate-800/40 text-xs font-bold transition-all cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/10 transition-all cursor-pointer"
                >
                  {loading ? "جاري الحفظ..." : "تأكيد التعديل"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
