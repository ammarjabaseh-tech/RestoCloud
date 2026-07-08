import React, { useState } from "react";
import { Lock, Mail, ShieldAlert } from "lucide-react";

interface SuperAdminLoginProps {
  onLoginSuccess: () => void;
}

/**
 * Super Admin Login Page (URL: /sa)
 */
export default function SuperAdminLogin({ onLoginSuccess }: SuperAdminLoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("الرجاء إدخال البريد الإلكتروني وكلمة المرور");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "البريد الإلكتروني أو كلمة المرور غير صحيحة");
      }
      if (data.isSuperAdmin) {
        onLoginSuccess();
      } else {
        throw new Error("هذا الحساب ليس لديه صلاحيات سوبر أدمن");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 font-sans p-4" dir="rtl">
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/60 p-8 shadow-2xl backdrop-blur-xl relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-xl shadow-indigo-500/10 mb-4">
            <ShieldAlert className="w-9 h-9" />
          </div>
          <h2 className="text-2xl font-bold text-slate-100">دخول السوبر أدمن</h2>
          <p className="text-xs text-slate-400 mt-2">لوحة التحكم المركزية لسفرة كلاود</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2">البريد الإلكتروني</label>
            <div className="relative">
              <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-500">
                <Mail className="w-5 h-5" />
              </span>
              <input
                type="text"
                placeholder="sa أو admin@sufra.cloud"
                className="w-full rounded-xl border border-slate-800 bg-slate-950/40 py-3 pr-10 pl-4 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2">كلمة المرور</label>
            <div className="relative">
              <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-500">
                <Lock className="w-5 h-5" />
              </span>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-800 bg-slate-950/40 py-3 pr-10 pl-4 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-indigo-600 py-3 font-bold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 transition-colors cursor-pointer mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "جاري التحقق..." : "تسجيل الدخول الآمن"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-[10px] text-slate-500">
            تنبيه: هذه الصفحة مخصصة لمدراء النظام فقط.
          </p>
        </div>
      </div>
    </div>
  );
}
