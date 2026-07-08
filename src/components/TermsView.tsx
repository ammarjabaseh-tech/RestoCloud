import React from "react";
import { ActivePortalView } from "../types";
import { ArrowRight, FileText, Shield, Scale } from "lucide-react";

interface TermsViewProps {
  onSelectView: (view: ActivePortalView) => void;
}

export const TermsView: React.FC<TermsViewProps> = ({ onSelectView }) => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-500/30" dir="rtl">
      
      {/* Header */}
      <header className="bg-slate-900 py-12 px-6 border-b border-slate-800">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-white mb-6">
            <Scale className="w-8 h-8 text-indigo-400" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-4">شروط الاستخدام وسياسة الخصوصية</h1>
          <p className="text-slate-400">آخر تحديث: يوليو 2026</p>
          
          <button
            onClick={() => onSelectView('landing_page')}
            className="mt-8 flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-white/10 text-white font-bold hover:bg-white/20 transition-colors text-sm"
          >
            <ArrowRight className="w-4 h-4" /> العودة للصفحة الرئيسية
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-16 text-slate-700 leading-loose">
        <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-sm border border-slate-200">
          
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-indigo-600" />
              <h2 className="text-2xl font-black text-slate-900">1. مقدمة</h2>
            </div>
            <p className="mb-4">
              مرحباً بك في منصة <strong>سفرة كلاود (Sufra Cloud)</strong>. باستخدامك لهذه المنصة، فإنك توافق على الامتثال والالتزام بشروط الاستخدام الماثلة. تُطبق هذه الشروط على جميع المستخدمين، بما في ذلك أصحاب المطاعم، ومديري الفروع، والموظفين، والزبائن الذين يستخدمون المنصة لطلب الطعام.
            </p>
          </section>

          <section className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-indigo-600" />
              <h2 className="text-2xl font-black text-slate-900">2. البيانات والخصوصية</h2>
            </div>
            <p className="mb-4">
              نحن نأخذ خصوصية بياناتك على محمل الجد. يتم تخزين جميع البيانات على خوادم سحابية آمنة (VPS) ومعزولة لكل مستأجر (Tenant Isolation).
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-600 font-medium mr-4">
              <li>نحن لا نشارك مبيعاتك أو بيانات زبائنك مع أي طرف ثالث.</li>
              <li>جميع الاتصالات مشفرة باستخدام بروتوكول HTTPS/SSL.</li>
              <li>المنصة متوافقة مع متطلبات الخصوصية والتشريعات المحلية، بما فيها الفاتورة الإلكترونية.</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-black text-slate-900 mb-4">3. الفاتورة الإلكترونية (ZATCA)</h2>
            <p className="mb-4">
              كمزود لبرنامج نقاط البيع (POS)، تلتزم سفرة كلاود بتوفير الأدوات اللازمة لإصدار فواتير إلكترونية متوافقة مع المرحلة الأولى (FATOORA). تقع مسؤولية إدخال الرقم الضريبي الصحيح واسم المنشأة التجاري بدقة على عاتق المشترك (صاحب المطعم).
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-black text-slate-900 mb-4">4. الاشتراكات والمدفوعات</h2>
            <p className="mb-4">
              الاشتراكات تُدفع مقدماً بناءً على الباقة المختارة (البداية أو الاحترافية). في حال عدم السداد بعد فترة السماح (5 أيام)، يحق لإدارة المنصة تعليق الحساب مؤقتاً حتى تتم التسوية. لا يوجد استرداد نقدي للمبالغ المدفوعة عن الفترات المستخدمة جزئياً.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-black text-slate-900 mb-4">5. الذكاء الاصطناعي (AI)</h2>
            <p className="mb-4">
              توفر المنصة ميزات مساعدة تعتمد على الذكاء الاصطناعي (Gemini) لكتابة الوصف الجذاب وتحليل المبيعات. هذه الاقتراحات هي إرشادية وتعتمد على خوارزميات إحصائية؛ ينبغي على الإدارة مراجعتها قبل الاعتماد عليها في اتخاذ قرارات مصيرية أو تغيير الأسعار.
            </p>
          </section>

        </div>
      </main>

    </div>
  );
};
