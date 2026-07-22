const fs = require("fs");
const file = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/POSDashboardView.tsx";

if (fs.existsSync(file)) {
  let content = fs.readFileSync(file, "utf8");

  const startMarker = "const renderDeliveryView = () => {";
  const endMarker = "if (currentUser?.role === 'delivery') {";

  const startIndex = content.indexOf(startMarker);
  const endIndex = content.indexOf(endMarker);

  if (startIndex !== -1 && endIndex !== -1) {
    const newDeliveryViewCode = `const renderDeliveryView = () => {
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
      <div className="space-y-6 max-w-5xl mx-auto pb-24 font-sans select-none" dir="rtl">
        {/* Driver Header Card (Styled like Waiter View Header) */}
        <div className="bg-gradient-to-r from-slate-950 via-sky-950 to-slate-900 text-white p-5 rounded-3xl border border-slate-800 shadow-lg relative overflow-hidden flex items-center justify-between">
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-2xl border border-white/10 overflow-hidden shrink-0">
              <RestaurantLogo logo={tenant.logo} />
            </div>
            <div>
              <h2 className="text-base font-black tracking-wide text-white flex items-center gap-2">
                <span>{lang === 'ar' ? 'شاشة التوصيل والدليفري 🛵' : 'Delivery Captain Dashboard'}</span>
              </h2>
              <p className="text-[10px] text-sky-200 mt-0.5">
                {lang === 'ar' 
                  ? \`السائق: \${currentUser?.name || "كابتن التوصيل"} | \${tenant.nameAr}\` 
                  : \`Driver: \${currentUser?.name || "Captain"} | \${tenant.nameEn || tenant.nameAr}\`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-[10px] font-black border border-sky-500/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
              {lang === 'ar' ? 'متصل بالخدمة' : 'Online'}
            </span>
            <button
              onClick={() => {
                if (confirm(lang === 'ar' ? "هل تريد تسجيل الخروج؟" : "Confirm Logout?")) {
                  window.location.reload();
                }
              }}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer"
              title="تسجيل الخروج"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Driver Top Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-50 dark:bg-amber-950/30 text-amber-600 rounded-xl flex items-center justify-center text-xl shrink-0">
              🛎️
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-bold">{lang === 'ar' ? 'جاهز بالـمطبخ' : 'Ready in Kitchen'}</div>
              <div className="text-base font-black text-slate-800 dark:text-white font-mono">
                {readyOrders.length} {lang === 'ar' ? 'طلب' : 'orders'}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 bg-sky-50 dark:bg-sky-950/30 text-sky-600 rounded-xl flex items-center justify-center text-xl shrink-0">
              🛵
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-bold">{lang === 'ar' ? 'طلباتي الحالية' : 'My Active'}</div>
              <div className="text-base font-black text-slate-800 dark:text-white font-mono">
                {myActiveOrders.length} {lang === 'ar' ? 'طلب' : 'orders'}
              </div>
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 rounded-xl flex items-center justify-center text-xl shrink-0">
              💵
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-bold">{lang === 'ar' ? 'تحصيل كاش اليوم' : 'Cash Collected'}</div>
              <div className="text-base font-black text-emerald-600 dark:text-emerald-400 font-mono">
                {totalCashCollected.toFixed(0)} <span className="text-[10px] text-slate-400">{tenant.currency}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs Bar (Horizontal Pills) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setDeliveryTab("ready")}
            className={\`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all border shrink-0 cursor-pointer flex items-center gap-2 \${
              deliveryTab === "ready"
                ? "bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/20 scale-102"
                : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50"
            }\`}
          >
            <span>🛎️</span>
            <span>{lang === 'ar' ? 'الطلبات الجاهزة من المطبخ' : 'Ready from Kitchen'}</span>
            <span className={\`px-2 py-0.5 rounded-full text-[10px] font-mono \${
              deliveryTab === "ready" ? "bg-white/20 text-white" : "bg-amber-100 text-amber-800"
            }\`}>
              {readyOrders.length}
            </span>
          </button>

          <button
            onClick={() => setDeliveryTab("active")}
            className={\`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all border shrink-0 cursor-pointer flex items-center gap-2 \${
              deliveryTab === "active"
                ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20 scale-102"
                : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50"
            }\`}
          >
            <span>🚚</span>
            <span>{lang === 'ar' ? 'طلباتي قيد التوصيل' : 'My Active Deliveries'}</span>
            <span className={\`px-2 py-0.5 rounded-full text-[10px] font-mono \${
              deliveryTab === "active" ? "bg-white/20 text-white" : "bg-indigo-100 text-indigo-800"
            }\`}>
              {myActiveOrders.length}
            </span>
          </button>

          <button
            onClick={() => setDeliveryTab("completed")}
            className={\`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all border shrink-0 cursor-pointer flex items-center gap-2 \${
              deliveryTab === "completed"
                ? "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20 scale-102"
                : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50"
            }\`}
          >
            <span>🟢</span>
            <span>{lang === 'ar' ? 'سجل التوصيل اليوم' : 'Completed Today'}</span>
            <span className={\`px-2 py-0.5 rounded-full text-[10px] font-mono \${
              deliveryTab === "completed" ? "bg-white/20 text-white" : "bg-emerald-100 text-emerald-800"
            }\`}>
              {myCompletedOrders.length}
            </span>
          </button>
        </div>

        {/* Tab 1: Ready Orders From Kitchen (الطلبات التي تم إنهاؤها من المطبخ وتحتاج إلى توصيل) */}
        {deliveryTab === "ready" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                <span>{lang === 'ar' ? 'الطلبات الجاهزة بالمطبخ وتنتظر التوصيل خارج المطعم:' : 'Orders Ready in Kitchen for Delivery:'}</span>
              </h3>
            </div>

            {readyOrders.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-2">
                <div className="text-4xl">🛎️</div>
                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200">
                  {lang === 'ar' ? 'لا توجد طلبات توصيل جاهزة في المطبخ حالياً' : 'No ready deliveries in kitchen'}
                </h4>
                <p className="text-xs text-slate-400">
                  {lang === 'ar' ? 'بمجرد انتهاء المطبخ من تحضير أي طلب توصيل، سيظهر هنا فوراً للاستلام.' : 'When kitchen finishes preparing delivery orders, they will appear here.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {readyOrders.map(order => (
                  <div key={order.id} className="bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/40 rounded-3xl p-5 shadow-sm space-y-4 hover:shadow-md transition-all">
                    {/* Order Header */}
                    <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-base text-slate-900 dark:text-white">#{order.orderNumber}</span>
                          <span className="text-[10px] font-black bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full animate-pulse border border-amber-300">
                            جاهز من المطبخ 🛎️
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">{order.createdAt}</p>
                      </div>
                      <div className="text-left font-mono font-black text-emerald-600 dark:text-emerald-400 text-base">
                        {order.total.toFixed(0)} {tenant.currency}
                      </div>
                    </div>

                    {/* Customer Info */}
                    <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-900 space-y-1.5 text-xs">
                      <p className="font-black text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>{order.customerName || 'زبون توصيل'}</span>
                      </p>
                      {order.customerPhone && (
                        <p className="text-slate-500 font-mono flex items-center gap-1.5 text-[11px]" dir="ltr">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>{order.customerPhone}</span>
                        </p>
                      )}
                      {order.customerAddress && (
                        <p className="text-slate-600 dark:text-slate-400 flex items-start gap-1.5 text-[11px] leading-relaxed pt-1 border-t border-slate-100 dark:border-slate-900">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                          <span>{order.customerAddress}</span>
                        </p>
                      )}
                    </div>

                    {/* Order Items */}
                    <div className="text-xs bg-slate-50/50 dark:bg-slate-950/20 p-3 rounded-2xl border border-slate-100 dark:border-slate-900 space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        {lang === 'ar' ? 'الوجبات التابعة للطلب:' : 'Prepared Items:'}
                      </p>
                      <div className="divide-y divide-slate-100 dark:divide-slate-800">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="py-1 flex justify-between items-center text-[11px]">
                            <span className="font-bold text-slate-700 dark:text-slate-300">{item.nameAr}</span>
                            <span className="font-mono font-black text-slate-400">x{item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Button */}
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
                          setDeliveryTab("active");
                          alert(lang === 'ar' ? "🛵 تم استلام الطلب وتثبيته باسمك! جاري التحويل لطلباتك الحالية." : "Order claimed successfully!");
                        }
                      }}
                      className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-2xl font-black text-xs shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
                    >
                      <Bike className="w-4 h-4" />
                      <span>{lang === 'ar' ? 'استلام الطلب والبدء بالتوصيل 🛵' : 'Claim Order & Start Delivery'}</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: My Active Deliveries (طلباتي قيد التوصيل حالياً) */}
        {deliveryTab === "active" && (
          <div className="space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
              <span>{lang === 'ar' ? 'طلباتك الحالية قيد التوصيل خارج المطعم:' : 'Active Deliveries On The Way:'}</span>
            </h3>

            {myActiveOrders.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-2">
                <div className="text-4xl">🛵</div>
                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200">
                  {lang === 'ar' ? 'لا توجد لديك طلبات قيد التوصيل حالياً' : 'No active deliveries'}
                </h4>
                <p className="text-xs text-slate-400">
                  {lang === 'ar' ? 'يمكنك استلام طلبات جديدة من تبويب "الطلبات الجاهزة من المطبخ".' : 'You can claim ready orders from the Ready tab.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myActiveOrders.map(order => (
                  <div key={order.id} className="bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-900/40 rounded-3xl p-5 shadow-sm space-y-4">
                    {/* Header */}
                    <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-base text-slate-900 dark:text-white">#{order.orderNumber}</span>
                          <span className="text-[10px] font-black bg-indigo-100 text-indigo-800 px-2.5 py-0.5 rounded-full border border-indigo-200">
                            جاري التوصيل 🚚
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">{order.createdAt}</p>
                      </div>
                      <div className="text-left">
                        <span className="text-[9px] text-slate-400 font-bold block">{lang === 'ar' ? 'المبلغ المطلوب' : 'Cash due'}</span>
                        <span className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-base">
                          {order.total.toFixed(0)} {tenant.currency}
                        </span>
                      </div>
                    </div>

                    {/* Customer Info Card & Actions */}
                    <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-900 space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="font-black text-slate-800 dark:text-slate-200 text-xs flex items-center gap-1.5">
                          <User className="w-4 h-4 text-indigo-500" />
                          <span>{order.customerName || 'زبون توصيل'}</span>
                        </p>
                        {order.customerPhone && (
                          <a
                            href={\`tel:\${order.customerPhone}\`}
                            className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black rounded-xl shadow-sm flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>اتصال</span>
                          </a>
                        )}
                      </div>

                      {order.customerAddress && (
                        <div className="space-y-2 pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
                          <p className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-1.5 leading-relaxed">
                            <MapPin className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                            <span>{order.customerAddress}</span>
                          </p>
                          <a
                            href={\`https://www.google.com/maps/search/?api=1&query=\${encodeURIComponent(order.customerAddress)}\`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-2 bg-sky-500 hover:bg-sky-600 text-white text-xs font-black rounded-xl shadow-sm flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
                          >
                            <span>🗺️</span>
                            <span>فتح الموقع في خرائط Google (GPS)</span>
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Order Items */}
                    <div className="text-xs bg-slate-50/50 dark:bg-slate-950/20 p-3 rounded-2xl border border-slate-100 dark:border-slate-900 space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        {lang === 'ar' ? 'الأصناف والتفاصيل:' : 'Order Items:'}
                      </p>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                        {order.items.map(i => \`\${i.nameAr} x\${i.quantity}\`).join("، ")}
                      </p>
                    </div>

                    {/* Complete Action Button */}
                    <button
                      onClick={async () => {
                        if (confirm(lang === 'ar' ? "تأكيد إتمام التوصيل واستلام المبلغ كاش؟" : "Confirm delivery completed?")) {
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
                            alert(lang === 'ar' ? "✅ تم تسليم الطلب بنجاح وتحديث الحسابات!" : "Order delivered successfully!");
                          }
                        }
                      }}
                      className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-2xl font-black text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{lang === 'ar' ? 'تم التوصيل وتسليم المبلغ كاش 🟢' : 'Delivered & Payment Collected'}</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Completed Orders History (سجل التوصيل المكتمل) */}
        {deliveryTab === "completed" && (
          <div className="space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>{lang === 'ar' ? 'سجل الطلبات التي قمت بتوصيلها اليوم:' : 'Deliveries Completed Today:'}</span>
            </h3>

            {myCompletedOrders.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400 font-bold">
                📭 {lang === 'ar' ? 'لم تقم بتوصيل أي طلبات اليوم بعد.' : 'No completed deliveries today yet.'}
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {myCompletedOrders.map(order => (
                    <div key={order.id} className="p-4 flex items-center justify-between text-xs hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-slate-800 dark:text-white text-sm">#{order.orderNumber}</span>
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-900">
                            تم التوصيل 🟢
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400">{order.customerName || 'زبون توصيل'} • {order.createdAt}</p>
                      </div>
                      <div className="text-left font-mono font-black text-slate-900 dark:text-white text-sm">
                        {order.total.toFixed(0)} {tenant.currency}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };`;

    const beforeCode = content.substring(0, startIndex);
    const afterCode = content.substring(endIndex);

    fs.writeFileSync(file, beforeCode + newDeliveryViewCode + "\n\n  " + afterCode, "utf8");
    console.log("Successfully formatted renderDeliveryView with Waiter Dashboard design & tabs!");
  } else {
    console.error("Markers not found! startIndex:", startIndex, "endIndex:", endIndex);
  }
} else {
  console.error("File not found!");
}
