const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/LandingPageView.tsx";
let content = fs.readFileSync(filePath, "utf8");

// 1. Redefine the tutorials array to include 7 detailed items
const oldTutorialsBlock = `  const tutorials = [
    {
      title: lang === 'ar' ? "تصفح وطلب العميل من المنيو" : lang === 'tr' ? "Müşteri Menü Gezintisi & Sipariş" : "Customer Menu Browsing & Ordering",
      desc: lang === 'ar' ? "كيف يقوم العميل بمسح باركود الطاولة واختيار الوجبات وإتمام الطلب في ثوانٍ دون انتظار النادل." : lang === 'tr' ? "Müşterinin masa barkodunu taraması, yemek seçmesi ve saniyeler içinde sipariş vermesi." : "How a customer scans the table QR, picks meals, and orders in seconds.",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-hand-holding-smartphone-with-restaurant-menu-40224-large.mp4",
      thumbnail: "📱"
    },
    {
      title: lang === 'ar' ? "تخصيص الهوية والألوان الفاخرة" : lang === 'tr' ? "Marka ve Renk Özelleştirme" : "Customizing Theme & Branding",
      desc: lang === 'ar' ? "طريقة تعديل شعار المطعم، واختيار ألوان المنيو، ورفع صورة الغلاف المناسبة لهويتك التجارية." : lang === 'tr' ? "Restoran logosunu değiştirme, renk temasını seçme ve kapak görselini yükleme." : "How to update your logo, pick menu colors, and upload your brand cover image.",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-user-interface-design-of-a-food-delivery-app-41566-large.mp4",
      thumbnail: "⚙️"
    },
    {
      title: lang === 'ar' ? "استقبال فوري للطلبات على الواتساب" : lang === 'tr' ? "WhatsApp Sipariş Otomasyonu" : "WhatsApp Order Automation",
      desc: lang === 'ar' ? "كيف يصل الطلب مفصلاً وبشكل منظم ومحسوب التكلفة والضريبة للمطعم فور إرساله من العميل." : lang === 'tr' ? "Sipariş detaylarının vergi ve toplam tutarla birlikte organize şekilde restorana ulaşması." : "How orders land on the restaurant's WhatsApp organized with item details and tax.",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-receiving-a-whatsapp-message-on-smartphone-screen-41712-large.mp4",
      thumbnail: "💬"
    },
    {
      title: lang === 'ar' ? "إضافة الأطباق والأسعار الذكية" : lang === 'tr' ? "Ürün Ekleme & Menü Yönetimi" : "Adding Items & Smart Pricing",
      desc: lang === 'ar' ? "طريقة إضافة الوجبات، وتحديد أسعارها، وتصنيف الأطباق في أقسام المنيو المتنوعة بمرونة." : lang === 'tr' ? "Yemek ekleme, fiyat belirleme ve ürünleri menü kategorilerine göre sınıflandırma." : "How to add dishes, set prices, and group them in different menu categories.",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-chef-preparing-vegetable-salad-in-kitchen-40223-large.mp4",
      thumbnail: "🍽️"
    }
  ];`;

