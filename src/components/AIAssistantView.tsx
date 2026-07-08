import React, { useState, useEffect } from "react";
import { Tenant, AIAnalysisResponse } from "../types";
import { getThemeClasses } from "../utils/theme";
import { 
  Sparkles, 
  TrendingUp, 
  DollarSign, 
  Flame, 
  Lightbulb, 
  CheckCircle2, 
  RefreshCw, 
  ArrowUpRight, 
  Store, 
  Bot, 
  Award, 
  AlertCircle
} from "lucide-react";

interface AIAssistantViewProps {
  tenant: Tenant;
}

export const AIAssistantView: React.FC<AIAssistantViewProps> = ({ tenant }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [analysis, setAnalysis] = useState<AIAnalysisResponse | null>(null);
  const [error, setError] = useState<string>("");

  const theme = getThemeClasses(tenant.themeColor);

  const fetchAIAnalysis = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/ai/analyze-menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenantId: tenant.id })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "فشل في جلب التحليل الذكي");
      setAnalysis(data);
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء التواصل مع محرك Gemini AI");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAIAnalysis();
  }, [tenant.id]);

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300" dir="rtl">
      
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white p-8 sm:p-10 shadow-2xl border border-purple-500/30">
        <div className="absolute top-0 left-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -translate-x-1/2"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none translate-x-1/3"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs font-semibold">
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>مدعوم بمحرك Google Gemini Pro AI</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              المساعد الذكي لمطعم <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-purple-300">{tenant.nameAr}</span>
            </h1>
            <p className="text-purple-200 text-sm sm:text-base leading-relaxed">
              يقوم الذكاء الاصطناعي بتحليل المبيعات الحية في نقطة البيع (POS)، وتكاليف المكونات (Cost Price)، واقتراح وجبات كومبو لزيادة متوسط قيمة الفاتورة وهامش الربح.
            </p>
          </div>

          <button
            onClick={fetchAIAnalysis}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-purple-500 hover:from-amber-500 hover:to-purple-600 text-slate-950 font-black shadow-xl shadow-purple-500/30 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 shrink-0 self-start md:self-center"
          >
            {loading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>جاري التحليل...</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-5 h-5" />
                <span>تحديث التحليل الذكي الآن</span>
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 rounded-2xl border border-rose-200 dark:border-rose-800 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-16 text-center border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto animate-bounce shadow-inner">
            <Bot className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-extrabold text-slate-800 dark:text-slate-200">
            يقوم المستشار الذكي بمراجعة مبيعات وقائمة طعام ({tenant.nameAr})...
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            يتم حساب أسعار التكلفة، معدل إشغال الطاولات، وتصميم استراتيجيات تسعير لرفع هوامش الربح اليومية.
          </p>
        </div>
      ) : analysis ? (
        <div className="space-y-6">
          
          {/* Key Insights Tile Grid */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
              <span>استنتاجات الأداء وهوامش الربح (Strategic Insights)</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {analysis.insights.map((ins, i) => (
                <div key={i} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2 flex flex-col justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-black text-xs flex items-center justify-center">
                      #{i + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-400 uppercase">مؤشر أداء</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
                    {ins}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Actionable Suggestions */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              <span>اقتراحات استراتيجية لزيادة قيمة الفاتورة (Growth Combos)</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {analysis.suggestions.map((sug, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform">
                        💡
                      </div>
                      <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 text-xs font-black px-2.5 py-1 rounded-full border border-emerald-500/20 shrink-0">
                        {sug.estimatedProfitBoost}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {sug.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {sug.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold text-purple-600 dark:text-purple-400">
                    <span>تطبيق في لوحة الكاشير</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Advice Box */}
          <div className="bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-indigo-500/10 rounded-3xl p-6 border border-amber-500/30 flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 text-2xl shadow-md">
              💰
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">نصيحة الخبير لتسعير المكونات وضبط الهدر:</h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {analysis.pricingAdvice}
              </p>
            </div>
          </div>

        </div>
      ) : null}
    </div>
  );
};
