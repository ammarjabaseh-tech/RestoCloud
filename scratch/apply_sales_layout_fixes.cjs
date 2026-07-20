const fs = require("fs");
const file = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/POSDashboardView.tsx";

if (fs.existsSync(file)) {
  let content = fs.readFileSync(file, "utf8");

  // 1. Wrap POS Top Header Bar (12 Cols) in activeOrderSession === null check
  const headerStartToken = `      {/* POS Top Header Bar (12 Cols) */}`;
  const headerDivStart = `      <div className="lg:col-span-12 bg-white p-2.5 px-4 rounded-3xl border border-slate-200 shadow-sm space-y-2">`;
  const headerEndToken = `            {categories.map((cat) => {`; // Let's find the closing of the top header div
  
  // Actually, let's find the exact string of the top header and replace it:
  // The header ends right before the sales menu grid starts, i.e., before activeOrderSession checks
  const headerBlockStart = content.indexOf(headerStartToken);
  const headerBlockEnd = content.indexOf(`      {/* Cashier Active Order Session Header (when in session) */}`);
  
  if (headerBlockStart !== -1 && headerBlockEnd !== -1) {
    const originalHeader = content.substring(headerBlockStart, headerBlockEnd);
    // Wrap it
    const wrappedHeader = `      {/* POS Top Header Bar (12 Cols) */}
      {activeOrderSession === null && (
        <div className="lg:col-span-12 bg-white p-2.5 px-4 rounded-3xl border border-slate-200 shadow-sm space-y-2">` + 
        originalHeader.substring(originalHeader.indexOf(`<div className="flex flex-col md:flex-row md:items-center justify-between gap-3">`), originalHeader.length - 14) + // Trim closing div and spacing
        `        </div>
      )}

`;
    
    // Replace it in content
    content = content.replace(originalHeader, wrappedHeader);
    console.log("Successfully wrapped Top Header Bar in activeOrderSession check!");
  } else {
    console.log("Failed to locate header block indices!");
  }

  // 2. Fix cart order type selector tabs (lines 1024-1064) and conditional table selection (lines 1065-1120)
  // Let's locate the order type selector tabs and replace them:
  const cartSelectorTarget = `        {/* Order Type Selector Tabs */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 space-y-3">
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-200/70 rounded-xl">`;
  
  const cartSelectorReplacement = `        {/* Order Type Selector Tabs */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 space-y-3">
          {activeOrderSession !== null ? (
            <div className="p-2.5 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-between text-xs font-black text-indigo-950">
              <div className="flex items-center gap-2">
                <span className="text-sm shrink-0">
                  {orderType === "dine_in" ? "🍽️" : orderType === "takeaway" ? "🛍️" : "🛵"}
                </span>
                <span>
                  {orderType === "dine_in" 
                    ? \`طاولة رقم \${selectedTable}\` 
                    : orderType === "takeaway" 
                    ? "طلب سفري خارجي" 
                    : "طلب توصيل للمنزل"}
                </span>
              </div>
              <span className="text-[9px] bg-indigo-150 text-indigo-800 px-2 py-0.5 rounded-full font-black uppercase">
                جلسة طلب مقفلة
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-200/70 rounded-xl">`;

  if (content.includes(cartSelectorTarget)) {
    content = content.replace(cartSelectorTarget, cartSelectorReplacement);
    // Find the closing of the grid grid-cols-3 selector and insert the closing of the activeOrderSession check:
    // The selector buttons end with:
    //     </button>
    //   </div>
    // 
    //   {/* Conditional Inputs based on Order Type */}
    //   {orderType === "dine_in" ? (
    const selectorEndTarget = `            </button>
          </div>

          {/* Conditional Inputs based on Order Type */}
          {orderType === "dine_in" ? (`;
    
    const selectorEndReplacement = `            </button>
          </div>
          )}

          {/* Conditional Inputs based on Order Type */}
          {orderType === "dine_in" ? (
            activeOrderSession === null && (`;
            
    content = content.replace(selectorEndTarget, selectorEndReplacement);
    
    // Also need to close the activeOrderSession === null check inside dine_in block:
    // Original dine_in block finishes right before the takeaway/delivery inputs:
    //                 })}
    //               </div>
    //             </div>
    //           ) : (
    //             <div className="space-y-2">
    const dineInEndTarget = `                })}
              </div>
            </div>
          ) : (`;
          
    const dineInEndReplacement = `                })}
              </div>
            </div>
            )
          ) : (`;
          
    content = content.replace(dineInEndTarget, dineInEndReplacement);
    console.log("Successfully locked order type and table selector inside cart!");
  } else {
    console.log("Failed to find cart selector target!");
  }

  // 3. Re-write the catalog and cart columns layout block to be 100% clean and correct
  const originalCatalogCartStart = content.indexOf(`      {/* Catalog & Cart layout (if activeOrderSession is selected) */}`);
  const originalCatalogCartEnd = content.indexOf(`      {/* Live Orders Management Page (orders mode only) */}`);
  
  if (originalCatalogCartStart !== -1 && originalCatalogCartEnd !== -1) {
    const originalBlock = content.substring(originalCatalogCartStart, originalCatalogCartEnd);
    
    const cleanBlock = `      {/* Catalog & Cart layout (if activeOrderSession is selected) */}
      {posMode === "sales" && activeOrderSession !== null && (
        <>
          {/* Right Column (8 Cols): Menu Grid (sales mode only) */}
          <div className="lg:col-span-8 space-y-4 pos-menu-column animate-in fade-in duration-200">
            {/* Meal Items Grid */}
            {filteredItems.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm space-y-3">
                <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center text-3xl">
                  🔍
                </div>
                <h3 className="text-sm font-bold text-slate-800">
                  {lang === 'ar' ? 'لا توجد أصناف تطابق البحث' : lang === 'tr' ? 'Arama sonucu bulunamadı' : 'No items match search'}
                </h3>
                <p className="text-xs text-slate-500">
                  {lang === 'ar' ? 'جرب البحث بكلمات أخرى أو اختر قسماً مختلفاً من المنيو' : lang === 'tr' ? 'Farklı kelimelerle aramayı deneyin veya başka kategori seçin' : 'Try searching with other keywords or choose another category'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2">
                {filteredItems.map((item) => {
                  const inCartQty = cart.find((i) => i.itemId === item.id)?.quantity || 0;
                  const itemName = lang === 'en' && item.nameEn ? item.nameEn : lang === 'tr' && item.nameTr ? item.nameTr : item.nameAr;
                  const itemDesc = lang === 'en' && item.descriptionEn ? item.descriptionEn : lang === 'tr' && item.descriptionTr ? item.descriptionTr : item.descriptionAr;
                  return (
                    <div
                      key={item.id}
                      onClick={() => addToCart(item)}
                      className={\`bg-white rounded-lg border transition-all duration-200 cursor-pointer overflow-hidden flex flex-col justify-between group hover:shadow-xs transform hover:-translate-y-0.5 \${
                        inCartQty > 0 
                          ? "border-indigo-500 ring-2 ring-indigo-500/10 bg-indigo-50/20" 
                          : "border-slate-200 hover:border-slate-300 shadow-3xs"
                      }\`}
                    >
                      {/* Image & Badges */}
                      <div className="relative h-14 w-full overflow-hidden bg-slate-50 border-b border-slate-100">
                        <img
                          src={item.image && item.image.trim() !== "" ? item.image : (tenant.logo || "/logo.jpg")}
                          onError={(e) => { (e.target as HTMLImageElement).src = (tenant.logo || "/logo.jpg"); }}
                          alt={itemName}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent" />
                        
                        {item.isBestSeller && (
                          <span className={\`absolute top-1 bg-amber-500 text-white text-[7px] font-black px-1.5 py-0.1 rounded-full shadow-sm flex items-center gap-0.5 \${lang === 'ar' ? 'right-1' : 'left-1'}\`}>
                            <span>★</span>
                            <span>{lang === 'ar' ? 'مميز' : lang === 'tr' ? 'Popüler' : 'Featured'}</span>
                          </span>
                        )}

                        {inCartQty > 0 && (
                          <span className={\`absolute top-1 \${lang === 'ar' ? 'left-1' : 'right-1'} \${theme.primaryBg} text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-sm animate-pulse\`}>
                            {inCartQty}
                          </span>
                        )}
                      </div>

                      {/* Text Details & Price */}
                      <div className="p-1.5 flex-1 flex flex-col justify-between space-y-1">
                        <div className="space-y-0.5">
                          <h4 className="text-[10px] font-black text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-1">
                            {itemName}
                          </h4>
                          <p className="text-[8px] text-slate-400 line-clamp-1 leading-snug">
                            {itemDesc}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-1 border-t border-slate-50">
                          <span className="text-[10px] font-black text-slate-950">
                            {item.price} <span className="text-[8px] font-normal text-slate-400">{tenant.currency}</span>
                          </span>
                          <span className="text-[8px] font-medium text-slate-400 bg-slate-50 px-1 py-0.1 rounded border border-slate-100">
                            {item.preparationTimeMin || 15} {lang === 'ar' ? 'د' : lang === 'tr' ? 'dk' : 'min'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Left Column (4 Cols): Cart & POS Invoice Register */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col h-[calc(100vh-100px)] sticky top-4 overflow-hidden pos-cart-column hidden lg:flex">
            {renderCart(false)}
          </div>
        </>
      )}

`;
    
    content = content.replace(originalBlock, cleanBlock);
    console.log("Successfully cleaned up catalog and cart layout!");
  } else {
    console.log("Failed to locate catalog/cart block indices!");
  }

  fs.writeFileSync(file, content, "utf8");
} else {
  console.log("File not found!");
}
