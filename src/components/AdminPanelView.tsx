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

const adminTranslations = {
  ar: {
    title: "لوحة التحكم وإدارة المطعم",
    subtitle: "التحكم في الهوية، قائمة الأصناف والأسعار، وإدارة الطاولات",
    tabMenu: "إدارة المنيو والأصناف",
    tabBranding: "الهوية والألوان",
    tabTables: "إدارة الطاولات",
    tabAnalytics: "تحليلات المبيعات",
    tabUsers: "الموظفون والصلاحيات",
    tabPrinters: "إدارة الطابعات"
  },
  en: {
    title: "Restaurant Management Panel",
    subtitle: "Manage brand identity, menu items, pricing, and tables",
    tabMenu: "Menu & Items",
    tabBranding: "Branding & Colors",
    tabTables: "Tables",
    tabAnalytics: "Sales Analytics",
    tabUsers: "Staff Permissions",
    tabPrinters: "Printers"
  },
  tr: {
    title: "Restoran Yönetim Paneli",
    subtitle: "Marka kimliği, menü öğeleri, fiyatlandırma ve masaları yönetin",
    tabMenu: "Menü ve Ürünler",
    tabBranding: "Kimlik ve Renkler",
    tabTables: "Masalar",
    tabAnalytics: "Satış Analizleri",
    tabUsers: "Personel Yetkileri",
    tabPrinters: "Yazıcılar"
  }
};

interface AdminPanelViewProps {
  tenant: Tenant;
  categories: Category[];
  items: MenuItem[];
  tables: RestaurantTable[];
  onUpdateTenant: (tenant: Tenant) => void;
  onAddCategory: (nameAr: string, icon: string, nameEn?: string, nameTr?: string) => void;
  onUpdateCategory?: (id: string, nameAr: string, icon: string, nameEn?: string, nameTr?: string) => void;
  onDeleteCategory?: (id: string) => void;
  onAddItem: (item: Partial<MenuItem>) => void;
  onUpdateItem: (id: string, updates: Partial<MenuItem>) => void;
  onDeleteItem: (id: string) => void;
  onUpdateTable: (id: string, updates: Partial<RestaurantTable>) => void;
  onAddTable?: (tableNumber: number, capacity: number) => void;
  onDeleteTable?: (id: string) => void;
  onReorderCategories?: (orderedIds: string[]) => void;
  lang?: 'ar' | 'en' | 'tr';
}