const newTutorialsBlock = `  const tutorials = [
    {
      title: lang === 'ar' ? "تصفح وطلب العميل من المنيو" : lang === 'tr' ? "Müşteri Menü Gezintisi & Sipariş" : "Customer Menu Browsing & Ordering",
      desc: lang === 'ar' ? "تجربة مسح الباركود، تصفح المنيو، وإتمام الطلب التفاعلي من هاتف العميل." : lang === 'tr' ? "Müşterinin masa barkodunu taraması ve sipariş vermesi." : "Interactive table QR scanning and customer checkout simulation.",
      thumbnail: "📱"
    },
    {
      title: lang === 'ar' ? "تخصيص الهوية والألوان لحظياً" : lang === 'tr' ? "Canlı Renk ve Marka Seçimi" : "Real-time Theme & Branding",
      desc: lang === 'ar' ? "تغيير شعار وألوان وتصميم المنيو وملاحظة التعديل فورياً." : lang === 'tr' ? "Menü renklerini değiştirin ve anında önizleyin." : "Change menu colors and see live updates instantly.",
      thumbnail: "🎨"
    },
    {
      title: lang === 'ar' ? "استقبال الطلبات على الواتساب" : lang === 'tr' ? "WhatsApp Sipariş Akışı" : "WhatsApp Order Receipts",
      desc: lang === 'ar' ? "محاكاة طريقة وصول تفاصيل الطلب والحساب إلى رقم الواتساب الخاص بك." : lang === 'tr' ? "Sipariş detaylarının WhatsApp'a ulaşma şekli." : "Simulate how structured orders and bills land on your WhatsApp.",
      thumbnail: "💬"
    },
    {
      title: lang === 'ar' ? "لوحة الإدارة وإضافة الأصناف" : lang === 'tr' ? "Ürün Ekleme & Kontrol Paneli" : "Item Manager & Admin Panel",
      desc: lang === 'ar' ? "تجربة إضافة وتعديل أسعار وصور الأطباق والوجبات بمرونة." : lang === 'tr' ? "Ürün ekleme ve menüyü kontrol etme." : "Simulate adding food items and updating prices.",
      thumbnail: "🍽️"
    },
    {
      title: lang === 'ar' ? "شاشة الكاشير ونقاط البيع السريعة" : lang === 'tr' ? "Hızlı POS Kasa Ekranı" : "Ultra-fast POS & Cashier Station",
      desc: lang === 'ar' ? "شاشة كاشير سريعة جداً لتسجيل الطلبات المباشرة والسفري بنقرة واحدة." : lang === 'tr' ? "Siparişleri hızlıca kaydetmek için POS kasası." : "A swift cashier console to checkout dine-in and takeaway orders.",
      thumbnail: "🖥️"
    },
    {
      title: lang === 'ar' ? "الفواتير الضريبية وطباعة الإيصالات" : lang === 'tr' ? "E-Fatura & Yazıcı Çözümleri" : "ZATCA E-Invoices & Receipt Printing",
      desc: lang === 'ar' ? "إصدار فواتير حرارية متوافقة مع هيئة الزكاة (ZATCA) مع رمز QR مشفر." : lang === 'tr' ? "Vergi kurallarına uyumlu fatura ve fiş yazdırma." : "Generate tax e-invoices with encrypted ZATCA QR codes.",
      thumbnail: "🖨️"
    },
    {
      title: lang === 'ar' ? "لوحة مبيعات وتقارير الفروع" : lang === 'tr' ? "Çoklu Şube Satış Raporları" : "Multi-branch Sales & Analytics",
      desc: lang === 'ar' ? "متابعة أرباح فروع مطعمك، مبيعاتك اليومية، وإحصائيات الطلبات." : lang === 'tr' ? "Şubelerinizin günlük kazançlarını ve satış raporlarını izleyin." : "Track daily earnings, orders, and branch sales statistics.",
      thumbnail: "📊"
    }
  ];`;

content = content.replace(oldTutorialsBlock, newTutorialsBlock);

