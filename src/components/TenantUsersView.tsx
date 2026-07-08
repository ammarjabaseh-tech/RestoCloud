import React, { useState, useEffect } from "react";
import { Tenant, TenantUser, UserRole } from "../types";
import { Users, UserPlus, Shield, Check, X, Key, Phone, Mail, Award, Trash2, Edit, AlertCircle, CheckCircle2 } from "lucide-react";

interface TenantUsersViewProps {
  currentTenant: Tenant;
}

export const TenantUsersView: React.FC<TenantUsersViewProps> = ({ currentTenant }) => {
  const [users, setUsers] = useState<TenantUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // New user form state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<TenantUser | null>(null);
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("123456");
  const [role, setRole] = useState<UserRole>("cashier");
  
  const [permissions, setPermissions] = useState({
    canManagePOS: true,
    canManageMenu: false,
    canManageUsers: false,
    canViewReports: false,
    canManageSettings: false
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/tenants/${currentTenant.id}/users`);
      if (!res.ok) throw new Error("فشل في جلب قائمة الموظفين");
      const data = await res.json();
      setUsers(data);
    } catch (err: any) {
      setError(err.message || "حدث خطأ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentTenant.id]);

  // Handle role change to auto-set default permissions
  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    if (newRole === "owner") {
      setPermissions({
        canManagePOS: true,
        canManageMenu: true,
        canManageUsers: true,
        canViewReports: true,
        canManageSettings: true
      });
    } else if (newRole === "manager") {
      setPermissions({
        canManagePOS: true,
        canManageMenu: true,
        canManageUsers: false,
        canViewReports: true,
        canManageSettings: false
      });
    } else if (newRole === "cashier") {
      setPermissions({
        canManagePOS: true,
        canManageMenu: false,
        canManageUsers: false,
        canViewReports: false,
        canManageSettings: false
      });
    } else if (newRole === "waiter") {
      setPermissions({
        canManagePOS: true,
        canManageMenu: false,
        canManageUsers: false,
        canViewReports: false,
        canManageSettings: false
      });
    } else if (newRole === "worker") {
      setPermissions({
        canManagePOS: false,
        canManageMenu: false,
        canManageUsers: false,
        canViewReports: false,
        canManageSettings: false
      });
    }
  };

  const openAddModal = () => {
    setEditingUser(null);
    setName("");
    setEmail(`user@${currentTenant.subdomain}.com`);
    setPhone("05");
    setPassword("123456");
    handleRoleChange("cashier");
    setShowAddModal(true);
  };

  const openEditModal = (u: TenantUser) => {
    setEditingUser(u);
    setName(u.name);
    setEmail(u.email);
    setPhone(u.phone || "");
    setPassword(u.password || "");
    setRole(u.role);
    setPermissions({ ...u.permissions });
    setShowAddModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    try {
      if (editingUser) {
        // Update user
        const res = await fetch(`/api/users/${editingUser.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email,
            phone,
            password,
            role,
            permissions
          })
        });
        if (!res.ok) throw new Error("فشل في تعديل بيانات الموظف");
        const updated = await res.json();
        setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
        setSuccessMsg("تم تحديث بيانات الموظف والصلاحيات بنجاح ✅");
      } else {
        // Create user
        const avatar = role === "owner" ? "👨‍🍳" : role === "manager" ? "👔" : role === "cashier" ? "🖥️" : "🍽️";
        const res = await fetch(`/api/tenants/${currentTenant.id}/users`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email,
            phone,
            password,
            role,
            permissions,
            avatar
          })
        });
        if (!res.ok) throw new Error("فشل في إضافة الموظف");
        const newU = await res.json();
        setUsers(prev => [...prev, newU]);
        setSuccessMsg("تمت إضافة الموظف بنجاح ✅");
      }
      setShowAddModal(false);
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err: any) {
      setError(err.message || "حدث خطأ");
    }
  };

  const handleDeleteUser = async (u: TenantUser) => {
    if (!confirm(`هل أنت متأكد من حذف الموظف "${u.name}"؟`)) return;
    try {
      const res = await fetch(`/api/users/${u.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("فشل في حذف الموظف");
      setUsers(prev => prev.filter(item => item.id !== u.id));
      setSuccessMsg("تم حذف الموظف بنجاح 🗑️");
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const toggleStatus = async (u: TenantUser) => {
    const newStatus = u.status === "active" ? "inactive" : "active";
    try {
      const res = await fetch(`/api/users/${u.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        const updated = await res.json();
        setUsers(prev => prev.map(item => item.id === updated.id ? updated : item));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getRoleBadge = (r: UserRole) => {
    switch (r) {
      case "owner":
        return <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-lg text-xs font-bold border border-amber-300 flex items-center gap-1"><Award className="w-3.5 h-3.5" /> صاحب مطعم (Owner)</span>;
      case "manager":
        return <span className="px-2.5 py-1 bg-purple-100 text-purple-800 rounded-lg text-xs font-bold border border-purple-300 flex items-center gap-1"><Shield className="w-3.5 h-3.5" /> مدير فرع (Manager)</span>;
      case "cashier":
        return <span className="px-2.5 py-1 bg-blue-100 text-blue-800 rounded-lg text-xs font-bold border border-blue-300 flex items-center gap-1"><Users className="w-3.5 h-3.5" /> كاشير (Cashier)</span>;
      case "waiter":
        return <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold border border-emerald-300 flex items-center gap-1"><Users className="w-3.5 h-3.5" /> ويتر / مقدم طعام (Waiter)</span>;
      case "worker":
        return <span className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded-lg text-xs font-bold border border-slate-300 flex items-center gap-1"><Users className="w-3.5 h-3.5" /> عامل / موظف (Worker)</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-tr from-emerald-600 to-teal-500 rounded-2xl flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <Users className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900">إدارة موظفين وصلاحيات المطعم</h1>
                <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full text-xs font-bold border border-slate-200">
                  {currentTenant.nameAr}
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-1">
                إضافة المستخدمين (صاحب مطعم، مدير، كاشير، ويتر) وتخصيص صلاحيات شاشة البيع والإعدادات بدقة
              </p>
            </div>
          </div>

          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-bold text-sm shadow-sm transition-all transform hover:-translate-y-0.5"
          >
            <UserPlus className="w-4 h-4" />
            <span>إضافة موظف جديد</span>
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
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Roles overview cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm flex items-center gap-3">
            <div className="w-11 h-11 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center text-xl">👨‍🍳</div>
            <div>
              <div className="text-xs text-slate-400 font-bold">أصحاب المطعم</div>
              <div className="text-lg font-black text-slate-800">
                {users.filter(u => u.role === "owner").length} مستخدم
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm flex items-center gap-3">
            <div className="w-11 h-11 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center text-xl">👔</div>
            <div>
              <div className="text-xs text-slate-400 font-bold">مدراء الفروع</div>
              <div className="text-lg font-black text-slate-800">
                {users.filter(u => u.role === "manager").length} مستخدم
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm flex items-center gap-3">
            <div className="w-11 h-11 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-xl">🖥️</div>
            <div>
              <div className="text-xs text-slate-400 font-bold">الكاشير ومحاسبو POS</div>
              <div className="text-lg font-black text-slate-800">
                {users.filter(u => u.role === "cashier").length} مستخدم
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm flex items-center gap-3">
            <div className="w-11 h-11 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center text-xl">🍽️</div>
            <div>
              <div className="text-xs text-slate-400 font-bold">الويتر ومقدمو الطعام</div>
              <div className="text-lg font-black text-slate-800">
                {users.filter(u => u.role === "waiter").length} مستخدم
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-600" />
              <span>قائمة الموظفين والصلاحيات المخصصة</span>
            </h2>
            <span className="text-xs text-slate-400 font-medium">إجمالي: {users.length} موظف</span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-400 font-medium">جاري تحميل الموظفين...</div>
          ) : users.length === 0 ? (
            <div className="p-12 text-center text-slate-400 font-medium">لا يوجد موظفون مسجلون حالياً لهذا المطعم.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/80 text-xs text-slate-500 font-bold">
                    <th className="py-3.5 px-4">الموظف</th>
                    <th className="py-3.5 px-4">الدور الوظيفي</th>
                    <th className="py-3.5 px-4">بيانات الاتصال والدخول</th>
                    <th className="py-3.5 px-4">الصلاحيات المتاحة</th>
                    <th className="py-3.5 px-4 text-center">الحالة</th>
                    <th className="py-3.5 px-4 text-center">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-4 font-bold text-slate-800">
                        <div className="flex items-center gap-3">
                          <span className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xl shadow-inner">
                            {u.avatar || "👤"}
                          </span>
                          <div>
                            <div className="text-slate-900">{u.name}</div>
                            <div className="text-xs font-normal text-slate-400">ID: {u.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        {getRoleBadge(u.role)}
                      </td>
                      <td className="py-4 px-4 text-xs text-slate-600 space-y-1">
                        <div className="flex items-center gap-1 text-slate-700 font-medium">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <span>{u.email}</span>
                        </div>
                        {u.phone && (
                          <div className="flex items-center gap-1 text-slate-500">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            <span dir="ltr">{u.phone}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1 text-slate-400">
                          <Key className="w-3.5 h-3.5 text-slate-400" />
                          <span>كلمة المرور: ****{u.password ? u.password.slice(-2) : "**"}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex flex-wrap gap-1.5 max-w-xs">
                          {u.permissions.canManagePOS && (
                            <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-[11px] font-bold border border-emerald-200">
                              💻 شاشة الكاشير
                            </span>
                          )}
                          {u.permissions.canManageMenu && (
                            <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded text-[11px] font-bold border border-amber-200">
                              🍴 المنيو والطاولات
                            </span>
                          )}
                          {u.permissions.canViewReports && (
                            <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[11px] font-bold border border-blue-200">
                              📊 التقارير والذكاء الاصطناعي
                            </span>
                          )}
                          {u.permissions.canManageUsers && (
                            <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded text-[11px] font-bold border border-purple-200">
                              👥 إدارة الموظفين
                            </span>
                          )}
                          {u.permissions.canManageSettings && (
                            <span className="bg-rose-50 text-rose-700 px-2 py-0.5 rounded text-[11px] font-bold border border-rose-200">
                              ⚙️ إعدادات المطعم
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => toggleStatus(u)}
                          className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                            u.status === "active"
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200"
                              : "bg-rose-100 text-rose-800 border border-rose-300 hover:bg-rose-200"
                          }`}
                          title="انقر لتغيير حالة الحساب"
                        >
                          {u.status === "active" ? "● نشط" : "● موقوف"}
                        </button>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openEditModal(u)}
                            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                            title="تعديل الموظف والصلاحيات"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          {u.role !== "owner" && (
                            <button
                              onClick={() => handleDeleteUser(u)}
                              className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors"
                              title="حذف الموظف"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* Add / Edit User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-scaleUp">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-5 text-white flex items-center justify-between">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <UserPlus className="w-5 h-5" />
                <span>{editingUser ? "تعديل صلاحيات وبيانات الموظف" : "إضافة موظف جديد للمطعم"}</span>
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-white/80 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-right">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">اسم الموظف الكامل *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="مثال: أحمد الغامدي"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">الدور الوظيفي (Role) *</label>
                  <select
                    value={role}
                    onChange={(e) => handleRoleChange(e.target.value as UserRole)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-bold bg-white"
                  >
                    <option value="cashier">🖥️ كاشير / محاسب (Cashier)</option>
                    <option value="waiter">🍽️ ويتر / مقدم طعام (Waiter)</option>
                    <option value="manager">👔 مدير فرع (Manager)</option>
                    <option value="owner">👨‍🍳 صاحب مطعم (Owner)</option>
                    <option value="worker">👷 عامل / موظف (Worker)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">البريد الإلكتروني (للتسجيل والدخول) *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm text-left font-mono"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">رقم الجوال (اختياري)</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0500000000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm text-left font-mono"
                    dir="ltr"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">كلمة المرور (لتسجيل دخول POS) *</label>
                <input
                  type="text"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm text-left font-mono"
                  dir="ltr"
                />
              </div>

              {/* Permissions Checkboxes */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mt-4 space-y-3">
                <div className="text-xs font-bold text-slate-800 border-b border-slate-200 pb-2 flex items-center justify-between">
                  <span>صلاحيات النظام للمستخدم (Permissions):</span>
                  <span className="text-[11px] text-slate-400">يمكن تخصيص الصلاحيات بغض النظر عن الدور</span>
                </div>

                <div className="space-y-2.5 text-sm">
                  <label className="flex items-center gap-3 cursor-pointer hover:bg-slate-100 p-1.5 rounded-lg transition-colors">
                    <input
                      type="checkbox"
                      checked={permissions.canManagePOS}
                      onChange={(e) => setPermissions(prev => ({ ...prev, canManagePOS: e.target.checked }))}
                      className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                    />
                    <span className="font-bold text-slate-800">صلاحية شاشة الكاشير وإصدار الفواتير (POS)</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer hover:bg-slate-100 p-1.5 rounded-lg transition-colors">
                    <input
                      type="checkbox"
                      checked={permissions.canManageMenu}
                      onChange={(e) => setPermissions(prev => ({ ...prev, canManageMenu: e.target.checked }))}
                      className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                    />
                    <span className="font-bold text-slate-800">صلاحية إدارة المنيو والأصناف وأسعار الطاولات</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer hover:bg-slate-100 p-1.5 rounded-lg transition-colors">
                    <input
                      type="checkbox"
                      checked={permissions.canViewReports}
                      onChange={(e) => setPermissions(prev => ({ ...prev, canViewReports: e.target.checked }))}
                      className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                    />
                    <span className="font-bold text-slate-800">صلاحية مشاهدة التقارير المالية ومستشار الذكاء الاصطناعي</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer hover:bg-slate-100 p-1.5 rounded-lg transition-colors">
                    <input
                      type="checkbox"
                      checked={permissions.canManageUsers}
                      onChange={(e) => setPermissions(prev => ({ ...prev, canManageUsers: e.target.checked }))}
                      className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                    />
                    <span className="font-bold text-slate-800">صلاحية إدارة الموظفين وصلاحياتهم</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer hover:bg-slate-100 p-1.5 rounded-lg transition-colors">
                    <input
                      type="checkbox"
                      checked={permissions.canManageSettings}
                      onChange={(e) => setPermissions(prev => ({ ...prev, canManageSettings: e.target.checked }))}
                      className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                    />
                    <span className="font-bold text-slate-800">صلاحية تعديل إعدادات المطعم وتجديد الاشتراك</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-sm font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm shadow-sm flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingUser ? "حفظ التعديلات" : "إضافة الموظف الآن"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
