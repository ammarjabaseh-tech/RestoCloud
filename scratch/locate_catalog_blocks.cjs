const fs = require("fs");
const file = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/POSDashboardView.tsx";
const content = fs.readFileSync(file, "utf8");

const startIndex = content.indexOf(`{/* Right Column (8 Cols): Menu Grid (sales mode only) */}`);
const endToken = `      {/* Left Column (4 Cols): Cart & POS Invoice Register */}`;
const cartEndToken = `      {posMode === "sales" && (
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col h-[calc(100vh-100px)] sticky top-4 overflow-hidden pos-cart-column hidden lg:flex">
          {renderCart(false)}
        </div>
      )}`;

const cartEndIndex = content.indexOf(cartEndToken);
console.log("Cart block start index:", cartEndIndex);
console.log("Cart block length:", cartEndToken.length);

if (startIndex !== -1 && cartEndIndex !== -1) {
  const fullOriginalBlock = content.substring(startIndex, cartEndIndex + cartEndToken.length);
  console.log("FULL ORIGINAL BLOCK SIZE:", fullOriginalBlock.length);
  console.log("START OF BLOCK:\n", fullOriginalBlock.substring(0, 300));
  console.log("END OF BLOCK:\n", fullOriginalBlock.substring(fullOriginalBlock.length - 300));
}