// 2. Define the PhoneSimulation component content to append at the end of the file (before exports or FeatureCard helper)
const phoneSimulationCode = `
const PhoneSimulation: React.FC<{ activeIndex: number; lang: string }> = ({ activeIndex, lang }) => {
  const [cartCount, setCartCount] = useState(0);
  const [orderSent, setOrderSent] = useState(false);
  const [brandingColor, setBrandingColor] = useState("emerald");
  const [itemsList, setItemsList] = useState([
    { name: lang === 'ar' ? "برجر كلاسيك" : "Classic Burger", price: 25 },
    { name: lang === 'ar' ? "بطاطس مقرمشة" : "Crispy Fries", price: 10 }
  ]);
  const [newItemName, setNewItemName] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");
  const [posCart, setPosCart] = useState<{ name: string; price: number; qty: number }[]>([]);
  const [posPaid, setPosPaid] = useState(false);
  const [branch, setBranch] = useState("riyadh");

  React.useEffect(() => {
    setOrderSent(false);
    setCartCount(0);
    setPosCart([]);
    setPosPaid(false);
  }, [activeIndex]);

  const getColorHex = (col: string) => {
    if (col === "violet") return "#8b5cf6";
    if (col === "rose") return "#f43f5e";
    return "#10b981";
  };

  const activeThemeColor = getColorHex(brandingColor);

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 font-sans text-right relative select-none">
      {/* Top Header Simulation bar */}
      <div className="h-10 bg-slate-900 border-b border-white/5 flex items-center justify-between px-4 pt-3 shrink-0 text-slate-400 text-[10px]">
        <div className="flex items-center gap-1">
          <span>🔋 100%</span>
        </div>
        <div className="w-14 h-3 bg-slate-950 rounded-full" />
        <div className="flex items-center gap-1 font-mono">
          <span>12:00 PM</span>
        </div>
      </div>

      {/* Screen Content */}
      <div className="flex-1 overflow-y-auto p-3 text-slate-200 text-xs flex flex-col">
        {activeIndex === 0 && (
          <div className="flex-1 flex flex-col space-y-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="text-[9px] bg-indigo-500/20 text-indigo-400 font-bold px-1.5 py-0.5 rounded-full">طاولة 4</span>
              <h4 className="font-bold text-white text-[11px]">🍔 برجر شو (Burger Show)</h4>
            </div>

            <div className="space-y-1.5">
              <div className="bg-slate-900 p-2 rounded-xl border border-white/5 flex items-center justify-between gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setCartCount(c => c + 1);
                    setOrderSent(false);
                  }}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-2.5 py-1 rounded-lg text-[10px] cursor-pointer"
                >
                  {lang === 'ar' ? 'أضف +' : 'Add +'}
                </button>
                <div className="text-right">
                  <div className="font-bold text-white text-[11px]">{lang === 'ar' ? 'كلاسيك برجر 🍔' : 'Classic Burger 🍔'}</div>
                  <div className="text-[10px] text-slate-400">25 ر.س</div>
                </div>
              </div>

              <div className="bg-slate-900 p-2 rounded-xl border border-white/5 flex items-center justify-between gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setCartCount(c => c + 1);
                    setOrderSent(false);
                  }}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-2.5 py-1 rounded-lg text-[10px] cursor-pointer"
                >
                  {lang === 'ar' ? 'أضف +' : 'Add +'}
                </button>
                <div className="text-right">
                  <div className="font-bold text-white text-[11px]">{lang === 'ar' ? 'بطاطس مقرمشة 🍟' : 'Crispy Fries 🍟'}</div>
                  <div className="text-[10px] text-slate-400">10 ر.س</div>
                </div>
              </div>
            </div>

            <div className="mt-auto pt-3">
              {orderSent ? (
                <div className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 p-2.5 rounded-xl text-center font-bold text-[9px] animate-in zoom-in-95">
                  🎉 {lang === 'ar' ? 'تم إرسال الطلب بنجاح إلى الواتساب!' : 'Order sent to WhatsApp!'}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    if (cartCount > 0) setOrderSent(true);
                  }}
                  disabled={cartCount === 0}
                  className={\`w-full py-2 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all \${
                    cartCount > 0 ? "bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-90 cursor-pointer" : "bg-slate-800 text-slate-500 cursor-not-allowed"
                  }\`}
                >
                  <span>🛒 {lang === 'ar' ? 'إرسال الطلب عبر الواتساب' : 'Send Order to WhatsApp'}</span>
                  {cartCount > 0 && <span className="bg-white text-emerald-600 font-black rounded-full w-4 h-4 flex items-center justify-center text-[10px]">{cartCount}</span>}
                </button>
              )}
            </div>
          </div>
        )}

        {activeIndex === 1 && (
          <div className="flex-1 flex flex-col space-y-3">
            <div className="bg-slate-900 p-2.5 rounded-xl border border-white/5 space-y-2">
              <span className="text-[9px] text-slate-400 block font-bold">{lang === 'ar' ? 'اختر لون الهوية للمنيو:' : 'Choose Menu Theme Color:'}</span>
              <div className="flex gap-2 justify-end">
                {["emerald", "violet", "rose"].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setBrandingColor(c)}
                    className={\`w-5 h-5 rounded-full border cursor-pointer transition-all \${
                      c === "emerald" ? "bg-emerald-500" : c === "violet" ? "bg-violet-500" : "bg-rose-500"
                    } \${brandingColor === c ? "ring-2 ring-white scale-110 border-black" : "border-white/10 hover:scale-105"}\`}
                  />
                ))}
              </div>
            </div>

            <div className="flex-1 border rounded-2xl p-2.5 flex flex-col space-y-2" style={{ borderColor: activeThemeColor + "40" }}>
              <div className="text-center py-1.5 rounded-xl" style={{ backgroundColor: activeThemeColor + "15" }}>
                <h5 className="font-bold text-[10px]" style={{ color: activeThemeColor }}>
                  {lang === 'ar' ? 'معاينة المنيو الخاص بك' : 'Your Menu Live Preview'}
                </h5>
              </div>
              <div className="bg-slate-900/60 p-2 rounded-xl border border-white/5 flex items-center justify-between">
                <span className="text-[9px] font-bold text-white px-2 py-0.5 rounded-md" style={{ backgroundColor: activeThemeColor }}>
                  {lang === 'ar' ? 'طلب' : 'Order'}
                </span>
                <span className="font-bold text-white text-[10px]">🍔 برجر لحم فاخر</span>
              </div>
            </div>
          </div>
        )}

        {activeIndex === 2 && (
          <div className="flex-1 flex flex-col space-y-2">
            <div className="bg-[#075e54] p-2 rounded-lg flex items-center justify-between text-white text-[9px] shrink-0">
              <span className="text-[8px] text-emerald-200">Online</span>
              <span className="font-bold">برجر شو (RestoCloud) 🍔</span>
            </div>

            <div className="flex-1 bg-slate-900/80 rounded-xl p-2 space-y-2 flex flex-col justify-end">
              <div className="bg-[#056162] text-white p-2 rounded-xl text-[9px] max-w-[90%] self-end space-y-1 text-right shadow-sm leading-relaxed">
                <div className="font-bold border-b border-white/10 pb-0.5 text-[8px] text-emerald-300">
                  {lang === 'ar' ? '💬 طلب جديد من طاولة 4' : '💬 New Order - Table 4'}
                </div>
                <div className="font-mono text-[8px] text-slate-100">
                  🍔 1x كلاسيك برجر (25 ر.س)<br />
                  🍟 1x بطاطس مقرمشة (10 ر.س)<br />
                  ---------------------<br />
                  💰 المجموع الإجمالي: 35 ر.س
                </div>
              </div>
              
              <div className="bg-[#262d31] text-slate-300 p-2 rounded-xl text-[9px] max-w-[85%] self-start text-right shadow-sm">
                👨‍🍳 {lang === 'ar' ? 'مرحباً بك! تم استلام طلبك وجاري تحضيره في المطبخ.' : 'Hello! We received your order and are preparing it.'}
              </div>
            </div>
          </div>
        )}

        {activeIndex === 3 && (
          <div className="flex-1 flex flex-col space-y-3">
            <div className="bg-slate-900 p-2.5 rounded-xl border border-white/5 space-y-2">
              <span className="text-[9px] font-bold text-white block">{lang === 'ar' ? 'إضافة طبق جديد للمنيو:' : 'Add New Dish:'}</span>
              <div className="space-y-1.5">
                <input
                  type="text"
                  placeholder={lang === 'ar' ? "اسم الوجبة (مثال: شاورما)" : "Item Name"}
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="w-full px-2 py-1 bg-slate-950 border border-white/10 rounded-lg text-[9px] text-right focus:outline-none"
                />
                <input
                  type="number"
                  placeholder={lang === 'ar' ? "السعر (مثال: 15)" : "Price"}
                  value={newItemPrice}
                  onChange={(e) => setNewItemPrice(e.target.value)}
                  className="w-full px-2 py-1 bg-slate-950 border border-white/10 rounded-lg text-[9px] text-right focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newItemName && newItemPrice) {
                      setItemsList([...itemsList, { name: newItemName, price: Number(newItemPrice) }]);
                      setNewItemName("");
                      setNewItemPrice("");
                    }
                  }}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-1 rounded-lg text-[9px] cursor-pointer"
                >
                  {lang === 'ar' ? 'حفظ الصنف الجديد' : 'Save New Item'}
                </button>
              </div>
            </div>

            <div className="flex-1 bg-slate-900/40 border border-white/5 rounded-xl p-2 max-h-[90px] overflow-y-auto space-y-1">
              <span className="text-[8px] text-slate-500 font-bold block mb-1">{lang === 'ar' ? 'قائمة الطعام الحالية:' : 'Current Menu:'}</span>
              {itemsList.map((item, idx) => (
                <div key={idx} className="bg-slate-950 p-1 rounded-lg border border-white/5 flex items-center justify-between text-[9px]">
                  <span className="text-slate-400 font-mono">{item.price} ر.س</span>
                  <span className="font-bold text-white">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeIndex === 4 && (
          <div className="flex-1 flex flex-col space-y-2">
            <div className="grid grid-cols-3 gap-1 shrink-0">
              {[{ name: "🍔 برجر", p: 25 }, { name: "🍟 بطاطس", p: 10 }, { name: "🥤 كولا", p: 5 }].map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    const existing = posCart.find(c => c.name === item.name);
                    if (existing) {
                      setPosCart(posCart.map(c => c.name === item.name ? { ...c, qty: c.qty + 1 } : c));
                    } else {
                      setPosCart([...posCart, { name: item.name, price: item.p, qty: 1 }]);
                    }
                    setPosPaid(false);
                  }}
                  className="bg-slate-900 hover:bg-slate-800 p-1.5 rounded-lg border border-white/5 text-center text-[9px] font-bold text-slate-200 cursor-pointer"
                >
                  <div>{item.name}</div>
                  <div className="text-[8px] text-slate-500">{item.p} ر.س</div>
                </button>
              ))}
            </div>

            <div className="flex-1 bg-white text-slate-900 rounded-xl p-2 flex flex-col overflow-y-auto font-mono text-[8px] space-y-1">
              <span className="font-black text-center border-b border-dashed border-slate-300 pb-1 text-[9px] text-slate-800">
                {lang === 'ar' ? 'فاتورة كاشير سريعة' : 'POS Cashier Slip'}
              </span>
              
              <div className="flex-1 space-y-0.5 max-h-[80px] overflow-y-auto">
                {posCart.length === 0 ? (
                  <div className="text-center text-slate-400 pt-3">{lang === 'ar' ? 'انقر على الأصناف بالأعلى' : 'Click items above'}</div>
                ) : (
                  posCart.map((c, i) => (
                    <div key={i} className="flex justify-between">
                      <span>{c.price * c.qty} ر.س</span>
                      <span className="text-right">{c.name} x{c.qty}</span>
                    </div>
                  ))
                )}
              </div>

              {posCart.length > 0 && (
                <div className="border-t border-dashed border-slate-300 pt-1">
                  <div className="flex justify-between font-black text-slate-950">
                    <span>{posCart.reduce((sum, item) => sum + (item.price * item.qty), 0)} ر.س</span>
                    <span>{lang === 'ar' ? 'المجموع:' : 'TOTAL:'}</span>
                  </div>

                  {posPaid ? (
                    <div className="bg-emerald-500 text-white font-bold p-1 rounded-md text-center text-[8px] mt-1">
                      🎉 {lang === 'ar' ? 'تم الدفع وطباعة الفاتورة!' : 'Paid & Printed!'}
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setPosPaid(true)}
                      className="w-full bg-slate-900 hover:bg-slate-850 text-white font-bold py-1 rounded-md text-[8px] mt-1 cursor-pointer"
                    >
                      💳 {lang === 'ar' ? 'دفع وطباعة' : 'Checkout & Print'}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {activeIndex === 5 && (
          <div className="flex-1 flex flex-col items-center justify-center p-2 space-y-3">
            <div className="bg-white text-slate-900 p-3 rounded-xl shadow-md border border-slate-200 w-full max-w-[180px] font-mono text-[8px] space-y-1.5 text-center animate-in slide-in-from-top-12 duration-550">
              <div className="font-black text-[9px] text-slate-800">🧾 {lang === 'ar' ? 'فاتورة ضريبية مبسطة' : 'Simplified Tax Invoice'}</div>
              <div className="text-slate-500 text-[7px]">{lang === 'ar' ? 'الرقم الضريبي: ٣١٠٥٢٩١٨٤' : 'VAT ID: 310529184'}</div>
              
              <div className="border-y border-dashed border-slate-200 py-1 space-y-0.5 text-right px-1">
                <div className="flex justify-between"><span>٢٥.٠٠ ر.س</span><span>برجر كلاسيك x١</span></div>
                <div className="flex justify-between"><span>٣.٧٥ ر.س</span><span>ضريبة القيمة المضافة ١٥٪</span></div>
              </div>

              <div className="flex justify-between font-black text-slate-950 px-1">
                <span>٢٨.٧٥ ر.س</span>
                <span>{lang === 'ar' ? 'الإجمالي:' : 'TOTAL:'}</span>
              </div>

              <div className="flex justify-center pt-2">
                <div className="w-14 h-14 bg-slate-100 border border-slate-200 p-1 flex flex-wrap gap-0.5 justify-center items-center">
                  {Array.from({ length: 49 }).map((_, idx) => (
                    <div
                      key={idx}
                      className={\`w-1 h-1 \${
                        (idx % 2 === 0 && idx % 3 === 0) || idx < 7 || idx % 7 === 0 || idx > 42 ? "bg-slate-900" : "bg-slate-200"
                      }\`}
                    />
                  ))}
                </div>
              </div>
              <div className="text-[6px] text-slate-400 font-sans">{lang === 'ar' ? 'متوافق مع متطلبات هيئة الزكاة والجمارك' : 'ZATCA Phase 2 Compliant'}</div>
            </div>
          </div>
        )}

        {activeIndex === 6 && (
          <div className="flex-1 flex flex-col space-y-2.5">
            <div className="flex items-center justify-between shrink-0 bg-slate-900 p-1.5 rounded-lg border border-white/5">
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="bg-slate-950 border border-white/10 rounded-md text-[8px] text-white p-1 focus:outline-none"
              >
                <option value="riyadh">📍 {lang === 'ar' ? 'فرع الرياض' : 'Riyadh Branch'}</option>
                <option value="jeddah">📍 {lang === 'ar' ? 'فرع جدة' : 'Jeddah Branch'}</option>
              </select>
              <span className="text-[9px] text-slate-400 font-bold">{lang === 'ar' ? 'مراقبة أرباح الفروع:' : 'Branch Sales Monitor:'}</span>
            </div>

            <div className="flex-1 bg-slate-900 p-2.5 rounded-xl border border-white/5 flex flex-col space-y-2">
              <div className="flex justify-between items-end border-b border-white/5 pb-1">
                <span className="text-[8px] text-emerald-400 font-black">+18.5%</span>
                <div className="text-right">
                  <div className="text-[7px] text-slate-500">{lang === 'ar' ? 'مبيعات اليوم' : 'Today Sales'}</div>
                  <div className="font-bold text-white text-[10px] font-mono">
                    {branch === "riyadh" ? "١٢,٨٥٠ ر.س" : "٨,٤٠٠ ر.س"}
                  </div>
                </div>
              </div>

              <div className="flex-1 flex items-end justify-between gap-1.5 px-2 pt-4 h-16">
                {[30, 45, 60, 40, 75, 90, 65].map((val, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full bg-gradient-to-t from-indigo-600 to-violet-400 rounded-t-md transition-all duration-500"
                      style={{ height: \`\${branch === "riyadh" ? val * 0.75 : val * 0.5}px\` }}
                    />
                    <span className="text-[5px] text-slate-500 font-mono">D{idx+1}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
`;

