const fs = require("fs");

const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/POSDashboardView.tsx";
let content = fs.readFileSync(filePath, "utf8");
const lines = content.split("\n");

// Locate the block
let startLineIdx = -1;
let endLineIdx = -1;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("Left Column (4 Cols): Cart & POS Invoice Register")) {
    startLineIdx = i; // 866 (0-indexed)
  }
  if (lines[i].includes("Live Orders Management Page (orders mode only)")) {
    endLineIdx = i; // 1186 (0-indexed)
    break;
  }
}

console.log("Start line index:", startLineIdx);
console.log("End line index:", endLineIdx);

// Extract the content of the cart column
// The column starts with:
//       {/* Left Column (4 Cols): Cart & POS Invoice Register */}
//       {posMode === "sales" && (
//         <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col h-[calc(100vh-180px)] sticky top-20 overflow-hidden pos-cart-column">
// So we extract from line startLineIdx + 3 to endLineIdx - 3 (which is the closing tag of lg:col-span-4)
const cartBodyLines = lines.slice(startLineIdx + 3, endLineIdx - 2);
const cartBody = cartBodyLines.join("\n");

// Define renderCart function text
const renderCartFn = `
  const renderCart = (isMobile = false) => {
    return (
      <div className={\`flex flex-col h-full overflow-hidden \${isMobile ? 'bg-white' : ''}\`}>
        {/* Cart Header */}
        <div className="p-4 bg-slate-100 text-slate-800 flex items-center justify-between border-b border-slate-200">
          <div className="flex items-center gap-2">
            {isMobile && (
              <button
                onClick={() => setShowMobileCart(false)}
                className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-slate-700 cursor-pointer ml-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <div className="w-8 h-8 rounded-lg bg-white text-indigo-600 border border-slate-200 flex items-center justify-center shadow-2xs">
              <ShoppingCart className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">{posTranslations[lang].cartTitle}</h3>
              <p className="text-[10px] text-slate-500">{posTranslations[lang].totalItems}: {cart.reduce((sum, i) => sum + i.quantity, 0)}</p>
            </div>
          </div>
          
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs text-rose-600 hover:text-rose-700 flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-rose-50 transition-colors font-bold border border-rose-200"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{posTranslations[lang].clearBtn}</span>
            </button>
          )}
        </div>
${cartBodyLines.slice(22).join("\n")}
      </div>
    );
  };
`;

// Now let's construct the replacement text for the original desktop cart column
const newDesktopCartColumn = `
      {/* Left Column (4 Cols): Cart & POS Invoice Register */}
      {posMode === "sales" && (
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col h-[calc(100vh-180px)] sticky top-20 overflow-hidden pos-cart-column hidden lg:flex">
          {renderCart(false)}
        </div>
      )}
`;

// Let's replace the original lines from startLineIdx to endLineIdx - 1
const beforeCart = lines.slice(0, startLineIdx).join("\n");
const afterCart = lines.slice(endLineIdx).join("\n");

// Inject renderCartFn right before "return (" (line 650)
let newContent = beforeCart;
const returnIdx = newContent.indexOf("return (");
if (returnIdx === -1) {
  throw new Error("Could not find 'return (' in POSDashboardView.tsx");
}

const beforeReturn = newContent.substring(0, returnIdx);
const afterReturn = newContent.substring(returnIdx);

newContent = beforeReturn + renderCartFn + "\n" + afterReturn + "\n" + newDesktopCartColumn + "\n" + afterCart;

// Also let's append the mobile cart drawer overlay and FAB right before the main container closing div
// The end of POSDashboardView.tsx before return is:
//       {/* ADD / EDIT PRINTER MODAL */}
//       ...
//       {/* ORDER HISTORY DETAIL MODAL */}
//       ...
//       {/* COMPLETED ORDER INVOICE MODAL */}
//       ...
//       {/* ORDER HISTORY LIST MODAL */}
//       ...
//     </div>
//   );
// };

// Let's find the closing tags of the main container div:
const finalClosingDivIdx = newContent.lastIndexOf("</div>");
const beforeFinalClose = newContent.substring(0, finalClosingDivIdx);
const afterFinalClose = newContent.substring(finalClosingDivIdx);

const mobileOverlayAndFab = `
      {/* Mobile Cart Floating Action Button */}
      {posMode === "sales" && cart.length > 0 && (
        <div className="lg:hidden fixed bottom-6 left-6 right-6 z-40">
          <button
            onClick={() => setShowMobileCart(true)}
            className="w-full flex items-center justify-between px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl shadow-xl font-bold animate-bounce cursor-pointer border border-indigo-500/30"
          >
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-xl">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <div className="text-right">
                <p className="text-[10px] text-indigo-200 leading-none">{lang === 'ar' ? 'عرض السلة' : lang === 'tr' ? 'Sepeti Göster' : 'View Cart'}</p>
                <p className="text-xs font-black mt-0.5">{cart.reduce((sum, i) => sum + i.quantity, 0)} {lang === 'ar' ? 'أصناف' : lang === 'tr' ? 'Ürün' : 'items'}</p>
              </div>
            </div>
            <div className="text-lg font-black font-sans">
              {total.toFixed(0)} {tenant.currency}
            </div>
          </button>
        </div>
      )}

      {/* Mobile Cart Drawer Overlay */}
      {showMobileCart && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex justify-end animate-in fade-in duration-200" dir="rtl">
          <div className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl slide-in-from-left duration-300">
            {renderCart(true)}
          </div>
        </div>
      )}
`;

newContent = beforeFinalClose + mobileOverlayAndFab + "\n" + afterFinalClose;

fs.writeFileSync(filePath, newContent, "utf8");
console.log("POSDashboardView.tsx refactored successfully!");
