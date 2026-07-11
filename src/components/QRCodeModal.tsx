import React, { useState, useEffect } from "react";
import QRCode from "qrcode";
import { Tenant, TableItem } from "../types";
import { getThemeClasses } from "../utils/theme";
import { RestaurantLogo } from "./RestaurantLogo";
import { QrCode, Printer, Copy, Check, Download, Share2, Utensils, Wifi, Globe, X, Sparkles, LayoutGrid } from "lucide-react";

interface QRCodeModalProps {
  tenant: Tenant;
  tables?: TableItem[];
  initialTableNumber?: number | "general";
  onClose: () => void;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({
  tenant,
  tables = [],
  initialTableNumber = "general",
  onClose
}) => {
  const [selectedTarget, setSelectedTarget] = useState<string | number>(initialTableNumber);
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [viewMode, setViewMode] = useState<"single" | "all_grid">("single");

  const theme = getThemeClasses(tenant.themeColor);

  // Extract platform base domain dynamically (e.g. restocloud.app or localhost:3000)
  const getBaseDomain = () => {
    const host = window.location.host;
    const parts = host.split('.');
    if (parts.length > 2) {
      if (parts[0] !== 'www' && parts[0] !== 'sa' && parts[0] !== 'admin') {
        return parts.slice(1).join('.');
      }
    } else if (parts.length === 2 && parts[1] === 'localhost') {
      return parts[1];
    }
    return host;
  };

  const baseDomain = getBaseDomain();
  const protocol = window.location.protocol;

  // Check if host is a direct IP address (e.g. 192.168.1.1 or 123.45.67.89)
  const isIPAddress = (hostStr: string) => {
    const ip = hostStr.split(':')[0];
    return /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(ip);
  };

  // Generate URL based on selected target (supports both subdomains and direct IP/port configurations)
  const getMenuUrl = (target: string | number) => {
    const host = window.location.host;
    
    if (isIPAddress(host)) {
      // IP address fallback (uses query params instead of subdomains)
      const baseUrl = `${protocol}//${host}/menu?tenant=${tenant.subdomain}`;
      if (target === "general" || !target) {
        return baseUrl;
      }
      return `${baseUrl}&table=${target}`;
    } else {
      // Standard subdomain configuration
      const baseUrl = `${protocol}//${tenant.subdomain}.${baseDomain}/menu`;
      if (target === "general" || !target) {
        return baseUrl;
      }
      return `${baseUrl}?table=${target}`;
    }
  };

  const currentUrl = getMenuUrl(selectedTarget);

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  const [qrUrls, setQrUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    const generateAllQrs = async () => {
      const urls: Record<string, string> = {};
      try {
        // Generate general QR
        const genUrl = getMenuUrl("general");
        urls["general"] = await QRCode.toDataURL(genUrl, {
          margin: 1,
          width: 250,
          color: {
            dark: "#0f172a",
            light: "#ffffff"
          }
        });

        // Generate WiFi QR if Wi-Fi details exist
        if (tenant.wifiName || tenant.wifiPassword) {
          const ssid = tenant.wifiName || tenant.nameAr;
          const pass = tenant.wifiPassword || "";
          const type = pass ? "WPA" : "nopass";
          const wifiString = `WIFI:S:${ssid};T:${type};P:${pass};;`;
          urls["wifi"] = await QRCode.toDataURL(wifiString, {
            margin: 1,
            width: 250,
            color: {
              dark: "#047857", // emerald-700
              light: "#ffffff"
            }
          });
        }

        // Generate QRs for all tables
        for (const t of tables) {
          const tblUrl = getMenuUrl(t.tableNumber);
          urls[t.tableNumber.toString()] = await QRCode.toDataURL(tblUrl, {
            margin: 1,
            width: 250,
            color: {
              dark: "#0f172a",
              light: "#ffffff"
            }
          });
        }
        setQrUrls(urls);
      } catch (err) {
        console.error("Failed to generate QR codes:", err);
      }
    };

    generateAllQrs();
  }, [tables, tenant.subdomain, baseDomain, protocol, tenant.wifiName, tenant.wifiPassword]);

