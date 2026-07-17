import React, { useState, useMemo } from "react";
import { Tenant, Category, MenuItem, RestaurantTable, OrderItem, Order, OrderStatus } from "../types";
import { getThemeClasses } from "../utils/theme";
import { RestaurantLogo } from "./RestaurantLogo";
import confetti from "canvas-confetti";
import { 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  ShoppingCart, 
  Clock, 
  Flame, 
  UtensilsCrossed, 
  ShoppingBag, 
  CheckCircle2, 
  Sparkles, 
  Globe, 
  Wifi, 
  MapPin, 
  Phone, 
  Share2, 
  QrCode,
  X,
  ChevronRight,
  Info,
  Facebook,
  Instagram
} from "lucide-react";
import { QRCodeModal } from "./QRCodeModal";

const translations = {
  ar: {
    menuTitle: "قائمة الطعام الرقمية",
    slogan: "أشهى المأكولات والمشروبات الطازجة",
    searchPlaceholder: "البحث عن وجبة أو طبق...",
    allCategories: "كل الأطباق",
    cart: "سلة المشتريات",
    emptyCart: "سلة المشتريات فارغة",
    emptyCartDesc: "أضف بعض الأطباق الشهية للمتابعة",
    subtotal: "المجموع الفرعي",
    tax: "الضريبة والخدمة",
    total: "الإجمالي النهائي",
    orderType: "نوع الطلب",
    dineIn: "🪑 تناول داخل المطعم",
    takeaway: "🛍️ طلب خارجي / سفري",
    tableNum: "رقم الطاولة",
    notes: "ملاحظات خاصة (بدون بصل، إكسترا جبن...)",
    notesPlaceholder: "مثال: بدون فلفل حار...",
    customerName: "اسم الزبون (اختياري)",
    customerNamePlaceholder: "اكتب اسمك هنا...",
    customerPhone: "رقم الجوال (اختياري)",
    customerPhonePlaceholder: "مثال: 05xxxxxxx",
    sendOrder: "🚀 أرسل الطلب للمطبخ الآن",
    activeOrderTitle: "متابعة طلبك الحالي في المطعم",
    calories: "سعرة",
    bestSeller: "الأكثر طلباً",
    preparationTime: "دقيقة تحضير",
    addToCart: "إضافة للسلة",
    currency: "ر.س",
    close: "إغلاق",
    orderNumber: "رقم الطلب",
    orderStatus: "حالة الطلب",
    statusPending: "⏳ بانتظار التأكيد",
    statusPreparing: "👨‍🍳 جاري التحضير",
    statusReady: "✅ جاهز للاستلام",
    statusDelivered: "🍽️ تم التوصيل",
    statusCancelled: "❌ ملغي",
    noItemsFound: "عذراً، لم نجد أصنافاً مطابقة",
    noItemsFoundDesc: "جرب البحث بكلمات أخرى أو تصفح قسم آخر",
    price: "السعر"
  },
  en: {
    menuTitle: "Digital Menu",
    slogan: "Delicious and fresh meals daily",
    searchPlaceholder: "Search for a dish...",
    allCategories: "All Dishes",
    cart: "Shopping Cart",
    emptyCart: "Your cart is empty",
    emptyCartDesc: "Add some delicious dishes to proceed",
    subtotal: "Subtotal",
    tax: "Tax & Service",
    total: "Total",
    orderType: "Order Type",
    dineIn: "🪑 Dine In",
    takeaway: "🛍️ Takeaway",
    tableNum: "Table Number",
    notes: "Special Notes (no onions, extra cheese...)",
    notesPlaceholder: "e.g. No spicy...",
    customerName: "Customer Name (Optional)",
    customerNamePlaceholder: "Enter your name...",
    customerPhone: "Phone Number (Optional)",
    customerPhonePlaceholder: "e.g. 05xxxxxxx",
    sendOrder: "🚀 Send Order to Kitchen",
    activeOrderTitle: "Track Your Current Order",
    calories: "kcal",
    bestSeller: "Best Seller",
    preparationTime: "mins prep",
    addToCart: "Add to Cart",
    currency: "SAR",
    close: "Close",
    orderNumber: "Order No.",
    orderStatus: "Status",
    statusPending: "⏳ Pending Confirmation",
    statusPreparing: "👨‍🍳 Preparing",
    statusReady: "✅ Ready for Pickup",
    statusDelivered: "🍽️ Delivered",
    statusCancelled: "❌ Cancelled",
    noItemsFound: "Sorry, no matching dishes found",
    noItemsFoundDesc: "Try searching other keywords or sections",
    price: "Price"
  },
  tr: {
    menuTitle: "Dijital Menü",
    slogan: "Günlük lezzetli ve taze yemekler",
    searchPlaceholder: "Yemek ara...",
    allCategories: "Tüm Yemekler",
    cart: "Alışveriş Sepeti",
    emptyCart: "Sepetiniz boş",
    emptyCartDesc: "Devam etmek için lezzetli yemekler ekleyin",
    subtotal: "Ara Toplam",
    tax: "Vergi & Hizmet",
    total: "Toplam",
    orderType: "Sipariş Türü",
    dineIn: "🪑 Masada Yemek",
    takeaway: "🛍️ Paket Servis",
    tableNum: "Masa Numarası",
    notes: "Özel Notlar (soğansız, ekstra peynir...)",
    notesPlaceholder: "Örn: Acısız olsun...",
    customerName: "Müşteri Adı (İsteğe Bağlı)",
    customerNamePlaceholder: "Adınızı girin...",
    customerPhone: "Telefon Numarası (İsteğe Bağlı)",
    customerPhonePlaceholder: "Örn: 05xxxxxxx",
    sendOrder: "🚀 Siparişi Mutfağa Gönder",
    activeOrderTitle: "Mevcut Siparişinizi Takip Edin",
    calories: "kcal",
    bestSeller: "En Çok Satan",
    preparationTime: "dk hazırlık",
    addToCart: "Sepete Ekle",
    currency: "TL",
    close: "Kapat",
    orderNumber: "Sipariş No",
    orderStatus: "Durum",
    statusPending: "⏳ Onay Bekliyor",
    statusPreparing: "👨‍🍳 Hazırlanıyor",
    statusReady: "✅ Teslimata Hazır",
    statusDelivered: "🍽️ Teslim Edildi",
    statusCancelled: "❌ İptal Edildi",
    noItemsFound: "Üzgünüz, eşleşen yemek bulunamadı",
    noItemsFoundDesc: "Diğer anahtar kelimeleri veya bölümleri aramayı deneyin",
    price: "Fiyat"
  }
};

