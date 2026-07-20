const fs = require("fs");
const file = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/POSDashboardView.tsx";

if (fs.existsSync(file)) {
  const content = fs.readFileSync(file, "utf8");

  const startToken = `{/* Right Column (8 Cols): Menu Grid (sales mode only) */}`;
  const cartEndToken = `{posMode === "sales" && (
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col h-[calc(100vh-100px)] sticky top-4 overflow-hidden pos-cart-column hidden lg:flex">
          {renderCart(false)}
        </div>
      )}`;

  const startIndex = content.indexOf(startToken);
  const cartEndIndex = content.indexOf(cartEndToken);

  if (startIndex !== -1 && cartEndIndex !== -1) {
    const originalCatalogHeader = content.substring(startIndex, cartEndIndex);
    
    // We want to construct the new segment:
    const replacement = `      {/* Cashier Active Order Session Header (when in session) */}
      {posMode === "sales" && activeOrderSession !== null && (
        <div className="lg:col-span-12 bg-gradient-to-r from-indigo-900 to-indigo-950 text-white p-3.5 rounded-3xl border border-indigo-850 shadow-md flex items-center justify-between animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-3">
            <span className="text-xl">
              {activeOrderSession.type === "dine_in" ? "🍽️" : activeOrderSession.type === "takeaway" ? "🛍️" : "🛵"}
            </span>
            <div className="text-right">
              <h3 className="text-sm font-black text-white">
                {activeOrderSession.type === "dine_in" 
                  ? \`تسجيل طلب للطاولة رقم \${activeOrderSession.tableNumber}\` 
                  : activeOrderSession.type === "takeaway" 
                  ? "تسجيل طلب سفري جديد" 
                  : "تسجيل طلب توصيل جديد"}
              </h3>
              <p className="text-[10px] text-indigo-250 mt-0.5">أضف الوجبات للطلب الحالي وأتمم الفاتورة</p>
            </div>
          </div>
          <button
            onClick={() => {
              setActiveOrderSession(null);
              setCart([]);
            }}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 text-white text-xs font-black rounded-xl transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
          >
            <span>رجوع للطاولات</span>
            <span>←</span>
          </button>
        </div>
      )}

      {/* Cashier Tables Grid (if activeOrderSession is null and posMode === "sales") */}
      {posMode === "sales" && activeOrderSession === null && (
        <div className="lg:col-span-12 space-y-6 animate-in fade-in duration-200" dir="rtl">
          {/* Quick Order Shortcut Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <button
              onClick={() => handleStartOrderSession('takeaway')}
              className="py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-2xl font-black text-sm shadow-md shadow-amber-500/10 flex items-center justify-center gap-2.5 cursor-pointer transition-all active:scale-98"
            >
              <span className="text-xl">🛍️</span>
              <span>{lang === 'ar' ? 'طلب سفري خارجي جديد' : 'New Takeaway Order'}</span>
            </button>
            <button
              onClick={() => handleStartOrderSession('delivery')}
              className="py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-2xl font-black text-sm shadow-md shadow-emerald-600/10 flex items-center justify-center gap-2.5 cursor-pointer transition-all active:scale-98"
            >
              <span className="text-xl">🛵</span>
              <span>{lang === 'ar' ? 'طلب توصيل للمنزل جديد' : 'New Delivery Order'}</span>
            </button>
          </div>

          {/* Tables Status Summary Grid Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-850 dark:text-slate-200 flex items-center gap-2">
              <span>🍽️</span>
              <span>{lang === 'ar' ? 'اختر طاولة لتسجيل طلب جديد أو إدارة الحساب:' : 'Select table to start order or manage billing:'}</span>
            </h3>
            <span className="text-[10px] bg-indigo-50 dark:bg-indigo-950 text-indigo-750 dark:text-indigo-300 px-3 py-1 rounded-full font-black border border-indigo-100 dark:border-indigo-900">
              {tables.length} {lang === 'ar' ? 'طاولات بالصالون' : 'Salon Tables'}
            </span>
          </div>

          {/* Main Tables Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
            {tables.map((t) => {
              const hasReadyOrder = historyOrders.some(o => 
                (o.tableId === t.id || o.tableId === t.tableNumber || o.tableNumber === t.tableNumber) && 
                o.orderStatus === "ready"
              );
              
              const hasPendingOrder = historyOrders.some(o => 
                (o.tableId === t.id || o.tableId === t.tableNumber || o.tableNumber === t.tableNumber) && 
                (o.orderStatus === "pending" || o.orderStatus === "preparing")
              );

              // Calculate active table balance if occupied
              const activeTableOrders = historyOrders.filter(o => 
                (o.tableId === t.id || o.tableId === t.tableNumber || o.tableNumber === t.tableNumber) &&
                o.orderStatus !== "delivered" && o.orderStatus !== "cancelled"
              );
              const tableTotal = activeTableOrders.reduce((sum, ord) => sum + Number(ord.total), 0);

              const statusDot = {
                available: "bg-emerald-500",
                occupied: "bg-rose-500",
                reserved: "bg-blue-500",
                needs_cleaning: "bg-amber-500"
              }[t.status] || "bg-slate-400";

              const statusStyles = {
                available: "bg-emerald-50/40 border-emerald-200/80 text-emerald-800 hover:bg-emerald-50 hover:border-emerald-300",
                occupied: "bg-rose-50/40 border-rose-200/80 text-rose-800 hover:bg-rose-50 hover:border-rose-300",
                reserved: "bg-blue-50/40 border-blue-200/80 text-blue-800 hover:bg-blue-50 hover:border-blue-300",
                needs_cleaning: "bg-amber-50/40 border-amber-200/80 text-amber-800 hover:bg-amber-50 hover:border-amber-300"
              }[t.status] || "bg-slate-50 text-slate-700 border-slate-200";

              const labelAr = {
                available: "متاح",
                occupied: "مشغول",
                reserved: "محجوز",
                needs_cleaning: "تنظيف"
              }[t.status] || "";

              return (
                <button
                  key={t.id}
                  onClick={() => handleStartOrderSession('dine_in', t.tableNumber)}
                  className={\`p-5 rounded-3xl border text-center transition-all flex flex-col items-center justify-center gap-2 cursor-pointer shadow-3xs relative overflow-hidden active:scale-98 duration-200 \${
                    hasReadyOrder
                      ? "bg-emerald-100 border-emerald-500 animate-pulse ring-4 ring-emerald-500/25 text-emerald-950 font-black shadow-md scale-102"
                      : statusStyles
                  }\`}
                >
                  {/* Status indicator pill on top corner */}
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-white/80 dark:bg-slate-900/80 px-2 py-0.5 rounded-full border border-slate-100 dark:border-slate-800">
                    <span className={\`w-1.5 h-1.5 rounded-full \${statusDot}\`} />
                    <span className="text-[8px] font-black text-slate-700 dark:text-slate-350">{labelAr}</span>
                  </div>

                  {hasReadyOrder && (
                    <div className="absolute -left-6 top-3 bg-rose-500 text-white text-[8px] font-black px-6 py-0.5 -rotate-45 shadow-sm uppercase tracking-widest animate-bounce">
                      جاهز 🔔
                    </div>
                  )}

                  <span className="text-[10px] text-slate-400 font-bold uppercase mt-2">
                    {lang === 'ar' ? 'طاولة' : 'Table'}
                  </span>
                  <span className="text-4xl font-mono font-black leading-none text-slate-900 dark:text-white">
                    {t.tableNumber}
                  </span>
                  <span className="text-[9px] text-slate-500 font-medium">
                    👥 {t.capacity} {lang === 'ar' ? 'كراسي' : 'Seats'}
                  </span>

                  {/* Show total balance if occupied */}
                  {t.status === "occupied" && tableTotal > 0 && (
                    <span className="mt-1 px-2.5 py-0.5 rounded-xl bg-rose-500 text-white text-[9px] font-mono font-black shadow-sm shrink-0">
                      {tableTotal.toFixed(0)} {tenant.currency}
                    </span>
                  )}

                  {/* Badges for active orders */}
                  {hasReadyOrder ? (
                    <span className="mt-1 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[8px] font-black uppercase">
                      وجبة جاهزة 🔔
                    </span>
                  ) : hasPendingOrder && t.status !== "occupied" ? (
                    <span className="mt-1 px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-750 text-[8px] font-bold">
                      تحت التحضير
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Catalog & Cart layout (if activeOrderSession is selected) */}
      {posMode === "sales" && activeOrderSession !== null && (
        <>
          {/* Right Column (8 Cols): Menu Grid (sales mode only) */}
          {posMode === "sales" && (
            <div className="lg:col-span-8 space-y-4 pos-menu-column animate-in fade-in duration-200">`;

    const afterCart = `          {renderCart(false)}
        </div>
      )}
    </>
  )}`;

    const originalBlock = content.substring(startIndex, cartEndIndex + cartEndToken.length);
    const middleContent = content.substring(startIndex + startToken.length, cartEndIndex);
    
    const newBlock = replacement + middleContent + afterCart;
    
    const updatedContent = content.replace(originalBlock, newBlock);
    
    fs.writeFileSync(file, updatedContent, "utf8");
    console.log("Successfully applied sales tables flow modification!");
  } else {
    console.log("Failed to locate blocks for replacement!");
  }
} else {
  console.log("File not found!");
}
