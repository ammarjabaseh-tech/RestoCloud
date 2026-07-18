const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/AdminPanelView.tsx";
let content = fs.readFileSync(filePath, "utf8");

// 1. Rewrite COLUMN 1 wrapper to include max-width [540px]
content = content.replace(
  '/* COLUMN 1: Basic Information & Socials (7 cols) */\n            <div className="lg:col-span-7 space-y-6">',
  '/* COLUMN 1: Basic Information & Socials (7 cols) */\n            <div className="lg:col-span-7 space-y-4 max-w-[540px] w-full">'
);

// 2. Rewrite COLUMN 2 wrapper to include max-width [380px]
content = content.replace(
  '/* COLUMN 2: Branding Customizations & Previews (5 cols) */\n            <div className="lg:col-span-5 space-y-6">',
  '/* COLUMN 2: Branding Customizations & Previews (5 cols) */\n            <div className="lg:col-span-5 space-y-4 max-w-[380px] w-full">'
);

// 3. Rewrite Card 1, 2, 3 wrapper padding to p-5 rounded-2xl (premium aesthetic)
content = content.replace(/rounded-xl p-4 border border-slate-200/g, "rounded-2xl p-5 border border-slate-200");

// Let's rewrite the inputs in Card 1 to use w-full h-9 px-3 rounded-xl (no items-start wrappers)
// We will replace the entire Card 1 content (from "Card 1: Restaurant Details" to "Card 2: Financial & WiFi Settings")
const card1StartTag = '{/* Card 1: Restaurant Details */}';
const card2StartTag = '{/* Card 2: Financial & WiFi Settings */}';
const card1StartIndex = content.indexOf(card1StartTag);
const card2StartIndex = content.indexOf(card2StartTag);

if (card1StartIndex !== -1 && card2StartIndex !== -1) {
  const card1Content = `<!-- Card 1 -->
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <h3 className="text-xs font-black text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center gap-2 uppercase tracking-wider">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                  <span>{lang === 'ar' ? 'معلومات المطعم والاتصال' : 'Restaurant & Contact Details'}</span>
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-405 mb-1">{lang === 'ar' ? 'اسم المطعم بالعربية' : 'Arabic Restaurant Name'} *</label>
                    <input
                      type="text"
                      required
                      value={nameAr}
                      onChange={(e) => setNameAr(e.target.value)}
                      className="w-full h-9 px-3 rounded-xl border border-slate-350 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-405 mb-1">{lang === 'ar' ? 'شعار المطعم / نوع المطبخ (Slogan)' : 'Slogan / Kitchen Type'}</label>
                    <input
                      type="text"
                      value={slogan}
                      onChange={(e) => setSlogan(e.target.value)}
                      className="w-full h-9 px-3 rounded-xl border border-slate-350 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-405 mb-1">{lang === 'ar' ? 'رقم الهاتف (الواتساب المستلم للطلبات)' : 'WhatsApp Number'}</label>
                    <div className="flex gap-2 w-full" dir="ltr">
                      {(() => {
                        const selectedCountry = countriesList.find(c => c.code === adminPhoneCountryCode) || countriesList[0];
                        return (
                          <div className="relative flex-initial shrink-0" dir="rtl">
                            <button
                              type="button"
                              onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                              className="w-[95px] h-9 px-2.5 rounded-xl border border-slate-350 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs flex items-center justify-between gap-1 cursor-pointer shadow-3xs hover:bg-slate-50 dark:hover:bg-slate-750"
                            >
                              <span className="text-[8px] text-slate-405 shrink-0">▼</span>
                              <div className="flex items-center gap-1.5">
                                <span className="font-sans text-[11px] font-black text-slate-750 dark:text-white">+{selectedCountry.code}</span>
                                <img
                                  src={\`https://flagcdn.com/w40/\${selectedCountry.iso}.png\`}
                                  alt={selectedCountry.name}
                                  className="w-5 h-3.5 rounded-xs object-cover border border-slate-200/50 shrink-0"
                                />
                              </div>
                            </button>

                            {showCountryDropdown && (
                              <>
                                <div 
                                  className="fixed inset-0 z-40" 
                                  onClick={() => setShowCountryDropdown(false)}
                                />
                                <div className="absolute right-0 mt-1.5 w-[210px] max-h-56 overflow-y-auto rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl z-50 p-1 animate-in fade-in slide-in-from-top-2 duration-150">
                                  {countriesList.map((c) => (
                                    <button
                                      key={c.code}
                                      type="button"
                                      onClick={() => {
                                        setAdminPhoneCountryCode(c.code);
                                        setShowCountryDropdown(false);
                                      }}
                                      className="w-full px-3 py-2 rounded-xl text-right text-xs font-bold flex items-center gap-2.5 transition-colors cursor-pointer text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                                    >
                                      <img
                                        src={\`https://flagcdn.com/w40/\${c.iso}.png\`}
                                        alt={c.name}
                                        className="w-5 h-3.5 rounded-xs object-cover border border-slate-200/50"
                                      />
                                      <span>{c.name} (+{c.code})</span>
                                    </button>
                                  ))}
                                </div>
                              </>
                            )}
                          </div>
                        );
                      })()}
                      <input
                        type="text"
                        required
                        placeholder="5xxxxxxxx"
                        value={adminPhoneLocalNumber}
                        onChange={(e) => setAdminPhoneLocalNumber(e.target.value.replace(/[^0-9]/g, ""))}
                        className="flex-1 h-9 px-3 rounded-xl border border-slate-350 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-405 mb-1">{lang === 'ar' ? 'العنوان وموقع الفرع' : 'Branch Address & Location'}</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full h-9 px-3 rounded-xl border border-slate-350 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
              
              `;
  content = content.substring(0, card1StartIndex) + card1Content + content.substring(card2StartIndex);
}