interface DigitalMenuViewProps {
  tenant: Tenant;
  categories: Category[];
  items: MenuItem[];
  tables: RestaurantTable[];
  onOrderCreated: (order: Order) => void;
  lang?: 'ar' | 'en' | 'tr';
}

export const DigitalMenuView: React.FC<DigitalMenuViewProps> = ({
  tenant,
  categories,
  items,
  tables,
  onOrderCreated,
  lang: initialLang = 'ar'
}) => {
  const [lang, setLang] = useState<'ar' | 'en' | 'tr'>(initialLang);

  React.useEffect(() => {
    if (initialLang) {
      setLang(initialLang);
    }
  }, [initialLang]);

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [showCartModal, setShowCartModal] = useState<boolean>(false);
  const [orderType, setOrderType] = useState<"dine_in" | "takeaway">("dine_in");
  const [selectedTable, setSelectedTable] = useState<number>(tables[0]?.tableNumber || 1);
  const [customerName, setCustomerName] = useState<string>("");
  const [customerPhone, setCustomerPhone] = useState<string>("");
  const [phoneCountryCode, setPhoneCountryCode] = useState<string>("966");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [orderSuccessNumber, setOrderSuccessNumber] = useState<string | null>(null);
  const [selectedItemDetail, setSelectedItemDetail] = useState<MenuItem | null>(null);
  const [showQRModal, setShowQRModal] = useState<boolean>(false);

  const [activeOrder, setActiveOrder] = useState<{ id: string; orderNumber: string; orderStatus: OrderStatus } | null>(() => {
    const saved = localStorage.getItem("activeCustomerOrder");
    return saved ? JSON.parse(saved) : null;
  });

  // Poll active customer order status
  React.useEffect(() => {
    if (!activeOrder) return;
    const checkStatus = async () => {
      try {
        const res = await fetch(`/api/tenants/${tenant.id}/orders`);
        if (res.ok) {
          const allOrders: Order[] = await res.json();
          const current = allOrders.find(o => o.id === activeOrder.id);
          if (current) {
            setActiveOrder(prev => prev ? { ...prev, orderStatus: current.orderStatus } : null);
          }
        }
      } catch (e) {
        console.error("Failed to check active order status:", e);
      }
    };
    checkStatus();
    const interval = setInterval(checkStatus, 5000); // Check status every 5 seconds
    return () => clearInterval(interval);
  }, [activeOrder?.id, tenant.id]);

  const theme = getThemeClasses(tenant.themeColor);

  // Filter available items
  const availableItems = useMemo(() => {
    return items.filter((item) => {
      const matchCat = selectedCategory === "all" || item.categoryId === selectedCategory;
      const matchSearch = item.nameAr.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.descriptionAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (item.nameEn || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (item.nameTr || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (item.descriptionEn || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (item.descriptionTr || "").toLowerCase().includes(searchQuery.toLowerCase());
      return item.isAvailable && matchCat && matchSearch;
    });
  }, [items, selectedCategory, searchQuery]);

  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  const taxRate = tenant.taxRate || 15;
  const taxAmount = useMemo(() => {
    return Number(((subtotal * taxRate) / 100).toFixed(2));
  }, [subtotal, taxRate]);

  const total = useMemo(() => {
    return Number((subtotal + taxAmount).toFixed(2));
  }, [subtotal, taxAmount]);

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.itemId === item.id);
      if (existing) {
        return prev.map((i) => (i.itemId === item.id ? { ...i, quantity: i.quantity + 1 } : i));
      } else {
        return [
          ...prev,
          {
            id: `oi-${Date.now()}`,
            itemId: item.id,
            nameAr: item.nameAr,
            price: item.price,
            quantity: 1
          }
        ];
      }
    });
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((i) => {
          if (i.itemId === itemId) {
            const newQty = i.quantity + delta;
            return newQty > 0 ? { ...i, quantity: newQty } : null;
          }
          return i;
        })
        .filter(Boolean) as OrderItem[];
    });
  };

  const updateNotes = (itemId: string, notes: string) => {
    setCart((prev) => prev.map((i) => (i.itemId === itemId ? { ...i, notes } : i)));
  };

  const handleSubmitCustomerOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setIsSubmitting(true);
    
    if (tenant.subscriptionPlan === "lite") {
      const whatsappNumber = tenant.phone ? tenant.phone.replace(/[^0-9]/g, "") : "";
      const cleanedNumber = whatsappNumber.startsWith("05") && whatsappNumber.length === 10
        ? "966" + whatsappNumber.substring(1)
        : whatsappNumber;
      
      if (!cleanedNumber) {
        alert(lang === 'ar' ? "عذراً، لم يقم المطعم بتهيئة رقم الهاتف للواتساب بعد." : "Sorry, the restaurant has not configured their WhatsApp number yet.");
        setIsSubmitting(false);
        return;
      }

      // Format items list
      const itemsText = cart.map(i => {
        const notesText = i.notes ? ` (ملاحظة: ${i.notes})` : "";
        return `- ${i.nameAr} (العدد: ${i.quantity}) - ${i.price * i.quantity} ${tenant.currency || 'ر.س'}${notesText}`;
      }).join("\n");

      const typeLabel = orderType === "dine_in" 
        ? (tenant.subscriptionPlan === "lite"
            ? (lang === 'ar' ? "🍽️ تناول في المطعم" : "Dine In")
            : (lang === 'ar' ? "🍽️ سفري/طاولة" : "Dine In / Table"))
        : orderType === "takeaway"
          ? (lang === 'ar' ? "🛍️ سفري/استلام" : "Takeaway")
          : (lang === 'ar' ? "🛵 توصيل" : "Delivery");

      const tableText = orderType === "dine_in" && selectedTable && tenant.subscriptionPlan !== "lite"
        ? `\n📍 رقم الطاولة: ${selectedTable}` 
        : "";

      const formattedCustomerPhone = customerPhone ? `+${phoneCountryCode}${customerPhone.replace(/^0+/, "")}` : "";
      const customerNameText = customerName ? `\n👤 العميل: ${customerName}` : "";
      const customerPhoneText = formattedCustomerPhone ? `\n📞 الهاتف: ${formattedCustomerPhone}` : "";

      const msg = `*طلب جديد من المنيو الرقمي (RestoCloud)* 🍽️\n` +
        `----------------------------------------\n` +
        `*نوع الطلب:* ${typeLabel}${tableText}${customerNameText}${customerPhoneText}\n` +
        `----------------------------------------\n` +
        `*الطلبات:*\n${itemsText}\n` +
        `----------------------------------------\n` +
        `*المجموع الإجمالي:* *${total} ${tenant.currency || 'ر.س'}*\n` +
        `----------------------------------------\n` +
        `شكراً لطلبكم! 🙏`;

      const encodedMsg = encodeURIComponent(msg);
      const whatsappUrl = `https://wa.me/${cleanedNumber}?text=${encodedMsg}`;
      
      // Clear cart & close modal
      setCart([]);
      setShowCartModal(false);
      setIsSubmitting(false);
      
      // Open WhatsApp
      window.open(whatsappUrl, "_blank");
      return;
    }

    try {
      const formattedCustomerPhone = customerPhone ? `+${phoneCountryCode}${customerPhone.replace(/^0+/, "")}` : "";
      const res = await fetch(`/api/tenants/${tenant.id}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderType,
          tableNumber: orderType === "dine_in" ? selectedTable : undefined,
          customerName: customerName || (orderType === "dine_in" ? `طلب من طاولة ${selectedTable}` : "زبون قائمة QR"),
          customerPhone: formattedCustomerPhone,
          items: cart,
          subtotal,
          taxAmount,
          discountAmount: 0,
          total,
          paymentMethod: "pending",
          paymentStatus: "pending",
          cashierName: "طلب ذاتي (QR Menu)"
        })
      });

      const newOrder = await res.json();
      if (!res.ok) throw new Error(newOrder.error || "فشل في إرسال الطلب");

      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } catch (e) {}

      onOrderCreated(newOrder);
      setOrderSuccessNumber(newOrder.orderNumber);
      const trackerData = { id: newOrder.id, orderNumber: newOrder.orderNumber, orderStatus: newOrder.orderStatus };
      localStorage.setItem("activeCustomerOrder", JSON.stringify(trackerData));
      setActiveOrder(trackerData);
      setCart([]);
      setShowCartModal(false);
    } catch (err: any) {
      alert(err.message || "حدث خطأ ما");
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalItemsCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24 animate-in fade-in duration-300" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      


      {activeOrder && (
        <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-5 shadow-xl space-y-4 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <h3 className="font-extrabold text-sm text-slate-100">متابعة طلبك الحالي في المطعم</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-indigo-400 font-black bg-indigo-950 px-2 py-0.5 rounded border border-indigo-900/60">
                {activeOrder.orderNumber}
              </span>
              <button
                onClick={() => {
                  localStorage.removeItem("activeCustomerOrder");
                  setActiveOrder(null);
                }}
                className="text-slate-400 hover:text-white p-1 text-xs cursor-pointer"
                title="إخفاء المتابعة"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Timeline steps */}
          <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-bold">
            <div className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 ${
              activeOrder.orderStatus === 'pending'
                ? "bg-amber-950/40 border-amber-500 text-amber-300 font-black shadow-md ring-2 ring-amber-500/20"
                : "bg-slate-800/40 border-slate-800 text-slate-400"
            }`}>
              <span>⏳</span>
              <span>بانتظار الكاشير</span>
            </div>

            <div className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 ${
              activeOrder.orderStatus === 'preparing'
                ? "bg-indigo-950/40 border-indigo-500 text-indigo-300 font-black shadow-md ring-2 ring-indigo-500/20"
                : "bg-slate-800/40 border-slate-800 text-slate-400"
            }`}>
              <span>👨‍🍳</span>
              <span>جاري التحضير</span>
            </div>

            <div className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 ${
              activeOrder.orderStatus === 'ready'
                ? "bg-emerald-950/40 border-emerald-500 text-emerald-300 font-black shadow-md ring-2 ring-emerald-500/20"
                : "bg-slate-800/40 border-slate-800 text-slate-400"
            }`}>
              <span>🎉</span>
              <span>جاهز للاستلام</span>
            </div>
          </div>

          {/* Alert Message */}
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>
              {activeOrder.orderStatus === 'pending' && "تم إرسال طلبكم بنجاح وهو بانتظار موافقة الكاشير وقبول العملية."}
              {activeOrder.orderStatus === 'preparing' && "تمت الموافقة على طلبكم من الكاشير! وبدأ الطاهي بتحضيره في المطبخ الآن."}
              {activeOrder.orderStatus === 'ready' && "طلبكم جاهز للتسليم! تفضل بالتوجه لكونتر الاستلام واستلام وجبتك الشهية."}
              {activeOrder.orderStatus === 'delivered' && "تم استلام وجبتكم بالهناء والشفاء! نتمنى لكم يوماً سعيداً."}
              {activeOrder.orderStatus === 'cancelled' && "عذراً، تم إلغاء أو رفض طلبكم من قبل الكاشير. يرجى مراجعة الكاشير لمزيد من التفاصيل."}
            </span>
          </div>
        </div>
      )}

      {/* Restaurant Facebook/Instagram Style Profile Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg overflow-hidden relative">
        {/* Cover Photo Banner */}
        <div className="h-40 sm:h-56 w-full relative bg-slate-100 dark:bg-slate-800">
          {tenant.bannerImage ? (
            <img src={tenant.bannerImage} alt="Cover Banner" className="w-full h-full object-cover" />
          ) : (
            <div className={`w-full h-full bg-gradient-to-r from-indigo-650 via-purple-650 to-pink-600 opacity-80`} />
          )}
          {/* Overlay gradient to ensure text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
        </div>

        {/* Restaurant Profile Content (Avatar + Info) */}
        <div className="px-6 pb-6 pt-16 relative flex flex-col items-center md:items-start text-center">
          {/* Circular Restaurant Logo (Profile Photo) */}
          <div className={`absolute -top-12 md:-top-16 ${lang === 'ar' ? 'right-6 md:right-10' : 'left-6 md:left-10'} w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-white dark:border-slate-900 bg-white dark:bg-slate-800 text-4xl md:text-5xl flex items-center justify-center shadow-md overflow-hidden z-10`}>
            <RestaurantLogo logo={tenant.logo} />
          </div>

          {/* Restaurant Details Info */}
          <div className={`w-full ${lang === 'ar' ? 'text-right' : 'text-left'} space-y-3`}>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-1">
                <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white leading-tight">
                  {tenant.nameAr}
                </h1>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                  {tenant.slogan || (lang === 'ar' ? "نرحب بكم في منيو الطعام الرقمي التفاعلي." : lang === 'tr' ? "İnteraktif dijital yemek menümüze hoş geldiniz." : "Welcome to our interactive digital food menu.")}
                </p>
              </div>

              {/* Badges / Quick details */}
              <div className={`flex flex-wrap gap-2 text-xs ${lang === 'ar' ? 'justify-start' : 'justify-start md:justify-end'}`}>
                <span className="px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border border-slate-200/60 dark:border-slate-750 flex items-center gap-1">
                  ⭐ 4.9
                </span>
                {tenant.isOpen !== false ? (
                  <span className="px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 font-bold border border-emerald-250/60 dark:border-emerald-900/60 flex items-center gap-1 animate-pulse">
                    🟢 {lang === 'ar' ? 'مفتوح الآن' : lang === 'tr' ? 'Açık' : 'Open'}
                  </span>
                ) : (
                  <span className="px-3.5 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 font-bold border border-rose-250/60 dark:border-rose-900/60 flex items-center gap-1">
                    🔴 {lang === 'ar' ? 'مغلق حالياً' : lang === 'tr' ? 'Kapalı' : 'Closed'}
                  </span>
                )}
              </div>
            </div>

            {/* Address, Phone, Wifi detailed row */}
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 font-sans">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1 shrink-0">
                  📍 {tenant.address}
                </span>
                <span className="flex items-center gap-1 shrink-0">
                  📞 {tenant.phone}
                </span>
                {(tenant.wifiName || tenant.wifiPassword) && (
                  <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-bold font-mono shrink-0">
                    📶 WiFi: {tenant.wifiName || (lang === 'ar' ? 'عام' : lang === 'tr' ? 'Genel' : 'General')} {tenant.wifiPassword ? `(${tenant.wifiPassword})` : ''}
                  </span>
                )}
              </div>

              {/* Social Media Profiles */}
              {((tenant.facebookUrl && tenant.facebookUrl.trim() !== "") || 
                (tenant.instagramUrl && tenant.instagramUrl.trim() !== "") || 
                (tenant.tiktokUrl && tenant.tiktokUrl.trim() !== "")) && (
                <div className="flex items-center gap-2 shrink-0 animate-in fade-in duration-200">
                  {tenant.facebookUrl && tenant.facebookUrl.trim() !== "" && (
                    <a 
                      href={tenant.facebookUrl.startsWith("http") ? tenant.facebookUrl : `https://${tenant.facebookUrl}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full bg-slate-100 hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-blue-950/60 text-slate-600 hover:text-blue-600 border border-slate-200 dark:border-slate-700 flex items-center justify-center transition-all hover:scale-110 cursor-pointer"
                      title="Facebook"
                    >
                      <Facebook className="w-4 h-4" />
                    </a>
                  )}
                  {tenant.instagramUrl && tenant.instagramUrl.trim() !== "" && (
                    <a 
                      href={tenant.instagramUrl.startsWith("http") ? tenant.instagramUrl : `https://${tenant.instagramUrl}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full bg-slate-100 hover:bg-pink-50 dark:bg-slate-800 dark:hover:bg-pink-950/60 text-slate-600 hover:text-pink-600 border border-slate-200 dark:border-slate-700 flex items-center justify-center transition-all hover:scale-110 cursor-pointer"
                      title="Instagram"
                    >
                      <Instagram className="w-4 h-4" />
                    </a>
                  )}
                  {tenant.tiktokUrl && tenant.tiktokUrl.trim() !== "" && (
                    <a 
                      href={tenant.tiktokUrl.startsWith("http") ? tenant.tiktokUrl : `https://${tenant.tiktokUrl}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 flex items-center justify-center transition-all hover:scale-110 cursor-pointer"
                      title="TikTok"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm5.75 8.16a3.52 3.52 0 0 1-2.07-.67v4.61a4.35 4.35 0 1 1-4.35-4.35 4.31 4.31 0 0 1 1 .12v2.24a2.15 2.15 0 0 0-1-.24 2.11 2.11 0 1 0 2.11 2.11V7.75h2.24a3.53 3.53 0 0 1 2.07 2.07v.34z"/>
                      </svg>
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Success Alert if Order Placed */}
      {orderSuccessNumber && (
        <div className="bg-emerald-50 dark:bg-emerald-950/60 border-2 border-emerald-500 rounded-3xl p-6 text-center space-y-3 shadow-lg animate-in zoom-in-95">
          <div className="w-14 h-14 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto text-2xl shadow-md">
            ✓
          </div>
          <h3 className="text-xl font-extrabold text-emerald-900 dark:text-emerald-100">
            تم استلام طلبكم بنجاح في المطبخ!
          </h3>
          <p className="text-sm text-emerald-700 dark:text-emerald-300">
            رقم الطلب الخاص بك هو: <strong className="font-mono text-lg bg-emerald-600 text-white px-3 py-1 rounded-xl">{orderSuccessNumber}</strong>
          </p>
          <p className="text-xs text-slate-500">سيصلك الطلب على الطاولة فور الانتهاء من التجهيز. نتمنى لكم وجبة شهية!</p>
          <button
            onClick={() => setOrderSuccessNumber(null)}
            className="px-6 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
          >
            متابعة تصفح المنيو
          </button>
        </div>
      )}

      {/* Restaurant Closed Notice Banner */}
      {tenant.isOpen === false && (
        <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-3xl p-5 text-center space-y-2 shadow-sm animate-in fade-in duration-300">
          <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-450 rounded-full flex items-center justify-center mx-auto text-xl">
            🔒
          </div>
          <h3 className="text-base font-extrabold text-rose-900 dark:text-rose-100">
            {lang === 'ar' ? 'المطعم لا يستقبل طلبات حالياً' : lang === 'tr' ? 'Restoran şu anda sipariş kabul etmiyor' : 'Restaurant is not accepting orders right now'}
          </h3>
          <p className="text-xs text-rose-700 dark:text-rose-350">
            {lang === 'ar' ? 'يمكنك تصفح قائمة الطعام والوجبات، ولكن تم إيقاف استقبال الطلبات الرقمية مؤقتاً.' : lang === 'tr' ? 'Menüye göz atabilirsiniz, ancak sipariş alımı geçici olarak durdurulmuştur.' : 'You can browse the menu and dishes, but digital ordering has been temporarily disabled.'}
          </p>
        </div>
      )}

      {/* Search and Category Filter */}
      <div className="sticky top-16 z-30 bg-slate-50/90 dark:bg-slate-950/90 backdrop-blur-md py-3 space-y-3">
        {/* Search Bar */}
        <div className="relative">
          <Search className={`w-4 h-4 absolute top-1/2 -translate-y-1/2 text-slate-400 ${lang === 'ar' ? 'right-4' : 'left-4'}`} />
          <input
            type="text"
            placeholder={translations[lang].searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full py-3 rounded-2xl text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
              lang === 'ar' ? 'pr-11 pl-4' : 'pl-11 pr-4'
            }`}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className={`absolute top-1/2 -translate-y-1/2 text-slate-400 ${lang === 'ar' ? 'left-4' : 'right-4'}`}>
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Horizontal Category Pill Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              selectedCategory === "all"
                ? `${theme.primaryBg} text-white shadow-md scale-105`
                : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100"
            }`}
          >
            <span>✨</span>
            <span>{translations[lang].allCategories} ({items.filter(i => i.isAvailable).length})</span>
          </button>

          {categories.map((cat) => {
            const count = items.filter((i) => i.categoryId === cat.id && i.isAvailable).length;
            const isSelected = selectedCategory === cat.id;
            const catName = lang === 'en' && cat.nameEn ? cat.nameEn : lang === 'tr' && cat.nameTr ? cat.nameTr : cat.nameAr;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                  isSelected
                    ? `${theme.primaryBg} text-white shadow-md scale-105`
                    : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100"
                }`}
              >
                {cat.icon.startsWith("http") || cat.icon.startsWith("data:image") ? (
                  <img src={cat.icon} alt="" className="w-5 h-5 object-cover rounded-lg shrink-0" />
                ) : (
                  <span className="text-base shrink-0">{cat.icon}</span>
                )}
                <span>{catName}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Menu Dishes Grid */}
      {availableItems.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center text-3xl">
            🍽️
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">{translations[lang].noItemsFound}</h3>
          <p className="text-xs text-slate-500">{translations[lang].noItemsFoundDesc}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {availableItems.map((item) => {
            const inCartQty = cart.find((i) => i.itemId === item.id)?.quantity || 0;
            const itemName = lang === 'en' && item.nameEn ? item.nameEn : lang === 'tr' && item.nameTr ? item.nameTr : item.nameAr;
            const itemDesc = lang === 'en' && item.descriptionEn ? item.descriptionEn : lang === 'tr' && item.descriptionTr ? item.descriptionTr : item.descriptionAr;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedItemDetail(item)}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between group cursor-pointer hover:-translate-y-0.5 transform"
              >
                {/* Photo & Badges */}
                <div className="relative h-28 sm:h-32 w-full overflow-hidden bg-slate-100 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-800">
                  <img
                    src={item.image}
                    alt={itemName}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />

                  {item.isBestSeller && (
                    <span className={`absolute top-2 bg-amber-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-md flex items-center gap-0.5 ${lang === 'ar' ? 'right-2' : 'left-2'}`}>
                      <span>★</span>
                      <span>{translations[lang].bestSeller}</span>
                    </span>
                  )}

                  {item.calories && (
                    <span className={`absolute top-2 bg-black/60 backdrop-blur-md text-white text-[9px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1 ${lang === 'ar' ? 'left-2' : 'right-2'}`}>
                      <Flame className="w-3.5 h-3.5 text-orange-400" />
                      <span>{item.calories} {translations[lang].calories}</span>
                    </span>
                  )}
                </div>

                {/* Details & Action */}
                <div className="p-2.5 sm:p-3 flex-1 flex flex-col justify-between space-y-2">
                  <div className="space-y-0.5">
                    <h3 className="text-xs font-black text-slate-800 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
                      {itemName}
                    </h3>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                      {itemDesc}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80">
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-slate-950 dark:text-white">
                        {item.price} <span className="text-[9px] font-normal text-slate-500">{translations[lang].currency}</span>
                      </span>
                      <span className="text-[9px] text-slate-400 flex items-center gap-0.5 mt-0.5">
                        <Clock className="w-2.5 h-2.5" />
                        <span>{item.preparationTimeMin || 15} {translations[lang].preparationTime}</span>
                      </span>
                    </div>

                    {inCartQty > 0 ? (
                      <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/60 p-1 rounded-xl border border-emerald-500/30" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-7 h-7 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-white flex items-center justify-center font-bold shadow-sm"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-black text-sm text-emerald-700 dark:text-emerald-300 w-6 text-center">
                          {inCartQty}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className={`w-7 h-7 rounded-lg ${theme.primaryBg} text-white flex items-center justify-center font-bold shadow-sm`}
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : tenant.isOpen === false ? (
                      <span className="text-[10px] font-extrabold text-rose-500 dark:text-rose-450 bg-rose-50 dark:bg-rose-950/20 px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900/40">
                        {lang === 'ar' ? 'مغلق' : lang === 'tr' ? 'Kapalı' : 'Closed'}
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(item);
                        }}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-[10px] font-extrabold transition-all ${theme.primaryBg} ${theme.primaryHover} text-white shadow-md hover:scale-103`}
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{translations[lang].addToCart}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* FLOATING BOTTOM CART BAR */}
      {totalItemsCount > 0 && (
        <div className="fixed bottom-6 left-0 right-0 z-40 px-4 pointer-events-none">
          <div className="max-w-xl mx-auto bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-slate-800 flex items-center justify-between gap-4 pointer-events-auto animate-in slide-in-from-bottom-5 duration-300" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl ${theme.primaryBg} text-white flex items-center justify-center relative shadow-inner`}>
                <ShoppingCart className="w-6 h-6" />
                <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-white text-xs font-black w-5 h-5 rounded-full flex items-center justify-center shadow">
                  {totalItemsCount}
                </span>
              </div>
              <div className={lang === 'ar' ? 'text-right' : 'text-left'}>
                <h4 className="text-xs font-semibold text-slate-400">{translations[lang].cart}</h4>
                <p className="text-lg font-black text-white">
                  {total.toFixed(2)} <span className="text-xs font-normal text-emerald-400">{translations[lang].currency}</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowCartModal(true)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl ${theme.primaryBg} ${theme.primaryHover} text-white font-bold text-sm shadow-lg transition-all transform hover:scale-105`}
            >
              <span>{lang === 'ar' ? 'مراجعة الطلب وإرساله' : lang === 'tr' ? 'Siparişi İncele' : 'Review & Send'}</span>
              <ChevronRight className={`w-4 h-4 ${lang === 'ar' ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      )}

      {/* CART & ORDER SUBMISSION MODAL */}
      {showCartModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className={`bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-6 ${lang === 'ar' ? 'text-right' : 'text-left'}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-emerald-600" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {lang === 'ar' ? `مراجعة سلة الطلب (${totalItemsCount} أصناف)` : lang === 'tr' ? `Sepeti İncele (${totalItemsCount} ürün)` : `Review Cart (${totalItemsCount} items)`}
                </h3>
              </div>
              <button onClick={() => setShowCartModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitCustomerOrder} className="space-y-6">
              
              {/* Order Mode Selection */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">{translations[lang].orderType}:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setOrderType("dine_in")}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                      orderType === "dine_in"
                        ? `${theme.primaryBg} text-white border-transparent shadow-sm`
                        : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    <UtensilsCrossed className="w-4 h-4" />
                    <span>
                      {tenant.subscriptionPlan === "lite"
                        ? (lang === 'ar' ? 'تناول في المطعم' : lang === 'tr' ? 'Restoranda Yemek' : 'Dine In')
                        : translations[lang].dineIn}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setOrderType("takeaway")}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                      orderType === "takeaway"
                        ? `${theme.primaryBg} text-white border-transparent shadow-sm`
                        : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>{translations[lang].takeaway}</span>
                  </button>
                </div>
              </div>

              {/* Table Number or Customer Details */}
              {orderType === "dine_in" && tenant.subscriptionPlan !== "lite" ? (
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    {lang === 'ar' ? 'حدد رقم الطاولة التي تجلس عليها *' : lang === 'tr' ? 'Oturduğunuz masa numarasını seçin *' : 'Select the table number you are sitting at *'}
                  </label>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                    {tables.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setSelectedTable(t.tableNumber)}
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold shrink-0 border transition-all ${
                          selectedTable === t.tableNumber
                            ? "bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-500/30"
                            : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                        }`}
                      >
                        {lang === 'ar' ? 'طاولة' : lang === 'tr' ? 'Masa' : 'Table'} {t.tableNumber}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">{translations[lang].customerName} *</label>
                    <input
                      type="text"
                      required
                      placeholder={translations[lang].customerNamePlaceholder}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">{translations[lang].customerPhone} *</label>
                    <div className="flex gap-1.5" dir="ltr">
                      <select
                        value={phoneCountryCode}
                        onChange={(e) => setPhoneCountryCode(e.target.value)}
                        className="px-2.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-55 bg-white dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 outline-none cursor-pointer"
                      >
                        <option value="966">🇸🇦 +966</option>
                        <option value="971">🇦🇪 +971</option>
                        <option value="974">🇶🇦 +974</option>
                        <option value="965">🇰🇼 +965</option>
                        <option value="968">🇴🇲 +968</option>
                        <option value="973">🇧🇭 +973</option>
                        <option value="20">🇪🇬 +20</option>
                        <option value="962">🇯🇴 +962</option>
                        <option value="90">🇹🇷 +90</option>
                        <option value="1">🇺🇸 +1</option>
                        <option value="44">🇬🇧 +44</option>
                      </select>
                      <input
                        type="tel"
                        required
                        placeholder={translations[lang].customerPhonePlaceholder}
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value.replace(/[^0-9]/g, ""))}
                        className="flex-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Items List */}
              <div className="space-y-2 max-h-52 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                {cart.map((item) => {
                  const menuItem = items.find(i => i.id === item.itemId);
                  const itemName = menuItem 
                    ? (lang === 'en' && menuItem.nameEn ? menuItem.nameEn : lang === 'tr' && menuItem.nameTr ? menuItem.nameTr : menuItem.nameAr)
                    : item.nameAr;
                  return (
                    <div key={item.id} className="pt-2.5 first:pt-0 flex items-center justify-between gap-3">
                      <div className="flex-1">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">{itemName}</h4>
                        <p className={`text-[10px] text-slate-400 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{item.price} {translations[lang].currency} × {item.quantity}</p>
                        <input
                          type="text"
                          placeholder={lang === 'ar' ? 'تعليق/ملاحظة للطلب...' : lang === 'tr' ? 'Not ekle...' : 'Add request/note...'}
                          value={item.notes || ""}
                          onChange={(e) => updateNotes(item.itemId, e.target.value)}
                          className="w-full mt-1 px-2 py-0.5 text-[9px] rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-transparent transition-all"
                        />
                      </div>

                      <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                        <button type="button" onClick={() => updateQuantity(item.itemId, -1)} className="w-5 h-5 rounded bg-white dark:bg-slate-700 text-xs font-bold flex items-center justify-center">-</button>
                        <span className="w-5 text-center text-xs font-bold text-slate-900 dark:text-white">{item.quantity}</span>
                        <button type="button" onClick={() => updateQuantity(item.itemId, 1)} className={`w-5 h-5 rounded ${theme.primaryBg} text-white text-xs font-bold flex items-center justify-center`}>+</button>
                      </div>

                      <span className={`text-xs font-bold text-emerald-600 dark:text-emerald-400 w-16 ${lang === 'ar' ? 'text-left' : 'text-right'}`}>
                        {(item.price * item.quantity).toFixed(0)} {translations[lang].currency}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Financial Summary */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>{translations[lang].subtotal}:</span>
                  <span>{subtotal.toFixed(2)} {translations[lang].currency}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>{translations[lang].tax} ({taxRate}%):</span>
                  <span>{taxAmount.toFixed(2)} {translations[lang].currency}</span>
                </div>
                <div className="flex justify-between font-black text-base pt-2 border-t border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white">
                  <span>{translations[lang].total}:</span>
                  <span className="text-emerald-600 dark:text-emerald-400">{total.toFixed(2)} {translations[lang].currency}</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCartModal(false)}
                  className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                >
                  {lang === 'ar' ? 'الرجوع للمنيو' : lang === 'tr' ? 'Menüye Dön' : 'Back to Menu'}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`flex-1 py-3 rounded-xl ${theme.primaryBg} ${theme.primaryHover} text-white font-black text-sm shadow-xl transition-all flex items-center justify-center gap-2`}
                >
                  {isSubmitting ? (
                    <span>
                      {tenant.subscriptionPlan === "lite"
                        ? (lang === 'ar' ? 'جاري تحويلك للواتساب...' : lang === 'tr' ? 'WhatsApp\'a yönlendiriliyor...' : 'Redirecting to WhatsApp...')
                        : (lang === 'ar' ? 'جاري إرسال الطلب للمطبخ...' : lang === 'tr' ? 'Sipariş Gönderiliyor...' : 'Sending Order...')}
                    </span>
                  ) : (
                    <>
                      {tenant.subscriptionPlan === "lite" ? (
                        <>
                          <span className="text-base">💬</span>
                          <span>{lang === 'ar' ? 'إرسال الطلب عبر الواتساب' : lang === 'tr' ? 'WhatsApp ile Gönder' : 'Send Order via WhatsApp'}</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-5 h-5" />
                          <span>{translations[lang].sendOrder}</span>
                        </>
                      )}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DISH DETAIL MODAL */}
      {selectedItemDetail && (() => {
        const itemName = lang === 'en' && selectedItemDetail.nameEn ? selectedItemDetail.nameEn : lang === 'tr' && selectedItemDetail.nameTr ? selectedItemDetail.nameTr : selectedItemDetail.nameAr;
        const itemDesc = lang === 'en' && selectedItemDetail.descriptionEn ? selectedItemDetail.descriptionEn : lang === 'tr' && selectedItemDetail.descriptionTr ? selectedItemDetail.descriptionTr : selectedItemDetail.descriptionAr;
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className={`bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 relative ${lang === 'ar' ? 'text-right' : 'text-left'}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
              <button
                onClick={() => setSelectedItemDetail(null)}
                className={`absolute top-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors ${lang === 'ar' ? 'left-4' : 'right-4'}`}
              >
                <X className="w-5 h-5" />
              </button>

              <div className="h-56 w-full relative">
                <img src={selectedItemDetail.image} alt={itemName} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />
                <div className={`absolute bottom-4 text-white ${lang === 'ar' ? 'right-4' : 'left-4'}`}>
                  <h3 className="text-xl font-extrabold">{itemName}</h3>
                  <span className="text-emerald-400 font-black text-lg">{selectedItemDetail.price} {translations[lang].currency}</span>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl font-medium">
                    <Clock className="w-4 h-4 text-emerald-500" />
                    <span>
                      {lang === 'ar' ? `مدة التحضير: ${selectedItemDetail.preparationTimeMin || 15} دقيقة` : lang === 'tr' ? `Hazırlık: ${selectedItemDetail.preparationTimeMin || 15} dk` : `Prep time: ${selectedItemDetail.preparationTimeMin || 15} mins`}
                    </span>
                  </span>
                  {selectedItemDetail.calories && (
                    <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl font-medium">
                      <Flame className="w-4 h-4 text-orange-500" />
                      <span>{selectedItemDetail.calories} {translations[lang].calories}</span>
                    </span>
                  )}
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase mb-1">
                    {lang === 'ar' ? 'وصف الطبق والمكونات:' : lang === 'tr' ? 'Yemek Açıklaması:' : 'Description:'}
                  </h4>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {itemDesc}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => {
                      addToCart(selectedItemDetail);
                      setSelectedItemDetail(null);
                    }}
                    className={`w-full py-3.5 rounded-2xl ${theme.primaryBg} ${theme.primaryHover} text-white font-bold text-sm shadow-xl flex items-center justify-center gap-2 transform hover:-translate-y-0.5 transition-all`}
                  >
                    <Plus className="w-5 h-5" />
                    <span>{translations[lang].addToCart} ({selectedItemDetail.price} {translations[lang].currency})</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* QR Code & Table Stand Modal */}
      {showQRModal && (
        <QRCodeModal
          tenant={tenant}
          tables={tables}
          initialTableNumber={orderType === "dine_in" ? selectedTable : "general"}
          onClose={() => setShowQRModal(false)}
        />
      )}
    </div>
  );
};