// Append the helper component code right before the `FeatureCard` helper in the file
const featureCardDecl = "function FeatureCard({ icon, title, desc, color, lang }";
const insertPos = content.indexOf(featureCardDecl);

if (insertPos !== -1) {
  content = content.substring(0, insertPos) + phoneSimulationCode + "\n\n" + content.substring(insertPos);
}

// 3. Update the Tutorials Section block to render the PhoneSimulation component instead of the video tag
// Let's replace the outer video player markup
const oldVideoInnerMarkup = `<video
                    key={activeVideo}
                    src={tutorials[activeVideo].videoUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover transition-opacity duration-300"
                  />
                  
                  {/* Glassmorphism description overlay */}
                  <div className="absolute bottom-4 left-4 right-4 bg-slate-900/80 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 text-right animate-in slide-in-from-bottom-4 duration-300">
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block mb-0.5">
                      {lang === 'ar' ? 'معاينة حية' : 'LIVE DEMO'}
                    </span>
                    <h4 className="text-xs font-bold text-white mb-1">{tutorials[activeVideo].title}</h4>
                    <p className="text-[10px] text-slate-400 leading-relaxed">{tutorials[activeVideo].desc}</p>
                  </div>`;

const newVideoInnerMarkup = `<PhoneSimulation activeIndex={activeVideo} lang={lang} />`;

content = content.replace(oldVideoInnerMarkup, newVideoInnerMarkup);

// Also let's adjust the Right Column spacing and sizing of the interactive list buttons
// Make the container have max-height and clean scrolling, and padding of the buttons a bit smaller
content = content.replace(
  '<div className="lg:col-span-7 space-y-4">',
  '<div className="lg:col-span-7 space-y-2.5 max-h-[560px] overflow-y-auto pr-2 custom-scrollbar" dir={lang === "ar" ? "rtl" : "ltr"}>'
);

content = content.replace(
  'className={`w-full p-5 rounded-3xl border text-right flex items-center gap-4 transition-all cursor-pointer ${',
  'className={`w-full p-3.5 rounded-2xl border text-right flex items-center gap-3 transition-all cursor-pointer ${'
);

content = content.replace(
  'className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg shrink-0 transition-all shadow-md ${',
  'className={`w-10 h-10 rounded-xl flex items-center justify-center text-md shrink-0 transition-all shadow-md ${'
);

fs.writeFileSync(filePath, content, "utf8");
console.log("Successfully replaced video hotlinks with an fully interactive React app mockup simulator!");