// Let's rewrite Card 2 content (from "Card 2: Financial & WiFi Settings" to "Card 3: Social Media Profiles")
const card2StartTagUpdated = '{/* Card 2: Financial & WiFi Settings */}';
const card3StartTag = '{/* Card 3: Social Media Profiles */}';
const card2StartIndexUpdated = content.indexOf(card2StartTagUpdated);
const card3StartIndex = content.indexOf(card3StartTag);

if (card2StartIndexUpdated !== -1 && card3StartIndex !== -1) {
  const card2Content = `<!-- Card 2 -->
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <h3 className="text-xs font-black text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center gap-2 uppercase tracking-wider">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>{lang === 'ar' ? 'الإعدادات الضريبية والواي فاي' : 'Taxation & WiFi Configuration'}</span>
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-405 mb-1">{lang === 'ar' ? 'نسبة الضريبة المضافة (VAT %)' : 'VAT Rate %'}</label>
                    <input
                      type="number"
                      value={taxRate}
                      onChange={(e) => setTaxRate(e.target.value)}
                      className="w-full h-9 px-3 rounded-xl border border-slate-350 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-405 mb-1">{lang === 'ar' ? 'البلد والعملة الرسمية' : 'Country & Currency'}</label>
                    <select
                      value={
                        ["ر.س", "د.إ", "د.ك", "ر.ق", "د.ب", "ر.ع", "ج.م", "د.أ", "د.ع", "ر.ي", "ل.س", "ل.ل", "₪", "ج.س", "د.ل", "د.ت", "د.ج", "د.م", "أ.م", "ش.ص", "ف.ج", "ف.ق", "$"].includes(currency)
                          ? currency
                          : "custom"
                      }
                      onChange={(e) => {
                        const val = e.target.value;
                        setCurrency(val !== "custom" ? val : "");
                      }}
                      className="w-full h-9 px-3 rounded-xl border border-slate-350 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    >
                      <option value="ر.س">🇸🇦 {lang === 'ar' ? 'السعودية (ر.س)' : 'Saudi Arabia (SAR)'}</option>
                      <option value="د.إ">🇦🇪 {lang === 'ar' ? 'الإمارات (د.إ)' : 'UAE (AED)'}</option>
                      <option value="د.ك">🇰🇼 {lang === 'ar' ? 'الكويت (د.ك)' : 'Kuwait (KWD)'}</option>
                      <option value="ر.ق">🇶🇦 {lang === 'ar' ? 'قطر (ر.ق)' : 'Qatar (QAR)'}</option>
                      <option value="د.ب">🇧🇭 {lang === 'ar' ? 'البحرين (د.ب)' : 'Bahrain (BHD)'}</option>
                      <option value="ر.ع">🇴🇲 {lang === 'ar' ? 'عمان (ر.ع)' : 'Oman (OMR)'}</option>
                      <option value="ج.م">🇪🇬 {lang === 'ar' ? 'مصر (ج.م)' : 'Egypt (EGP)'}</option>
                      <option value="د.أ">🇯🇴 {lang === 'ar' ? 'الأردن (د.أ)' : 'Jordan (JOD)'}</option>
                      <option value="د.ع">🇮🇶 {lang === 'ar' ? 'العراق (د.ع)' : 'Iraq (IQD)'}</option>
                      <option value="ر.ي">🇾🇪 {lang === 'ar' ? 'اليمن (ر.ي)' : 'Yemen (YER)'}</option>
                      <option value="ل.س">🇸🇾 {lang === 'ar' ? 'سوريا (ل.س)' : 'Syria (SYP)'}</option>
                      <option value="ل.ل">🇱🇧 {lang === 'ar' ? 'لبنان (ل.ل)' : 'Lebanon (LBP)'}</option>
                      <option value="₪">🇵🇸 {lang === 'ar' ? 'فلسطين (₪)' : 'Palestine (ILS)'}</option>
                      <option value="ج.س">🇸🇩 {lang === 'ar' ? 'السودان (ج.س)' : 'Sudan (SDG)'}</option>
                      <option value="د.ل">🇱🇾 {lang === 'ar' ? 'ليبيا (د.ل)' : 'Libya (LYD)'}</option>
                      <option value="د.ت">🇹🇳 {lang === 'ar' ? 'تونس (د.ت)' : 'Tunisia (TND)'}</option>
                      <option value="د.ج">🇩🇿 {lang === 'ar' ? 'الجزائر (د.ج)' : 'Algeria (DZD)'}</option>
                      <option value="د.م">🇲🇦 {lang === 'ar' ? 'المغرب (د.م)' : 'Morocco (MAD)'}</option>
                      <option value="أ.م">🇲🇷 {lang === 'ar' ? 'موريتانيا (أ.م)' : 'Mauritania (MRU)'}</option>
                      <option value="ش.ص">🇸🇴 {lang === 'ar' ? 'الصومال (ش.ص)' : 'Somalia (SOS)'}</option>
                      <option value="ف.ج">🇩🇯 {lang === 'ar' ? 'جيبوتي (ف.ج)' : 'Djibouti (DJF)'}</option>
                      <option value="ف.ق">🇰🇲 {lang === 'ar' ? 'جزر القمر (ف.ق)' : 'Comoros (KMF)'}</option>
                      <option value="$">🇺🇸 {lang === 'ar' ? 'دولار أمريكي ($)' : 'US Dollar ($)'}</option>
                      <option value="custom">⚙️ {lang === 'ar' ? 'رمز عملة مخصص...' : 'Custom Symbol...'}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-405 mb-1">{lang === 'ar' ? 'اسم شبكة الواي فاي (WiFi SSID)' : 'WiFi SSID'}</label>
                    <input
                      type="text"
                      placeholder={lang === 'ar' ? 'اتركه فارغاً إذا لم يتوفر' : 'Leave empty if none'}
                      value={wifiName}
                      onChange={(e) => setWifiName(e.target.value)}
                      className="w-full h-9 px-3 rounded-xl border border-slate-350 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-405 mb-1">{lang === 'ar' ? 'كلمة مرور واي فاي المطعم' : 'WiFi Password'}</label>
                    <input
                      type="text"
                      placeholder={lang === 'ar' ? 'اتركه فارغاً إذا لم يتوفر' : 'Leave empty if none'}
                      value={wifiPass}
                      onChange={(e) => setWifiPass(e.target.value)}
                      className="w-full h-9 px-3 rounded-xl border border-slate-350 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
              
              `;
  content = content.substring(0, card2StartIndexUpdated) + card2Content + content.substring(card3StartIndex);
}

