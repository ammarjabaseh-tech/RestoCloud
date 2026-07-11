import React, { useState } from "react";
import { Tenant, Category, MenuItem, RestaurantTable, ThemeColor, Printer } from "../types";
import { getThemeClasses } from "../utils/theme";
import { TenantUsersView } from "./TenantUsersView";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from "recharts";
import { 
  Store, 
  Palette, 
  Utensils, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  Sparkles, 
  TrendingUp, 
  BarChart3, 
  Users, 
  DollarSign, 
  Eye, 
  EyeOff, 
  RefreshCw,
  Clock,
  Flame,
  LayoutGrid,
  Settings,
  AlertCircle,
  QrCode,
  Upload,
  Image,
  ChevronLeft,
  ChevronRight,
  Printer as PrinterIcon
} from "lucide-react";
import { QRCodeModal } from "./QRCodeModal";
import { RestaurantLogo } from "./RestaurantLogo";

interface AdminPanelViewProps {
  tenant: Tenant;
  categories: Category[];
  items: MenuItem[];
  tables: RestaurantTable[];
  onUpdateTenant: (tenant: Tenant) => void;
  onAddCategory: (nameAr: string, icon: string) => void;
  onAddItem: (item: Partial<MenuItem>) => void;
  onUpdateItem: (id: string, updates: Partial<MenuItem>) => void;
  onDeleteItem: (id: string) => void;
  onUpdateTable: (id: string, updates: Partial<RestaurantTable>) => void;
  onReorderCategories?: (orderedIds: string[]) => void;
}

