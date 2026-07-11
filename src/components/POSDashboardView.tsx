import React, { useState, useMemo } from "react";
import { Tenant, Category, MenuItem, RestaurantTable, OrderItem, OrderType, PaymentMethod, Order, Printer } from "../types";
import { getThemeClasses } from "../utils/theme";
import { RestaurantLogo } from "./RestaurantLogo";
import confetti from "canvas-confetti";
import { 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  ShoppingCart, 
  CreditCard, 
  Banknote, 
  Clock, 
  Printer as PrinterIcon, 
  CheckCircle2, 
  UtensilsCrossed, 
  ShoppingBag, 
  Bike, 
  Sparkles, 
  Receipt, 
  AlertCircle,
  X,
  User,
  Phone,
  MapPin,
  RefreshCw,
  History,
  Bell
} from "lucide-react";
import { POSInvoiceReceipt } from "./POSInvoiceReceipt";

interface POSDashboardViewProps {
  tenant: Tenant;
  categories: Category[];
  items: MenuItem[];
  tables: RestaurantTable[];
  onOrderCreated: (order: Order) => void;
  onUpdateTableStatus: (tableId: string, status: any) => void;
}

export const POSDashboardView: React.FC<POSDashboardViewProps> = ({
  tenant,
  categories,
  items,
  tables,
  onOrderCreated,
  onUpdateTableStatus
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [orderType, setOrderType] = useState<OrderType>("dine_in");
  const [selectedTable, setSelectedTable] = useState<number | undefined>(tables[0]?.tableNumber || 1);
  const [customerName, setCustomerName] = useState<string>("");
  const [customerPhone, setCustomerPhone] = useState<string>("");
  const [customerAddress, setCustomerAddress] = useState<string>("");
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [isDraftPrint, setIsDraftPrint] = useState<boolean>(false);
  const [showOrderHistoryModal, setShowOrderHistoryModal] = useState<boolean>(false);
  const [historyOrders, setHistoryOrders] = useState<Order[]>([]);
  const [historyLoading, setHistoryLoading] = useState<boolean>(false);
  const [historySearch, setHistorySearch] = useState<string>("");
  const [historyTab, setHistoryTab] = useState<"all" | "pending">("all");
  const [posMode, setPosMode] = useState<"sales" | "orders">("sales");
  const [posOrderTab, setPosOrderTab] = useState<"all" | "pending" | "preparing" | "ready" | "archived">("all");

  const pendingSelfOrders = useMemo(() => {
    return historyOrders.filter(o => o.orderStatus === "pending");
  }, [historyOrders]);

  // Printers integration
  const [printers, setPrinters] = useState<Printer[]>([]);
  const [selectedPrinterId, setSelectedPrinterId] = useState<string>("");

  React.useEffect(() => {
    fetch(`/api/tenants/${tenant.id}/printers`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setPrinters(data);
          const defaultPrinter = data.find(p => p.printerRole === 'receipt' && p.isActive) || data[0];
          if (defaultPrinter) setSelectedPrinterId(defaultPrinter.id);
        }
      })
      .catch(err => console.error("Failed to load printers:", err));
  }, [tenant.id]);

  const handlePrintOrder = async (order: Order, printRole: 'receipt' | 'kitchen') => {
    if (!selectedPrinterId) {
      window.print();
      return;
    }
    const printer = printers.find(p => p.id === selectedPrinterId);
    if (!printer || printer.connectionType !== 'network') {
      window.print();
      return;
    }

    try {
      const res = await fetch(`/api/tenants/${tenant.id}/orders/${order.id}/print`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ printerId: printer.id, printRole })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert("✅ " + data.message);
      } else if (data.webPrintFallback) {
        window.print();
      } else {
        alert("❌ " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("❌ فشل الاتصال بالطابعة الشبكية، جاري التحويل لطباعة المتصفح...");
      window.print();
    }
  };

  // Silent polling of orders every 10 seconds for real-time mobile order receipt
  React.useEffect(() => {
    fetchHistoryOrders();
    const interval = setInterval(() => {
      fetch(`/api/tenants/${tenant.id}/orders`)
        .then(res => res.json())
        .then(data => {
          setHistoryOrders(data);
        })
        .catch(err => console.error("Silent polling failed:", err));
    }, 10000);
    return () => clearInterval(interval);
  }, [tenant.id]);

  const handleApproveOrder = async (orderId: string) => {
    try {
      const res = await fetch(`/api/tenants/${tenant.id}/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderStatus: "preparing" })
      });
      if (res.ok) {
        const updated = await res.json();
        setHistoryOrders(prev => prev.map(o => o.id === orderId ? updated : o));
        onOrderCreated(updated); // triggers cashier modal display/printing if needed
        
        // Success sound chime
        try {
          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
          const ctx = new AudioContextClass();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(523.25, ctx.currentTime);
          osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1);
          osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2);
          gain.gain.setValueAtTime(0.15, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.45);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.45);
        } catch (e) {}
      }
    } catch (e) {
      console.error("Failed to approve order:", e);
    }
  };

  const handleRejectOrder = async (orderId: string) => {
    if (!confirm("هل أنت متأكد من رفض وإلغاء هذا الطلب؟")) return;
    try {
      const res = await fetch(`/api/tenants/${tenant.id}/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderStatus: "cancelled" })
      });
      if (res.ok) {
        const updated = await res.json();
        setHistoryOrders(prev => prev.map(o => o.id === orderId ? updated : o));
      }
    } catch (e) {
      console.error("Failed to reject order:", e);
    }
  };

  const theme = getThemeClasses(tenant.themeColor);

  // Filter items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchCat = selectedCategory === "all" || item.categoryId === selectedCategory;
      const matchSearch = item.nameAr.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.descriptionAr.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch && item.isAvailable;
    });
  }, [items, selectedCategory, searchQuery]);

  // Cart Calculations
  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  const taxRate = tenant.taxRate || 15;
  const taxAmount = useMemo(() => {
    return Number(((subtotal * taxRate) / 100).toFixed(2));
  }, [subtotal, taxRate]);

  const total = useMemo(() => {
    const calc = subtotal + taxAmount - discountAmount;
    return calc > 0 ? Number(calc.toFixed(2)) : 0;
  }, [subtotal, taxAmount, discountAmount]);

  // Cart Actions
  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.itemId === item.id);
      if (existing) {
        return prev.map((i) => (i.itemId === item.id ? { ...i, quantity: i.quantity + 1 } : i));
      } else {
        return [
          ...prev,
          {
            id: `oi-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
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

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((i) => i.itemId !== itemId));
  };

  const updateNotes = (itemId: string, notes: string) => {
    setCart((prev) => prev.map((i) => (i.itemId === itemId ? { ...i, notes } : i)));
  };

  const clearCart = () => {
    if (cart.length === 0) return;
    if (confirm("هل أنت متأكد من مسح جميع الأصناف من السلة؟")) {
      setCart([]);
      setDiscountAmount(0);
    }
  };

  // Submit Order
  const handleCheckout = async (statusOverride?: 'paid' | 'pending') => {
    if (cart.length === 0) return;
    if (orderType === "dine_in" && !selectedTable) {
      alert("يرجى تحديد رقم الطاولة للطلب الداخلي");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/tenants/${tenant.id}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderType,
          tableNumber: orderType === "dine_in" ? selectedTable : undefined,
          customerName: customerName || (orderType === "dine_in" ? `طاولة رقم ${selectedTable}` : "عميل سفري"),
          customerPhone,
          customerAddress: orderType === "delivery" ? customerAddress : undefined,
          items: cart,
          subtotal,
          taxAmount,
          discountAmount,
          total,
          paymentMethod: statusOverride === 'pending' ? 'pending' : paymentMethod,
          paymentStatus: statusOverride === 'pending' ? 'pending' : 'paid',
          cashierName: "الكاشير العام"
        })
      });

      const newOrder = await res.json();
      if (!res.ok) throw new Error(newOrder.error || "فشل في إتمام الطلب");

      // Trigger Confetti!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}

      onOrderCreated(newOrder);
      setCompletedOrder(newOrder);
      
      // Reset cart
      setCart([]);
      setCustomerName("");
      setCustomerPhone("");
      setCustomerAddress("");
      setDiscountAmount(0);
    } catch (err: any) {
      alert(err.message || "حدث خطأ في الاتصال");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrintDraft = () => {
    if (cart.length === 0) {
      alert("يرجى إضافة أصناف إلى السلة أولاً لطباعة الفاتورة المبدئية");
      return;
    }
    const draftOrder: Order = {
      id: `draft-${Date.now()}`,
      orderNumber: `#DRAFT-${Math.floor(1000 + Math.random() * 9000)}`,
      tenantId: tenant.id,
      orderType,
      tableNumber: orderType === "dine_in" ? selectedTable : undefined,
      customerName: customerName || (orderType === "dine_in" ? `طاولة رقم ${selectedTable}` : "عميل سفري"),
      customerPhone,
      customerAddress: orderType === "delivery" ? customerAddress : undefined,
      items: cart,
      subtotal,
      taxAmount,
      discountAmount,
      total,
      paymentMethod: paymentMethod,
      paymentStatus: "pending",
      orderStatus: "preparing",
      createdAt: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
      cashierName: "الكاشير العام (فاتورة مراجعة)"
    };
    setIsDraftPrint(true);
    setCompletedOrder(draftOrder);
  };

  const fetchHistoryOrders = async () => {
    setHistoryLoading(true);
    try {
      const res = await fetch(`/api/tenants/${tenant.id}/orders`);
      if (res.ok) {
        const data = await res.json();
        setHistoryOrders(data);
      }
    } catch (e) {
      console.error("Failed to fetch orders:", e);
    } finally {
      setHistoryLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 animate-in fade-in duration-200" dir="rtl">
      
      {/* POS Top Header Bar (12 Cols) */}
      <div className="lg:col-span-12 bg-white p-3.5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center text-lg border border-slate-200 overflow-hidden">
              <RestaurantLogo logo={tenant.logo} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">نقطة البيع والكاشير (POS)</h2>
              <p className="text-[10px] text-slate-500">{tenant.nameAr} - كاشير نشط</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl overflow-x-auto border border-slate-200">
              <button
                onClick={() => setPosMode("sales")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  posMode === "sales"
                    ? `${theme.primaryBg} text-white shadow-sm font-bold`
                    : "text-slate-600 hover:bg-white/70"
                }`}
              >
                🛒 كاشير (بيع جديد)
              </button>
              <button
                onClick={() => {
                  setPosMode("orders");
                  fetchHistoryOrders();
                }}
                className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  posMode === "orders"
                    ? `${theme.primaryBg} text-white shadow-sm font-bold`
                    : "text-slate-600 hover:bg-white/70"
                }`}
              >
                <span>📋 قائمة طلبات المطعم</span>
                {pendingSelfOrders.length > 0 && (
                  <span className="absolute -top-1.5 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-black flex items-center justify-center animate-pulse">
                    {pendingSelfOrders.length}
                  </span>
                )}
              </button>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => {
                  fetchHistoryOrders();
                  setHistoryTab("all");
                  setShowOrderHistoryModal(true);
                }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] border border-slate-200 transition-colors whitespace-nowrap shadow-xs cursor-pointer"
                title="سجل الفواتير وإعادة الطباعة"
              >
                <History className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">سجل الفواتير (طباعة)</span>
                <span className="sm:hidden">الفواتير</span>
              </button>

              {posMode === "sales" && (
                <div className="relative w-full sm:w-48">
                  <Search className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="ابحث عن وجبة..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pr-8 pl-3 py-1.5 rounded-xl text-xs bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery("")}
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Categories horizontal tabs (sales only) */}
          {posMode === "sales" && (
            <div className="flex items-center gap-1 overflow-x-auto pb-1 border-t pt-3 border-slate-100">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-300 border shadow-3xs cursor-pointer ${
                  selectedCategory === "all"
                    ? `${theme.primaryBg} text-white border-transparent shadow-xs`
                    : "bg-white hover:bg-slate-50 text-slate-600 border-slate-200/80"
                }`}
              >
                <span>🔥</span>
                <span>الكل ({items.filter(i => i.isAvailable).length})</span>
              </button>

              {categories.map((cat) => {
                const count = items.filter((i) => i.categoryId === cat.id && i.isAvailable).length;
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-300 border shadow-3xs cursor-pointer ${
                      isSelected
                        ? `${theme.primaryBg} text-white border-transparent shadow-xs`
                        : "bg-white hover:bg-slate-50 text-slate-600 border-slate-200/80"
                    }`}
                  >
                    <span className="text-[10px]">{cat.icon}</span>
                    <span>{cat.nameAr}</span>
                    <span className={`text-[8px] font-mono px-1 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

      {/* Right Column (8 Cols): Menu Grid (sales mode only) */}
      {posMode === "sales" && (
        <div className="lg:col-span-8 space-y-4 pos-menu-column animate-in fade-in duration-200">

        {/* Meal Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm space-y-3">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center text-3xl">
              🔍
            </div>
            <h3 className="text-sm font-bold text-slate-800">لا توجد أصناف تطابق البحث</h3>
            <p className="text-xs text-slate-500">جرب البحث بكلمات أخرى أو اختر قسماً مختلفاً من المنيو</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2">
            {filteredItems.map((item) => {
              const inCartQty = cart.find((i) => i.itemId === item.id)?.quantity || 0;
              return (
                <div
                  key={item.id}
                  onClick={() => addToCart(item)}
                  className={`bg-white rounded-lg border transition-all duration-200 cursor-pointer overflow-hidden flex flex-col justify-between group hover:shadow-xs transform hover:-translate-y-0.5 ${
                    inCartQty > 0 
                      ? "border-indigo-500 ring-2 ring-indigo-500/10 bg-indigo-50/20" 
                      : "border-slate-200 hover:border-slate-300 shadow-3xs"
                  }`}
                >
                  {/* Image & Badges */}
                  <div className="relative h-14 w-full overflow-hidden bg-slate-50 border-b border-slate-100">
                    <img
                      src={item.image}
                      alt={item.nameAr}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent" />
                    
                    {item.isBestSeller && (
                      <span className="absolute top-1 right-1 bg-amber-500 text-white text-[7px] font-black px-1.5 py-0.1 rounded-full shadow-sm flex items-center gap-0.5">
                        <span>★</span>
                        <span>مميز</span>
                      </span>
                    )}

                    {inCartQty > 0 && (
                      <span className={`absolute top-1 left-1 ${theme.primaryBg} text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-sm animate-pulse`}>
                        {inCartQty}
                      </span>
                    )}
                  </div>

                  {/* Text Details & Price */}
                  <div className="p-1.5 flex-1 flex flex-col justify-between space-y-1">
                    <div className="space-y-0.5">
                      <h4 className="text-[10px] font-black text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-1">
                        {item.nameAr}
                      </h4>
                      <p className="text-[8px] text-slate-400 line-clamp-1 leading-snug">
                        {item.descriptionAr}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-50">
                      <span className="text-[10px] font-black text-slate-950">
                        {item.price} <span className="text-[8px] font-normal text-slate-400">{tenant.currency}</span>
                      </span>
                      <span className="text-[8px] font-medium text-slate-400 bg-slate-50 px-1 py-0.1 rounded border border-slate-100">
                        {item.preparationTimeMin || 15} د
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      )}

      {/* Left Column (4 Cols): Cart & POS Invoice Register */}
      {posMode === "sales" && (
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col h-[calc(100vh-180px)] sticky top-20 overflow-hidden pos-cart-column">
        
        {/* Cart Header */}
        <div className="p-4 bg-slate-100 text-slate-800 flex items-center justify-between border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white text-indigo-600 border border-slate-200 flex items-center justify-center shadow-2xs">
              <ShoppingCart className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">سلة المشتريات (الفاتورة)</h3>
              <p className="text-[10px] text-slate-500">إجمالي الأصناف: {cart.reduce((sum, i) => sum + i.quantity, 0)}</p>
            </div>
          </div>
          
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs text-rose-600 hover:text-rose-700 flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-rose-50 transition-colors font-bold border border-rose-200"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>مسح</span>
            </button>
          )}
        </div>

        {/* Order Type Selector Tabs */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 space-y-3">
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-200/70 rounded-xl">
            <button
              onClick={() => setOrderType("dine_in")}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all ${
                orderType === "dine_in"
                  ? `${theme.primaryBg} text-white shadow-sm`
                  : "text-slate-600 hover:bg-white/70"
              }`}
            >
              <UtensilsCrossed className="w-3.5 h-3.5" />
              <span>طاولات</span>
            </button>

            <button
              onClick={() => setOrderType("takeaway")}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all ${
                orderType === "takeaway"
                  ? `${theme.primaryBg} text-white shadow-sm`
                  : "text-slate-600 hover:bg-white/70"
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>سفري</span>
            </button>

            <button
              onClick={() => setOrderType("delivery")}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all ${
                orderType === "delivery"
                  ? `${theme.primaryBg} text-white shadow-sm`
                  : "text-slate-600 hover:bg-white/70"
              }`}
            >
              <Bike className="w-3.5 h-3.5" />
              <span>توصيل</span>
            </button>
          </div>

          {/* Conditional Inputs based on Order Type */}
          {orderType === "dine_in" ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span>اختر الطاولة:</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400">
                  {tables.filter(t => t.status === "available").length} طاولات متاحة
                </span>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                {tables.map((t) => {
                  const isOccupied = t.status === "occupied";
                  const isSelected = selectedTable === t.tableNumber;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTable(t.tableNumber)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold shrink-0 border transition-all flex items-center gap-1.5 ${
                        isSelected
                          ? "bg-emerald-600 text-white border-emerald-600 ring-2 ring-emerald-500/30"
                          : isOccupied
                          ? "bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800/60"
                          : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-emerald-500"
                      }`}
                    >
                      <span>طاولة {t.tableNumber}</span>
                      <span className={`w-2 h-2 rounded-full ${isOccupied ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="اسم العميل (اختياري)"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-1 focus:ring-emerald-500 outline-none"
                />
                <input
                  type="text"
                  placeholder="رقم الهاتف"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-1 focus:ring-emerald-500 outline-none"
                />
              </div>
              {orderType === "delivery" && (
                <input
                  type="text"
                  placeholder="عنوان التوصيل بالتفصيل *"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-1 focus:ring-emerald-500 outline-none"
                />
              )}
            </div>
          )}
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-slate-100 dark:divide-slate-800">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-3">
              <ShoppingCart className="w-12 h-12 stroke-1 text-slate-300 dark:text-slate-700" />
              <div>
                <p className="text-sm font-bold text-slate-600 dark:text-slate-300">السلة فارغة حالياً</p>
                <p className="text-xs text-slate-400 mt-1">اضغط على أي صنف من قائمة المنيو لإضافته هنا</p>
              </div>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="pt-3 first:pt-0 flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{item.nameAr}</h4>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                      {(item.price * item.quantity).toFixed(0)} {tenant.currency}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400">{item.price} {tenant.currency} / للصنف</p>
                  <input
                    type="text"
                    placeholder="ملاحظات (بدون بصل، إكسترا صوص...)"
                    value={item.notes || ""}
                    onChange={(e) => updateNotes(item.itemId, e.target.value)}
                    className="w-full mt-1 px-2 py-0.5 text-[9px] rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Quantity Control Buttons */}
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl shrink-0">
                  <button
                    onClick={() => updateQuantity(item.itemId, -1)}
                    className="w-6 h-6 rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-white flex items-center justify-center hover:bg-slate-200 transition-colors shadow-sm text-xs font-bold"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-6 text-center font-bold text-xs text-slate-900 dark:text-white">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.itemId, 1)}
                    className={`w-6 h-6 rounded-lg ${theme.primaryBg} text-white flex items-center justify-center hover:opacity-90 transition-colors shadow-sm text-xs font-bold`}
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                <button
                  onClick={() => removeFromCart(item.itemId)}
                  className="text-slate-400 hover:text-rose-500 p-1 rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Financial Footer & Payment */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 space-y-3">
          
          {/* Summary Breakdown */}
          <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex justify-between">
              <span>المجموع الفرعي:</span>
              <span className="font-semibold">{subtotal.toFixed(2)} {tenant.currency}</span>
            </div>
            <div className="flex justify-between">
              <span>ضريبة القيمة المضافة ({taxRate}%):</span>
              <span className="font-semibold">{taxAmount.toFixed(2)} {tenant.currency}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>الخصم:</span>
              <div className="flex items-center gap-1 w-24">
                <input
                  type="number"
                  min="0"
                  max={subtotal}
                  value={discountAmount || ""}
                  onChange={(e) => setDiscountAmount(Number(e.target.value) || 0)}
                  placeholder="0"
                  className="w-full px-2 py-0.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-left font-mono text-xs outline-none"
                />
                <span className="text-[10px]">{tenant.currency}</span>
              </div>
            </div>
            <div className="flex justify-between text-sm font-black text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-700">
              <span>الإجمالي المطلوب:</span>
              <span className="text-base text-emerald-600 dark:text-emerald-400">{total.toFixed(2)} {tenant.currency}</span>
            </div>
          </div>

          {/* Payment Method Tabs */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400">طريقة الدفع:</label>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                onClick={() => setPaymentMethod("cash")}
                className={`flex items-center justify-center gap-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                  paymentMethod === "cash"
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-emerald-500"
                }`}
              >
                <Banknote className="w-3.5 h-3.5" />
                <span>كاش (نقدي)</span>
              </button>

              <button
                onClick={() => setPaymentMethod("card")}
                className={`flex items-center justify-center gap-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                  paymentMethod === "card"
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-500"
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>شبكة / بطاقة</span>
              </button>

              <button
                onClick={() => setPaymentMethod("pending")}
                className={`flex items-center justify-center gap-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                  paymentMethod === "pending"
                    ? "bg-amber-600 text-white border-amber-600 shadow-md"
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-amber-500"
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>آجل (معلق)</span>
              </button>
            </div>
          </div>

          {/* Main Action Buttons */}
          <div className="grid grid-cols-12 gap-2 pt-1">
            <button
              onClick={handlePrintDraft}
              disabled={cart.length === 0 || isSubmitting}
              className="col-span-3 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs border border-slate-300 dark:border-slate-700 transition-colors flex flex-col sm:flex-row items-center justify-center gap-1 disabled:opacity-40"
              title="طباعة فاتورة للمراجعة قبل الدفع"
            >
              <PrinterIcon className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              <span>فاتورة مبدئية</span>
            </button>

            <button
              onClick={() => handleCheckout('pending')}
              disabled={cart.length === 0 || isSubmitting}
              className="col-span-3 py-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 font-bold text-xs transition-colors flex flex-col sm:flex-row items-center justify-center gap-1 disabled:opacity-40"
              title="تعليق الفاتورة بدون دفع"
            >
              <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>تعليق</span>
            </button>

            <button
              onClick={() => handleCheckout()}
              disabled={cart.length === 0 || isSubmitting}
              className={`col-span-6 py-3 rounded-xl ${theme.primaryBg} ${theme.primaryHover} text-white font-black text-xs sm:text-sm shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-1.5 disabled:opacity-40`}
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>جاري الإتمام...</span>
                </>
              ) : (
                <>
                  <Receipt className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="truncate">إتمام وطباعة ({total.toFixed(0)} {tenant.currency})</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      )}

      {/* Live Orders Management Page (orders mode only) */}
      {posMode === "orders" && (
        <div className="lg:col-span-12 space-y-4 animate-in fade-in duration-200 pos-orders-dashboard">
          {/* Header tabs for statuses */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {(["all", "pending", "preparing", "ready", "archived"] as const).map(tab => {
                const count = tab === "all" 
                  ? historyOrders.filter(o => o.orderStatus !== "delivered" && o.orderStatus !== "cancelled").length
                  : tab === "archived"
                  ? historyOrders.filter(o => o.orderStatus === "delivered" || o.orderStatus === "cancelled").length
                  : historyOrders.filter(o => o.orderStatus === tab).length;
                  
                const label = 
                  tab === "all" ? "الطلبات النشطة" :
                  tab === "pending" ? "بانتظار الموافقة" :
                  tab === "preparing" ? "تحت التحضير" :
                  tab === "ready" ? "جاهز للتسليم" : "المؤرشفة (المنتهية)";
                  
                const badgeColor = 
                  tab === "pending" ? "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400" :
                  tab === "preparing" ? "bg-indigo-100 text-indigo-850 dark:bg-indigo-950/40 dark:text-indigo-400" :
                  tab === "ready" ? "bg-emerald-100 text-emerald-850 dark:bg-emerald-950/40 dark:text-emerald-400" : "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400";

                return (
                  <button
                    key={tab}
                    onClick={() => setPosOrderTab(tab)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                      posOrderTab === tab
                        ? `${theme.primaryBg} text-white shadow-sm font-bold`
                        : "text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    <span>{label}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-black ${posOrderTab === tab ? "bg-white/20 text-white" : badgeColor}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
            
            {/* Search filter for orders */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="ابحث برقم الطلب أو اسم الزبون..."
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
                className="w-full pr-8 pl-3 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Orders Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {historyOrders
              .filter(o => {
                const matchSearch = o.orderNumber.toLowerCase().includes(historySearch.toLowerCase()) || 
                                    (o.customerName && o.customerName.toLowerCase().includes(historySearch.toLowerCase()));
                const matchTab = 
                  posOrderTab === "all" ? o.orderStatus !== "delivered" && o.orderStatus !== "cancelled" :
                  posOrderTab === "archived" ? o.orderStatus === "delivered" || o.orderStatus === "cancelled" :
                  o.orderStatus === posOrderTab;
                return matchSearch && matchTab;
              })
              .map(order => (
                <div key={order.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 shadow-sm flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all">
                  
                  {/* Order header */}
                  <div className="pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-black text-sm text-slate-900 dark:text-white">{order.orderNumber}</span>
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.2 rounded">
                          {order.orderType === 'dine_in' ? `طاولة ${order.tableNumber}` : order.orderType === 'takeaway' ? 'سفري' : 'توصيل'}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        <span>{order.createdAt}</span>
                        <span className="mx-1">•</span>
                        <span>{order.customerName || 'عميل'}</span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      order.orderStatus === "pending" ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-400 animate-pulse" :
                      order.orderStatus === "preparing" ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-400" :
                      order.orderStatus === "ready" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400 animate-pulse" :
                      order.orderStatus === "delivered" ? "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400" : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-400"
                    }`}>
                      {order.orderStatus === "pending" ? "معلق (موافقة)" :
                       order.orderStatus === "preparing" ? "في المطبخ" :
                       order.orderStatus === "ready" ? "جاهز للتسليم" :
                       order.orderStatus === "delivered" ? "تم التسليم" : "ملغي"}
                    </span>
                  </div>

                  {/* Order items list */}
                  <div className="py-3 flex-1 divide-y divide-slate-100/60 dark:divide-slate-800/60">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="py-2 first:pt-0 last:pb-0 text-xs">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-slate-800 dark:text-slate-200">{item.nameAr}</span>
                          <span className="font-mono font-black text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.2 rounded">x{item.quantity}</span>
                        </div>
                        {item.notes && (
                          <p className="text-[10px] text-amber-600 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-950/20 px-2 py-0.5 rounded border border-amber-100 dark:border-amber-900/30 mt-1">
                            💡 ملاحظة: {item.notes}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Pricing and Actions */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4 mt-2">
                    <div className="text-right">
                      <p className="text-[9px] text-slate-400 font-bold">الإجمالي النهائي</p>
                      <p className="font-black text-sm text-emerald-600 dark:text-emerald-400 font-mono">
                        {order.total.toFixed(2)} {tenant.currency}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {order.orderStatus === "pending" && (
                        <>
                          <button
                            onClick={() => handleRejectOrder(order.id)}
                            className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-all cursor-pointer"
                            title="رفض وإلغاء الطلب"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleApproveOrder(order.id)}
                            className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1 cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>موافقة</span>
                          </button>
                        </>
                      )}

                      {order.orderStatus === "preparing" && (
                        <>
                          <button
                            onClick={() => {
                              setIsDraftPrint(false);
                              setCompletedOrder(order);
                            }}
                            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 text-xs font-bold transition-all cursor-pointer"
                            title="طباعة إيصال المطبخ"
                          >
                            <PrinterIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={async () => {
                              const res = await fetch(`/api/tenants/${tenant.id}/orders/${order.id}`, {
                                method: "PUT",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ orderStatus: "ready" })
                              });
                              if (res.ok) {
                                const updated = await res.json();
                                setHistoryOrders(prev => prev.map(o => o.id === order.id ? updated : o));
                              }
                            }}
                            className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1 cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>جاهز</span>
                          </button>
                        </>
                      )}

                      {order.orderStatus === "ready" && (
                        <>
                          <button
                            onClick={() => {
                              setIsDraftPrint(false);
                              setCompletedOrder(order);
                            }}
                            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 text-xs font-bold transition-all cursor-pointer"
                            title="طباعة الفاتورة"
                          >
                            <PrinterIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={async () => {
                              const res = await fetch(`/api/tenants/${tenant.id}/orders/${order.id}`, {
                                method: "PUT",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ orderStatus: "delivered" })
                              });
                              if (res.ok) {
                                const updated = await res.json();
                                setHistoryOrders(prev => prev.map(o => o.id === order.id ? updated : o));
                              }
                            }}
                            className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1 cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>تم التسليم</span>
                          </button>
                        </>
                      )}

                      {(order.orderStatus === "delivered" || order.orderStatus === "cancelled") && (
                        <button
                          onClick={() => {
                            setIsDraftPrint(false);
                            setCompletedOrder(order);
                          }}
                          className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <PrinterIcon className="w-3.5 h-3.5" />
                          <span>إعادة طباعة</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            
            {historyOrders.filter(o => {
              const matchSearch = o.orderNumber.toLowerCase().includes(historySearch.toLowerCase()) || 
                                  (o.customerName && o.customerName.toLowerCase().includes(historySearch.toLowerCase()));
              const matchTab = 
                posOrderTab === "all" ? o.orderStatus !== "delivered" && o.orderStatus !== "cancelled" :
                posOrderTab === "archived" ? o.orderStatus === "delivered" || o.orderStatus === "cancelled" :
                o.orderStatus === posOrderTab;
              return matchSearch && matchTab;
            }).length === 0 && (
              <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-12 text-center text-slate-500 text-sm space-y-2">
                <Receipt className="w-12 h-12 mx-auto text-slate-300" />
                <p className="font-bold text-slate-800 dark:text-slate-200">لا توجد طلبات في هذا القسم حالياً</p>
                <p className="text-xs text-slate-400">ستظهر الطلبات الحية والنشطة هنا بمجرد وصولها لتسهيل إدارتها.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Thermal Receipt Preview Modal */}
      {completedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200 receipt-print-wrapper">
          <div className="bg-white text-slate-900 rounded-3xl max-w-sm w-full p-4 sm:p-6 shadow-2xl border border-slate-200 space-y-4 font-mono text-center relative print:shadow-none print:border-none print:max-w-none print:w-full print:p-0 print:rounded-none">
            
            <button
              onClick={() => {
                setCompletedOrder(null);
                setIsDraftPrint(false);
              }}
              className="absolute top-4 left-4 p-1.5 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors font-sans print:hidden"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Print Header Controls (Hidden during print) */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 font-sans print:hidden">
              <span className="font-bold text-xs text-slate-500 flex items-center gap-1.5">
                <PrinterIcon className="w-4 h-4 text-emerald-600" />
                <span>{isDraftPrint ? "معاينة الفاتورة المبدئية" : "معاينة الفاتورة للطباعة"}</span>
              </span>
              <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-mono">
                {completedOrder.orderNumber}
              </span>
            </div>

            {/* The Dedicated Printable Receipt Component */}
            <div className="max-h-[65vh] overflow-y-auto pr-1 print:max-h-none print:overflow-visible no-scrollbar">
              <POSInvoiceReceipt tenant={tenant} order={completedOrder} isDraft={isDraftPrint} />
            </div>

            {/* Printer Selection (Hidden during print) */}
            {printers.length > 0 && (
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs font-sans print:hidden" dir="rtl">
                <span className="text-slate-500 font-bold whitespace-nowrap">الطابعة:</span>
                <select
                  value={selectedPrinterId}
                  onChange={e => setSelectedPrinterId(e.target.value)}
                  className="w-full bg-transparent font-bold outline-none cursor-pointer text-slate-800"
                >
                  {printers.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.connectionType === 'network' ? `IP: ${p.ipAddress}` : 'USB'}) - {p.printerRole === 'kitchen' ? 'مطبخ' : 'كاشير'}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Actions Toolbar (Hidden during print) */}
            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 font-sans print:hidden">
              <button
                onClick={() => {
                  setCompletedOrder(null);
                  setIsDraftPrint(false);
                }}
                className="py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
              >
                إغلاق وطلب جديد
              </button>
              <button
                onClick={() => {
                  handlePrintOrder(completedOrder, 'receipt');
                }}
                className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md"
              >
                <PrinterIcon className="w-4 h-4" />
                <span>طباعة الإيصال (🖨️)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order History & Invoices Register Modal */}
      {showOrderHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200 print:hidden font-sans" dir="rtl">
          <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-3xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            {/* Header */}
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center">
                  <History className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">سجل فواتير وطلبات المطعم (إعادة الطباعة)</h3>
                  <p className="text-xs text-slate-500">اختر الفاتورة لعرض الإيصال وطباعته فوراً عبر نافذة المتصفح</p>
                </div>
              </div>
              <button
                onClick={() => setShowOrderHistoryModal(false)}
                className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tab selection */}
            <div className="flex items-center gap-1.5 p-3 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setHistoryTab("all")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  historyTab === "all"
                    ? "bg-slate-900 text-white font-bold shadow-sm"
                    : "text-slate-600 hover:bg-white/70"
                }`}
              >
                فواتير المطعم الصادرة
              </button>
              <button
                onClick={() => setHistoryTab("pending")}
                className={`relative px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  historyTab === "pending"
                    ? "bg-amber-600 text-white font-bold shadow-sm"
                    : "text-slate-600 hover:bg-white/70"
                }`}
              >
                <span>طلبات الجوال المعلقة (QR)</span>
                {pendingSelfOrders.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-black flex items-center justify-center animate-pulse">
                    {pendingSelfOrders.length}
                  </span>
                )}
              </button>
            </div>

            {/* Toolbar / Search */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 bg-white dark:bg-slate-900">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="ابحث برقم الفاتورة، اسم العميل..."
                  value={historySearch}
                  onChange={(e) => setHistorySearch(e.target.value)}
                  className="w-full pr-10 pl-4 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button
                onClick={fetchHistoryOrders}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${historyLoading ? 'animate-spin' : ''}`} />
                <span>تحديث الفواتير</span>
              </button>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {historyLoading ? (
                <div className="py-12 text-center text-slate-500 text-sm flex flex-col items-center gap-2">
                  <RefreshCw className="w-6 h-6 animate-spin text-indigo-500" />
                  <span>جاري تحميل سجل الفواتير...</span>
                </div>
              ) : historyOrders.filter(o => {
                const matchSearch = o.orderNumber.toLowerCase().includes(historySearch.toLowerCase()) || 
                                    (o.customerName && o.customerName.toLowerCase().includes(historySearch.toLowerCase()));
                const matchTab = historyTab === 'pending' ? o.orderStatus === 'pending' : o.orderStatus !== 'pending';
                return matchSearch && matchTab;
              }).length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-sm space-y-1">
                  <Receipt className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                  <p className="font-bold">لا توجد فواتير أو طلبات معلقة مطابقة</p>
                  <p className="text-xs text-slate-400">ستظهر هنا فواتير المطعم أو طلبات الكاستمر القادمة من المنيو الرقمي</p>
                </div>
              ) : (
                historyOrders
                  .filter(o => {
                    const matchSearch = o.orderNumber.toLowerCase().includes(historySearch.toLowerCase()) || 
                                        (o.customerName && o.customerName.toLowerCase().includes(historySearch.toLowerCase()));
                    const matchTab = historyTab === 'pending' ? o.orderStatus === 'pending' : o.orderStatus !== 'pending';
                    return matchSearch && matchTab;
                  })
                  .map((ord) => (
                    <div
                      key={ord.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 hover:border-indigo-400 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-mono font-black text-xs text-emerald-600 dark:text-emerald-400">
                          {ord.orderNumber.replace('#', '')}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-900 dark:text-white font-mono">{ord.orderNumber}</span>
                            <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold">
                              {ord.orderType === 'dine_in' ? `طاولة ${ord.tableNumber}` : ord.orderType === 'takeaway' ? 'سفري' : 'توصيل'}
                            </span>
                            {ord.orderStatus === 'pending' && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-400 font-black animate-pulse">
                                معلق (ينتظر الموافقة)
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                            <span>{ord.createdAt}</span>
                            <span>•</span>
                            <span>{ord.customerName || 'عميل نقدي'}</span>
                            <span>•</span>
                            <span>{ord.items.length} أصناف</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200 dark:border-slate-700">
                        <div className="text-right ml-2">
                          <div className="font-black text-sm text-emerald-600 dark:text-emerald-400 font-mono">
                            {ord.total.toFixed(2)} {tenant.currency}
                          </div>
                          <div className="text-[10px] text-slate-400 font-bold">
                            {ord.paymentMethod === 'cash' ? 'نقدي (Cash)' : ord.paymentMethod === 'card' ? 'بطاقة' : ord.paymentMethod === 'pending' ? 'انتظار الموافقة' : 'آجل'}
                          </div>
                        </div>

                        {ord.orderStatus === 'pending' ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleRejectOrder(ord.id)}
                              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 transition-all cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>رفض الطلب</span>
                            </button>
                            <button
                              onClick={() => handleApproveOrder(ord.id)}
                              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>موافق وتحضير</span>
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setIsDraftPrint(false);
                              setCompletedOrder(ord);
                              setShowOrderHistoryModal(false);
                            }}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-sm"
                          >
                            <PrinterIcon className="w-3.5 h-3.5" />
                            <span>طباعة الفاتورة</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-left">
              <button
                onClick={() => setShowOrderHistoryModal(false)}
                className="px-5 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