// Let's rewrite Card 3 content (from "Card 3: Social Media Profiles" to "COLUMN 2: Branding Customizations")
const card3StartTagUpdated = '{/* Card 3: Social Media Profiles */}';
const column2StartTag = '/* COLUMN 2: Branding Customizations & Previews (5 cols) */';
const card3StartIndexUpdated = content.indexOf(card3StartTagUpdated);
const column2StartIndex = content.indexOf(column2StartTag);

if (card3StartIndexUpdated !== -1 && column2StartIndex !== -1) {
  const card3Content = `<!-- Card 3 -->
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <h3 className="text-xs font-black text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center gap-2 uppercase tracking-wider">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <span>{lang === 'ar' ? 'روابط شبكات التواصل الاجتماعي' : 'Social Media Integration'}</span>
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-405 mb-1 flex items-center gap-1.5">
                      <Facebook className="w-3.5 h-3.5 text-blue-600" />
                      <span>فيسبوك (Facebook)</span>
                    </label>
                    <input
                      type="url"
                      placeholder="facebook.com/username"
                      value={facebookUrl}
                      onChange={(e) => setFacebookUrl(e.target.value)}
                      className="w-full h-9 px-3 rounded-xl border border-slate-350 dark:border-slate-750 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-indigo-550 focus:outline-none"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-405 mb-1 flex items-center gap-1.5">
                      <Instagram className="w-3.5 h-3.5 text-pink-600" />
                      <span>انستغرام (Instagram)</span>
                    </label>
                    <input
                      type="url"
                      placeholder="instagram.com/username"
                      value={instagramUrl}
                      onChange={(e) => setInstagramUrl(e.target.value)}
                      className="w-full h-9 px-3 rounded-xl border border-slate-350 dark:border-slate-750 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-indigo-550 focus:outline-none"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-405 mb-1 flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5 text-slate-950 dark:text-white fill-current" viewBox="0 0 24 24">
                        <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm5.75 8.16a3.52 3.52 0 0 1-2.07-.67v4.61a4.35 4.35 0 1 1-4.35-4.35 4.31 4.31 0 0 1 1 .12v2.24a2.15 2.15 0 0 0-1-.24 2.11 2.11 0 1 0 2.11 2.11V7.75h2.24a3.53 3.53 0 0 1 2.07 2.07v.34z"/>
                      </svg>
                      <span>تيك توك (TikTok)</span>
                    </label>
                    <input
                      type="url"
                      placeholder="tiktok.com/@username"
                      value={tiktokUrl}
                      onChange={(e) => setTiktokUrl(e.target.value)}
                      className="w-full h-9 px-3 rounded-xl border border-slate-350 dark:border-slate-750 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-indigo-550 focus:outline-none"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-405 mb-1 flex items-center gap-1.5">
                      <span className="w-3.5 h-3.5 flex items-center justify-center text-xs">📍</span>
                      <span>موقع قوقل ماب (Location)</span>
                    </label>
                    <input
                      type="url"
                      placeholder="https://maps.google.com/..."
                      value={locationUrl}
                      onChange={(e) => setLocationUrl(e.target.value)}
                      className="w-full h-9 px-3 rounded-xl border border-slate-350 dark:border-slate-750 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-indigo-550 focus:outline-none"
                      dir="ltr"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            `;
  content = content.substring(0, card3StartIndexUpdated) + card3Content + content.substring(column2StartIndex);
}

// Let's rewrite Card 4 and Card 5 (Brand theme color & logo) to use normal w-full and a compact grid of 2 columns for colors
content = content.replace(
  '<div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 w-full max-w-[240px]">',
  '<div className="grid grid-cols-2 gap-2">'
);
content = content.replace(
  'className={`flex items-center gap-1.5 p-1.5 rounded-lg border transition-all cursor-pointer text-[11px] ${',
  'className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all cursor-pointer text-xs w-full ${'
);

// Constrain the initials input, choose logo file upload label, and emojis grid in Card 5 to be w-full (they will be constrained by the parent col-span-5 max-w-[380px] wrapper anyway, which is perfectly compact!)
content = content.replace(/max-w-\[200px\]/g, "");
content = content.replace(/max-w-\[150px\]/g, "");
content = content.replace(/w-\[240px\]/g, "w-full");

fs.writeFileSync(filePath, content, "utf8");
console.log("Successfully redesigned settings panel to be clean, aligned, and compact!");
