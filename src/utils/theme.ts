import { ThemeColor } from "../types";

export interface ThemeClasses {
  primaryBg: string;
  primaryHover: string;
  primaryText: string;
  primaryBorder: string;
  primaryLightBg: string;
  badgeBg: string;
  gradientFrom: string;
  ringColor: string;
}

export function getThemeClasses(theme: ThemeColor = "emerald"): ThemeClasses {
  switch (theme) {
    case "amber":
      return {
        primaryBg: "bg-amber-600",
        primaryHover: "hover:bg-amber-700",
        primaryText: "text-amber-600",
        primaryBorder: "border-amber-600",
        primaryLightBg: "bg-amber-50 text-amber-700 border border-amber-200",
        badgeBg: "bg-amber-100 text-amber-800 rounded-full font-medium",
        gradientFrom: "from-amber-600 to-orange-600",
        ringColor: "focus:ring-amber-500"
      };
    case "rose":
      return {
        primaryBg: "bg-rose-600",
        primaryHover: "hover:bg-rose-700",
        primaryText: "text-rose-600",
        primaryBorder: "border-rose-600",
        primaryLightBg: "bg-rose-50 text-rose-700 border border-rose-200",
        badgeBg: "bg-rose-100 text-rose-800 rounded-full font-medium",
        gradientFrom: "from-rose-600 to-pink-600",
        ringColor: "focus:ring-rose-500"
      };
    case "indigo":
      return {
        primaryBg: "bg-indigo-600",
        primaryHover: "hover:bg-indigo-700",
        primaryText: "text-indigo-600",
        primaryBorder: "border-indigo-600",
        primaryLightBg: "bg-indigo-50 text-indigo-700 border border-indigo-200",
        badgeBg: "bg-indigo-100 text-indigo-800 rounded-full font-medium",
        gradientFrom: "from-indigo-600 to-purple-600",
        ringColor: "focus:ring-indigo-500"
      };
    case "violet":
      return {
        primaryBg: "bg-violet-600",
        primaryHover: "hover:bg-violet-700",
        primaryText: "text-violet-600",
        primaryBorder: "border-violet-600",
        primaryLightBg: "bg-violet-50 text-violet-700 border border-violet-200",
        badgeBg: "bg-violet-100 text-violet-800 rounded-full font-medium",
        gradientFrom: "from-violet-600 to-fuchsia-600",
        ringColor: "focus:ring-violet-500"
      };
    case "slate":
      return {
        primaryBg: "bg-slate-800",
        primaryHover: "hover:bg-slate-900",
        primaryText: "text-slate-800",
        primaryBorder: "border-slate-800",
        primaryLightBg: "bg-slate-100 text-slate-800 border border-slate-200",
        badgeBg: "bg-slate-200 text-slate-800 rounded-full font-medium",
        gradientFrom: "from-slate-800 to-zinc-700",
        ringColor: "focus:ring-slate-500"
      };
    case "cyan":
      return {
        primaryBg: "bg-cyan-600",
        primaryHover: "hover:bg-cyan-700",
        primaryText: "text-cyan-600",
        primaryBorder: "border-cyan-600",
        primaryLightBg: "bg-cyan-50 text-cyan-700 border border-cyan-200",
        badgeBg: "bg-cyan-100 text-cyan-800 rounded-full font-medium",
        gradientFrom: "from-cyan-600 to-teal-600",
        ringColor: "focus:ring-cyan-500"
      };
    case "orange":
      return {
        primaryBg: "bg-orange-600",
        primaryHover: "hover:bg-orange-700",
        primaryText: "text-orange-600",
        primaryBorder: "border-orange-600",
        primaryLightBg: "bg-orange-50 text-orange-700 border border-orange-200",
        badgeBg: "bg-orange-100 text-orange-800 rounded-full font-medium",
        gradientFrom: "from-orange-600 to-red-600",
        ringColor: "focus:ring-orange-500"
      };
    case "emerald":
    default:
      return {
        primaryBg: "bg-emerald-600",
        primaryHover: "hover:bg-emerald-700",
        primaryText: "text-emerald-600",
        primaryBorder: "border-emerald-600",
        primaryLightBg: "bg-emerald-50 text-emerald-700 border border-emerald-200",
        badgeBg: "bg-emerald-100 text-emerald-800 rounded-full font-medium",
        gradientFrom: "from-emerald-600 to-teal-600",
        ringColor: "focus:ring-emerald-500"
      };
  }
}
