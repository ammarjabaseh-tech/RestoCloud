import React, { useState, useEffect } from "react";
import { Tenant, TenantUser, UserRole } from "../types";
import { Users, UserPlus, Shield, Check, X, Key, Phone, Mail, Award, Trash2, Edit, AlertCircle, CheckCircle2 } from "lucide-react";

interface TenantUsersViewProps {
  currentTenant: Tenant;
  lang?: 'ar' | 'en' | 'tr';
}

const usersTranslations = {
  ar: {
    panelTitle: "إدارة موظفين وصلاحيات المطعم",
    panelSubtitle: "إضافة المستخدمين (صاحب مطعم، مدير، كاشير، ويتر) وتخصيص صلاحيات شاشة البيع والإعدادات بدقة",
    addBtn: "إضافة موظف جديد",
    owners: "أصحاب المطعم",
    managers: "مدراء الفروع",
    cashiers: "الكاشير ومحاسبو POS",
    waiters: "الويتر ومقدمو الطعام",
    listTitle: "قائمة الموظفين والصلاحيات المخصصة",
    listSubtitle: "قائمة الموظفين والصلاحيات المخصصة",
    totalCount: "إجمالي:",
    usersUnit: "مستخدم",
    userLabel: "موظف",
    loading: "جاري تحميل الموظفين...",
    empty: "لا يوجد موظفون مسجلون حالياً لهذا المطعم.",
    thEmployee: "الموظف",
    thRole: "الدور الوظيفي",
    thContacts: "بيانات الاتصال والدخول",
    thPermissions: "الصلاحيات المتاحة",
    thStatus: "الحالة",
    thActions: "الإجراءات",
    activeStatus: "نشط",
    suspendedStatus: "موقوف",
    passwordLabel: "كلمة المرور:",
    permPOS: "🖥️ شاشة الكاشير",
    permMenu: "🍴 المنيو والطاولات",
    permReports: "📊 التقارير والذكاء الاصطناعي",
    permUsers: "👥 إدارة الموظفين",
    permSettings: "⚙️ إعدادات المطعم",
    modalAddTitle: "إضافة موظف جديد للمطعم",
    modalEditTitle: "تعديل صلاحيات وبيانات الموظف",
    inputName: "اسم الموظف الكامل *",
    inputNamePlaceholder: "مثال: أحمد الغامدي",
    inputRole: "الدور الوظيفي (Role) *",
    inputEmail: "البريد الإلكتروني (للتسجيل والدخول) *",
    inputPhone: "رقم الجوال (اختياري)",
    inputPassword: "كلمة المرور (لتسجيل دخول POS) *",
    permHeading: "صلاحيات النظام للمستخدم (Permissions):",
    permSubheading: "يمكن تخصيص الصلاحيات بغض النظر عن الدور",
    permPOSDesc: "صلاحية شاشة الكاشير وإصدار الفواتير (POS)",
    permMenuDesc: "صلاحية إدارة المنيو والأصناف وأسعار الطاولات",
    permReportsDesc: "صلاحية مشاهدة التقارير المالية ومستشار الذكاء الاصطناعي",
    permUsersDesc: "صلاحية إدارة الموظفين وصلاحياتهم",
    permSettingsDesc: "صلاحية تعديل إعدادات المطعم وتجديد الاشتراك",
    cancel: "إلغاء",
    save: "حفظ التعديلات",
    addSubmit: "إضافة الموظف الآن",
    statusToggleTitle: "انقر لتغيير حالة الحساب",
    editTooltip: "تعديل الموظف والصلاحيات",
    deleteTooltip: "حذف الموظف",
    ownerLabel: "صاحب مطعم (Owner)",
    managerLabel: "مدير فرع (Manager)",
    cashierLabel: "كاشير (Cashier)",
    waiterLabel: "ويتر / مقدم طعام (Waiter)",
    workerLabel: "عامل / موظف (Worker)",
    deliveryLabel: "عامل توصيل / سائق (Delivery)",
    deliveries: "عمال التوصيل",
    confirmDelete: "هل أنت متأكد من حذف الموظف",
    deleteSuccess: "تم حذف الموظف بنجاح 🗑️",
    addSuccess: "تمت إضافة الموظف بنجاح ✅",
    editSuccess: "تم تحديث بيانات الموظف والصلاحيات بنجاح ✅",
    fetchError: "فشل في جلب قائمة الموظفين",
    unknownError: "حدث خطأ",
    updateError: "فشل في تعديل بيانات الموظف",
    addError: "فشل في إضافة الموظف",
    deleteError: "فشل في حذف الموظف"
  },
  en: {
    panelTitle: "Staff & Permissions Management",
    panelSubtitle: "Add users (Owner, Manager, Cashier, Waiter) and allocate precise POS & settings permissions",
    addBtn: "Add New Employee",
    owners: "Owners",
    managers: "Managers",
    cashiers: "Cashiers & POS Operators",
    waiters: "Waiters & Servers",
    listTitle: "Staff List & Custom Permissions",
    listSubtitle: "Staff List & Custom Permissions",
    totalCount: "Total:",
    usersUnit: "users",
    userLabel: "employee",
    loading: "Loading staff list...",
    empty: "No staff registered for this restaurant yet.",
    thEmployee: "Employee",
    thRole: "Role",
    thContacts: "Contact & Login info",
    thPermissions: "Assigned Permissions",
    thStatus: "Status",
    thActions: "Actions",
    activeStatus: "Active",
    suspendedStatus: "Suspended",
    passwordLabel: "Password:",
    permPOS: "🖥️ Cashier Screen",
    permMenu: "🍴 Menu & Tables",
    permReports: "📊 Reports & AI",
    permUsers: "👥 Staff Admin",
    permSettings: "⚙️ Settings",
    modalAddTitle: "Add New Restaurant Employee",
    modalEditTitle: "Edit Employee Details & Permissions",
    inputName: "Full Name *",
    inputNamePlaceholder: "e.g. John Doe",
    inputRole: "Job Role (Role) *",
    inputEmail: "Email (for registration/login) *",
    inputPhone: "Phone Number (Optional)",
    inputPassword: "Password (for POS login) *",
    permHeading: "System Permissions:",
    permSubheading: "Permissions can be customized regardless of job role",
    permPOSDesc: "POS Cashier screen access & billing",
    permMenuDesc: "Menu, category, items & tables management",
    permReportsDesc: "Sales reports, analytics & Gemini AI assistant access",
    permUsersDesc: "Staff, roles and user permissions administration",
    permSettingsDesc: "Restaurant details, VAT configuration & subscription management",
    cancel: "Cancel",
    save: "Save Changes",
    addSubmit: "Add Employee Now",
    statusToggleTitle: "Click to toggle account status",
    editTooltip: "Edit staff details & permissions",
    deleteTooltip: "Delete employee",
    ownerLabel: "Restaurant Owner (Owner)",
    managerLabel: "Branch Manager (Manager)",
    cashierLabel: "Cashier (Cashier)",
    waiterLabel: "Waiter / Server (Waiter)",
    workerLabel: "Worker / Employee (Worker)",
    deliveryLabel: "Delivery Driver (Delivery)",
    deliveries: "Delivery Drivers",
    confirmDelete: "Are you sure you want to delete employee",
    deleteSuccess: "Employee deleted successfully 🗑️",
    addSuccess: "Employee added successfully ✅",
    editSuccess: "Employee details & permissions updated successfully ✅",
    fetchError: "Failed to fetch staff list",
    unknownError: "An error occurred",
    updateError: "Failed to update employee details",
    addError: "Failed to add employee",
    deleteError: "Failed to delete employee"
  },
  tr: {
    panelTitle: "Personel ve Yetki Yönetimi",
    panelSubtitle: "Personel (Sahip, Yönetici, Kasiyer, Garson) ekleyin ve POS ve ayarlar yetkilerini özelleştirin",
    addBtn: "Yeni Personel Ekle",
    owners: "Sahipler",
    managers: "Yöneticiler",
    cashiers: "Kasiyerler & POS Operatörleri",
    waiters: "Garsonlar & Servis Elemanları",
    listTitle: "Personel Listesi ve Özel Yetkiler",
    listSubtitle: "Personel Listesi ve Özel Yetkiler",
    totalCount: "Toplam:",
    usersUnit: "kullanıcı",
    userLabel: "personel",
    loading: "Personel listesi yükleniyor...",
    empty: "Bu restoran için henüz kayıtlı personel bulunmamaktadır.",
    thEmployee: "Personel",
    thRole: "Rol",
    thContacts: "İletişim & Giriş Bilgileri",
    thPermissions: "Atanan Yetkiler",
    thStatus: "Durum",
    thActions: "İşlemler",
    activeStatus: "Aktif",
    suspendedStatus: "Askıya Alındı",
    passwordLabel: "Şifre:",
    permPOS: "🖥️ Kasiyer Ekranı",
    permMenu: "🍴 Menü & Masalar",
    permReports: "📊 Raporlar & Yapay Zeka",
    permUsers: "👥 Personel Yönetimi",
    permSettings: "⚙️ Ayarlar",
    modalAddTitle: "Yeni Restoran Personeli Ekle",
    modalEditTitle: "Personel Detaylarını ve Yetkilerini Düzenle",
    inputName: "Tam Adı *",
    inputNamePlaceholder: "Örn: Ahmet Yılmaz",
    inputRole: "İş Rolü (Rol) *",
    inputEmail: "E-posta (kayıt/giriş için) *",
    inputPhone: "Telefon Numarası (İsteğe Bağlı)",
    inputPassword: "Şifre (POS girişi için) *",
    permHeading: "Sistem Yetkileri:",
    permSubheading: "Yetkiler rolden bağımsız olarak özelleştirilebilir",
    permPOSDesc: "POS Kasiyer ekranı erişimi ve faturalandırma",
    permMenuDesc: "Menü, kategori, ürünler ve masa yönetimi",
    permReportsDesc: "Satış raporları, analizler ve Gemini AI asistan erişimi",
    permUsersDesc: "Personel, roller ve kullanıcı yetkileri yönetimi",
    permSettingsDesc: "Restoran detayları, KDV ayarları ve abonelik yönetimi",
    cancel: "İptal",
    save: "Değişiklikleri Kaydet",
    addSubmit: "Personeli Şimdi Ekle",
    statusToggleTitle: "Hesap durumunu değiştirmek için tıklayın",
    editTooltip: "Personel detaylarını ve yetkilerini düzenle",
    deleteTooltip: "Personeli sil",
    ownerLabel: "Restoran Sahibi (Owner)",
    managerLabel: "Şube Yöneticisi (Manager)",
    cashierLabel: "Kasiyer (Cashier)",
    waiterLabel: "Garson / Servis Elemanı (Waiter)",
    workerLabel: "İşçi / Çalışan (Worker)",
    deliveryLabel: "Kurye / Sürücü (Delivery)",
    deliveries: "Kuryeler",
    confirmDelete: "Personeli silmek istediğinizden emin misiniz:",
    deleteSuccess: "Personel başarıyla silindi 🗑️",
    addSuccess: "Personel başarıyla eklendi ✅",
    editSuccess: "Personel bilgileri ve yetkileri başarıyla güncellendi ✅",
    fetchError: "Personel listesi alınamadı",
    unknownError: "Bir hata oluştu",
    updateError: "Personel bilgileri güncellenemedi",
    addError: "Personel eklenemedi",
    deleteError: "Personel silinemedi"
  }
};

