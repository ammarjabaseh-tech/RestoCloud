const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/LandingPageView.tsx";
let content = fs.readFileSync(filePath, "utf8");

// Define state & tutorials array to inject inside the component
const stateInjection = `  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [activeVideo, setActiveVideo] = useState(0);
  
  const tutorials = [
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

content = content.replace("  const [showLangDropdown, setShowLangDropdown] = useState(false);", stateInjection);

// Define the tutorials section JSX to inject before the pricing section
const pricingStartText = '{/* Pricing Section */}';
const pricingIndex = content.indexOf(pricingStartText);

if (pricingIndex !== -1) {
  const tutorialsSection = `
      {/* Video Tutorials Section */}
      <section id="tutorials" className="py-24 bg-slate-950/60 relative border-t border-white/5">
        {/* Glow light */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              {lang === 'ar' ? 'شرح المنيو وكيفية العمل' : lang === 'tr' ? 'Nasıl Çalışır & Video Rehberler' : 'How it Works & Video Guides'}
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              {lang === 'ar' ? 'شاهد شروحات سريعة توضح كيف تساهم منصتنا في تنظيم طلبات مطعمك ورفع أرباحك بضغطة زر' : lang === 'tr' ? 'Platformumuzun restoran siparişlerinizi nasıl düzenlediğini ve satışlarınızı nasıl artırdığını gösteren hızlı rehberleri izleyin' : 'Watch quick videos showing how our platform organizes your restaurant orders and boosts your sales easily'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left side: Video Player Mockup (5 cols) */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-[280px] h-[560px] bg-slate-900 rounded-[40px] p-3 border-4 border-slate-700 shadow-2xl shadow-indigo-500/10 flex flex-col overflow-hidden group">
                {/* Phone Speaker & Camera Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-5 w-32 bg-slate-700 rounded-b-xl z-20 flex items-center justify-center">
                  <div className="w-12 h-1 bg-slate-800 rounded-full" />
                  <div className="w-2.5 h-2.5 bg-slate-850 rounded-full ml-2" />
                </div>

                {/* Inner Screen */}
                <div className="relative flex-1 rounded-[32px] overflow-hidden bg-slate-950 flex items-center justify-center">
                  <video
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
                  </div>
                </div>
              </div>
            </div>

            {/* Right side: Interactive Tutorial list (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              {tutorials.map((t, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveVideo(idx)}
                  className={\`w-full p-5 rounded-3xl border text-right flex items-center gap-4 transition-all cursor-pointer \${
                    activeVideo === idx
                      ? "bg-gradient-to-l from-indigo-900/30 to-slate-800/80 border-indigo-500/40 shadow-lg shadow-indigo-500/5"
                      : "bg-slate-800/20 hover:bg-slate-800/40 border-white/5"
                  }\`}
                >
                  {/* Play circle / Selected icon */}
                  <div className={\`w-12 h-12 rounded-2xl flex items-center justify-center text-lg shrink-0 transition-all shadow-md \${
                    activeVideo === idx
                      ? "bg-indigo-600 text-white scale-105"
                      : "bg-slate-800/60 text-slate-400 group-hover:text-white"
                  }\`}>
                    {t.thumbnail}
                  </div>

                  <div className="flex-1 space-y-1">
                    <h3 className={\`text-base font-bold transition-colors \${
                      activeVideo === idx ? "text-white" : "text-slate-300"
                    }\`}>
                      {t.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{t.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
`;

  content = content.substring(0, pricingIndex) + tutorialsSection + content.substring(pricingIndex);
  fs.writeFileSync(filePath, content, "utf8");
  console.log("Successfully added Interactive Tutorials & Explanation Video section to the Landing Page!");
} else {
  console.log("Could not locate Pricing Section anchor in LandingPageView.tsx");
}