export const AdminPanelView: React.FC<AdminPanelViewProps> = ({
  tenant,
  categories,
  items,
  tables,
  onUpdateTenant,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  onUpdateTable,
  onAddTable,
  onDeleteTable,
  onReorderCategories,
  lang = 'ar'
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
  const [itemNameEn, setItemNameEn] = useState("");
  const [itemNameTr, setItemNameTr] = useState("");
  const [itemDesc, setItemDesc] = useState("");
  const [itemDescEn, setItemDescEn] = useState("");
  const [itemDescTr, setItemDescTr] = useState("");
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
  const [newCatNameEn, setNewCatNameEn] = useState("");
  const [newCatNameTr, setNewCatNameTr] = useState("");
  const [newCatIcon, setNewCatIcon] = useState("🍽️");
  const [showCatModal, setShowCatModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const openCategoryModal = (cat?: Category) => {
    if (cat) {
      setEditingCategory(cat);
      setNewCatName(cat.nameAr);
      setNewCatNameEn(cat.nameEn || "");
      setNewCatNameTr(cat.nameTr || "");
      setNewCatIcon(cat.icon || "🍽️");
    } else {
      setEditingCategory(null);
      setNewCatName("");
      setNewCatNameEn("");
      setNewCatNameTr("");
      setNewCatIcon("🍽️");
    }
    setShowCatModal(true);
  };

  const theme = getThemeClasses(tenant.themeColor);

  // Handle open add/edit item modal
  const openItemModal = (item?: MenuItem) => {
    if (item) {
      setEditingItem(item);
      setItemName(item.nameAr);
      setItemNameEn(item.nameEn || "");
      setItemNameTr(item.nameTr || "");
      setItemDesc(item.descriptionAr);
      setItemDescEn(item.descriptionEn || "");
      setItemDescTr(item.descriptionTr || "");
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
      setItemNameEn("");
      setItemNameTr("");
      setItemDesc("");
      setItemDescEn("");
      setItemDescTr("");
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
    const finalItemName = itemName.trim() || itemNameEn.trim() || itemNameTr.trim();
    if (!finalItemName || !itemPrice) {
      alert(lang === 'ar' ? "يرجى إدخال اسم الطبق والسعر" : lang === 'tr' ? "Lütfen ürün adını ve fiyatını girin" : "Please enter item name and price");
      return;
    }

    const payload: Partial<MenuItem> = {
      nameAr: finalItemName,
      nameEn: itemNameEn.trim() || undefined,
      nameTr: itemNameTr.trim() || undefined,
      descriptionAr: itemDesc.trim(),
      descriptionEn: itemDescEn.trim() || undefined,
      descriptionTr: itemDescTr.trim() || undefined,
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
    <div className="space-y-6 animate-in fade-in duration-200" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      
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
                {lang === 'ar' ? 'لوحة المالك (Admin)' : lang === 'tr' ? 'Sahip Paneli (Admin)' : 'Owner Panel (Admin)'}
              </span>
              {tenant.status === 'trial' && (
                <span className="text-[11px] bg-amber-100 dark:bg-amber-950 text-amber-855 dark:text-amber-300 border border-amber-200 dark:border-amber-900 px-2.5 py-0.5 rounded-full animate-pulse font-bold">
                  {lang === 'ar' ? `⏳ تجريبي: متبقي ${getTrialDaysLeft()} يوم` : lang === 'tr' ? `⏳ Deneme: ${getTrialDaysLeft()} gün kaldı` : `⏳ Trial: ${getTrialDaysLeft()} days left`}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1">{adminTranslations[lang].subtitle}</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl overflow-x-auto border border-slate-200 no-scrollbar">
          <button
            onClick={() => setActiveTab("menu")}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === "menu"
                ? `${theme.primaryBg} text-white shadow-sm`
                : "text-slate-600 hover:bg-white/70"
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>{adminTranslations[lang].tabMenu}</span>
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
            <span>{adminTranslations[lang].tabBranding}</span>
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
            <span>{adminTranslations[lang].tabTables}</span>
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
            <span>{adminTranslations[lang].tabAnalytics}</span>
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
            <span>{adminTranslations[lang].tabUsers}</span>
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
            <span>{adminTranslations[lang].tabPrinters}</span>
          </button>
        </div>
      </div>

      {/* TAB 1: MENU & ITEMS MANAGEMENT */}
      {activeTab === "menu" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Utensils className="w-5 h-5 text-emerald-600" />
                <span>
                  {lang === 'ar' ? 'أصناف قائمة الطعام' : lang === 'tr' ? 'Yemek Menüsü Öğeleri' : 'Menu Items'} ({items.length})
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {lang === 'ar' ? 'يمكنك إضافة أطباق جديدة، تغيير الأسعار فوراً، أو تعطيل توفر الصنف في الكاشير والمنيو الرقمي' : lang === 'tr' ? 'Yeni yemekler ekleyebilir, fiyatları hemen değiştirebilir veya kasiyer ile dijital menüde ürünün kullanılabilirliğini kapatabilirsiniz.' : 'You can add new dishes, change prices instantly, or toggle item availability in POS and digital menu.'}
              </p>
            </div>
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => openCategoryModal()}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-750 font-bold text-xs transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{lang === 'ar' ? 'إضافة قسم جديد' : lang === 'tr' ? 'Yeni Kategori Ekle' : 'Add New Category'}</span>
              </button>
              <button
                onClick={() => openItemModal()}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl ${theme.primaryBg} ${theme.primaryHover} text-white font-bold text-xs shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer`}
              >
                <Plus className="w-4 h-4" />
                <span>{lang === 'ar' ? 'إضافة طبق / صنف جديد' : lang === 'tr' ? 'Yeni Yemek/Ürün Ekle' : 'Add New Item'}</span>
              </button>
            </div>
          </div>

          {/* Categories Horizontal Banner */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
            {categories.map((cat, idx) => (
              <div key={cat.id} className="bg-white dark:bg-slate-900 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-2 shrink-0">
                <span className="text-lg">{cat.icon}</span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {lang === 'en' && cat.nameEn ? cat.nameEn : lang === 'tr' && cat.nameTr ? cat.nameTr : cat.nameAr}
                </span>
                <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full text-slate-500 font-mono">
                  {items.filter(i => i.categoryId === cat.id).length}
                </span>

                {/* Edit & Delete Controls */}
                <div className="flex items-center gap-0.5 border-r border-slate-200 dark:border-slate-800 px-1.5 mr-1">
                  <button 
                    onClick={() => openCategoryModal(cat)}
                    className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-blue-600 dark:text-blue-400 cursor-pointer"
                    title={lang === 'ar' ? "تعديل" : lang === 'tr' ? "Düzenle" : "Edit"}
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => {
                      const count = items.filter(i => i.categoryId === cat.id).length;
                      if (count > 0) {
                        alert(lang === 'ar' ? "لا يمكن حذف هذا القسم لأنه يحتوي على أصناف. يرجى نقل الأصناف أو حذفها أولاً." : lang === 'tr' ? "Bu kategori ürün içerdiği için silinemez. Lütfen önce ürünleri başka bir yere taşıyın veya silin." : "Cannot delete this category because it contains items. Please move or delete them first.");
                        return;
                      }
                      if (confirm(lang === 'ar' ? "هل أنت متأكد من حذف هذا القسم؟" : lang === 'tr' ? "Bu kategoriyi silmek istediğinizden emin misiniz?" : "Are you sure you want to delete this category?")) {
                        onDeleteCategory && onDeleteCategory(cat.id);
                      }
                    }}
                    className="p-1 rounded hover:bg-slate-105 dark:hover:bg-slate-800 text-rose-600 dark:text-rose-400 cursor-pointer"
                    title={lang === 'ar' ? "حذف" : lang === 'tr' ? "Sil" : "Delete"}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Reordering Controls */}
                <div className="flex items-center gap-0.5 mr-1 border-r border-slate-200 dark:border-slate-800 pr-1.5">
                  <button 
                    disabled={idx === 0}
                    onClick={() => handleMoveCategory(idx, -1)}
                    className="p-0.5 rounded hover:bg-slate-150 dark:hover:bg-slate-800 text-slate-500 disabled:opacity-20 cursor-pointer"
                    title={lang === 'ar' ? "تحريك لليمين" : lang === 'tr' ? "Sağa Taşı" : "Move Left"}
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    disabled={idx === categories.length - 1}
                    onClick={() => handleMoveCategory(idx, 1)}
                    className="p-0.5 rounded hover:bg-slate-150 dark:hover:bg-slate-800 text-slate-500 disabled:opacity-20 cursor-pointer"
                    title={lang === 'ar' ? "تحريك لليسار" : lang === 'tr' ? "Sola Taşı" : "Move Right"}
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Items Table List */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 text-xs font-bold border-b border-slate-200 dark:border-slate-800">
                    <th className="p-4">{lang === 'ar' ? 'الصنف والوصف' : lang === 'tr' ? 'Ürün & Açıklama' : 'Item & Description'}</th>
                    <th className="p-4">{lang === 'ar' ? 'القسم' : lang === 'tr' ? 'Kategori' : 'Category'}</th>
                    <th className="p-4">{lang === 'ar' ? 'السعر والتكلفة' : lang === 'tr' ? 'Fiyat & Maliyet' : 'Price & Cost'}</th>
                    <th className="p-4">{lang === 'ar' ? 'مدة التحضير' : lang === 'tr' ? 'Hazırlama Süresi' : 'Prep Time'}</th>
                    <th className="p-4">{lang === 'ar' ? 'الحالة والتوفر' : lang === 'tr' ? 'Durum & Stok' : 'Status & Availability'}</th>
                    <th className="p-4 text-center">{lang === 'ar' ? 'إجراءات' : lang === 'tr' ? 'İşlemler' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                  {items.map((item) => {
                    const cat = categories.find(c => c.id === item.categoryId);
                    const margin = item.price > 0 ? Math.round(((item.price - item.costPrice) / item.price) * 100) : 0;
                    const itemName = lang === 'en' && item.nameEn ? item.nameEn : lang === 'tr' && item.nameTr ? item.nameTr : item.nameAr;
                    const itemDesc = lang === 'en' && item.descriptionEn ? item.descriptionEn : lang === 'tr' && item.descriptionTr ? item.descriptionTr : item.descriptionAr;
                    const catName = cat ? (lang === 'en' && cat.nameEn ? cat.nameEn : lang === 'tr' && cat.nameTr ? cat.nameTr : cat.nameAr) : '';
                    return (
                      <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img src={item.image} alt={itemName} className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-200" />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-900 dark:text-white">{itemName}</span>
                                {item.isBestSeller && (
                                  <span className="bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 text-[10px] font-bold px-1.5 py-0.2 rounded">
                                    {lang === 'ar' ? '★ مميز' : lang === 'tr' ? '★ Popüler' : '★ Featured'}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-500 line-clamp-1 max-w-xs mt-0.5">{itemDesc}</p>
                            </div>
                          </div>
                        </td>

                        <td className="p-4">
                          <span className="text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-lg">
                            {cat ? `${cat.icon} ${catName}` : (lang === 'ar' ? 'عام' : lang === 'tr' ? 'Genel' : 'General')}
                          </span>
                        </td>

                        <td className="p-4">
                          <div className="font-bold text-slate-900 dark:text-white font-sans">
                            {item.price} <span className="text-xs font-normal text-slate-500">{tenant.currency}</span>
                          </div>
                          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-sans">
                            {lang === 'ar' ? 'هامش الربح:' : lang === 'tr' ? 'Kâr Marjı:' : 'Profit Margin:'} {margin}%
                          </div>
                        </td>

                        <td className="p-4 text-xs text-slate-600 dark:text-slate-400 font-sans">
                          {item.preparationTimeMin || 15} {lang === 'ar' ? 'دقيقة' : lang === 'tr' ? 'dakika' : 'mins'}
                        </td>

                        <td className="p-4">
                          <button
                            onClick={() => onUpdateItem(item.id, { isAvailable: !item.isAvailable })}
                            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                              item.isAvailable
                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-500/20"
                                : "bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-500/20"
                            }`}
                          >
                            {item.isAvailable ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                            <span>
                              {item.isAvailable 
                                ? (lang === 'ar' ? "متوفر اليوم" : lang === 'tr' ? "Bugün Mevcut" : "Available Today") 
                                : (lang === 'ar' ? "نفد (غير متاح)" : lang === 'tr' ? "Tükendi (Mevcut Değil)" : "Out of Stock")}
                            </span>
                          </button>
                        </td>

                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => openItemModal(item)}
                              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 transition-colors cursor-pointer"
                              title={lang === 'ar' ? "تعديل الطبق" : lang === 'tr' ? "Yemeği Düzenle" : "Edit Item"}
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                const question = lang === 'ar' 
                                  ? `هل أنت متأكد من حذف طبق "${item.nameAr}"؟` 
                                  : lang === 'tr' 
                                  ? `"${item.nameTr || item.nameAr}" yemeğini silmek istediğinizden emin misiniz?` 
                                  : `Are you sure you want to delete item "${item.nameEn || item.nameAr}"?`;
                                if (confirm(question)) {
                                  onDeleteItem(item.id);
                                }
                              }}
                              className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400 transition-colors cursor-pointer"
                              title={lang === 'ar' ? "حذف الطبق" : lang === 'tr' ? "Yemeği Sil" : "Delete Item"}
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
                <span>{lang === 'ar' ? 'إعدادات الهوية البصرية والمطعم (Brand Customization)' : lang === 'tr' ? 'Restoran Kimliği ve Ayarları (Brand Customization)' : 'Restaurant Branding & Settings (Brand Customization)'}</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {lang === 'ar' ? 'التغييرات ستنعكس فوراً على لوحة الكاشير، قائمة الطعام الرقمية، والإيصالات الضريبية' : lang === 'tr' ? 'Değişiklikler kasiyer paneline, dijital menüye ve vergi faturalarına anında yansıyacaktır' : 'Changes will reflect instantly on POS cashier screen, digital menu, and tax receipts'}
              </p>
            </div>
            {saveSuccess && (
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-1.5 animate-bounce">
                <Check className="w-4 h-4" />
                <span>{lang === 'ar' ? 'تم حفظ الإعدادات بنجاح!' : lang === 'tr' ? 'Ayarlar başarıyla kaydedildi!' : 'Settings saved successfully!'}</span>
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">{lang === 'ar' ? 'اسم المطعم بالعربية' : lang === 'tr' ? 'Arapça Restoran Adı' : 'Arabic Restaurant Name'}</label>
              <input
                type="text"
                value={nameAr}
                onChange={(e) => setNameAr(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">{lang === 'ar' ? 'شعار المطعم / نوع المطبخ (Slogan)' : lang === 'tr' ? 'Restoran Sloganı / Mutfak Türü' : 'Restaurant Slogan / Kitchen Type'}</label>
              <input
                type="text"
                value={slogan}
                onChange={(e) => setSlogan(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">{lang === 'ar' ? 'رقم الهاتف' : lang === 'tr' ? 'Telefon Numarası' : 'Phone Number'}</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">{lang === 'ar' ? 'نسبة ضريبة القيمة المضافة (VAT %)' : lang === 'tr' ? 'KDV Oranı (KDV %)' : 'Value Added Tax (VAT %)'}</label>
              <input
                type="number"
                value={taxRate}
                onChange={(e) => setTaxRate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">{lang === 'ar' ? 'البلد والعملة الرسمية' : lang === 'tr' ? 'Ülke ve Resmi Para Birimi' : 'Country & Official Currency'}</label>
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
                <option value="ر.س">{lang === 'ar' ? 'المملكة العربية السعودية (ر.س)' : lang === 'tr' ? 'Suudi Arabistan (SAR)' : 'Saudi Arabia (SAR)'}</option>
                <option value="د.إ">{lang === 'ar' ? 'الإمارات العربية المتحدة (د.إ)' : lang === 'tr' ? 'Birleşik Arap Emirlikleri (AED)' : 'United Arab Emirates (AED)'}</option>
                <option value="د.ك">{lang === 'ar' ? 'الكويت (د.ك)' : lang === 'tr' ? 'Kuveyt (KWD)' : 'Kuwait (KWD)'}</option>
                <option value="ر.ق">{lang === 'ar' ? 'قطر (ر.ق)' : lang === 'tr' ? 'Katar (QAR)' : 'Qatar (QAR)'}</option>
                <option value="د.ب">{lang === 'ar' ? 'البحرين (د.ب)' : lang === 'tr' ? 'Bahreyn (BHD)' : 'Bahrain (BHD)'}</option>
                <option value="ر.ع">{lang === 'ar' ? 'سلطنة عمان (ر.ع)' : lang === 'tr' ? 'Umman (OMR)' : 'Oman (OMR)'}</option>
                <option value="ج.م">{lang === 'ar' ? 'جمهورية مصر العربية (ج.م)' : lang === 'tr' ? 'Mısır (EGP)' : 'Egypt (EGP)'}</option>
                <option value="د.أ">{lang === 'ar' ? 'المملكة الأردنية الهاشمية (د.أ)' : lang === 'tr' ? 'Ürdün (JOD)' : 'Jordan (JOD)'}</option>
                <option value="د.ع">{lang === 'ar' ? 'العراق (د.ع)' : lang === 'tr' ? 'Irak (IQD)' : 'Iraq (IQD)'}</option>
                <option value="$">{lang === 'ar' ? 'الولايات المتحدة / عملة دولية ($)' : lang === 'tr' ? 'ABD / Uluslararası ($)' : 'United States / Global ($)'}</option>
                <option value="custom">{lang === 'ar' ? 'عملة مخصصة أخرى...' : lang === 'tr' ? 'Diğer özel para birimi...' : 'Other custom currency...'}</option>
              </select>

              {!["ر.س", "د.إ", "د.ك", "ر.ق", "د.ب", "ر.ع", "ج.م", "د.أ", "د.ع", "$"].includes(currency) && (
                <input
                  type="text"
                  placeholder={lang === 'ar' ? "اكتب رمز العملة المخصصة هنا (مثال: د.ت)" : lang === 'tr' ? "Özel para birimi simgesini buraya yazın (Örn: TL)" : "Type custom currency symbol here (e.g. TL)"}
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none font-sans"
                />
              )}
            </div>

            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">{lang === 'ar' ? 'اسم شبكة واي فاي المطعم (WiFi SSID)' : lang === 'tr' ? 'Restoran WiFi Adı (WiFi SSID)' : 'Restaurant WiFi Name (WiFi SSID)'}</label>
                <input
                  type="text"
                  placeholder={lang === 'ar' ? 'اتركه فارغاً إذا لم يتوفر' : lang === 'tr' ? 'Mevcut değilse boş bırakın' : 'Leave empty if not available'}
                  value={wifiName}
                  onChange={(e) => setWifiName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">{lang === 'ar' ? 'كلمة مرور واي فاي المطعم (لعملائك)' : lang === 'tr' ? 'Restoran WiFi Şifresi (Müşteriler için)' : 'Restaurant WiFi Password (For customers)'}</label>
                <input
                  type="text"
                  placeholder={lang === 'ar' ? 'اتركه فارغاً إذا لم يتوفر' : lang === 'tr' ? 'Mevcut değilse boş bırakın' : 'Leave empty if not available'}
                  value={wifiPass}
                  onChange={(e) => setWifiPass(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">{lang === 'ar' ? 'العنوان وموقع الفرع' : lang === 'tr' ? 'Restoran Adresi ve Konumu' : 'Branch Address & Location'}</label>
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
                  <span>{lang === 'ar' ? 'شعار المطعم (Logo Options)' : lang === 'tr' ? 'Restoran Logosu (Logo Options)' : 'Restaurant Logo (Logo Options)'}</span>
                </label>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {lang === 'ar' ? 'يمكنك اختيار أيقونة تعبيرية، أو كتابة حروف واختصار مخصص، أو رفع صورة الشعار الخاص بالمطعم.' : lang === 'tr' ? 'Bir emoji seçebilir, özel harfler yazabilir veya restoran logonuzun resmini yükleyebilirsiniz.' : 'You can choose an emoji icon, write custom text/initials, or upload your restaurant logo image.'}
                </p>
              </div>

              {/* Live Preview Badge */}
              <div className="flex items-center gap-2.5 bg-white dark:bg-slate-800 px-3.5 py-2 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs shrink-0 font-sans">
                <span className="text-xs text-slate-500 font-bold">{lang === 'ar' ? 'معاينة الشعار:' : lang === 'tr' ? 'Logo Önizleme:' : 'Logo Preview:'}</span>
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 flex items-center justify-center text-2xl overflow-hidden shadow-sm">
                  <RestaurantLogo logo={logo} />
                </div>
              </div>
            </div>

            {/* Option 1: File Upload / Image URL / Custom Text */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1">
              <div className="sm:col-span-7">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  {lang === 'ar' ? 'رابط صورة الشعار (https://...) أو كتابة حروف ورمز مخصص (مثال: ✨ أو KF)' : lang === 'tr' ? 'Logo Resmi URLsi (https://...) veya Özel Metin (Örn: ✨ veya KF)' : 'Logo Image URL (https://...) or Custom Text (e.g. ✨ or KF)'}
                </label>
                <input
                  type="text"
                  placeholder={lang === 'ar' ? "ضع رابط صورة أو اكتب رمز شعارك هنا..." : lang === 'tr' ? "Resim bağlantısını yapıştırın veya logonuzu yazın..." : "Paste image URL or type your logo symbol here..."}
                  value={logo}
                  onChange={(e) => setLogo(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  dir="ltr"
                />
              </div>

              <div className="sm:col-span-5 flex items-end">
                <label className="w-full cursor-pointer bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all transform hover:-translate-y-0.5 text-center">
                  <Upload className="w-4 h-4 shrink-0 animate-bounce" />
                  <span>{lang === 'ar' ? '📂 رفع صورة شعار من جهازك' : lang === 'tr' ? '📂 Cihazınızdan Logo Yükleyin' : '📂 Upload Logo from Device'}</span>
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
                {lang === 'ar' ? 'أو اختر من الرموز التعبيرية الجاهزة للمطاعم والكافيهات:' : lang === 'tr' ? 'Veya restoran ve kafeler için hazır emojilerden seçin:' : 'Or choose from ready-to-use emojis for restaurants & cafes:'}
              </label>
              <div className="flex flex-wrap gap-2 p-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 max-h-48 overflow-y-auto">
                {emojis.map((em) => (
                  <button
                    key={em}
                    type="button"
                    onClick={() => setLogo(em)}
                    className={`w-11 h-11 rounded-xl text-2xl flex items-center justify-center transition-transform hover:scale-110 overflow-hidden shrink-0 cursor-pointer ${
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
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{lang === 'ar' ? 'اللون الأساسي للواجهات (Brand Theme)' : lang === 'tr' ? 'Arayüzler İçin Ana Renk (Brand Theme)' : 'Primary Interface Color (Brand Theme)'}</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {colors.map((col) => {
                const colorName = lang === 'ar' ? col.name :
                  lang === 'tr' ? (
                    col.id === 'emerald' ? 'Zümrüt Yeşili' :
                    col.id === 'amber' ? 'Altın Sarısı' :
                    col.id === 'rose' ? 'Gül Pembesi' :
                    col.id === 'indigo' ? 'Çivit Mavisi' :
                    col.id === 'violet' ? 'Menekşe Moru' :
                    col.id === 'slate' ? 'Kömür Grisi' :
                    col.id === 'cyan' ? 'Açık Mavi' : 'Turuncu'
                  ) : (
                    col.id === 'emerald' ? 'Emerald Green' :
                    col.id === 'amber' ? 'Amber Gold' :
                    col.id === 'rose' ? 'Rose Pink' :
                    col.id === 'indigo' ? 'Indigo Blue' :
                    col.id === 'violet' ? 'Violet Purple' :
                    col.id === 'slate' ? 'Charcoal Gray' :
                    col.id === 'cyan' ? 'Cyan Blue' : 'Orange'
                  );
                return (
                  <button
                    key={col.id}
                    type="button"
                    onClick={() => setThemeColor(col.id)}
                    className={`flex items-center gap-2 p-3 rounded-2xl border transition-all cursor-pointer ${
                      themeColor === col.id 
                        ? "border-slate-900 dark:border-white ring-2 ring-emerald-500 shadow-md bg-slate-100 dark:bg-slate-800 font-bold" 
                        : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    }`}
                  >
                    <span className={`w-6 h-6 rounded-full ${col.bg} shadow-sm flex items-center justify-center text-white`}>
                      {themeColor === col.id && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </span>
                    <span className="text-sm text-slate-800 dark:text-slate-200">{colorName}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              type="submit"
              className={`px-8 py-3 rounded-xl ${theme.primaryBg} ${theme.primaryHover} text-white font-bold text-sm shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer`}
            >
              {lang === 'ar' ? 'حفظ التعديلات وتحديث الهوية' : lang === 'tr' ? 'Değişiklikleri Kaydet ve Kimliği Güncelle' : 'Save Changes & Update Brand'}
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
                <span>
                  {lang === 'ar' ? 'طاولات المطعم والجلسات' : lang === 'tr' ? 'Restoran Masaları ve Oturumlar' : 'Restaurant Tables & Seating'} ({tables.length})
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {lang === 'ar' ? 'إدارة حالة الطاولات ومراقبة الإشغال الفوري في الطلبات الداخلية' : lang === 'tr' ? 'Masa durumunu yönetin ve iç siparişlerde anlık doluluk oranını izleyin' : 'Manage table status and monitor real-time occupancy for dine-in orders'}
              </p>
            </div>
            <button
              onClick={() => {
                let maxNum = 0;
                tables.forEach(t => {
                  if (t.tableNumber > maxNum) maxNum = t.tableNumber;
                });
                const nextNum = maxNum + 1;
                onAddTable && onAddTable(nextNum, 4);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl ${theme.primaryBg} text-white font-bold text-xs shadow-md hover:opacity-90 transition-all cursor-pointer`}
            >
              <Plus className="w-4 h-4" />
              <span>{lang === 'ar' ? 'إضافة طاولة جديدة' : lang === 'tr' ? 'Yeni Masa Ekle' : 'Add New Table'}</span>
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
                  <span>{lang === 'ar' ? 'مركز باركود الـ QR وستاندات الطاولات للطباعة' : lang === 'tr' ? 'QR Barkod Merkezi ve Masa Standı Basımı' : 'QR Barcode Studio & Table Stands Printing'}</span>
                  <span className="text-xs bg-emerald-500 text-white px-2.5 py-0.5 rounded-full font-sans font-bold">
                    {lang === 'ar' ? 'جاهز للطباعة' : lang === 'tr' ? 'Baskıya Hazır' : 'Ready to Print'}
                  </span>
                </h3>
                <p className="text-xs text-indigo-200 mt-1">
                  {lang === 'ar' ? 'يمكنك طباعة ستاند طاولة مخصص لكل رقم طاولة، أو طباعة باركود المنيو العام على الطاولات والإعلانات.' : lang === 'tr' ? 'Her masa numarası için özel bir masa standı yazdırabilir veya masalar ve reklamlar için genel menü barkodunu yazdırabilirsiniz.' : 'You can print a custom table stand for each table number, or print the general menu QR code for tables and advertisements.'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <button
                onClick={() => {
                  setQrTargetTable("general");
                  setShowQRModal(true);
                }}
                className="flex-1 md:flex-none px-4 py-2.5 bg-white text-slate-900 hover:bg-slate-100 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <QrCode className="w-4 h-4 text-indigo-600" />
                <span>{lang === 'ar' ? 'المنيو العام (QR)' : lang === 'tr' ? 'Genel Menü (QR)' : 'General Menu (QR)'}</span>
              </button>
              <button
                onClick={() => {
                  setQrTargetTable(1);
                  setShowQRModal(true);
                }}
                className="flex-1 md:flex-none px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <QrCode className="w-4 h-4 text-white" />
                <span>{lang === 'ar' ? '🖨️ طباعة جميع الطاولات' : lang === 'tr' ? '🖨️ Tüm Masaları Yazdır' : '🖨️ Print All Tables'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {tables.map((t) => {
              const statusColor = 
                t.status === "available" ? "bg-emerald-500 border-emerald-500" :
                t.status === "occupied" ? "bg-rose-500 border-rose-500" :
                t.status === "reserved" ? "bg-amber-500 border-amber-500" : "bg-purple-500 border-purple-500";

              return (
                <div key={t.id} className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-500">{lang === 'ar' ? 'رقم الطاولة:' : lang === 'tr' ? 'Masa No:' : 'Table No:'}</span>
                        <input
                          type="number"
                          min="1"
                          value={t.tableNumber}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            if (val > 0) onUpdateTable(t.id, { tableNumber: val });
                          }}
                          className="w-14 px-1.5 py-0.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-black text-center bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-slate-400">{lang === 'ar' ? 'السعة (أشخاص):' : lang === 'tr' ? 'Kapasite:' : 'Capacity:'}</span>
                        <input
                          type="number"
                          min="1"
                          max="100"
                          value={t.capacity}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            if (val > 0) onUpdateTable(t.id, { capacity: val });
                          }}
                          className="w-14 px-1.5 py-0.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-bold text-center bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-350 outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${statusColor} shadow-sm animate-pulse`} />
                      <button 
                        onClick={() => {
                          if (confirm(lang === 'ar' ? "هل أنت متأكد من حذف هذه الطاولة؟" : lang === 'tr' ? "Bu masayı silmek istediğinizden emin misiniz?" : "Are you sure you want to delete this table?")) {
                            onDeleteTable && onDeleteTable(t.id);
                          }
                        }}
                        className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-rose-600 dark:text-rose-400 cursor-pointer"
                        title={lang === 'ar' ? "حذف الطاولة" : lang === 'tr' ? "Masayı Sil" : "Delete Table"}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <label className="block text-[10px] text-slate-400 font-bold mb-1">{lang === 'ar' ? 'تغيير الحالة الفورية:' : lang === 'tr' ? 'Anlık Durumu Değiştir:' : 'Change Instant Status:'}</label>
                    <select
                      value={t.status}
                      onChange={(e) => onUpdateTable(t.id, { status: e.target.value as any })}
                      className="w-full px-2.5 py-1.5 rounded-lg text-xs font-bold border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 outline-none cursor-pointer"
                    >
                      <option value="available">{lang === 'ar' ? '🟢 متاح (Available)' : lang === 'tr' ? '🟢 Uygun (Available)' : '🟢 Available'}</option>
                      <option value="occupied">{lang === 'ar' ? '🔴 مشغول (Occupied)' : lang === 'tr' ? '🔴 Dolu (Occupied)' : '🔴 Occupied'}</option>
                      <option value="reserved">{lang === 'ar' ? '🟡 محجوز (Reserved)' : lang === 'tr' ? '🟡 Rezerve (Reserved)' : '🟡 Reserved'}</option>
                      <option value="needs_cleaning">{lang === 'ar' ? '🟣 بحاجة للتنظيف (Cleaning)' : lang === 'tr' ? '🟣 Temizlik Gerekiyor (Cleaning)' : '🟣 Needs Cleaning'}</option>
                    </select>

                    <button
                      onClick={() => {
                        setQrTargetTable(t.tableNumber);
                        setShowQRModal(true);
                      }}
                      className="w-full mt-2 py-2 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold border border-indigo-200/80 flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer"
                    >
                      <QrCode className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{lang === 'ar' ? '📲 عرض وطباعة باركود الطاولة' : lang === 'tr' ? '📲 Masa QR Kodu Yazdır' : '📲 View & Print Table QR'}</span>
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
                <span className="text-xs font-bold">{lang === 'ar' ? 'إجمالي إيرادات الأطباق اليوم' : lang === 'tr' ? 'Bugünkü Toplam Yemek Geliri' : 'Total Food Revenue Today'}</span>
                <DollarSign className="w-5 h-5 text-emerald-500" />
              </div>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white font-sans">
                {items.reduce((sum, i) => sum + i.price * 3, 0)} <span className="text-sm font-normal text-emerald-600">{tenant.currency}</span>
              </h3>
              <p className="text-xs text-emerald-600 font-semibold font-sans">{lang === 'ar' ? '+14.2% مقارنة بالأمس' : lang === 'tr' ? 'Düne göre +%14.2' : '+14.2% vs yesterday'}</p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold">{lang === 'ar' ? 'الأصناف المتاحة في الكاشير' : lang === 'tr' ? 'Kasiyerde Mevcut Ürünler' : 'Active Cashier Menu Items'}</span>
                <Utensils className="w-5 h-5 text-amber-500" />
              </div>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white font-sans">
                {items.filter(i => i.isAvailable).length} <span className="text-sm font-normal text-slate-500 font-sans">{lang === 'ar' ? `من ${items.length}` : lang === 'tr' ? ` / ${items.length}` : ` of ${items.length}`}</span>
              </h3>
              <p className="text-xs text-slate-400 font-semibold">{lang === 'ar' ? 'جاهز للطلب في المنيو الرقمي' : lang === 'tr' ? 'Dijital menüde siparişe hazır' : 'Ready for digital menu orders'}</p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold">{lang === 'ar' ? 'متوسط هامش الربح التقريبي' : lang === 'tr' ? 'Ortalama Yaklaşık Kâr Marjı' : 'Average Estimated Profit Margin'}</span>
                <TrendingUp className="w-5 h-5 text-indigo-500" />
              </div>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white font-sans">
                61.5%
              </h3>
              <p className="text-xs text-indigo-600 font-semibold">{lang === 'ar' ? 'معدل ممتاز للمطاعم ومحلات التجزئة' : lang === 'tr' ? 'Restoranlar ve perakende için mükemmel oran' : 'Excellent rate for restaurants and retail'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bar Chart: Items per category */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {lang === 'ar' ? 'توزيع الأصناف حسب الأقسام' : lang === 'tr' ? 'Kategorilere Göre Ürün Dağılımı' : 'Items Distribution by Category'}
              </h3>
              <div className="h-64 w-full" dir="ltr">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryChartData}>
                    <XAxis dataKey="name" stroke="#888888" fontSize={11} />
                    <YAxis stroke="#888888" fontSize={11} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#10b981" radius={[8, 8, 0, 0]} name={lang === 'ar' ? 'عدد الأصناف' : lang === 'tr' ? 'Ürün Sayısı' : 'Number of Items'} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Best Sellers List */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-500" />
                <span>{lang === 'ar' ? 'الأصناف الأكثر طلباً ومبيعاً (Best Sellers)' : lang === 'tr' ? 'En Çok Satan Ürünler (Best Sellers)' : 'Best Selling Items'}</span>
              </h3>
              <div className="space-y-3">
                {bestSellers.map((it, idx) => {
                  const itName = lang === 'en' && it.nameEn ? it.nameEn : lang === 'tr' && it.nameTr ? it.nameTr : it.nameAr;
                  return (
                    <div key={it.id} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-black flex items-center justify-center font-sans">
                          #{idx + 1}
                        </span>
                        <img src={it.image} alt={itName} className="w-10 h-10 rounded-xl object-cover" />
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">{itName}</h4>
                          <p className="text-[11px] text-slate-500 font-sans">{lang === 'ar' ? 'السعر:' : lang === 'tr' ? 'Fiyat:' : 'Price:'} {it.price} {tenant.currency}</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-950 px-2.5 py-1 rounded-lg">
                        {lang === 'ar' ? 'مطلوب بكثرة' : lang === 'tr' ? 'Popüler' : 'Popular'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "users" && (
        <TenantUsersView currentTenant={tenant} lang={lang} />
      )}

      {activeTab === "printers" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <PrinterIcon className="w-5 h-5 text-emerald-600" />
                <span>
                  {lang === 'ar' ? 'إدارة الطابعات الحرارية' : lang === 'tr' ? 'Termal Yazıcı Yönetimi' : 'Thermal Printers Management'} ({printers.length})
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {lang === 'ar' ? 'قم بتهيئة طابعات الفواتير أو بونات المطبخ للربط عبر الشبكة (IP) أو الـ USB.' : lang === 'tr' ? 'Ağ (IP) veya USB üzerinden bağlamak için fatura veya mutfak yazıcılarını yapılandırın.' : 'Configure receipt or kitchen printers for connection via Network (IP) or USB.'}
              </p>
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
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors self-start sm:self-center shadow-md shadow-emerald-500/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{lang === 'ar' ? 'إضافة طابعة جديدة' : lang === 'tr' ? 'Yeni Yazıcı Ekle' : 'Add New Printer'}</span>
            </button>
          </div>

          {loadingPrinters ? (
            <div className="text-center py-12 text-slate-500">{lang === 'ar' ? 'جاري تحميل الطابعات...' : lang === 'tr' ? 'Yazıcılar yükleniyor...' : 'Loading printers...'}</div>
          ) : printers.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center max-w-md mx-auto space-y-4 font-sans">
              <PrinterIcon className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {lang === 'ar' ? 'لا يوجد طابعات مهيأة' : lang === 'tr' ? 'Yapılandırılmış Yazıcı Yok' : 'No Printers Configured'}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {lang === 'ar' ? 'لم تقم بتهيئة أي طابعة حتى الآن. يمكنك إضافة طابعة شبكية (Network IP) للمطبخ لتلقي بونات الطلبات تلقائياً أو طابعة كاشير للفواتير.' : lang === 'tr' ? 'Henüz bir yazıcı yapılandırmadınız. Mutfak için otomatik sipariş fişleri almak üzere bir ağ yazıcısı (Network IP) veya faturalar için bir kasiyer yazıcısı ekleyebilirsiniz.' : 'You have not configured any printer yet. You can add a network printer (Network IP) for the kitchen to receive order tickets automatically or a cashier printer for invoices.'}
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
                        {p.connectionType === 'network' ? (lang === 'ar' ? 'IP شبكة' : lang === 'tr' ? 'Ağ IP' : 'Network IP') : p.connectionType === 'usb' ? 'USB' : (lang === 'ar' ? 'بلوتوث' : 'Bluetooth')}
                      </span>
                    </div>

                    <div className="text-xs space-y-1.5 text-slate-600 dark:text-slate-400">
                      {p.connectionType === 'network' && (
                        <p className="font-mono">IP: {p.ipAddress}:{p.port || 9100}</p>
                      )}
                      <p>{lang === 'ar' ? 'الدور:' : lang === 'tr' ? 'Rol:' : 'Role:'} <span className="font-bold">{
                        p.printerRole === 'receipt' ? (lang === 'ar' ? 'فاتورة كاشير' : lang === 'tr' ? 'Kasa Faturası' : 'Cashier Receipt') : p.printerRole === 'kitchen' ? (lang === 'ar' ? 'بون مطبخ' : lang === 'tr' ? 'Mutfak Fişi' : 'Kitchen Ticket') : p.printerRole === 'bar' ? (lang === 'ar' ? 'مشروبات وعصائر' : lang === 'tr' ? 'Bar / İçecekler' : 'Bar / Drinks') : (lang === 'ar' ? 'عامة' : lang === 'tr' ? 'Genel' : 'General')
                      }</span></p>
                      <p>{lang === 'ar' ? 'حجم الورق:' : lang === 'tr' ? 'Kağıt Boyutu:' : 'Paper Size:'} <span className="font-mono">{p.paperSize}</span></p>
                      
                      {p.assignedCategories && p.assignedCategories.length > 0 && (
                        <div className="pt-2">
                          <p className="text-[10px] text-slate-400 mb-1 font-bold">{lang === 'ar' ? 'التصنيفات الموجهة:' : lang === 'tr' ? 'Yönlendirilen Kategoriler:' : 'Assigned Categories:'}</p>
                          <div className="flex flex-wrap gap-1">
                            {p.assignedCategories.map(catId => {
                              const cat = categories.find(c => c.id === catId);
                              const catName = cat ? (lang === 'en' && cat.nameEn ? cat.nameEn : lang === 'tr' && cat.nameTr ? cat.nameTr : cat.nameAr) : '';
                              return cat ? (
                                <span key={catId} className="text-[9px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-605 dark:text-slate-300 px-2 py-0.5 rounded-full">
                                  {cat.icon} {catName}
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
                        className="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
                      >
                        {lang === 'ar' ? 'تجربة الطباعة 🔄' : lang === 'tr' ? 'Yazdırma Testi 🔄' : 'Print Test 🔄'}
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setEditingPrinter({ ...p });
                        setShowPrinterModal(true);
                      }}
                      className="p-2 rounded-xl bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
                      title={lang === 'ar' ? 'تعديل' : lang === 'tr' ? 'Düzenle' : 'Edit'}
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
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">اسم الطبق بالإنجليزية (English)</label>
                  <input
                    type="text"
                    placeholder="مثال: Grilled Kabab"
                    value={itemNameEn}
                    onChange={(e) => setItemNameEn(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-bold text-slate-900 dark:text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">اسم الطبق بالتركية (Türkçe)</label>
                  <input
                    type="text"
                    placeholder="مثال: Izgara Kebap"
                    value={itemNameTr}
                    onChange={(e) => setItemNameTr(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-bold text-slate-900 dark:text-white outline-none"
                  />
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">وصف الطبق بالإنجليزية (English)</label>
                    <textarea
                      rows={2}
                      placeholder="English description..."
                      value={itemDescEn}
                      onChange={(e) => setItemDescEn(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white outline-none leading-relaxed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">وصف الطبق بالتركية (Türkçe)</label>
                    <textarea
                      rows={2}
                      placeholder="Türkçe açıklama..."
                      value={itemDescTr}
                      onChange={(e) => setItemDescTr(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white outline-none leading-relaxed"
                    />
                  </div>
                </div>
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

      {/* ADD / EDIT CATEGORY MODAL */}
      {showCatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {editingCategory 
                  ? (lang === 'ar' ? 'تعديل بيانات القسم' : lang === 'tr' ? 'Kategoriyi Düzenle' : 'Edit Category')
                  : (lang === 'ar' ? 'إضافة قسم جديد للمنيو' : lang === 'tr' ? 'Yeni Kategori Ekle' : 'Add New Category')
                }
              </h3>
              <button onClick={() => {
                setShowCatModal(false);
                setEditingCategory(null);
                setNewCatName("");
                setNewCatNameEn("");
                setNewCatNameTr("");
              }} className="text-slate-400 cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">{lang === 'ar' ? 'اسم القسم بالعربية *' : lang === 'tr' ? 'Arapça Kategori Adı *' : 'Category Name in Arabic *'}</label>
                <input
                  type="text"
                  placeholder={lang === 'ar' ? "مثال: مقبلات ساخنة" : lang === 'tr' ? "Örnek: Sıcak Başlangıçlar" : "e.g. Hot Appetizers"}
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-bold text-slate-900 dark:text-white outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">{lang === 'ar' ? 'اسم القسم بالإنجليزية (English)' : lang === 'tr' ? 'İngilizce Kategori Adı' : 'Category Name in English'}</label>
                <input
                  type="text"
                  placeholder="e.g. Hot Appetizers"
                  value={newCatNameEn}
                  onChange={(e) => setNewCatNameEn(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-bold text-slate-900 dark:text-white outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">{lang === 'ar' ? 'اسم القسم بالتركية (Türkçe)' : lang === 'tr' ? 'Türkçe Kategori Adı' : 'Category Name in Turkish'}</label>
                <input
                  type="text"
                  placeholder="Örnek: Sıcak Başlangıçlar"
                  value={newCatNameTr}
                  onChange={(e) => setNewCatNameTr(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-bold text-slate-900 dark:text-white outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">{lang === 'ar' ? 'أيقونة القسم (Emoji)' : lang === 'tr' ? 'Kategori Simgesi (Emoji)' : 'Category Icon (Emoji)'}</label>
                <input
                  type="text"
                  value={newCatIcon}
                  onChange={(e) => setNewCatIcon(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-lg font-bold text-center outline-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => {
                setShowCatModal(false);
                setEditingCategory(null);
                setNewCatName("");
                setNewCatNameEn("");
                setNewCatNameTr("");
              }} className="px-4 py-2 rounded-xl bg-slate-100 text-xs font-semibold cursor-pointer">{lang === 'ar' ? 'إلغاء' : lang === 'tr' ? 'İptal' : 'Cancel'}</button>
              <button
                onClick={() => {
                  const finalNameAr = newCatName.trim() || newCatNameEn.trim() || newCatNameTr.trim();
                  if (finalNameAr) {
                    if (editingCategory) {
                      onUpdateCategory && onUpdateCategory(editingCategory.id, finalNameAr, newCatIcon || "🍴", newCatNameEn.trim() || undefined, newCatNameTr.trim() || undefined);
                    } else {
                      onAddCategory(finalNameAr, newCatIcon || "🍴", newCatNameEn.trim() || undefined, newCatNameTr.trim() || undefined);
                    }
                    setNewCatName("");
                    setNewCatNameEn("");
                    setNewCatNameTr("");
                    setEditingCategory(null);
                    setShowCatModal(false);
                  }
                }}
                className={`px-5 py-2 rounded-xl ${theme.primaryBg} text-white text-xs font-bold shadow-md cursor-pointer`}
              >
                {editingCategory 
                  ? (lang === 'ar' ? 'حفظ التغييرات' : lang === 'tr' ? 'Değişiklikleri Kaydet' : 'Save Changes')
                  : (lang === 'ar' ? 'إضافة القسم' : lang === 'tr' ? 'Kategori Ekle' : 'Add Category')
                }
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