export const AdminPanelView: React.FC<AdminPanelViewProps> = ({
  tenant,
  categories,
  items,
  tables,
  onUpdateTenant,
  onAddCategory,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  onUpdateTable,
  onReorderCategories
}) => {
  const [activeTab, setActiveTab] = useState<"menu" | "branding" | "tables" | "analytics" | "users" | "printers">("menu");
  const [showQRModal, setShowQRModal] = useState<boolean>(false);
  const [qrTargetTable, setQrTargetTable] = useState<number | "general">("general");
  
  // Printers State Configuration
  const [printers, setPrinters] = useState<Printer[]>([]);
  const [loadingPrinters, setLoadingPrinters] = useState(false);
  const [showPrinterModal, setShowPrinterModal] = useState(false);
  const [editingPrinter, setEditingPrinter] = useState<Partial<Printer> | null>(null);

  const fetchPrinters = async () => {
    setLoadingPrinters(true);
    try {
      const res = await fetch(`/api/tenants/${tenant.id}/printers`);
      if (res.ok) {
        const data = await res.json();
        setPrinters(data);
      }
    } catch (err) {
      console.error("Failed to fetch printers:", err);
    } finally {
      setLoadingPrinters(false);
    }
  };

  React.useEffect(() => {
    if (activeTab === "printers") {
      fetchPrinters();
    }
  }, [activeTab]);

  const handleSavePrinter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPrinter || !editingPrinter.name || !editingPrinter.connectionType) return;
    
    const isNew = !editingPrinter.id;
    const url = isNew 
      ? `/api/tenants/${tenant.id}/printers` 
      : `/api/tenants/${tenant.id}/printers/${editingPrinter.id}`;
    const method = isNew ? "POST" : "PUT";
    
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingPrinter)
      });
      if (res.ok) {
        fetchPrinters();
        setShowPrinterModal(false);
        setEditingPrinter(null);
      } else {
        const data = await res.json();
        alert(data.error || "خطأ أثناء حفظ الطابعة");
      }
    } catch (err) {
      console.error(err);
      alert("حدث خطأ بالاتصال");
    }
  };

  const handleDeletePrinter = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه الطابعة؟")) return;
    try {
      const res = await fetch(`/api/tenants/${tenant.id}/printers/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchPrinters();
      } else {
        const data = await res.json();
        alert(data.error || "خطأ أثناء حذف الطابعة");
      }
    } catch (err) {
      console.error(err);
      alert("حدث خطأ بالاتصال");
    }
  };

  const handleTestPrint = async (id: string) => {
    try {
      const res = await fetch(`/api/tenants/${tenant.id}/printers/${id}/print-test`, { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        alert("✅ " + data.message);
      } else {
        alert("❌ " + data.error);
      }
    } catch (err) {
      alert("❌ حدث خطأ بالاتصال بالخادم");
    }
  };
  
  // Item Modal State
  const [showItemModal, setShowItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [itemName, setItemName] = useState("");
  const [itemDesc, setItemDesc] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemCost, setItemCost] = useState("");
  const [itemCat, setItemCat] = useState(categories[0]?.id || "");
  const [itemImage, setItemImage] = useState("https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80");
  const [itemPrep, setItemPrep] = useState("15");
  const [itemBestSeller, setItemBestSeller] = useState(false);
  const [itemAvailable, setItemAvailable] = useState(true);
  const [aiGenerating, setAiGenerating] = useState(false);

  // Branding State
  const [nameAr, setNameAr] = useState(tenant.nameAr);
  const [slogan, setSlogan] = useState(tenant.slogan || "");
  const [logo, setLogo] = useState(tenant.logo);
  const [themeColor, setThemeColor] = useState<ThemeColor>(tenant.themeColor);
  const [phone, setPhone] = useState(tenant.phone);
  const [address, setAddress] = useState(tenant.address);
  const [taxRate, setTaxRate] = useState(tenant.taxRate.toString());
  const [wifiPass, setWifiPass] = useState(tenant.wifiPassword || "");
  const [wifiName, setWifiName] = useState(tenant.wifiName || "");
  const [currency, setCurrency] = useState(tenant.currency || "ر.س");
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync state when tenant prop changes (e.g. on save or tenant switch)
  React.useEffect(() => {
    setNameAr(tenant.nameAr);
    setSlogan(tenant.slogan || "");
    setLogo(tenant.logo);
    setThemeColor(tenant.themeColor);
    setPhone(tenant.phone);
    setAddress(tenant.address);
    setTaxRate(tenant.taxRate.toString());
    setWifiPass(tenant.wifiPassword || "");
    setWifiName(tenant.wifiName || "");
    setCurrency(tenant.currency || "ر.س");
  }, [tenant]);

  // New Category State
  const [newCatName, setNewCatName] = useState("");
  const [newCatIcon, setNewCatIcon] = useState("🍽️");
  const [showCatModal, setShowCatModal] = useState(false);

  const theme = getThemeClasses(tenant.themeColor);

  // Handle open add/edit item modal
  const openItemModal = (item?: MenuItem) => {
    if (item) {
      setEditingItem(item);
      setItemName(item.nameAr);
      setItemDesc(item.descriptionAr);
      setItemPrice(item.price.toString());
      setItemCost(item.costPrice.toString());
      setItemCat(item.categoryId);
      setItemImage(item.image);
      setItemPrep((item.preparationTimeMin || 15).toString());
      setItemBestSeller(item.isBestSeller || false);
      setItemAvailable(item.isAvailable);
    } else {
      setEditingItem(null);
      setItemName("");
      setItemDesc("");
      setItemPrice("");
      setItemCost("");
      setItemCat(categories[0]?.id || "");
      setItemImage("https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80");
      setItemPrep("15");
      setItemBestSeller(false);
      setItemAvailable(true);
    }
    setShowItemModal(true);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName || !itemPrice) {
      alert("يرجى إدخال اسم الطبق والسعر");
      return;
    }

    const payload: Partial<MenuItem> = {
      nameAr: itemName,
      descriptionAr: itemDesc,
      price: Number(itemPrice) || 0,
      costPrice: Number(itemCost) || Math.round(Number(itemPrice) * 0.4),
      categoryId: itemCat || categories[0]?.id,
      image: itemImage,
      preparationTimeMin: Number(itemPrep) || 15,
      isBestSeller: itemBestSeller,
      isAvailable: itemAvailable
    };

    if (editingItem) {
      onUpdateItem(editingItem.id, payload);
    } else {
      onAddItem(payload);
    }
    setShowItemModal(false);
  };

  // AI Description Generator
  const handleGenerateAI = async () => {
    if (!itemName) {
      alert("يرجى كتابة اسم الطبق أولاً");
      return;
    }
    setAiGenerating(true);
    try {
      const catObj = categories.find(c => c.id === itemCat);
      const res = await fetch("/api/ai/generate-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dishName: itemName,
          categoryName: catObj?.nameAr || "طبق رئيسي",
          restaurantStyle: tenant.slogan || tenant.nameAr
        })
      });
      const data = await res.json();
      if (data.descriptionAr) {
        setItemDesc(data.descriptionAr);
      }
    } catch (err) {
      alert("تعذر توليد الوصف، تأكد من اتصال الإنترنت");
    } finally {
      setAiGenerating(false);
    }
  };

  // Handle Save Branding
  const handleSaveBranding = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated: Tenant = {
      ...tenant,
      nameAr,
      slogan,
      logo,
      themeColor,
      phone,
      address,
      taxRate: Number(taxRate) || 15,
      wifiPassword: wifiPass,
      wifiName: wifiName,
      currency
    };

    try {
      const res = await fetch(`/api/tenants/${tenant.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated)
      });
      const data = await res.json();
      onUpdateTenant(data);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      alert("فشل في حفظ التعديلات");
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("حجم الصورة كبير جداً، يرجى اختيار صورة أقل من 2 ميجابايت.");
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

  // Analytics Data
  const categoryChartData = categories.map((cat) => {
    const catItems = items.filter(i => i.categoryId === cat.id);
    return {
      name: cat.nameAr,
      count: catItems.length,
      avgPrice: catItems.length > 0 ? Math.round(catItems.reduce((s, i) => s + i.price, 0) / catItems.length) : 0
    };
  });

  const COLORS = ["#10b981", "#f59e0b", "#f43f5e", "#6366f1", "#8b5cf6"];
  const bestSellers = items.filter(i => i.isBestSeller || i.isAvailable).slice(0, 5);

  const emojis = ["🍽️", "🥙", "🍔", "🍕", "☕", "🍗", "🌮", "🍣", "🥗", "🍰", "🍩", "🍜", "🦞", "🥩", "🥐", "👑", "🔥", "🌟", "🍷", "🍹", "🍦", "🧁", "🍳", "🍿", "🧆", "🥘", "🌯", "🍵", "🥤", "🧋", "👨‍🍳", "🌶️", "🧄", "🫒", "🥑", "🧀"];
  const colors: { id: ThemeColor; name: string; bg: string }[] = [
    { id: "emerald", name: "زمردي", bg: "bg-emerald-600" },
    { id: "amber", name: "ذهبي", bg: "bg-amber-600" },
    { id: "rose", name: "وردي", bg: "bg-rose-600" },
    { id: "indigo", name: "نيلي", bg: "bg-indigo-600" },
    { id: "violet", name: "بنفسجي", bg: "bg-violet-600" },
    { id: "slate", name: "رمادي", bg: "bg-slate-800" },
    { id: "cyan", name: "سماوي", bg: "bg-cyan-600" },
    { id: "orange", name: "برتقالي", bg: "bg-orange-600" },
  ];

  const getTrialDaysLeft = () => {
    if (tenant.status !== 'trial') return null;
    const createdDate = new Date(tenant.createdAt || new Date());
    const trialEndDate = new Date(createdDate.getTime() + 14 * 24 * 60 * 60 * 1000);
    const diffTime = trialEndDate.getTime() - new Date().getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const handleMoveCategory = (idx: number, direction: number) => {
    if (!onReorderCategories) return;
    const newCats = [...categories];
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= newCats.length) return;
    
    // Swap items in local array
    const temp = newCats[idx];
    newCats[idx] = newCats[targetIdx];
    newCats[targetIdx] = temp;
    
    onReorderCategories(newCats.map(c => c.id));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200" dir="rtl">
      
      {/* Top Banner & Tabs */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-800 text-3xl flex items-center justify-center border border-slate-200 shadow-2xs overflow-hidden">
            <RestaurantLogo logo={tenant.logo} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-extrabold text-slate-900">{tenant.nameAr}</h1>
              <span className="text-xs bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full font-bold border border-emerald-200 font-sans">
                لوحة المالك (Admin)
              </span>
              {tenant.status === 'trial' && (
                <span className="text-[11px] bg-amber-100 dark:bg-amber-950 text-amber-855 dark:text-amber-300 border border-amber-200 dark:border-amber-900 px-2.5 py-0.5 rounded-full animate-pulse font-bold">
                  ⏳ تجريبي: متبقي {getTrialDaysLeft()} يوم
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1">التحكم في الهوية، قائمة الأصناف والأسعار، وإدارة الطاولات</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl overflow-x-auto border border-slate-200">
          <button
            onClick={() => setActiveTab("menu")}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === "menu"
                ? `${theme.primaryBg} text-white shadow-sm`
                : "text-slate-600 hover:bg-white/70"
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>إدارة المنيو والأصناف</span>
          </button>

          <button
            onClick={() => setActiveTab("branding")}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === "branding"
                ? `${theme.primaryBg} text-white shadow-sm`
                : "text-slate-600 hover:bg-white/70"
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>الهوية والألوان</span>
          </button>

          <button
            onClick={() => setActiveTab("tables")}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === "tables"
                ? `${theme.primaryBg} text-white shadow-sm`
                : "text-slate-600 hover:bg-white/70"
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>إدارة الطاولات</span>
          </button>

          <button
            onClick={() => setActiveTab("analytics")}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === "analytics"
                ? `${theme.primaryBg} text-white shadow-sm`
                : "text-slate-600 hover:bg-white/70"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>تحليلات المبيعات</span>
          </button>

          <button
            onClick={() => setActiveTab("users")}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === "users"
                ? `${theme.primaryBg} text-white shadow-sm`
                : "text-slate-600 hover:bg-white/70"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>الموظفون والصلاحيات</span>
          </button>

          <button
            onClick={() => setActiveTab("printers")}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === "printers"
                ? `${theme.primaryBg} text-white shadow-sm`
                : "text-slate-600 hover:bg-white/70"
            }`}
          >
            <PrinterIcon className="w-3.5 h-3.5" />
            <span>إدارة الطابعات</span>
          </button>
        </div>
      </div>

      {/* TAB 1: MENU & ITEMS MANAGEMENT */}
      {activeTab === "menu" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Utensils className="w-5 h-5 text-emerald-600" />
                <span>أصناف قائمة الطعام ({items.length})</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">يمكنك إضافة أطباق جديدة، تغيير الأسعار فوراً، أو تعطيل توفر الصنف في الكاشير والمنيو الرقمي</p>
            </div>
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setShowCatModal(true)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 font-bold text-xs transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة قسم جديد</span>
              </button>
              <button
                onClick={() => openItemModal()}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl ${theme.primaryBg} ${theme.primaryHover} text-white font-bold text-xs shadow-lg transition-all transform hover:-translate-y-0.5`}
              >
                <Plus className="w-4 h-4" />
                <span>إضافة طبق / صنف جديد</span>
              </button>
            </div>
          </div>

          {/* Categories Horizontal Banner */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {categories.map((cat, idx) => (
              <div key={cat.id} className="bg-white dark:bg-slate-900 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-2 shrink-0">
                <span className="text-lg">{cat.icon}</span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{cat.nameAr}</span>
                <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full text-slate-500 font-mono">
                  {items.filter(i => i.categoryId === cat.id).length}
                </span>

                {/* Reordering Controls */}
                <div className="flex items-center gap-0.5 mr-1 border-r border-slate-200 dark:border-slate-800 pr-1.5">
                  <button 
                    disabled={idx === 0}
                    onClick={() => handleMoveCategory(idx, -1)}
                    className="p-0.5 rounded hover:bg-slate-150 dark:hover:bg-slate-800 text-slate-500 disabled:opacity-20 cursor-pointer"
                    title="تحريك لليمين"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    disabled={idx === categories.length - 1}
                    onClick={() => handleMoveCategory(idx, 1)}
                    className="p-0.5 rounded hover:bg-slate-150 dark:hover:bg-slate-800 text-slate-500 disabled:opacity-20 cursor-pointer"
                    title="تحريك لليسار"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Items Table List */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 text-xs font-bold border-b border-slate-200 dark:border-slate-800">
                    <th className="p-4">الصنف والوصف</th>
                    <th className="p-4">القسم</th>
                    <th className="p-4">السعر والتكلفة</th>
                    <th className="p-4">مدة التحضير</th>
                    <th className="p-4">الحالة والتوفر</th>
                    <th className="p-4 text-center">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                  {items.map((item) => {
                    const cat = categories.find(c => c.id === item.categoryId);
                    const margin = item.price > 0 ? Math.round(((item.price - item.costPrice) / item.price) * 100) : 0;
                    return (
                      <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img src={item.image} alt={item.nameAr} className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-200" />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-900 dark:text-white">{item.nameAr}</span>
                                {item.isBestSeller && (
                                  <span className="bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 text-[10px] font-bold px-1.5 py-0.2 rounded">
                                    ★ مميز
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-500 line-clamp-1 max-w-xs mt-0.5">{item.descriptionAr}</p>
                            </div>
                          </div>
                        </td>

                        <td className="p-4">
                          <span className="text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-lg">
                            {cat ? `${cat.icon} ${cat.nameAr}` : "عام"}
                          </span>
                        </td>

                        <td className="p-4">
                          <div className="font-bold text-slate-900 dark:text-white">
                            {item.price} <span className="text-xs font-normal text-slate-500">{tenant.currency}</span>
                          </div>
                          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono">
                            هامش الربح: {margin}%
                          </div>
                        </td>

                        <td className="p-4 text-xs text-slate-600 dark:text-slate-400">
                          {item.preparationTimeMin || 15} دقيقة
                        </td>

                        <td className="p-4">
                          <button
                            onClick={() => onUpdateItem(item.id, { isAvailable: !item.isAvailable })}
                            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                              item.isAvailable
                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-500/20"
                                : "bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-500/20"
                            }`}
                          >
                            {item.isAvailable ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                            <span>{item.isAvailable ? "متوفر اليوم" : "نفد (غير متاح)"}</span>
                          </button>
                        </td>

                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => openItemModal(item)}
                              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 transition-colors"
                              title="تعديل الطبق"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`هل أنت متأكد من حذف طبق "${item.nameAr}"؟`)) {
                                  onDeleteItem(item.id);
                                }
                              }}
                              className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400 transition-colors"
                              title="حذف الطبق"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BRANDING & SETTINGS */}
      {activeTab === "branding" && (
        <form onSubmit={handleSaveBranding} className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Palette className="w-5 h-5 text-emerald-600" />
                <span>إعدادات الهوية البصرية والمطعم (Brand Customization)</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">التغييرات ستنعكس فوراً على لوحة الكاشير، قائمة الطعام الرقمية، والإيصالات الضريبية</p>
            </div>
            {saveSuccess && (
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-1.5 animate-bounce">
                <Check className="w-4 h-4" />
                <span>تم حفظ الإعدادات بنجاح!</span>
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">اسم المطعم بالعربية</label>
              <input
                type="text"
                value={nameAr}
                onChange={(e) => setNameAr(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">شعار المطعم / نوع المطبخ (Slogan)</label>
              <input
                type="text"
                value={slogan}
                onChange={(e) => setSlogan(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">رقم الهاتف</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">نسبة ضريبة القيمة المضافة (VAT %)</label>
              <input
                type="number"
                value={taxRate}
                onChange={(e) => setTaxRate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">البلد والعملة الرسمية</label>
              <select
                value={
                  ["ر.س", "د.إ", "د.ك", "ر.ق", "د.ب", "ر.ع", "ج.م", "د.أ", "د.ع", "$"].includes(currency)
                    ? currency
                    : "custom"
                }
                onChange={(e) => {
                  const val = e.target.value;
                  if (val !== "custom") {
                    setCurrency(val);
                  } else {
                    setCurrency("");
                  }
                }}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold mb-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
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

              {!["ر.س", "د.إ", "د.ك", "ر.ق", "د.ب", "ر.ع", "ج.م", "د.أ", "د.ع", "$"].includes(currency) && (
                <input
                  type="text"
                  placeholder="اكتب رمز العملة المخصصة هنا (مثال: د.ت)"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none font-sans"
                />
              )}
            </div>

            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">اسم شبكة واي فاي المطعم (WiFi SSID)</label>
                <input
                  type="text"
                  placeholder="اتركه فارغاً إذا لم يتوفر"
                  value={wifiName}
                  onChange={(e) => setWifiName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">كلمة مرور واي فاي المطعم (لعملائك)</label>
                <input
                  type="text"
                  placeholder="اتركه فارغاً إذا لم يتوفر"
                  value={wifiPass}
                  onChange={(e) => setWifiPass(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">العنوان وموقع الفرع</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Logo Selection & Customization */}
          <div className="space-y-4 p-5 bg-slate-50 dark:bg-slate-800/40 rounded-3xl border border-slate-200 dark:border-slate-700">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-700">
              <div>
                <label className="block text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Image className="w-5 h-5 text-emerald-600" />
                  <span>شعار المطعم (Logo Options)</span>
                </label>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  يمكنك اختيار أيقونة تعبيرية، أو كتابة حروف واختصار مخصص، أو رفع صورة الشعار الخاص بالمطعم.
                </p>
              </div>

              {/* Live Preview Badge */}
              <div className="flex items-center gap-2.5 bg-white dark:bg-slate-800 px-3.5 py-2 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs shrink-0">
                <span className="text-xs text-slate-500 font-bold">معاينة الشعار:</span>
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 flex items-center justify-center text-2xl overflow-hidden shadow-sm">
                  <RestaurantLogo logo={logo} />
                </div>
              </div>
            </div>

            {/* Option 1: File Upload / Image URL / Custom Text */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1">
              <div className="sm:col-span-7">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  رابط صورة الشعار (https://...) أو كتابة حروف ورمز مخصص (مثال: ✨ أو KF)
                </label>
                <input
                  type="text"
                  placeholder="ضع رابط صورة أو اكتب رمز شعارك هنا..."
                  value={logo}
                  onChange={(e) => setLogo(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  dir="ltr"
                />
              </div>

              <div className="sm:col-span-5 flex items-end">
                <label className="w-full cursor-pointer bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all transform hover:-translate-y-0.5 text-center">
                  <Upload className="w-4 h-4 shrink-0 animate-bounce" />
                  <span>📂 رفع صورة شعار من جهازك</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Option 2: Ready Emojis */}
            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
                أو اختر من الرموز التعبيرية الجاهزة للمطاعم والكافيهات:
              </label>
              <div className="flex flex-wrap gap-2 p-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 max-h-48 overflow-y-auto">
                {emojis.map((em) => (
                  <button
                    key={em}
                    type="button"
                    onClick={() => setLogo(em)}
                    className={`w-11 h-11 rounded-xl text-2xl flex items-center justify-center transition-transform hover:scale-110 overflow-hidden shrink-0 ${
                      logo === em ? "bg-emerald-500 text-white shadow-md ring-2 ring-emerald-600 scale-110" : "bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-white hover:bg-slate-100 shadow-2xs"
                    }`}
                  >
                    <RestaurantLogo logo={em} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Brand Color Theme Selection */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">اللون الأساسي للواجهات (Brand Theme)</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {colors.map((col) => (
                <button
                  key={col.id}
                  type="button"
                  onClick={() => setThemeColor(col.id)}
                  className={`flex items-center gap-2 p-3 rounded-2xl border transition-all ${
                    themeColor === col.id 
                      ? "border-slate-900 dark:border-white ring-2 ring-emerald-500 shadow-md bg-slate-100 dark:bg-slate-800 font-bold" 
                      : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  }`}
                >
                  <span className={`w-6 h-6 rounded-full ${col.bg} shadow-sm flex items-center justify-center text-white`}>
                    {themeColor === col.id && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </span>
                  <span className="text-sm text-slate-800 dark:text-slate-200">{col.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              type="submit"
              className={`px-8 py-3 rounded-xl ${theme.primaryBg} ${theme.primaryHover} text-white font-bold text-sm shadow-lg transition-all transform hover:-translate-y-0.5`}
            >
              حفظ التعديلات وتحديث الهوية
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: TABLES MANAGEMENT */}
      {activeTab === "tables" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <LayoutGrid className="w-5 h-5 text-emerald-600" />
                <span>طاولات المطعم والجلسات ({tables.length})</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">إدارة حالة الطاولات ومراقبة الإشغال الفوري في الطلبات الداخلية</p>
            </div>
            <button
              onClick={() => {
                const nextNum = tables.length + 1;
                onUpdateTable(`tbl-${Date.now()}`, {
                  id: `tbl-${Date.now()}`,
                  tenantId: tenant.id,
                  tableNumber: nextNum,
                  capacity: 4,
                  status: "available"
                } as any);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl ${theme.primaryBg} text-white font-bold text-xs shadow-md hover:opacity-90 transition-all`}
            >
              <Plus className="w-4 h-4" />
              <span>إضافة طاولة جديدة</span>
            </button>
          </div>

          {/* QR Code Barcode Studio Banner */}
          <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-purple-900 text-white p-6 rounded-3xl border border-indigo-800 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-3xl shrink-0 border border-white/20">
                📲
              </div>
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <span>مركز باركود الـ QR وستاندات الطاولات للطباعة</span>
                  <span className="text-xs bg-emerald-500 text-white px-2.5 py-0.5 rounded-full font-sans font-bold">جاهز للطباعة</span>
                </h3>
                <p className="text-xs text-indigo-200 mt-1">
                  يمكنك طباعة ستاند طاولة مخصص لكل رقم طاولة، أو طباعة باركود المنيو العام على الطاولات والإعلانات.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <button
                onClick={() => {
                  setQrTargetTable("general");
                  setShowQRModal(true);
                }}
                className="flex-1 md:flex-none px-4 py-2.5 bg-white text-slate-900 hover:bg-slate-100 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
              >
                <QrCode className="w-4 h-4 text-indigo-600" />
                <span>المنيو العام (QR)</span>
              </button>
              <button
                onClick={() => {
                  setQrTargetTable(1);
                  setShowQRModal(true);
                }}
                className="flex-1 md:flex-none px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
              >
                <QrCode className="w-4 h-4 text-white" />
                <span>🖨️ طباعة جميع الطاولات</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {tables.map((t) => {
              const statusColor = 
                t.status === "available" ? "bg-emerald-500 border-emerald-500" :
                t.status === "occupied" ? "bg-rose-500 border-rose-500" :
                t.status === "reserved" ? "bg-amber-500 border-amber-500" : "bg-purple-500 border-purple-500";

              const statusText = 
                t.status === "available" ? "متاح (جاهز)" :
                t.status === "occupied" ? "مشغول بالزبائن" :
                t.status === "reserved" ? "محجوز مسبقاً" : "بحاجة للتنظيف";

              return (
                <div key={t.id} className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">طاولة رقم {t.tableNumber}</h3>
                      <p className="text-xs text-slate-500">السعة: {t.capacity} أشخاص</p>
                    </div>
                    <span className={`w-3 h-3 rounded-full ${statusColor} shadow-sm animate-pulse`} />
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <label className="block text-[10px] text-slate-400 font-bold mb-1">تغيير الحالة الفورية:</label>
                    <select
                      value={t.status}
                      onChange={(e) => onUpdateTable(t.id, { status: e.target.value as any })}
                      className="w-full px-2.5 py-1.5 rounded-lg text-xs font-bold border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 outline-none"
                    >
                      <option value="available">🟢 متاح (Available)</option>
                      <option value="occupied">🔴 مشغول (Occupied)</option>
                      <option value="reserved">🟡 محجوز (Reserved)</option>
                      <option value="needs_cleaning">🟣 بحاجة للتنظيف (Cleaning)</option>
                    </select>

                    <button
                      onClick={() => {
                        setQrTargetTable(t.tableNumber);
                        setShowQRModal(true);
                      }}
                      className="w-full mt-2 py-2 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold border border-indigo-200/80 flex items-center justify-center gap-1.5 transition-all shadow-2xs"
                    >
                      <QrCode className="w-3.5 h-3.5 text-indigo-600" />
                      <span>📲 عرض وطباعة باركود الطاولة</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: DAILY SALES ANALYTICS */}
      {activeTab === "analytics" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold">إجمالي إيرادات الأطباق اليوم</span>
                <DollarSign className="w-5 h-5 text-emerald-500" />
              </div>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white">
                {items.reduce((sum, i) => sum + i.price * 3, 0)} <span className="text-sm font-normal text-emerald-600">{tenant.currency}</span>
              </h3>
              <p className="text-xs text-emerald-600 font-semibold">+14.2% مقارنة بالأمس</p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold">الأصناف المتاحة في الكاشير</span>
                <Utensils className="w-5 h-5 text-amber-500" />
              </div>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white">
                {items.filter(i => i.isAvailable).length} <span className="text-sm font-normal text-slate-500">من {items.length}</span>
              </h3>
              <p className="text-xs text-slate-400 font-semibold">جاهز للطلب في المنيو الرقمي</p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold">متوسط هامش الربح التقريبي</span>
                <TrendingUp className="w-5 h-5 text-indigo-500" />
              </div>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white">
                61.5%
              </h3>
              <p className="text-xs text-indigo-600 font-semibold">معدل ممتاز للمطاعم ومحلات التجزئة</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bar Chart: Items per category */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">توزيع الأصناف حسب الأقسام</h3>
              <div className="h-64 w-full" dir="ltr">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryChartData}>
                    <XAxis dataKey="name" stroke="#888888" fontSize={11} />
                    <YAxis stroke="#888888" fontSize={11} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#10b981" radius={[8, 8, 0, 0]} name="عدد الأصناف" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Best Sellers List */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-500" />
                <span>الأصناف الأكثر طلباً ومبيعاً (Best Sellers)</span>
              </h3>
              <div className="space-y-3">
                {bestSellers.map((it, idx) => (
                  <div key={it.id} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-black flex items-center justify-center">
                        #{idx + 1}
                      </span>
                      <img src={it.image} alt={it.nameAr} className="w-10 h-10 rounded-xl object-cover" />
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">{it.nameAr}</h4>
                        <p className="text-[11px] text-slate-500">السعر: {it.price} {tenant.currency}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-950 px-2.5 py-1 rounded-lg">
                      مطلوب بكثرة
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "users" && (
        <TenantUsersView currentTenant={tenant} />
      )}

      {activeTab === "printers" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <PrinterIcon className="w-5 h-5 text-emerald-600" />
                <span>إدارة الطابعات الحرارية ({printers.length})</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">قم بتهيئة طابعات الفواتير أو بونات المطبخ للربط عبر الشبكة (IP) أو الـ USB.</p>
            </div>
            <button
              onClick={() => {
                setEditingPrinter({
                  name: "",
                  connectionType: "network",
                  ipAddress: "",
                  port: 9100,
                  paperSize: "80mm",
                  printerRole: "receipt",
                  isActive: true,
                  assignedCategories: []
                });
                setShowPrinterModal(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors self-start sm:self-center shadow-md shadow-emerald-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة طابعة جديدة</span>
            </button>
          </div>

          {loadingPrinters ? (
            <div className="text-center py-12 text-slate-500">جاري تحميل الطابعات...</div>
          ) : printers.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center max-w-md mx-auto space-y-4">
              <PrinterIcon className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">لا يوجد طابعات مهيأة</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                لم تقم بتهيئة أي طابعة حتى الآن. يمكنك إضافة طابعة شبكية (Network IP) للمطبخ لتلقي بونات الطلبات تلقائياً أو طابعة كاشير للفواتير.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {printers.map((p) => (
                <div key={p.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4 relative flex flex-col justify-between">
                  <div className="space-y-3 text-right">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                        {p.name}
                      </h4>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        p.connectionType === 'network'
                          ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400'
                          : 'bg-amber-50 text-amber-600 dark:bg-amber-950/40'
                      }`}>
                        {p.connectionType === 'network' ? 'IP شبكة' : p.connectionType === 'usb' ? 'USB' : 'بلوتوث'}
                      </span>
                    </div>

                    <div className="text-xs space-y-1.5 text-slate-600 dark:text-slate-400">
                      {p.connectionType === 'network' && (
                        <p className="font-mono">IP: {p.ipAddress}:{p.port || 9100}</p>
                      )}
                      <p>الدور: <span className="font-bold">{
                        p.printerRole === 'receipt' ? 'فاتورة كاشير' : p.printerRole === 'kitchen' ? 'بون مطبخ' : p.printerRole === 'bar' ? 'مشروبات وعصائر' : 'عامة'
                      }</span></p>
                      <p>حجم الورق: <span className="font-mono">{p.paperSize}</span></p>
                      
                      {p.assignedCategories && p.assignedCategories.length > 0 && (
                        <div className="pt-2">
                          <p className="text-[10px] text-slate-400 mb-1 font-bold">التصنيفات الموجهة:</p>
                          <div className="flex flex-wrap gap-1">
                            {p.assignedCategories.map(catId => {
                              const cat = categories.find(c => c.id === catId);
                              return cat ? (
                                <span key={catId} className="text-[9px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-605 dark:text-slate-300 px-2 py-0.5 rounded-full">
                                  {cat.icon} {cat.nameAr}
                                </span>
                              ) : null;
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 border-t border-slate-100 dark:border-slate-800 pt-4 mt-2">
                    {p.connectionType === 'network' && (
                      <button
                        onClick={() => handleTestPrint(p.id)}
                        className="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors"
                      >
                        تجربة الطباعة 🔄
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setEditingPrinter({ ...p });
                        setShowPrinterModal(true);
                      }}
                      className="p-2 rounded-xl bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-700 transition-colors"
                      title="تعديل"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeletePrinter(p.id)}
                      className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/20 hover:bg-rose-100 text-rose-600 transition-colors"
                      title="حذف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ADD / EDIT ITEM MODAL */}
      {showItemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-6" dir="rtl">
            
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {editingItem ? "تعديل بيانات الطبق / الصنف" : "إضافة طبق أو صنف جديد للمنيو"}
              </h3>
              <button onClick={() => setShowItemModal(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">اسم الطبق بالعربية *</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: كباب لحم نعيمي"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-bold text-slate-900 dark:text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">القسم *</label>
                  <select
                    value={itemCat}
                    onChange={(e) => setItemCat(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white outline-none font-bold"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.icon} {c.nameAr}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">سعر البيع للزبون ({tenant.currency}) *</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    placeholder="0"
                    value={itemPrice}
                    onChange={(e) => setItemPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-mono font-bold text-slate-900 dark:text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">تكلفة المواد الخام (Cost Price) *</label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="لحساب هامش الربح"
                    value={itemCost}
                    onChange={(e) => setItemCost(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-mono font-bold text-slate-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              {/* AI Description Field */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">وصف الطبق والمكونات</label>
                  <button
                    type="button"
                    onClick={handleGenerateAI}
                    disabled={aiGenerating}
                    className="text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 font-bold flex items-center gap-1.5 bg-purple-50 dark:bg-purple-950/80 px-2.5 py-1 rounded-lg border border-purple-200 dark:border-purple-800/60 transition-all disabled:opacity-50"
                  >
                    {aiGenerating ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>جاري صياغة الوصف بالذكاء الاصطناعي...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>✨ توليد وصف تسويقي شهي (Gemini AI)</span>
                      </>
                    )}
                  </button>
                </div>
                <textarea
                  rows={3}
                  placeholder="وصف المكونات والنكهة وطريقة التحضير..."
                  value={itemDesc}
                  onChange={(e) => setItemDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white outline-none leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">رابط صورة الطبق (Image URL)</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={itemImage}
                    onChange={(e) => setItemImage(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">مدة التحضير المتوقعة (بالدقائق)</label>
                  <input
                    type="number"
                    value={itemPrep}
                    onChange={(e) => setItemPrep(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-mono font-bold text-slate-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-slate-800 dark:text-slate-200">
                  <input
                    type="checkbox"
                    checked={itemAvailable}
                    onChange={(e) => setItemAvailable(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>صنف متوفر اليوم للطلب</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-slate-800 dark:text-slate-200">
                  <input
                    type="checkbox"
                    checked={itemBestSeller}
                    onChange={(e) => setItemBestSeller(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500"
                  />
                  <span className="text-amber-600 dark:text-amber-400 font-bold">★ تصنيف (الأكثر مبيعاً)</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowItemModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className={`px-8 py-2.5 rounded-xl ${theme.primaryBg} ${theme.primaryHover} text-white font-bold text-xs shadow-lg transition-all`}
                >
                  {editingItem ? "حفظ التعديلات" : "إضافة الطبق الآن"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD CATEGORY MODAL */}
      {showCatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4" dir="rtl">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">إضافة قسم جديد للمنيو</h3>
              <button onClick={() => setShowCatModal(false)} className="text-slate-400"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">اسم القسم بالعربية *</label>
                <input
                  type="text"
                  placeholder="مثال: مقبلات ساخنة"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-bold text-slate-900 dark:text-white outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">أيقونة القسم (Emoji)</label>
                <input
                  type="text"
                  value={newCatIcon}
                  onChange={(e) => setNewCatIcon(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-lg font-bold text-center outline-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowCatModal(false)} className="px-4 py-2 rounded-xl bg-slate-100 text-xs font-semibold">إلغاء</button>
              <button
                onClick={() => {
                  if (newCatName) {
                    onAddCategory(newCatName, newCatIcon || "🍴");
                    setNewCatName("");
                    setShowCatModal(false);
                  }
                }}
                className={`px-5 py-2 rounded-xl ${theme.primaryBg} text-white text-xs font-bold shadow-md`}
              >
                إضافة القسم
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT PRINTER MODAL */}
      {showPrinterModal && editingPrinter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-6" dir="rtl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <PrinterIcon className="w-5 h-5 text-emerald-600" />
                <span>{editingPrinter.id ? "تعديل إعدادات الطابعة" : "إضافة طابعة جديدة"}</span>
              </h3>
              <button onClick={() => setShowPrinterModal(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePrinter} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 text-right">اسم الطابعة (مثال: طابعة المطبخ) *</label>
                  <input
                    type="text"
                    required
                    value={editingPrinter.name || ""}
                    onChange={e => setEditingPrinter(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white outline-none"
                    placeholder="طابعة المطبخ"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 text-right">نوع الاتصال *</label>
                  <select
                    value={editingPrinter.connectionType || "network"}
                    onChange={e => setEditingPrinter(prev => ({ ...prev, connectionType: e.target.value as any }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold outline-none"
                  >
                    <option value="network">IP شبكة (Network Ethernet/WiFi)</option>
                    <option value="usb">USB (محلي للمتصفح)</option>
                    <option value="bluetooth">بلوتوث</option>
                  </select>
                </div>
              </div>

              {editingPrinter.connectionType === 'network' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 text-right">عنوان الـ IP الخاص بالطابعة *</label>
                    <input
                      type="text"
                      required
                      value={editingPrinter.ipAddress || ""}
                      onChange={e => setEditingPrinter(prev => ({ ...prev, ipAddress: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono outline-none"
                      placeholder="192.168.1.100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 text-right">المنفذ (Port)</label>
                    <input
                      type="number"
                      required
                      value={editingPrinter.port || 9100}
                      onChange={e => setEditingPrinter(prev => ({ ...prev, port: Number(e.target.value) }))}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono outline-none"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 text-right">حجم الورق *</label>
                  <select
                    value={editingPrinter.paperSize || "80mm"}
                    onChange={e => setEditingPrinter(prev => ({ ...prev, paperSize: e.target.value as any }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold outline-none"
                  >
                    <option value="80mm">80mm (الحجم القياسي)</option>
                    <option value="58mm">58mm (الورق الصغير)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 text-right">دور الطابعة الأساسي *</label>
                  <select
                    value={editingPrinter.printerRole || "receipt"}
                    onChange={e => setEditingPrinter(prev => ({ ...prev, printerRole: e.target.value as any }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold outline-none"
                  >
                    <option value="receipt">طابعة الفواتير (الكاشير)</option>
                    <option value="kitchen">طابعة المطبخ (أكلات رئيسية)</option>
                    <option value="bar">طابعة بار المشروبات والعصائر</option>
                    <option value="general">عامة (تطبع كل شيء)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 text-right">ربط توجيه الأقسام تلقائياً:</label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border border-slate-200 dark:border-slate-800 rounded-2xl p-3 bg-slate-50 dark:bg-slate-800/40">
                  {categories.map(cat => {
                    const isChecked = (editingPrinter.assignedCategories || []).includes(cat.id);
                    return (
                      <label key={cat.id} className="flex items-center gap-2 p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:bg-slate-50 cursor-pointer text-xs font-bold">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={e => {
                            const current = editingPrinter.assignedCategories || [];
                            const updated = e.target.checked 
                              ? [...current, cat.id]
                              : current.filter(id => id !== cat.id);
                            setEditingPrinter(prev => ({ ...prev, assignedCategories: updated }));
                          }}
                          className="w-4 h-4 rounded text-emerald-600 ml-1.5"
                        />
                        <span>{cat.icon} {cat.nameAr}</span>
                      </label>
                    );
                  })}
                </div>
                <p className="text-[10px] text-slate-405 dark:text-slate-500 mt-1.5 leading-relaxed text-right">
                  * سيتم توجيه طباعة الأصناف التابعة للأقسام المحددة فقط إلى هذه الطابعة عند إرسال طلب للمطبخ.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowPrinterModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className={`px-6 py-2.5 rounded-xl ${theme.primaryBg} text-white text-xs font-bold shadow-md shadow-emerald-500/20`}
                >
                  حفظ الطابعة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Code Stand & Printing Modal */}
      {showQRModal && (
        <QRCodeModal
          tenant={tenant}
          tables={tables}
          initialTableNumber={qrTargetTable}
          onClose={() => setShowQRModal(false)}
        />
      )}
    </div>
  );
};
