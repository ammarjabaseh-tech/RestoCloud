import React, { useState, useEffect, useCallback, useRef } from "react";
import { Tenant, TenantUser, Order } from "../types";

interface DeliveryDriverViewProps {
  tenant: Tenant;
  currentUser: TenantUser;
  onLogout: () => void;
  lang?: 'ar' | 'en' | 'tr';
}

export const DeliveryDriverView: React.FC<DeliveryDriverViewProps> = ({
  tenant,
  currentUser,
  onLogout,
  lang = 'ar',
}) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'ready' | 'mine' | 'done'>('ready');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const prevOrderCountRef = useRef<number | null>(null);

  const playNotificationSound = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.setValueAtTime(880.00, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.4);
    } catch (e) {}
  };

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch(`/api/tenants/${tenant.id}/orders`);
      if (res.ok) {
        const data: Order[] = await res.json();
        if (Array.isArray(data)) {
          const currentDeliveryCount = data.filter(
            o => o.orderType === "delivery" && o.orderStatus !== "delivered" && o.orderStatus !== "cancelled"
          ).length;

          if (prevOrderCountRef.current !== null && currentDeliveryCount > prevOrderCountRef.current) {
            playNotificationSound();
          }
          prevOrderCountRef.current = currentDeliveryCount;

          setOrders(data);
        }
      }
    } catch (e) {
      console.error("DeliveryView: failed to fetch orders", e);
    } finally {
      setLoading(false);
    }
  }, [tenant.id]);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 6000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await fetchOrders();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const updateOrderStatus = async (orderId: string, newStatus: string, driverName?: string) => {
    setUpdatingId(orderId);
    try {
      const body: any = { orderStatus: newStatus };
      if (driverName !== undefined) body.deliveryDriverName = driverName;
      const res = await fetch(`/api/tenants/${tenant.id}/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        playNotificationSound();
        await fetchOrders();
        if (newStatus === "out_for_delivery") {
          setActiveTab("mine");
        }
      } else {
        let errMsg = "فشل في تحديث حالة الطلب";
        try {
          const errData = await res.json();
          if (errData.error) errMsg = errData.error;
        } catch (e) {}
        alert(errMsg);
      }
    } catch (e) {
      console.error("DeliveryView: failed to update order", e);
      alert("تعذر الاتصال بالخادم لتحديث الطلب");
    } finally {
      setUpdatingId(null);
    }
  };

  // Ready delivery orders (unassigned or assigned to current user, not yet out for delivery)
  const readyOrders = orders.filter(
    (o) =>
      o.orderType === "delivery" &&
      o.orderStatus !== "delivered" &&
      o.orderStatus !== "cancelled" &&
      o.orderStatus !== "out_for_delivery" &&
      (!o.deliveryDriverName || o.deliveryDriverName.trim() === "" || o.deliveryDriverName === currentUser.name)
  );

  // My active orders (out for delivery with my name)
  const myActiveOrders = orders.filter(
    (o) =>
      o.orderType === "delivery" &&
      o.deliveryDriverName === currentUser.name &&
      o.orderStatus === "out_for_delivery"
  );

  // My completed orders today
  const myDoneOrders = orders.filter(
    (o) =>
      o.orderType === "delivery" &&
      o.orderStatus === "delivered" &&
      o.deliveryDriverName === currentUser.name
  );

  const totalEarnings = myDoneOrders.reduce((sum, o) => sum + Number(o.total || 0), 0);

  const statusBadge = (status: string) => {
    const map: Record<string, { label: string; color: string }> = {
      pending: { label: "بانتظار التأكيد ⏳", color: "bg-amber-100 text-amber-800" },
      preparing: { label: "في المطبخ 👨‍🍳", color: "bg-indigo-100 text-indigo-800" },
      ready: { label: "جاهز للتوصيل 🟢", color: "bg-emerald-100 text-emerald-800" },
      out_for_delivery: { label: "في الطريق 🛵", color: "bg-sky-100 text-sky-800" },
      delivered: { label: "تم التوصيل ✅", color: "bg-slate-100 text-slate-600" },
    };
    const s = map[status] || { label: status, color: "bg-gray-100 text-gray-600" };
    return (
      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${s.color}`}>
        {s.label}
      </span>
    );
  };

  const OrderCard = ({ order, showActions }: { order: Order; showActions?: boolean }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-black text-slate-800 text-sm">#{order.orderNumber || order.id.slice(-6)}</p>
          <p className="text-xs text-slate-500 mt-0.5">{order.customerName || "زبون"}</p>
        </div>
        {statusBadge(order.orderStatus)}
      </div>

      {/* Driver Assignment Badge */}
      {order.deliveryDriverName && (
        <div className="text-[11px] font-bold text-sky-700 bg-sky-50 rounded-lg px-2.5 py-1 flex items-center gap-1.5 border border-sky-100">
          <span>🛵 السائق المحدد:</span>
          <span>{order.deliveryDriverName}</span>
        </div>
      )}

      {/* Address / Google Maps Link */}
      {order.customerAddress && (
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.customerAddress)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-start gap-2.5 bg-sky-50/70 hover:bg-sky-100/80 rounded-xl p-3 text-sky-900 border border-sky-100 transition-all cursor-pointer group"
          title="انقر لفتح العنوان في خرائط جوجل Google Maps"
        >
          <span className="text-lg shrink-0 group-hover:scale-110 transition-transform">📍</span>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold leading-relaxed">{order.customerAddress}</p>
            <span className="text-[10px] text-sky-600 font-extrabold flex items-center gap-1 mt-1 underline">
              <span>فتح الموقع في الخريطة (Google Maps)</span>
              <span>🗺️</span>
            </span>
          </div>
        </a>
      )}

      {/* Phone */}
      {order.customerPhone && (
        <a
          href={`tel:${order.customerPhone}`}
          className="flex items-center gap-2 bg-emerald-50 rounded-xl p-3 text-emerald-700 hover:bg-emerald-100 transition-colors"
        >
          <span className="text-base">📞</span>
          <span className="text-xs font-bold">{order.customerPhone}</span>
        </a>
      )}

      {/* Items */}
      {order.items && order.items.length > 0 && (
        <div className="space-y-1">
          {order.items.map((item, i) => (
            <div key={i} className="flex justify-between text-xs text-slate-600">
              <span>{item.nameAr} × {item.quantity}</span>
              <span className="font-bold">{(item.price * item.quantity).toFixed(2)} {tenant.currency}</span>
            </div>
          ))}
        </div>
      )}

      {/* Total */}
      <div className="flex justify-between items-center pt-2 border-t border-slate-100">
        <span className="text-xs text-slate-500">المجموع</span>
        <span className="font-black text-slate-800 text-sm">{Number(order.total || 0).toFixed(2)} {tenant.currency}</span>
      </div>

      {/* Actions */}
      {showActions && (
        <div className="grid grid-cols-2 gap-2 pt-1">
          {order.orderStatus !== "out_for_delivery" && order.orderStatus !== "delivered" && (
            <button
              disabled={updatingId === order.id}
              onClick={() => updateOrderStatus(order.id, "out_for_delivery", currentUser.name)}
              className="col-span-2 bg-gradient-to-r from-sky-600 to-indigo-600 text-white text-xs font-black py-2.5 rounded-xl hover:opacity-90 transition-all disabled:opacity-50 cursor-pointer shadow-md active:scale-98"
            >
              {updatingId === order.id ? "⏳ جاري التحديث..." : "🛵 استلام الطلب والخروج للتوصيل"}
            </button>
          )}
          {order.orderStatus === "out_for_delivery" && (
            <button
              disabled={updatingId === order.id}
              onClick={() => updateOrderStatus(order.id, "delivered")}
              className="col-span-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-black py-2.5 rounded-xl hover:opacity-90 transition-all disabled:opacity-50 cursor-pointer shadow-md active:scale-98"
            >
              {updatingId === order.id ? "⏳ جاري التحديث..." : "✅ تم التوصيل بنجاح"}
            </button>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div
      className="min-h-screen bg-slate-50 font-sans"
      dir="rtl"
      style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white px-4 py-5 shadow-lg">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-xl">
              🛵
            </div>
            <div>
              <h1 className="text-base font-black text-white">شاشة الدليفري والتوصيل</h1>
              <p className="text-[11px] text-sky-200 mt-0.5">
                {currentUser.name} · {tenant.nameAr}
              </p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="text-[11px] text-white/60 hover:text-white border border-white/20 rounded-xl px-3 py-1.5 transition-colors cursor-pointer"
          >
            خروج
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-2xl mx-auto px-4 pt-4 grid grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-3 text-center">
          <p className="text-2xl font-black text-emerald-600">{readyOrders.length}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">طلبات مريضة/متاحة</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-3 text-center">
          <p className="text-2xl font-black text-sky-600">{myActiveOrders.length}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">في الطريق 🛵</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-3 text-center">
          <p className="text-2xl font-black text-slate-700">{myDoneOrders.length}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">تم تسليمها</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-2xl mx-auto px-4 pt-4">
        <div className="bg-white rounded-2xl border border-slate-100 p-1 flex gap-1 shadow-sm">
          {(["ready", "mine", "done"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 text-xs font-bold py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === tab
                  ? "bg-sky-600 text-white shadow"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              {tab === "ready"
                ? `جاهزة (${readyOrders.length})`
                : tab === "mine"
                ? `في الطريق (${myActiveOrders.length})`
                : `منجزة (${myDoneOrders.length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 pt-4 pb-28 space-y-3">
        {loading ? (
          <div className="text-center py-16 text-slate-400">
            <div className="w-10 h-10 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm">جاري تحميل الطلبات...</p>
          </div>
        ) : activeTab === "ready" ? (
          readyOrders.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <p className="text-4xl mb-3">🛵</p>
              <p className="text-sm font-bold">لا توجد طلبات جاهزة للتوصيل حالياً</p>
              <p className="text-xs mt-1">ستظهر هنا الطلبات فور إرسالها من الكاشير أو تحضيرها في المطبخ</p>
            </div>
          ) : (
            readyOrders.map((o) => (
              <div key={o.id}>
                <OrderCard order={o} showActions />
              </div>
            ))
          )
        ) : activeTab === "mine" ? (
          myActiveOrders.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <p className="text-4xl mb-3">📦</p>
              <p className="text-sm font-bold">لا توجد طلبات قيد التوصيل في الطريق</p>
              <p className="text-xs mt-1">استلم الطلبات من تبويب "جاهزة" للبدء بالتوصيل</p>
            </div>
          ) : (
            myActiveOrders.map((o) => (
              <div key={o.id}>
                <OrderCard order={o} showActions />
              </div>
            ))
          )
        ) : (
          <>
            {myDoneOrders.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <p className="text-4xl mb-3">✅</p>
                <p className="text-sm font-bold">لم تُنجز أي طلبات بعد اليوم</p>
              </div>
            ) : (
              <>
                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl p-4 flex justify-between items-center shadow-md">
                  <div>
                    <p className="text-[11px] text-emerald-100">إجمالي المبالغ المحصلة</p>
                    <p className="text-2xl font-black mt-0.5">{totalEarnings.toFixed(2)} {tenant.currency}</p>
                  </div>
                  <span className="text-3xl">💰</span>
                </div>
                {myDoneOrders.map((o) => (
                  <div key={o.id}>
                    <OrderCard order={o} />
                  </div>
                ))}
              </>
            )}
          </>
        )}
      </div>

      {/* Refresh Button */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-20">
        <button
          onClick={handleManualRefresh}
          disabled={isRefreshing}
          className="bg-sky-600 hover:bg-sky-700 text-white text-xs font-black px-6 py-3 rounded-2xl shadow-xl transition-all cursor-pointer flex items-center gap-2 active:scale-95 disabled:opacity-75"
        >
          <span className={`inline-block text-sm ${isRefreshing ? "animate-spin" : ""}`}>🔄</span>
          <span>{isRefreshing ? "جاري التحديث..." : "تحديث الطلبات"}</span>
        </button>
      </div>
    </div>
  );
};
