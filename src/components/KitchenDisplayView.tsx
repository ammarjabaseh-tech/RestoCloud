import React, { useState, useEffect } from "react";
import { Tenant, Order, OrderStatus, MenuItem } from "../types";
import { 
  ChefHat, 
  Clock, 
  Check, 
  Play, 
  CheckSquare, 
  Volume2, 
  VolumeX, 
  RefreshCw, 
  Utensils, 
  ShoppingBag, 
  Bike,
  AlertCircle
} from "lucide-react";
import { getThemeClasses } from "../utils/theme";

const kdsTranslations = {
  ar: {
    kdsTitle: "شاشة المطبخ (KDS)",
    activeKitchen: "المطبخ 👨‍🍳",
    subtitle: "تحضير ومتابعة الطلبات الحية",
    muteBtn: "كتم الصوت",
    unmuteBtn: "تفعيل الصوت",
    silentAlert: "صامت",
    activeAlert: "الصوت نشط",
    refresh: "تحديث",
    all: "الكل",
    dineIn: "طاولات",
    takeaway: "سفري",
    delivery: "توصيل",
    loadingOrders: "جاري التحميل...",
    emptyTitle: "لا توجد طلبات نشطة حالياً",
    emptyDesc: "ستظهر طلبات المطبخ فور إرسالها مع تنبيه صوتي.",
    preparingTitle: "قيد التحضير",
    readyTitle: "جاهز للتسليم",
    noPreparing: "لا توجد طلبات قيد التحضير",
    noReady: "لا توجد طلبات جاهزة",
    dineInLabel: "طاولة",
    takeawayLabel: "سفري",
    deliveryLabel: "توصيل",
    cashierLabel: "الكاشير:",
    readyForCustomer: "جاهز",
    since: "منذ",
    minutes: "د",
    noteLabel: "💡 ملاحظة:",
    startPrep: "بدء التحضير",
    markReady: "جاهز",
    markDelivered: "إنهاء وأرشفة"
  },
  en: {
    kdsTitle: "Kitchen Display System (KDS)",
    activeKitchen: "Active Kitchen 👨‍🍳",
    subtitle: "Prepare live orders, check chef notes, and update customers when ready",
    muteBtn: "Mute sound alerts",
    unmuteBtn: "Unmute sound alerts for new orders",
    silentAlert: "Silent Alert",
    activeAlert: "Sound Alert Active",
    refresh: "Refresh",
    all: "All",
    dineIn: "Tables",
    takeaway: "Takeaway",
    delivery: "Delivery",
    loadingOrders: "Loading active kitchen orders...",
    emptyTitle: "Kitchen has no active orders currently!",
    emptyDesc: "When the cashier approves a new order, it will appear here instantly with a notification chime.",
    preparingTitle: "Orders in Preparation",
    readyTitle: "Ready for Pickup",
    noPreparing: "No orders in prep currently",
    noReady: "No orders waiting for pickup",
    dineInLabel: "Dine In (Table",
    takeawayLabel: "Takeaway",
    deliveryLabel: "Delivery",
    cashierLabel: "Cashier:",
    readyForCustomer: "Ready for Customer",
    since: "since",
    minutes: "min",
    noteLabel: "💡 Note:",
    startPrep: "Start Prep",
    markReady: "Mark Ready",
    markDelivered: "Mark Delivered & Archive"
  },
  tr: {
    kdsTitle: "Mutfak Ekran Sistemi (KDS)",
    activeKitchen: "Aktif Mutfak 👨‍🍳",
    subtitle: "Canlı siparişleri hazırlayın, şef notlarını görün ve hazır olduğunda bildirin",
    muteBtn: "Sesli uyarıyı sessize al",
    unmuteBtn: "Yeni siparişler için sesli uyarıyı aç",
    silentAlert: "Sessiz Uyarı",
    activeAlert: "Sesli Uyarı Aktif",
    refresh: "Yenile",
    all: "Tümü",
    dineIn: "Masalar",
    takeaway: "Gel-Al",
    delivery: "Paket Servis",
    loadingOrders: "Aktif mutfak siparişleri yükleniyor...",
    emptyTitle: "Mutfakta aktif sipariş bulunmamaktadır!",
    emptyDesc: "Kasiyer yeni bir siparişi onayladığında, burada sesli uyarı ile anında görünecektir.",
    preparingTitle: "Hazırlanan Siparişler",
    readyTitle: "Teslime Hazır (Pickup)",
    noPreparing: "Şu anda hazırlanan sipariş yok",
    noReady: "Teslim edilmeyi bekleyen hazır sipariş yok",
    dineInLabel: "Masada (Masa",
    takeawayLabel: "Gel-Al",
    deliveryLabel: "Paket Servis",
    cashierLabel: "Kasiyer:",
    readyForCustomer: "Müşteriye Hazır",
    since: "süre:",
    minutes: "dk",
    noteLabel: "💡 Not:",
    startPrep: "Hazırlığa Başla",
    markReady: "Hazır Olarak İşaretle",
    markDelivered: "Teslim Edildi & Arşivle"
  }
};

