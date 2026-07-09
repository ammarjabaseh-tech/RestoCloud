import React, { useState, useEffect } from "react";
import { Tenant } from "../types";
import { 
  Database, 
  Server, 
  Copy, 
  Check, 
  Download, 
  Terminal, 
  ShieldCheck, 
  Code2, 
  Layers, 
  Cpu, 
  CheckCircle2,
  ExternalLink,
  HelpCircle
} from "lucide-react";

interface PostgreSQLExportViewProps {
  tenant: Tenant;
}

export const PostgreSQLExportView: React.FC<PostgreSQLExportViewProps> = ({ tenant }) => {
  const [sqlContent, setSqlContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    fetch("/api/export/postgresql")
      .then((res) => res.text())
      .then((text) => {
        setSqlContent(text);
        setLoading(false);
      })
      .catch(() => {
        setSqlContent("-- تعذر تحميل السكربت، تأكد من تشغيل الخادم");
        setLoading(false);
      });
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(sqlContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleDownload = () => {
    const blob = new Blob([sqlContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sufra-cloud-db-migration-${new Date().toISOString().split("T")[0]}.sql`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300 pb-16" dir="rtl">
      
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-zinc-900 to-amber-950 text-white p-8 sm:p-10 shadow-2xl border border-amber-500/30">
        <div className="absolute top-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -translate-x-1/2"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-semibold">
              <Database className="w-4 h-4" />
              <span>جاهزية التشغيل على سيرفرات خاصة (Self-Hosted VPS Ready)</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              تصدير قاعدة بيانات <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">PostgreSQL</span> وسكربتات التثبيت
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              تم تصميم هيكلية ريستو كلاود (RestoCloud) بكود نظيف ومعزول (SaaS Multi-Tenant Schema) يدعم العلاقات والجداول في PostgreSQL مع دعم النطاقات الفرعية وديمومة البيانات. يمكنك تحميل السكربت الكامل وتشغيله على أي سيرفر Linux VPS خاص.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0 self-start md:self-center">
            <button
              onClick={handleCopy}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700 transition-all shadow-md"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? "تم النسخ للحافظة!" : "نسخ السكربت (SQL)"}</span>
            </button>

            <button
              onClick={handleDownload}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-black text-sm shadow-xl shadow-amber-600/30 transition-all transform hover:-translate-y-0.5"
            >
              <Download className="w-4 h-4" />
              <span>تحميل ملف migration.sql</span>
            </button>
          </div>
        </div>
      </div>

      {/* Architecture Schema Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            01
          </div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">جدول المستأجرين (tenants)</h3>
          <p className="text-xs text-slate-500">مفتاح أساسي، معرف النطاق الفرعي (subdomain)، الهوية البصرية، وإعدادات الضريبة.</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            02
          </div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">جدول الأقسام (categories)</h3>
          <p className="text-xs text-slate-500">مرتبط بمعرف المستأجر (tenant_id) مع ترتيب الظهور والأيقونات.</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
            03
          </div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">جدول الأطباق (menu_items)</h3>
          <p className="text-xs text-slate-500">الأسعار، التكلفة، السعرات، وحالة التوفر (is_available) مع الفهرسة.</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
            04
          </div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">الفواتير (orders - JSONB)</h3>
          <p className="text-xs text-slate-500">تخزين أصناف الفاتورة كـ JSONB لمرونة نقطة البيع وحساب الضريبة والخصم.</p>
        </div>
      </div>

      {/* VPS Deployment Step-by-Step Guide */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Terminal className="w-5 h-5 text-emerald-600" />
            <span>دليل التثبيت والتشغيل على سيرفر VPS (Linux Ubuntu / Debian)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">خطوات نشر النظام لاحقاً على سيرفرك الخاص (مثل DigitalOcean أو AWS أو Linode) باستخدام Nginx & PM2</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold">
              <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-xs">1</span>
              <span>تجهيز قاعدة البيانات (PostgreSQL)</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              قم بتثبيت PostgreSQL على السيرفر وتنفيذ ملف <code className="bg-slate-200 dark:bg-slate-700 px-1 rounded">migration.sql</code> لإنشاء الجداول وإدراج البيانات الأولية للمستأجرين.
            </p>
            <div className="bg-slate-900 text-emerald-400 p-3 rounded-xl font-mono text-[11px]" dir="ltr">
              psql -U postgres -d sufra_db &lt; migration.sql
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold">
              <span className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-xs">2</span>
              <span>بناء التطبيق (Next.js & Express)</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              قم بتحميل حزم Node.js ثم بناء نسخة الإنتاج عبر أمر <code className="bg-slate-200 dark:bg-slate-700 px-1 rounded">npm run build</code> وتشغيل الخادم عبر مدير العمليات PM2.
            </p>
            <div className="bg-slate-900 text-amber-400 p-3 rounded-xl font-mono text-[11px]" dir="ltr">
              npm install && npm run build<br />
              pm2 start dist/server.cjs --name sufra
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold">
              <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-xs">3</span>
              <span>إعداد النطاقات الفرعية (Nginx Wildcard)</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              قم بضبط Nginx Reverse Proxy لاستقبال النطاقات الفرعية <code className="bg-slate-200 dark:bg-slate-700 px-1 rounded">*.restocloud.app</code> وتوجيهها للمنفذ 3000.
            </p>
            <div className="bg-slate-900 text-indigo-300 p-3 rounded-xl font-mono text-[11px]" dir="ltr">
              server_name *.restocloud.app;<br />
              proxy_pass http://localhost:3000;
            </div>
          </div>
        </div>
      </div>

      {/* SQL Code Box */}
      <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-2xl space-y-4 text-left font-mono" dir="ltr">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-sans">
            <Code2 className="w-4 h-4 text-amber-400" />
            <span>PostgreSQL DDL & Seed Migration Script (migration.sql)</span>
          </div>
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-sans flex items-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied" : "Copy SQL"}</span>
          </button>
        </div>

        <div className="max-h-[500px] overflow-y-auto text-xs text-slate-300 leading-relaxed pr-2">
          {loading ? (
            <div className="py-12 text-center text-slate-500 font-sans">Generating PostgreSQL script...</div>
          ) : (
            <pre className="whitespace-pre-wrap">{sqlContent}</pre>
          )}
        </div>
      </div>

    </div>
  );
};