export const TenantUsersView: React.FC<TenantUsersViewProps> = ({ currentTenant, lang = 'ar' }) => {
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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError(lang === 'ar' ? "يرجى إدخال بريد إلكتروني صحيح وصالح" : "Please enter a valid email address");
      return;
    }

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
        if (!res.ok) throw new Error(usersTranslations[lang].updateError);
        const updated = await res.json();
        setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
        setSuccessMsg(usersTranslations[lang].editSuccess);
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
        if (!res.ok) throw new Error(usersTranslations[lang].addError);
        const newU = await res.json();
        setUsers(prev => [...prev, newU]);
        setSuccessMsg(usersTranslations[lang].addSuccess);
      }
      setShowAddModal(false);
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err: any) {
      setError(err.message || usersTranslations[lang].unknownError);
    }
  };

  const handleDeleteUser = async (u: TenantUser) => {
    if (!confirm(`${usersTranslations[lang].confirmDelete} "${u.name}"؟`)) return;
    try {
      const res = await fetch(`/api/users/${u.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(usersTranslations[lang].deleteError);
      setUsers(prev => prev.filter(item => item.id !== u.id));
      setSuccessMsg(usersTranslations[lang].deleteSuccess);
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
        return <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-lg text-xs font-bold border border-amber-300 flex items-center gap-1"><Award className="w-3.5 h-3.5" /> {usersTranslations[lang].ownerLabel}</span>;
      case "manager":
        return <span className="px-2.5 py-1 bg-purple-100 text-purple-800 rounded-lg text-xs font-bold border border-purple-300 flex items-center gap-1"><Shield className="w-3.5 h-3.5" /> {usersTranslations[lang].managerLabel}</span>;
      case "cashier":
        return <span className="px-2.5 py-1 bg-blue-100 text-blue-800 rounded-lg text-xs font-bold border border-blue-300 flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {usersTranslations[lang].cashierLabel}</span>;
      case "waiter":
        return <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold border border-emerald-300 flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {usersTranslations[lang].waiterLabel}</span>;
      case "worker":
        return <span className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded-lg text-xs font-bold border border-slate-300 flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {usersTranslations[lang].workerLabel}</span>;
      case "delivery":
        return <span className="px-2.5 py-1 bg-sky-100 text-sky-800 rounded-lg text-xs font-bold border border-sky-300 flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {usersTranslations[lang].deliveryLabel}</span>;
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
                <h1 className="text-2xl font-black text-slate-900">{usersTranslations[lang].panelTitle}</h1>
                <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full text-xs font-bold border border-slate-200">
                  {lang === 'ar' ? currentTenant.nameAr : (currentTenant.nameEn || currentTenant.nameAr)}
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-1">
                {usersTranslations[lang].panelSubtitle}
              </p>
            </div>
          </div>

          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-bold text-sm shadow-sm transition-all transform hover:-translate-y-0.5 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>{usersTranslations[lang].addBtn}</span>
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
              <div className="text-xs text-slate-400 font-bold">{usersTranslations[lang].owners}</div>
              <div className="text-lg font-black text-slate-800 font-sans">
                {users.filter(u => u.role === "owner").length} {usersTranslations[lang].usersUnit}
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm flex items-center gap-3">
            <div className="w-11 h-11 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center text-xl">👔</div>
            <div>
              <div className="text-xs text-slate-400 font-bold">{usersTranslations[lang].managers}</div>
              <div className="text-lg font-black text-slate-800 font-sans">
                {users.filter(u => u.role === "manager").length} {usersTranslations[lang].usersUnit}
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm flex items-center gap-3">
            <div className="w-11 h-11 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-xl">🖥️</div>
            <div>
              <div className="text-xs text-slate-400 font-bold">{usersTranslations[lang].cashiers}</div>
              <div className="text-lg font-black text-slate-800 font-sans">
                {users.filter(u => u.role === "cashier").length} {usersTranslations[lang].usersUnit}
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm flex items-center gap-3">
            <div className="w-11 h-11 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center text-xl">🍽️</div>
            <div>
              <div className="text-xs text-slate-400 font-bold">{usersTranslations[lang].waiters}</div>
              <div className="text-lg font-black text-slate-800 font-sans">
                {users.filter(u => u.role === "waiter").length} {usersTranslations[lang].usersUnit}
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm flex items-center gap-3">
            <div className="w-11 h-11 bg-sky-50 text-sky-600 rounded-xl flex items-center justify-center text-xl">🛵</div>
            <div>
              <div className="text-xs text-slate-400 font-bold">{usersTranslations[lang].deliveries}</div>
              <div className="text-lg font-black text-slate-800 font-sans">
                {users.filter(u => u.role === "delivery").length} {usersTranslations[lang].usersUnit}
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-600" />
              <span>{usersTranslations[lang].listTitle}</span>
            </h2>
            <span className="text-xs text-slate-400 font-medium font-sans">{usersTranslations[lang].totalCount} {users.length} {usersTranslations[lang].userLabel}</span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-400 font-medium">{usersTranslations[lang].loading}</div>
          ) : users.length === 0 ? (
            <div className="p-12 text-center text-slate-400 font-medium">{usersTranslations[lang].empty}</div>
          ) : (
            <div className="overflow-x-auto no-scrollbar">
              <table className={`w-full ${lang === 'ar' ? 'text-right' : 'text-left'} border-collapse`}>
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/80 text-xs text-slate-500 font-bold">
                    <th className="py-3.5 px-4">{usersTranslations[lang].thEmployee}</th>
                    <th className="py-3.5 px-4">{usersTranslations[lang].thRole}</th>
                    <th className="py-3.5 px-4">{usersTranslations[lang].thContacts}</th>
                    <th className="py-3.5 px-4">{usersTranslations[lang].thPermissions}</th>
                    <th className="py-3.5 px-4 text-center">{usersTranslations[lang].thStatus}</th>
                    <th className="py-3.5 px-4 text-center">{usersTranslations[lang].thActions}</th>
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
                          <span>{usersTranslations[lang].passwordLabel} ****{u.password ? u.password.slice(-2) : "**"}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex flex-wrap gap-1.5 max-w-xs">
                          {u.permissions.canManagePOS && (
                            <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-[11px] font-bold border border-emerald-200">
                              {usersTranslations[lang].permPOS}
                            </span>
                          )}
                          {u.permissions.canManageMenu && (
                            <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded text-[11px] font-bold border border-amber-200">
                              {usersTranslations[lang].permMenu}
                            </span>
                          )}
                          {u.permissions.canViewReports && (
                            <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[11px] font-bold border border-blue-200">
                              {usersTranslations[lang].permReports}
                            </span>
                          )}
                          {u.permissions.canManageUsers && (
                            <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded text-[11px] font-bold border border-purple-200">
                              {usersTranslations[lang].permUsers}
                            </span>
                          )}
                          {u.permissions.canManageSettings && (
                            <span className="bg-rose-50 text-rose-700 px-2 py-0.5 rounded text-[11px] font-bold border border-rose-200">
                              {usersTranslations[lang].permSettings}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => toggleStatus(u)}
                          className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                            u.status === "active"
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200"
                              : "bg-rose-100 text-rose-800 border border-rose-300 hover:bg-rose-200"
                          }`}
                          title={usersTranslations[lang].statusToggleTitle}
                        >
                          {u.status === "active" ? `● ${usersTranslations[lang].activeStatus}` : `● ${usersTranslations[lang].suspendedStatus}`}
                        </button>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openEditModal(u)}
                            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
                            title={usersTranslations[lang].editTooltip}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          {u.role !== "owner" && (
                            <button
                              onClick={() => handleDeleteUser(u)}
                              className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors cursor-pointer"
                              title={usersTranslations[lang].deleteTooltip}
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
                <span>{editingUser ? usersTranslations[lang].modalEditTitle : usersTranslations[lang].modalAddTitle}</span>
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-white/80 hover:text-white cursor-pointer">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className={`p-6 space-y-4 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">{usersTranslations[lang].inputName}</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={lang === 'ar' ? "مثال: أحمد الغامدي" : "e.g. John Doe"}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">{usersTranslations[lang].inputRole}</label>
                  <select
                    value={role}
                    onChange={(e) => handleRoleChange(e.target.value as UserRole)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-bold bg-white"
                  >
                    <option value="cashier">🖥️ {usersTranslations[lang].cashierLabel}</option>
                    <option value="waiter">🍽️ {usersTranslations[lang].waiterLabel}</option>
                    <option value="manager">👔 {usersTranslations[lang].managerLabel}</option>
                    <option value="owner">👨‍🍳 {usersTranslations[lang].ownerLabel}</option>
                    <option value="worker">👷 {usersTranslations[lang].workerLabel}</option>
                    <option value="delivery">🛵 {usersTranslations[lang].deliveryLabel}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">{usersTranslations[lang].inputEmail}</label>
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
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">{usersTranslations[lang].inputPhone}</label>
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
                <label className="block text-xs font-bold text-slate-700 mb-1.5">{usersTranslations[lang].inputPassword}</label>
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
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 mt-4 space-y-3">
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 pb-2 flex items-center justify-between">
                  <span>{usersTranslations[lang].permHeading}</span>
                  <span className="text-[11px] text-slate-400">{usersTranslations[lang].permSubheading}</span>
                </div>

                <div className="space-y-2.5 text-sm">
                  <label className="flex items-center gap-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50 p-1.5 rounded-lg transition-colors">
                    <input
                      type="checkbox"
                      checked={permissions.canManagePOS}
                      onChange={(e) => setPermissions(prev => ({ ...prev, canManagePOS: e.target.checked }))}
                      className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
                    />
                    <span className="font-bold text-slate-800 dark:text-slate-200">{usersTranslations[lang].permPOSDesc}</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50 p-1.5 rounded-lg transition-colors">
                    <input
                      type="checkbox"
                      checked={permissions.canManageMenu}
                      onChange={(e) => setPermissions(prev => ({ ...prev, canManageMenu: e.target.checked }))}
                      className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
                    />
                    <span className="font-bold text-slate-800 dark:text-slate-200">{usersTranslations[lang].permMenuDesc}</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50 p-1.5 rounded-lg transition-colors">
                    <input
                      type="checkbox"
                      checked={permissions.canViewReports}
                      onChange={(e) => setPermissions(prev => ({ ...prev, canViewReports: e.target.checked }))}
                      className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
                    />
                    <span className="font-bold text-slate-800 dark:text-slate-200">{usersTranslations[lang].permReportsDesc}</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50 p-1.5 rounded-lg transition-colors">
                    <input
                      type="checkbox"
                      checked={permissions.canManageUsers}
                      onChange={(e) => setPermissions(prev => ({ ...prev, canManageUsers: e.target.checked }))}
                      className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
                    />
                    <span className="font-bold text-slate-800 dark:text-slate-200">{usersTranslations[lang].permUsersDesc}</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50 p-1.5 rounded-lg transition-colors">
                    <input
                      type="checkbox"
                      checked={permissions.canManageSettings}
                      onChange={(e) => setPermissions(prev => ({ ...prev, canManageSettings: e.target.checked }))}
                      className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
                    />
                    <span className="font-bold text-slate-800 dark:text-slate-200">{usersTranslations[lang].permSettingsDesc}</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-bold cursor-pointer"
                >
                  {usersTranslations[lang].cancel}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm shadow-sm flex items-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingUser ? usersTranslations[lang].save : usersTranslations[lang].addSubmit}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