  // Helper to render a high-contrast real QR code representing the URL
  const renderSVGQR = (targetStr: string | number, size = 220) => {
    const dataUrl = qrUrls[targetStr.toString()];
    if (!dataUrl) {
      return (
        <div 
          style={{ width: size, height: size }} 
          className="mx-auto flex items-center justify-center bg-slate-50 border rounded-2xl animate-pulse text-xs text-slate-400"
        >
          جاري التوليد...
        </div>
      );
    }

    return (
      <div className="relative inline-block bg-white p-3 rounded-2xl shadow-md border border-slate-100 mx-auto">
        <img 
          src={dataUrl} 
          width={size} 
          height={size} 
          alt={`QR for ${targetStr}`}
          className="mx-auto block"
        />
        {/* Center Logo Overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-10 h-10 rounded-xl bg-white shadow-md border border-slate-100 flex items-center justify-center text-xl overflow-hidden">
            <RestaurantLogo logo={tenant.logo} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200" dir="rtl">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header (Hidden in print) */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 print:hidden">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${theme.primaryBg} flex items-center justify-center text-xl font-bold shadow-sm`}>
              <QrCode className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <span>مركز باركود الـ QR وستاندات الطاولات</span>
                <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full font-sans font-bold">
                  SaaS Menu QR
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                {tenant.nameAr} — جاهز للطباعة والنشر المباشر للزبائن
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Controls Toolbar (Hidden in print) */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
          
          {/* Target Selector: General vs Table */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-bold text-slate-600 shrink-0">تخصيص الباركود:</span>
            <select
              value={selectedTarget}
              onChange={(e) => setSelectedTarget(e.target.value === "general" ? "general" : Number(e.target.value))}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-white border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-56 shadow-2xs"
            >
              <option value="general">🌐 المنيو العام (طلب خارجي / سفري / سفري)</option>
              {tables.map((t) => (
                <option key={t.id} value={t.tableNumber}>
                  🪑 طاولة رقم {t.tableNumber} ({t.capacity} أشخاص)
                </option>
              ))}
            </select>
          </div>

          {/* Switch View Mode: Single vs All Grid */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => setViewMode(viewMode === "single" ? "all_grid" : "single")}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                viewMode === "all_grid"
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                  : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>{viewMode === "single" ? "عرض جميع الطاولات للطباعة" : "عرض ستاند فردي"}</span>
            </button>

            <button
              onClick={handlePrint}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all shadow-sm ${theme.primaryBg} ${theme.primaryHover}`}
            >
              <Printer className="w-4 h-4" />
              <span>طباعة الستاند الآن</span>
            </button>
          </div>
        </div>

        {/* Modal Body / Print Preview Area */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-100 print:bg-white print:p-0">
          
          {/* MODE 1: SINGLE STAND PREVIEW */}
          {viewMode === "single" && (
            <div className="max-w-sm mx-auto space-y-4">
              
              {/* ACRYLIC STAND CARD */}
              <div className="bg-white rounded-[24px] p-5 text-center border-2 border-slate-200 shadow-xl relative overflow-hidden print:border-2 print:shadow-none print:w-full print:max-w-none">
                
                {/* Top decorative accent */}
                <div className={`absolute top-0 left-0 right-0 h-3 ${theme.primaryBg}`} />
                
                {/* Restaurant Brand Header */}
                <div className="pt-1 space-y-1">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 text-2xl flex items-center justify-center mx-auto shadow-sm overflow-hidden">
                    <RestaurantLogo logo={tenant.logo} />
                  </div>
                  <h1 className="text-lg font-black text-slate-900 tracking-tight">
                    {tenant.nameAr}
                  </h1>
                  <p className="text-[10px] text-slate-500 font-medium">
                    {tenant.slogan || "أشهى المأكولات والمشروبات الطازجة"}
                  </p>
                </div>

                {/* Table Badge if Table Selected */}
                <div className="my-2.5">
                  {selectedTarget === "general" ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black bg-slate-100 text-slate-800 border border-slate-200">
                      <Globe className="w-3 h-3 text-indigo-600" />
                      <span>قائمة الطعام الرقمية التفاعلية</span>
                    </span>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-black bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-2xs">
                      <Utensils className="w-3.5 h-3.5" />
                      <span>🪑 طاولة رقم {selectedTarget}</span>
                    </div>
                  )}
                </div>

                {/* Call to Action Text */}
                <div className="my-2 text-slate-800 font-bold text-xs bg-slate-50 py-1.5 px-3 rounded-xl border border-slate-100/60">
                  📲 امسح الباركود لطلب الطعام مباشرة من جوالك!
                </div>

                {/* QR CODES VISUAL */}
                <div className="my-4 flex items-center justify-center gap-5 flex-wrap">
                  <div className="text-center space-y-1">
                    {renderSVGQR(selectedTarget, 150)}
                    <span className="text-[9px] font-black text-slate-500 block">📲 باركود المنيو والطلب</span>
                  </div>

                  {(tenant.wifiName || tenant.wifiPassword) && qrUrls["wifi"] && (
                    <div className="text-center space-y-1">
                      <div className="relative inline-block bg-white p-2.5 rounded-2xl shadow-md border border-slate-100 mx-auto">
                        <img 
                          src={qrUrls["wifi"]} 
                          width={150} 
                          height={150} 
                          alt="WiFi QR"
                          className="mx-auto block"
                        />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-8 h-8 rounded-lg bg-emerald-50 shadow-md border border-emerald-100 flex items-center justify-center text-emerald-600">
                            <Wifi className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                      <span className="text-[9px] font-black text-emerald-700 block">📶 اتصل بالواي فاي تلقائياً</span>
                    </div>
                  )}
                </div>

                {/* Footer Info: WiFi & URL */}
                <div className="space-y-2 pt-2 border-t border-slate-100 text-[10px]">
                  {(tenant.wifiName || tenant.wifiPassword) && (
                    <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 px-3 py-1 rounded-lg border border-emerald-200/60 font-mono font-bold">
                      <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                      <span>WiFi: <strong className="text-emerald-900">{tenant.wifiName || tenant.nameAr}</strong> {tenant.wifiPassword && <>| Pass: <strong className="text-emerald-900">{tenant.wifiPassword}</strong></>}</span>
                    </div>
                  )}
                  
                  <div className="text-[10px] font-mono text-slate-400 truncate dir-ltr">
                    {currentUrl}
                  </div>

                  <div className="text-[9px] text-slate-400 font-medium pt-0.5">
                    امسح باركود الواي فاي للاتصال التلقائي بالشبكة فوراً
                  </div>
                </div>
              </div>

              {/* 3D Acrylic Stand Base Mockup */}
              <div className="w-48 h-3.5 bg-slate-800 dark:bg-slate-700 rounded-b-xl mx-auto shadow-md transform -translate-y-4 relative z-10 border-t border-slate-900" />

              {/* ACTION TOOLBAR UNDER CARD (Hidden in print) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 print:hidden">
                <button
                  onClick={() => handleCopyUrl(currentUrl)}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs border border-slate-300 shadow-sm transition-all"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-700">تم نسخ رابط المنيو بنجاح!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-slate-600" />
                      <span>نسخ رابط المنيو ({selectedTarget === "general" ? "عام" : `طاولة ${selectedTarget}`})</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleDownload}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-all"
                >
                  {downloaded ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-300">تم تجهيز تحميل الصورة!</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 text-slate-300" />
                      <span>تحميل صورة ستاند QR للطباعة</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          )}

          {/* MODE 2: ALL TABLES GRID FOR BATCH PRINTING */}
          {viewMode === "all_grid" && (
            <div className="space-y-6">
              <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-2xl text-indigo-900 text-xs font-bold flex items-center justify-between print:hidden">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                  <span>عرض جماعي لجميع الطاولات ({tables.length} طاولات) + المنيو العام — جاهز للطباعة على ورق A4 أو كروت طاولة!</span>
                </div>
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm"
                >
                  🖨️ طباعة جميع الكروت
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 print:grid-cols-2 print:gap-4">
                
                {/* General Menu Card */}
                <div className="bg-white rounded-2xl p-5 text-center border-2 border-slate-200 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-slate-100 text-2xl flex items-center justify-center mx-auto mb-2 border overflow-hidden">
                      <RestaurantLogo logo={tenant.logo} />
                    </div>
                    <h3 className="font-black text-slate-900 text-base">{tenant.nameAr}</h3>
                    <span className="inline-block mt-1 px-3 py-1 bg-slate-100 text-slate-800 text-xs font-bold rounded-full border">
                      🌐 المنيو العام (سفري)
                    </span>
                    <p className="text-[11px] text-slate-500 mt-2">امسح الباركود لطلب الطعام مباشرة</p>
                  </div>
                  <div className="my-3 flex items-center justify-center gap-4 flex-wrap">
                    <div className="text-center">
                      {renderSVGQR("general", 120)}
                      <span className="text-[8px] font-black text-slate-400 block mt-1">📲 باركود المنيو</span>
                    </div>
                    {(tenant.wifiName || tenant.wifiPassword) && qrUrls["wifi"] && (
                      <div className="text-center">
                        <div className="relative inline-block bg-white p-2 rounded-xl shadow-sm border border-slate-100 mx-auto">
                          <img 
                            src={qrUrls["wifi"]} 
                            width={120} 
                            height={120} 
                            alt="WiFi QR"
                            className="mx-auto block"
                          />
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-6 h-6 rounded-md bg-emerald-50 shadow-sm border border-emerald-100 flex items-center justify-center text-emerald-600">
                              <Wifi className="w-3.5 h-3.5" />
                            </div>
                          </div>
                        </div>
                        <span className="text-[8px] font-black text-emerald-700 block mt-1">📶 اتصل بالواي فاي</span>
                      </div>
                    )}
                  </div>
                  <div className="text-[9px] font-mono text-slate-400 truncate">
                    {getMenuUrl("general")}
                  </div>
                </div>

                {/* Table Cards */}
                {tables.map((t) => (
                  <div key={t.id} className="bg-white rounded-2xl p-5 text-center border-2 border-slate-200 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="w-12 h-12 rounded-xl bg-slate-100 text-2xl flex items-center justify-center mx-auto mb-2 border overflow-hidden">
                        <RestaurantLogo logo={tenant.logo} />
                      </div>
                      <h3 className="font-black text-slate-900 text-base">{tenant.nameAr}</h3>
                      <span className="inline-block mt-1 px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-black rounded-full border border-indigo-200">
                        🪑 طاولة رقم {t.tableNumber} (Table {t.tableNumber})
                      </span>
                      <p className="text-[11px] text-slate-500 mt-2">امسح لطلب الطعام من الطاولة مباشرة</p>
                    </div>
                    <div className="my-3 flex items-center justify-center gap-4 flex-wrap">
                      <div className="text-center">
                        {renderSVGQR(t.tableNumber, 120)}
                        <span className="text-[8px] font-black text-slate-400 block mt-1">📲 باركود المنيو</span>
                      </div>
                      {(tenant.wifiName || tenant.wifiPassword) && qrUrls["wifi"] && (
                        <div className="text-center">
                          <div className="relative inline-block bg-white p-2 rounded-xl shadow-sm border border-slate-100 mx-auto">
                            <img 
                              src={qrUrls["wifi"]} 
                              width={120} 
                              height={120} 
                              alt="WiFi QR"
                              className="mx-auto block"
                            />
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                              <div className="w-6 h-6 rounded-md bg-emerald-50 shadow-sm border border-emerald-100 flex items-center justify-center text-emerald-600">
                                <Wifi className="w-3.5 h-3.5" />
                              </div>
                            </div>
                          </div>
                          <span className="text-[8px] font-black text-emerald-700 block mt-1">📶 اتصل بالواي فاي</span>
                        </div>
                      )}
                    </div>
                    <div className="text-[9px] font-mono text-slate-400 truncate">
                      {getMenuUrl(t.tableNumber)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer (Hidden in print) */}
        <div className="p-4 bg-white border-t border-slate-200 text-center text-xs text-slate-500 flex items-center justify-between print:hidden">
          <span>نظام ريستو كلاود (RestoCloud) (RestoCloud) — باركود المنيو الرقمي الفوري</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors"
          >
            إغلاق النافذة
          </button>
        </div>

      </div>
    </div>
  );
};
