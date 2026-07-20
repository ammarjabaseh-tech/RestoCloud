const fs = require("fs");
const file = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/POSDashboardView.tsx";

if (fs.existsSync(file)) {
  let content = fs.readFileSync(file, "utf8");

  const targetLine = `  if (currentUser?.role === 'waiter') {
    return renderWaiterView();
  }`;

  const replacement = `  const renderDeliveryView = () => {
    const readyOrders = historyOrders.filter(o => 
      o.orderType === "delivery" && 
      o.orderStatus === "ready" && 
      (!o.deliveryDriverName || o.deliveryDriverName.trim() === "")
    );

    const myActiveOrders = historyOrders.filter(o => 
      o.orderType === "delivery" && 
      o.orderStatus !== "delivered" && 
      o.orderStatus !== "cancelled" && 
      o.deliveryDriverName === currentUser?.name
    );

    const myCompletedOrders = historyOrders.filter(o => 
      o.orderType === "delivery" && 
      o.orderStatus === "delivered" && 
      o.deliveryDriverName === currentUser?.name
    );

    const totalCashCollected = myCompletedOrders.reduce((sum, o) => sum + Number(o.total), 0);

    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 font-sans text-right" dir="rtl">
        {/* Header driver dashboard */}
        <div className="bg-gradient-to-r from-sky-600 to-indigo-700 text-white p-5 rounded-3xl shadow-lg border border-sky-500/20 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl bg-white/10 w-12 h-12 rounded-2xl flex items-center justify-center">🛵</span>
            <div>
              <h1 className="text-base font-black text-white">{lang === 'ar' ? 'لوحة تحكم كابتن التوصيل' : 'Delivery Captain Dashboard'}</h1>
              <p className="text-[10px] text-sky-100 mt-0.5">
                {lang === 'ar' ? \`السائق النشط: \${currentUser?.name}\` : \`Active Captain: \${currentUser?.name}\`}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              if (confirm(lang === 'ar' ? "هل تريد تسجيل الخروج؟" : "Confirm Logout?")) {
                window.location.reload();
              }
            }}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/15 text-xs font-black rounded-xl transition-all cursor-pointer flex items-center gap-1.5 justify-center self-start"
          >
            <span>تسجيل الخروج</span>
            <span>👋</span>
          </button>
        </div>

        {/* Driver Stats summary */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
            <span className="text-xl">📦</span>
            <h3 className="text-[10px] text-slate-400 font-bold mt-1">رحلات اليوم</h3>
            <p className="text-lg font-black text-slate-800 dark:text-white font-mono mt-0.5">
              {myCompletedOrders.length} {lang === 'ar' ? 'توصيل' : 'Done'}
            </p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
            <span className="text-xl">💰</span>
            <h3 className="text-[10px] text-slate-400 font-bold mt-1">المبالغ المحصلة كاش</h3>
            <p className="text-lg font-black text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
              {totalCashCollected.toFixed(0)} <span className="text-[10px] font-normal text-slate-400">{tenant.currency}</span>
            </p>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="space-y-6">
          {/* Section 1: My active deliveries */}
          <div>
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              <span>{lang === 'ar' ? 'طلباتي قيد التوصيل حالياً:' : 'My Active Deliveries:'}</span>
              <span className="text-[9px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-mono">{myActiveOrders.length}</span>
            </h2>

            {myActiveOrders.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400 font-bold">
                📭 {lang === 'ar' ? 'لا توجد لديك طلبات قيد التوصيل حالياً. استلم طلباً من الأسفل!' : 'No active deliveries. Claim a ready order below!'}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {myActiveOrders.map(order => (
                  <div key={order.id} className="bg-white dark:bg-slate-900 border border-indigo-150 dark:border-indigo-900/40 rounded-3xl p-4 shadow-sm space-y-4">
                    {/* Header card details */}
                    <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-3">
                      <div>
                        <span className="font-mono font-black text-sm text-slate-900 dark:text-white">{order.orderNumber}</span>
                        <p className="text-[9px] text-slate-400 mt-1">{order.createdAt}</p>
                      </div>
                      <span className="text-[9px] font-black bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full uppercase">
                        جاري التوصيل 🚚
                      </span>
                    </div>

                    {/* Customer details */}
                    <div className="space-y-2 text-xs">
                      <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-100 dark:border-slate-900 space-y-1.5">
                        <p className="font-black text-slate-855 dark:text-slate-205">👤 {order.customerName || 'زبون توصيل'}</p>
                        {order.customerPhone && (
                          <div className="flex justify-between items-center gap-2 pt-1 border-t border-slate-100/60 dark:border-slate-800/60">
                            <span className="text-slate-500 font-sans">{order.customerPhone}</span>
                            <a
                              href={\`tel:\${order.customerPhone}\`}
                              className="px-2.5 py-1 bg-emerald-500 text-white text-[10px] font-black rounded-lg shadow-sm flex items-center gap-1 active:scale-95 cursor-pointer"
                            >
                              <span>📞</span>
                              <span>اتصال</span>
                            </a>
                          </div>
                        )}
                      </div>

                      {order.customerAddress && (
                        <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-100 dark:border-slate-900 space-y-2">
                          <p className="text-slate-600 dark:text-slate-350 leading-relaxed">
                            📍 {order.customerAddress}
                          </p>
                          <a
                            href={\`https://www.google.com/maps/search/?api=1&query=\${encodeURIComponent(order.customerAddress)}\`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-1.5 bg-sky-500 hover:bg-sky-600 text-white text-[10px] font-black rounded-lg shadow-sm flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
                          >
                            <span>🗺️</span>
                            <span>فتح خرائط Google (GPS)</span>
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Order items summary */}
                    <div className="text-[10px] text-slate-505 bg-slate-50/50 dark:bg-slate-950/20 p-2.5 rounded-xl border border-slate-100 dark:border-slate-900">
                      <p className="font-bold text-slate-400 mb-1">الوجبات الملحقة بالطلب:</p>
                      <p className="line-clamp-2 leading-relaxed">{order.items.map(i => \`\${i.nameAr} x\${i.quantity}\`).join("، ")}</p>
                    </div>

                    {/* Actions footer */}
                    <div className="flex items-center justify-between gap-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                      <div>
                        <span className="text-[8px] text-slate-400 font-bold block">مطلوب تحصيله كاش</span>
                        <span className="font-black text-sm text-emerald-600 font-sans">{order.total.toFixed(0)} {tenant.currency}</span>
                      </div>
                      <button
                        onClick={async () => {
                          if (confirm(lang === 'ar' ? "تأكيد إتمام التوصيل واستلام المبلغ؟" : "Confirm delivery completed and payment collected?")) {
                            const res = await fetch(\`/api/tenants/\${tenant.id}/orders/\${order.id}\`, {
                              method: "PUT",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ 
                                orderStatus: "delivered",
                                paymentStatus: "paid"
                              })
                            });
                            if (res.ok) {
                              const updated = await res.json();
                              setHistoryOrders(prev => prev.map(o => o.id === order.id ? updated : o));
                              alert("✅ تم إتمام التوصيل بنجاح وتسجيل الفاتورة!");
                            }
                          }
                        }}
                        className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-xl text-xs font-black shadow-md shadow-emerald-600/10 flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                      >
                        <span>تم التوصيل 🟢</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 2: Ready orders to accept */}
          <div>
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>{lang === 'ar' ? 'طلب توصيل جاهز بالمطعم للاستلام:' : 'Ready Orders to Deliver:'}</span>
              <span className="text-[9px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-mono">{readyOrders.length}</span>
            </h2>

            {readyOrders.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400 font-bold">
                📭 {lang === 'ar' ? 'لا توجد طلبات توصيل جاهزة في المطبخ حالياً.' : 'No ready deliveries in kitchen right now.'}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {readyOrders.map(order => (
                  <div key={order.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 shadow-sm space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
                      <div>
                        <span className="font-mono font-black text-sm text-slate-900 dark:text-white">{order.orderNumber}</span>
                        <p className="text-[8px] text-slate-400 mt-0.5">{order.createdAt}</p>
                      </div>
                      <span className="text-[8px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full animate-pulse">
                        جاهز بالتسليم 🛎️
                      </span>
                    </div>

                    <div className="text-xs space-y-1">
                      <p className="font-black text-slate-855 dark:text-slate-205">👤 {order.customerName || 'زبون توصيل'}</p>
                      {order.customerAddress && (
                        <p className="text-slate-505 text-[10px] leading-relaxed line-clamp-1">📍 {order.customerAddress}</p>
                      )}
                      <p className="text-[10px] text-slate-400 pt-1">الوجبات: {order.items.map(i => \`\${i.nameAr} x\${i.quantity}\`).join("، ")}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 gap-4">
                      <div className="font-sans font-black text-slate-800 dark:text-slate-200 text-xs">
                        المجموع: {order.total.toFixed(0)} {tenant.currency}
                      </div>
                      <button
                        onClick={async () => {
                          const res = await fetch(\`/api/tenants/\${tenant.id}/orders/\${order.id}\`, {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ deliveryDriverName: currentUser?.name })
                          });
                          if (res.ok) {
                            const updated = await res.json();
                            setHistoryOrders(prev => prev.map(o => o.id === order.id ? updated : o));
                            alert("🛵 تم استلام وتثبيت التوصيل باسمك بنجاح! تحرك فوراً.");
                          }
                        }}
                        className="px-3.5 py-1.5 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white rounded-lg text-[10px] font-black shadow-sm flex items-center gap-1 cursor-pointer transition-colors active:scale-95"
                      >
                        <span>استلام وتوصيل 🛵</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (currentUser?.role === 'waiter') {
    return renderWaiterView();
  }

  if (currentUser?.role === 'delivery') {
    return renderDeliveryView();
  }`;

  content = content.replace(targetLine, replacement);
  fs.writeFileSync(file, content, "utf8");
  console.log("Successfully inserted renderDeliveryView dashboard into POSDashboardView.tsx!");
} else {
  console.log("File not found!");
}
