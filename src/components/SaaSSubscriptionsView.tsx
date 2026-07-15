import React, { useState, useEffect } from "react";
import { Tenant, TenantSubscriptionInvoice } from "../types";
import { CreditCard, CheckCircle2, AlertTriangle, Clock, RefreshCw, Plus, FileText, ArrowUpRight, DollarSign, Shield, Check, X } from "lucide-react";

interface SaaSSubscriptionsViewProps {
  tenants: Tenant[];
  currentTenant?: Tenant;
  isSuperAdmin?: boolean;
}

export const SaaSSubscriptionsView: React.FC<SaaSSubscriptionsViewProps> = ({
  tenants,
  currentTenant,
  isSuperAdmin = true
}) => {
  const [invoices, setInvoices] = useState<TenantSubscriptionInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Filter state
  const [filterPlan, setFilterPlan] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // New Invoice / Renewal Modal
  const [showModal, setShowModal] = useState(false);
  const [selectedTenantId, setSelectedTenantId] = useState(currentTenant?.id || (tenants[0]?.id || ""));
  const [plan, setPlan] = useState<"starter" | "pro" | "enterprise">("pro");
  const [amount, setAmount] = useState<number>(399);
  const [billingPeriod, setBillingPeriod] = useState("شهري - تجديد دوري 30 يوم");

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const url = (!isSuperAdmin && currentTenant) 
        ? `/api/invoices?tenantId=${currentTenant.id}` 
        : `/api/invoices`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("فشل في جلب الفواتير والاشتراكات");
      const data = await res.json();
      setInvoices(data);
    } catch (err: any) {
      setError(err.message || "حدث خطأ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [currentTenant?.id, isSuperAdmin]);

  const handlePlanChange = (p: "starter" | "pro" | "enterprise") => {
    setPlan(p);
    if (p === "starter") setAmount(199);
    else if (p === "pro") setAmount(399);
    else if (p === "enterprise") setAmount(899);
  };

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    const targetTenant = tenants.find(t => t.id === selectedTenantId) || currentTenant;
    if (!targetTenant) {
      setError("يرجى اختيار المطعم");
      return;
    }

    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenantId: targetTenant.id,
          tenantName: targetTenant.nameAr,
          plan,
          amount,
          billingPeriod
        })
      });
      if (!res.ok) throw new Error("فشل في إصدار فاتورة الاشتراك");
      const newInv = await res.json();
      setInvoices(prev => [newInv, ...prev]);
      setShowModal(false);
      setSuccessMsg("تم إصدار فاتورة تجديد الاشتراك بنجاح ✅");
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err: any) {
      setError(err.message || "حدث خطأ");
    }
  };

  const markAsPaid = async (inv: TenantSubscriptionInvoice) => {
    try {
      const res = await fetch(`/api/invoices/${inv.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "paid" })
      });
      if (!res.ok) throw new Error("فشل تحديث الفاتورة");
      const updated = await res.json();
      setInvoices(prev => prev.map(i => i.id === updated.id ? updated : i));
      setSuccessMsg(`تم سداد الفاتورة ${inv.invoiceNumber} بنجاح وتم تفعيل اشتراك المطعم 🚀`);
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Filtered invoices
  const filteredInvoices = invoices.filter(inv => {
    if (filterPlan !== "all" && inv.plan !== filterPlan) return false;
    if (filterStatus !== "all" && inv.status !== filterStatus) return false;
    return true;
  });

  const totalCollected = invoices.filter(i => i.status === "paid").reduce((sum, i) => sum + i.amount, 0);
  const totalPending = invoices.filter(i => i.status === "pending").reduce((sum, i) => sum + i.amount, 0);

  const getPlanBadge = (p: string) => {
    switch (p) {
      case "starter":
        return <span className="px-2.5 py-1 bg-blue-100 text-blue-800 rounded-lg text-xs font-bold border border-blue-300">💡 البداية (199 ر.س)</span>;
      case "pro":
        return <span className="px-2.5 py-1 bg-purple-100 text-purple-800 rounded-lg text-xs font-bold border border-purple-300">🔥 المحترف (399 ر.س)</span>;
      case "enterprise":
        return <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-lg text-xs font-bold border border-amber-300">👑 المؤسسات (899 ر.س)</span>;
      default:
        return <span className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded-lg text-xs font-bold">{p}</span>;
    }
  };

  const getStatusBadge = (s: string) => {
    switch (s) {
      case "paid":
        return <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> مدفوعة ومفعلة</span>;
      case "pending":
        return <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-amber-600" /> بانتظار السداد</span>;
      case "overdue":
        return <span className="px-2.5 py-1 bg-rose-100 text-rose-800 rounded-full text-xs font-bold flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> متأخرة</span>;
      default:
        return <span>{s}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-tr from-purple-600 to-indigo-500 rounded-2xl flex items-center justify-center text-white shadow-md shadow-purple-500/20">
              <CreditCard className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900">إدارة اشتراكات وفواتير المطاعم</h1>
                {currentTenant && !isSuperAdmin && (
                  <span className="bg-purple-50 text-purple-700 px-2.5 py-0.5 rounded-full text-xs font-bold border border-purple-200">
                    {currentTenant.nameAr}
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-500 mt-1">
                متابعة اشتراكات الـ SaaS الشهرية والسنوية، تجديد الباقات وإصدار الفواتير التلقائية
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-bold text-sm shadow-sm transition-all transform hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4" />
            <span>إصدار فاتورة تجديد / اشتراك جديد</span>
          </button>
        </div>

        {/* Success or Error alert */}
        {successMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center gap-3 text-emerald-800 text-sm font-bold animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-300 rounded-2xl flex items-center gap-3 text-rose-800 text-sm font-bold">
            <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-2">
              <span>إجمالي الإيرادات المحصلة (Paid)</span>
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-emerald-700 flex items-baseline gap-1">
              <span>{totalCollected.toLocaleString()}</span>
              <span className="text-xs font-medium text-slate-400">ر.س</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">فواتير سددت بنجاح وتعمل حالياً</div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-2">
              <span>مبالغ بانتظار التحصيل (Pending)</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-black text-amber-600 flex items-baseline gap-1">
              <span>{totalPending.toLocaleString()}</span>
              <span className="text-xs font-medium text-slate-400">ر.س</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">مطاعم في مرحلة التجربة أو بانتظار التجديد</div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-2">
              <span>إجمالي الفواتير الصادرة</span>
              <FileText className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-2xl font-black text-slate-800">
              {invoices.length} <span className="text-xs font-normal text-slate-500">فاتورة</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">شامل الفواتير النشطة والمجددة</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-700">تصنيف حسب الباقة:</span>
            <div className="flex bg-slate-100 p-1 rounded-lg text-xs font-bold">
              <button onClick={() => setFilterPlan("all")} className={`px-3 py-1.5 rounded-md transition-all ${filterPlan === "all" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600"}`}>الكل</button>
              <button onClick={() => setFilterPlan("starter")} className={`px-3 py-1.5 rounded-md transition-all ${filterPlan === "starter" ? "bg-white text-blue-700 shadow-sm" : "text-slate-600"}`}>البداية</button>
              <button onClick={() => setFilterPlan("pro")} className={`px-3 py-1.5 rounded-md transition-all ${filterPlan === "pro" ? "bg-white text-purple-700 shadow-sm" : "text-slate-600"}`}>المحترف</button>
              <button onClick={() => setFilterPlan("enterprise")} className={`px-3 py-1.5 rounded-md transition-all ${filterPlan === "enterprise" ? "bg-white text-amber-700 shadow-sm" : "text-slate-600"}`}>المؤسسات</button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-700">حالة السداد:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-800 bg-white"
            >
              <option value="all">جميع الحالات</option>
              <option value="paid">✅ مدفوعة ومفعلة</option>
              <option value="pending">⏳ بانتظار السداد</option>
              <option value="overdue">⚠️ متأخرة</option>
            </select>
          </div>
        </div>

        {/* Invoices Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-600" />
              <span>سجل الفواتير وتجديد اشتراكات المطاعم</span>
            </h2>
            <button onClick={fetchInvoices} className="text-xs text-purple-600 font-bold flex items-center gap-1 hover:underline">
              <RefreshCw className="w-3.5 h-3.5" />
              <span>تحديث السجل</span>
            </button>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-400 font-medium">جاري تحميل اشتراكات المطاعم...</div>
          ) : filteredInvoices.length === 0 ? (
            <div className="p-12 text-center text-slate-400 font-medium">لا توجد فواتير تطابق الفلتر المحدد.</div>
          ) : (
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/80 text-xs text-slate-500 font-bold">
                    <th className="py-3.5 px-4">رقم الفاتورة</th>
                    <th className="py-3.5 px-4">المطعم المشترك</th>
                    <th className="py-3.5 px-4">الباقة المختارة</th>
                    <th className="py-3.5 px-4">فترة الاشتراك</th>
                    <th className="py-3.5 px-4">المبلغ المطلوب</th>
                    <th className="py-3.5 px-4 text-center">حالة السداد</th>
                    <th className="py-3.5 px-4 text-center">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredInvoices.map(inv => (
                    <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-4 font-mono font-bold text-slate-700">
                        {inv.invoiceNumber}
                      </td>
                      <td className="py-4 px-4 font-bold text-slate-900">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                          <span>{inv.tenantName}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        {getPlanBadge(inv.plan)}
                      </td>
                      <td className="py-4 px-4 text-xs text-slate-600">
                        <div className="font-medium">{inv.billingPeriod}</div>
                        <div className="text-slate-400 mt-0.5">تاريخ الاستحقاق: <span className="font-mono">{inv.dueDate}</span></div>
                      </td>
                      <td className="py-4 px-4 font-black text-slate-800">
                        {inv.amount.toLocaleString()} <span className="text-xs font-normal text-slate-500">ر.س</span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        {getStatusBadge(inv.status)}
                      </td>
                      <td className="py-4 px-4 text-center">
                        {inv.status === "pending" ? (
                          <button
                            onClick={() => markAsPaid(inv)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1 mx-auto"
                            title="تأكيد تحصيل المبلغ وتفعيل الاشتراك"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>تأكيد السداد</span>
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400 font-medium">مكتملت الدفع</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* New Subscription Invoice Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-scaleUp">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-5 text-white flex items-center justify-between">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                <span>إصدار فاتورة اشتراك أو تجديد باقة</span>
              </h3>
              <button onClick={() => setShowModal(false)} className="text-white/80 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="p-6 space-y-4 text-right">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">اختر المطعم (Tenant) *</label>
                <select
                  value={selectedTenantId}
                  onChange={(e) => setSelectedTenantId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-bold bg-white focus:ring-2 focus:ring-purple-500"
                >
                  {tenants.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.nameAr} ({t.subdomain})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">باقة الاشتراك *</label>
                  <select
                    value={plan}
                    onChange={(e) => handlePlanChange(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-bold bg-white focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="starter">💡 باقة البداية (Starter - 199 ر.س)</option>
                    <option value="pro">🔥 باقة المحترف (Pro - 399 ر.س)</option>
                    <option value="enterprise">👑 باقة المؤسسات (Enterprise - 899 ر.س)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">مبلغ الفاتورة (ر.س) *</label>
                  <input
                    type="number"
                    required
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-left font-mono"
                    dir="ltr"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">وصف دورة الفاتورة والتجديد *</label>
                <input
                  type="text"
                  required
                  value={billingPeriod}
                  onChange={(e) => setBillingPeriod(e.target.value)}
                  placeholder="مثال: شهري - 1 يوليو إلى 1 أغسطس 2026"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-sm font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-sm shadow-sm flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>إصدار الفاتورة الآن</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
