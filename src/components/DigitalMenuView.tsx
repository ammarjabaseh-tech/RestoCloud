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
  Info
} from "lucide-react";
import { QRCodeModal } from "./QRCodeModal";

interface DigitalMenuViewProps {
  tenant: Tenant;
  categories: Category[];
  items: MenuItem[];
  tables: RestaurantTable[];
  onOrderCreated: (order: Order) => void;
}

export const DigitalMenuView: React.FC<DigitalMenuViewProps> = ({
  tenant,
  categories,
  items,
  tables,
  onOrderCreated
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [showCartModal, setShowCartModal] = useState<boolean>(false);
  const [orderType, setOrderType] = useState<"dine_in" | "takeaway">("dine_in");
  const [selectedTable, setSelectedTable] = useState<number>(tables[0]?.tableNumber || 1);
  const [customerName, setCustomerName] = useState<string>("");
  const [customerPhone, setCustomerPhone] = useState<string>("");
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
                          item.descriptionAr.toLowerCase().includes(searchQuery.toLowerCase());
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
    try {
      const res = await fetch(`/api/tenants/${tenant.id}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderType,
          tableNumber: orderType === "dine_in" ? selectedTable : undefined,
          customerName: customerName || (orderType === "dine_in" ? `طلب من طاولة ${selectedTable}` : "زبون قائمة QR"),
          customerPhone,
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
    <div className="max-w-4xl mx-auto space-y-6 pb-24 animate-in fade-in duration-300" dir="rtl">
      


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

      {/* Restaurant Sleek Compact Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg p-5 flex flex-col md:flex-row items-center justify-between gap-5 relative overflow-hidden">
        <div className={`absolute top-0 left-0 right-0 h-1.5 ${theme.primaryBg}`} />
        
        <div className="flex items-center gap-4 w-full md:w-auto text-right">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 text-3xl flex items-center justify-center shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden shrink-0">
            <RestaurantLogo logo={tenant.logo} />
          </div>
          <div className="space-y-0.5">
            <h1 className="text-xl font-black text-slate-900 dark:text-white leading-tight">
              {tenant.nameAr}
            </h1>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
              {tenant.slogan || "نرحب بكم في منيو الطعام الرقمي التفاعلي."}
            </p>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] text-slate-400 pt-0.5 font-sans">
              {(tenant.wifiName || tenant.wifiPassword) && (
                <span className="text-emerald-600 dark:text-emerald-400 font-bold font-mono">
                  📶 WiFi: {tenant.wifiName || "عام"} {tenant.wifiPassword ? `(كلمة المرور: ${tenant.wifiPassword})` : "(بدون باسورد)"}
                </span>
              )}
              {(tenant.wifiName || tenant.wifiPassword) && <span>•</span>}
              <span>📞 {tenant.phone}</span>
              <span>•</span>
              <span>📍 {tenant.address}</span>
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

      {/* Search and Category Filter */}
      <div className="sticky top-16 z-30 bg-slate-50/90 dark:bg-slate-950/90 backdrop-blur-md py-3 space-y-3">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="ابحث في قائمة الطعام عن صنف أو مكون..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-11 pl-4 py-3 rounded-2xl text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
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
            <span>كل الأصناف ({items.filter(i => i.isAvailable).length})</span>
          </button>

          {categories.map((cat) => {
            const count = items.filter((i) => i.categoryId === cat.id && i.isAvailable).length;
            const isSelected = selectedCategory === cat.id;
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
                <span className="text-base">{cat.icon}</span>
                <span>{cat.nameAr}</span>
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
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">عذراً، لم نجد أصنافاً مطابقة</h3>
          <p className="text-xs text-slate-500">جرب البحث بكلمات أخرى أو تصفح قسم آخر من القائمة</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableItems.map((item) => {
            const inCartQty = cart.find((i) => i.itemId === item.id)?.quantity || 0;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedItemDetail(item)}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between group cursor-pointer hover:-translate-y-0.5 transform"
              >
                {/* Photo & Badges */}
                <div className="relative h-32 w-full overflow-hidden bg-slate-100 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-800">
                  <img
                    src={item.image}
                    alt={item.nameAr}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />

                  {item.isBestSeller && (
                    <span className="absolute top-2 right-2 bg-amber-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-md flex items-center gap-0.5">
                      <span>★</span>
                      <span>الأكثر طلباً</span>
                    </span>
                  )}

                  {item.calories && (
                    <span className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-white text-[9px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-orange-400" />
                      <span>{item.calories} سعرة</span>
                    </span>
                  )}
                </div>

                {/* Details & Action */}
                <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                  <div className="space-y-0.5">
                    <h3 className="text-xs font-black text-slate-800 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
                      {item.nameAr}
                    </h3>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                      {item.descriptionAr}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80">
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-slate-950 dark:text-white">
                        {item.price} <span className="text-[9px] font-normal text-slate-500">{tenant.currency}</span>
                      </span>
                      <span className="text-[9px] text-slate-400 flex items-center gap-0.5 mt-0.5">
                        <Clock className="w-2.5 h-2.5" />
                        <span>تحضير: {item.preparationTimeMin || 15} د</span>
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
                        <span>أضف لطلبي</span>
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
          <div className="max-w-xl mx-auto bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-slate-800 flex items-center justify-between gap-4 pointer-events-auto animate-in slide-in-from-bottom-5 duration-300">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl ${theme.primaryBg} text-white flex items-center justify-center relative shadow-inner`}>
                <ShoppingCart className="w-6 h-6" />
                <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-white text-xs font-black w-5 h-5 rounded-full flex items-center justify-center shadow">
                  {totalItemsCount}
                </span>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-slate-400">إجمالي سلة طلباتي</h4>
                <p className="text-lg font-black text-white">
                  {total.toFixed(2)} <span className="text-xs font-normal text-emerald-400">{tenant.currency}</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowCartModal(true)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl ${theme.primaryBg} ${theme.primaryHover} text-white font-bold text-sm shadow-lg transition-all transform hover:scale-105`}
            >
              <span>مراجعة الطلب وإرساله</span>
              <ChevronRight className="w-4 h-4 rotate-180" />
            </button>
          </div>
        </div>
      )}

      {/* CART & ORDER SUBMISSION MODAL */}
      {showCartModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-6 text-right" dir="rtl">
            
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-emerald-600" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">مراجعة سلة الطلب ({totalItemsCount} أصناف)</h3>
              </div>
              <button onClick={() => setShowCartModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitCustomerOrder} className="space-y-6">
              
              {/* Order Mode Selection */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">نوع الاستلام والطلب:</label>
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
                    <span>طلب داخل المطعم (طاولة)</span>
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
                    <span>سفري / استلام ذاتي</span>
                  </button>
                </div>
              </div>

              {/* Table Number or Customer Details */}
              {orderType === "dine_in" ? (
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">حدد رقم الطاولة التي تجلس عليها *</label>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
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
                        طاولة {t.tableNumber}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">الاسم الكريم *</label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: عبد الله"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">رقم الجوال *</label>
                    <input
                      type="text"
                      required
                      placeholder="05xxxxxxxx"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Items List */}
              <div className="space-y-2 max-h-52 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                {cart.map((item) => (
                  <div key={item.id} className="pt-2.5 first:pt-0 flex items-center justify-between gap-3">
                    <div className="flex-1">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{item.nameAr}</h4>
                      <p className="text-[10px] text-slate-400">{item.price} {tenant.currency} × {item.quantity}</p>
                      <input
                        type="text"
                        placeholder="تعليق/ملاحظة للطلب..."
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

                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 w-16 text-left">
                      {(item.price * item.quantity).toFixed(0)} {tenant.currency}
                    </span>
                  </div>
                ))}
              </div>

              {/* Financial Summary */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>المجموع الفرعي:</span>
                  <span>{subtotal.toFixed(2)} {tenant.currency}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>ضريبة القيمة المضافة ({taxRate}%):</span>
                  <span>{taxAmount.toFixed(2)} {tenant.currency}</span>
                </div>
                <div className="flex justify-between font-black text-base pt-2 border-t border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white">
                  <span>الإجمالي المطلوب:</span>
                  <span className="text-emerald-600 dark:text-emerald-400">{total.toFixed(2)} {tenant.currency}</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCartModal(false)}
                  className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                >
                  الرجوع للمنيو
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`flex-1 py-3 rounded-xl ${theme.primaryBg} ${theme.primaryHover} text-white font-black text-sm shadow-xl transition-all flex items-center justify-center gap-2`}
                >
                  {isSubmitting ? (
                    <span>جاري إرسال الطلب للمطبخ...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      <span>تأكيد وإرسال الطلب ({total.toFixed(0)} {tenant.currency})</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DISH DETAIL MODAL */}
      {selectedItemDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 relative text-right" dir="rtl">
            <button
              onClick={() => setSelectedItemDetail(null)}
              className="absolute top-4 left-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="h-56 w-full relative">
              <img src={selectedItemDetail.image} alt={selectedItemDetail.nameAr} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-4 right-4 text-white">
                <h3 className="text-xl font-extrabold">{selectedItemDetail.nameAr}</h3>
                <span className="text-emerald-400 font-black text-lg">{selectedItemDetail.price} {tenant.currency}</span>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl font-medium">
                  <Clock className="w-4 h-4 text-emerald-500" />
                  <span>مدة التحضير: {selectedItemDetail.preparationTimeMin || 15} دقيقة</span>
                </span>
                {selectedItemDetail.calories && (
                  <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl font-medium">
                    <Flame className="w-4 h-4 text-orange-500" />
                    <span>{selectedItemDetail.calories} سعرة حرارية</span>
                  </span>
                )}
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase mb-1">وصف الطبق والمكونات:</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {selectedItemDetail.descriptionAr}
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
                  <span>إضافة للسلة ({selectedItemDetail.price} {tenant.currency})</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