interface KitchenDisplayViewProps {
  tenant: Tenant;
  lang?: 'ar' | 'en' | 'tr';
}

export const KitchenDisplayView: React.FC<KitchenDisplayViewProps> = ({ tenant, lang = 'ar' }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [menuItems, setMenuItems] = useState<Record<string, MenuItem>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [filterType, setFilterType] = useState<"all" | "dine_in" | "takeaway" | "delivery">("all");
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch(`/api/tenants/${tenant.id}/menu-items`);
        if (res.ok) {
          const data: MenuItem[] = await res.json();
          const map: Record<string, MenuItem> = {};
          data.forEach(item => {
            map[item.id] = item;
          });
          setMenuItems(map);
        }
      } catch (err) {
        console.error("Failed to fetch menu items for KDS translation", err);
      }
    };
    fetchMenu();
  }, [tenant.id]);
  
  const theme = getThemeClasses(tenant.themeColor);

  // Sound Notification using Web Audio API (Synthesizing a nice chime)
  const playNotificationSound = () => {
    if (isMuted) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = "sine";
      // Double chime sound
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.12); // A5
      
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch (err) {
      console.warn("AudioContext chime blocked by browser auto-play policy:", err);
    }
  };

  const fetchOrders = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const res = await fetch(`/api/tenants/${tenant.id}/orders`);
      if (!res.ok) throw new Error("فشل في تحميل الطلبات النشطة");
      const data: Order[] = await res.json();
      
      // Filter to active orders only (preparing, ready)
      const active = data.filter(o => 
        o.orderStatus === "preparing" || 
        o.orderStatus === "ready"
      );
      
      // Sort: Ready at the end, Pending & Preparing at the beginning (oldest first)
      const sorted = active.sort((a, b) => {
        if (a.orderStatus === "ready" && b.orderStatus !== "ready") return 1;
        if (a.orderStatus !== "ready" && b.orderStatus === "ready") return -1;
        
        // Both pending/preparing: sort by date ascending (oldest first)
        const timeA = a.createdAtIso ? new Date(a.createdAtIso).getTime() : 0;
        const timeB = b.createdAtIso ? new Date(b.createdAtIso).getTime() : 0;
        return timeA - timeB;
      });

      // Play alert if new order arrives
      setOrders(prev => {
        if (prev.length > 0) {
          const prevIds = new Set(prev.map(o => o.id));
          const hasNew = sorted.some(o => !prevIds.has(o.id) && o.orderStatus !== "ready");
          if (hasNew) {
            playNotificationSound();
          }
        }
        return sorted;
      });

      setError("");
    } catch (err: any) {
      setError(err.message || "حدث خطأ");
    } finally {
      if (!silent) setLoading(false);
    }
  };

  // Poll orders every 10 seconds & tick time every 10 seconds for relative minutes
  useEffect(() => {
    fetchOrders();

    const interval = setInterval(() => {
      fetchOrders(true);
    }, 10000);

    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 10000);

    return () => {
      clearInterval(interval);
      clearInterval(timeInterval);
    };
  }, [tenant.id]);

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const res = await fetch(`/api/tenants/${tenant.id}/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderStatus: newStatus })
      });
      if (!res.ok) throw new Error("فشل في تحديث حالة الطلب");
      const updated: Order = await res.json();
      
      setOrders(prev => {
        // If archived ('delivered' or 'cancelled'), remove it. Otherwise, update it
        if (newStatus === "delivered" || newStatus === "cancelled") {
          return prev.filter(o => o.id !== orderId);
        }
        return prev.map(o => o.id === orderId ? { ...o, orderStatus: newStatus } : o);
      });
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Calculate relative waiting time in minutes
  const getWaitingTimeMin = (isoStr?: string) => {
    if (!isoStr) return 0;
    const diffMs = currentTime.getTime() - new Date(isoStr).getTime();
    return Math.max(0, Math.floor(diffMs / 60000));
  };

  const getWaitingTimeColor = (mins: number, status: OrderStatus) => {
    if (status === "ready") return "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20";
    if (mins >= 20) return "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 animate-pulse border border-rose-200 dark:border-rose-800/40";
    if (mins >= 10) return "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20";
    return "text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/60";
  };

  const filteredOrders = orders.filter(o => {
    if (filterType === "all") return true;
    return o.orderType === filterType;
  });

  const pendingList = filteredOrders.filter(o => o.orderStatus === "pending");
  const preparingList = filteredOrders.filter(o => o.orderStatus === "preparing");
  const readyList = filteredOrders.filter(o => o.orderStatus === "ready");

  return (
    <div className="min-h-[calc(100vh-130px)] bg-slate-950 text-slate-100 p-4 sm:p-6 rounded-3xl shadow-xl border border-slate-900 flex flex-col font-sans" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      
      {/* Top Header Dashboard */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-5 border-b border-slate-900">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/20 shadow-md`}>
            <ChefHat className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-tight text-white">{kdsTranslations[lang].kdsTitle}</h1>
              <span className="bg-slate-900 border border-slate-800 text-slate-400 text-[10px] font-black px-2 py-0.5 rounded-full">
                {kdsTranslations[lang].activeKitchen}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{kdsTranslations[lang].subtitle}</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Mute Notification Chime */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
              isMuted 
                ? "bg-rose-950/20 border-rose-900/60 text-rose-400 hover:bg-rose-950/30" 
                : "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800"
            }`}
            title={isMuted ? kdsTranslations[lang].unmuteBtn : kdsTranslations[lang].muteBtn}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            <span>{isMuted ? kdsTranslations[lang].silentAlert : kdsTranslations[lang].activeAlert}</span>
          </button>

          {/* Manual Refresh */}
          <button
            onClick={() => fetchOrders()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 text-xs font-bold transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>{kdsTranslations[lang].refresh}</span>
          </button>

          <div className="h-5 w-px bg-slate-800 mx-1 hidden sm:block"></div>

          {/* Order Type Filter Tabs */}
          <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-xl">
            {(["all", "dine_in", "takeaway", "delivery"] as const).map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  filterType === type 
                    ? "bg-indigo-600 text-white shadow-md" 
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {type === "all" ? kdsTranslations[lang].all : type === "dine_in" ? kdsTranslations[lang].dineIn : type === "takeaway" ? kdsTranslations[lang].takeaway : kdsTranslations[lang].delivery}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main KDS Columns Grid */}
      {loading && orders.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-20 text-slate-500 text-sm gap-2">
          <RefreshCw className="w-8 h-8 animate-spin text-indigo-500" />
          <span>{kdsTranslations[lang].loadingOrders}</span>
        </div>
      ) : orders.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-20 text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 text-slate-600 flex items-center justify-center text-3xl">
            🍳
          </div>
          <h3 className="text-base font-bold text-slate-300">{kdsTranslations[lang].emptyTitle}</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">{kdsTranslations[lang].emptyDesc}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 flex-1 items-start">
          
          {/* Column 1: Preparing Orders */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-2 bg-slate-900/60 rounded-xl border border-slate-900/80">
              <span className="flex items-center gap-2 text-sm font-bold text-slate-300">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span>{kdsTranslations[lang].preparingTitle}</span>
              </span>
              <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full text-xs font-black font-mono">
                {preparingList.length}
              </span>
            </div>
            
            <div className="space-y-3 max-h-[70vh] overflow-y-auto no-scrollbar pb-10">
              {preparingList.map(order => renderOrderCard(order))}
              {preparingList.length === 0 && (
                <div className="text-center py-10 border border-dashed border-slate-900/60 rounded-2xl text-xs text-slate-600 font-bold">
                  {kdsTranslations[lang].noPreparing}
                </div>
              )}
            </div>
          </div>

          {/* Column 2: Ready Orders */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-2 bg-slate-900/60 rounded-xl border border-slate-900/80">
              <span className="flex items-center gap-2 text-sm font-bold text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{kdsTranslations[lang].readyTitle}</span>
              </span>
              <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full text-xs font-black font-mono">
                {readyList.length}
              </span>
            </div>
            
            <div className="space-y-3 max-h-[70vh] overflow-y-auto no-scrollbar pb-10">
              {readyList.map(order => renderOrderCard(order))}
              {readyList.length === 0 && (
                <div className="text-center py-10 border border-dashed border-slate-900/60 rounded-2xl text-xs text-slate-600 font-bold">
                  {kdsTranslations[lang].noReady}
                </div>
              )}
            </div>
          </div>

        </div>
      )}
    </div>
  );

  // Helper renderer for single KDS order card
  function renderOrderCard(order: Order) {
    const minsWaiting = getWaitingTimeMin(order.createdAtIso);
    
    // Icon based on order type
    const OrderIcon = order.orderType === "dine_in" 
      ? Utensils 
      : order.orderType === "takeaway" 
      ? ShoppingBag 
      : Bike;
      
    const typeLabel = order.orderType === "dine_in" 
      ? `${kdsTranslations[lang].dineInLabel} ${order.tableNumber || 1})` 
      : order.orderType === "takeaway" 
      ? kdsTranslations[lang].takeawayLabel 
      : kdsTranslations[lang].deliveryLabel;

    return (
      <div 
        key={order.id} 
        className={`bg-slate-900 rounded-2xl border transition-all overflow-hidden flex flex-col justify-between ${
          order.orderStatus === "ready" 
            ? "border-emerald-950 hover:border-emerald-800" 
            : minsWaiting >= 20 
            ? "border-rose-950/80 ring-2 ring-rose-950/40" 
            : "border-slate-800 hover:border-slate-700"
        }`}
      >
        {/* Card Header Info */}
        <div className="p-3 bg-slate-900/40 border-b border-slate-800 flex items-center justify-between gap-2">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <span className="font-mono font-black text-sm text-indigo-400">{order.orderNumber}</span>
              <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-1.5 py-0.2 rounded flex items-center gap-1">
                <OrderIcon className="w-3 h-3 text-indigo-500" />
                <span>{typeLabel}</span>
              </span>
            </div>
            <div className="text-[10px] text-slate-500 font-medium">
              <span>
                {order.cashierName === "طلب ذاتي (QR Menu)" ? (
                  lang === 'ar' ? "📱 طلب ذاتي (QR)" : lang === 'tr' ? "📱 Self Servis (QR)" : "📱 Self Order (QR)"
                ) : order.cashierName && order.cashierName !== "الكاشير العام" && order.cashierName !== "General Cashier" && order.cashierName !== "Genel Kasiyer" ? (
                  `${lang === 'ar' ? "👤 الويتر:" : lang === 'tr' ? "👤 Garson:" : "👤 Waiter:"} ${order.cashierName}`
                ) : (
                  `${lang === 'ar' ? "💼 الكاشير" : lang === 'tr' ? "💼 Kasiyer" : "💼 Cashier"}`
                )}
              </span>
              {order.customerName && order.orderType !== "dine_in" && (
                <span className="mr-1.5 font-bold text-slate-400">({order.customerName})</span>
              )}
            </div>
          </div>

          {/* Waiting Timer Badge */}
          <div className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-black tracking-wide ${getWaitingTimeColor(minsWaiting, order.orderStatus)}`}>
            <Clock className="w-3.5 h-3.5 shrink-0" />
            {order.orderStatus === "ready" ? (
              <span>{kdsTranslations[lang].readyForCustomer}</span>
            ) : (
              <span>{kdsTranslations[lang].since} {minsWaiting} {kdsTranslations[lang].minutes}</span>
            )}
          </div>
        </div>

        {/* Card Body - Items & Notes */}
        <div className="p-3 flex-1 space-y-2">
          <div className="divide-y divide-slate-800/80">
            {order.items.map((item, idx) => {
              const dbItem = menuItems[item.itemId];
              const itemName = dbItem 
                ? (lang === 'ar' ? dbItem.nameAr : (lang === 'tr' && dbItem.nameTr ? dbItem.nameTr : (dbItem.nameEn || dbItem.nameAr)))
                : item.nameAr;
              return (
                <div key={idx} className="py-2 first:pt-0 last:pb-0 space-y-1">
                  <div className="flex items-start justify-between text-xs gap-3">
                    <span className="font-extrabold text-white leading-snug">{itemName}</span>
                    <span className="font-mono font-black text-sm bg-indigo-950/60 text-indigo-300 border border-indigo-900/40 px-2 py-0.2 rounded-lg shrink-0">
                      x{item.quantity}
                    </span>
                  </div>
                  {item.notes && (
                    <div className="text-[10px] font-black text-amber-300 bg-amber-950/20 border border-amber-900/30 p-1.5 rounded-lg pr-2 leading-relaxed">
                      {kdsTranslations[lang].noteLabel} {item.notes}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Card Footer - Next Action Buttons */}
        <div className="p-2 bg-slate-900/20 border-t border-slate-800/60 flex items-center justify-end">
          {order.orderStatus === "pending" && (
            <button
              onClick={() => updateOrderStatus(order.id, "preparing")}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-black shadow-sm transition-all cursor-pointer"
            >
              <Play className="w-3.5 h-3.5" />
              <span>{kdsTranslations[lang].startPrep}</span>
            </button>
          )}

          {order.orderStatus === "preparing" && (
            <button
              onClick={() => updateOrderStatus(order.id, "ready")}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-sm transition-all cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{kdsTranslations[lang].markReady}</span>
            </button>
          )}

          {order.orderStatus === "ready" && (
            <button
              onClick={() => updateOrderStatus(order.id, "delivered")}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow-sm transition-all cursor-pointer"
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>{kdsTranslations[lang].markDelivered}</span>
            </button>
          )}
        </div>
      </div>
    );
  }
};
