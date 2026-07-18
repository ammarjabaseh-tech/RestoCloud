const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/AdminPanelView.tsx";
let content = fs.readFileSync(filePath, "utf8");

// We want to replace standard wrappers of inputs to be flex flex-col items-start so they align to the right in RTL
// Let's do this for Card 1 first (around lines 1018-1115)
content = content.replace(
  '<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">\n                  <div>',
  '<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">\n                  <div className="flex flex-col items-start">'
);
content = content.replace(
  '</div>\n\n                  <div>\n                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-0.5">{lang === \'ar\' ? \'شعار المطعم / نوع المطبخ (Slogan)\'',
  '</div>\n\n                  <div className="flex flex-col items-start">\n                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-0.5">{lang === \'ar\' ? \'شعار المطعم / نوع المطبخ (Slogan)\''
);

content = content.replace(
  '</div>\n\n                  <div>\n                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-0.5">{lang === \'ar\' ? \'رقم الهاتف (الواتساب المستلم للطلبات)\'',
  '</div>\n\n                  <div className="flex flex-col items-start">\n                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-0.5">{lang === \'ar\' ? \'رقم الهاتف (الواتساب المستلم للطلبات)\''
);

content = content.replace(
  '</div>\n\n                  <div>\n                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-0.5">{lang === \'ar\' ? \'العنوان وموقع الفرع\'',
  '</div>\n\n                  <div className="flex flex-col items-start">\n                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-0.5">{lang === \'ar\' ? \'العنوان وموقع الفرع\''
);

// Card 2: Financial & WiFi Settings (around lines 1121-1212)
content = content.replace(
  '<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">\n                  <div>\n                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-0.5">{lang === \'ar\' ? \'نسبة الضريبة المضافة (VAT %)\'',
  '<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">\n                  <div className="flex flex-col items-start">\n                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-0.5">{lang === \'ar\' ? \'نسبة الضريبة المضافة (VAT %)\''
);

content = content.replace(
  '</div>\n\n                  <div>\n                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-0.5">{lang === \'ar\' ? \'البلد والعملة الرسمية\'',
  '</div>\n\n                  <div className="flex flex-col items-start">\n                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-0.5">{lang === \'ar\' ? \'البلد والعملة الرسمية\''
);

content = content.replace(
  '</div>\n\n                  <div>\n                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-0.5">{lang === \'ar\' ? \'اسم شبكة الواي فاي (WiFi SSID)\'',
  '</div>\n\n                  <div className="flex flex-col items-start">\n                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-0.5">{lang === \'ar\' ? \'اسم شبكة الواي فاي (WiFi SSID)\''
);

content = content.replace(
  '</div>\n\n                  <div>\n                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-0.5">{lang === \'ar\' ? \'كلمة مرور واي فاي المطعم\'',
  '</div>\n\n                  <div className="flex flex-col items-start">\n                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-0.5">{lang === \'ar\' ? \'كلمة مرور واي فاي المطعم\''
);

// Card 3: Social Media Profiles (around lines 1214-1285)
content = content.replace(
  '<div className="grid grid-cols-1 md:grid-cols-2 gap-4">\n                  <div>\n                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-0.5 flex items-center gap-1.5">\n                      <Facebook className="w-3.5 h-3.5 text-blue-600" />',
  '<div className="grid grid-cols-1 md:grid-cols-2 gap-4">\n                  <div className="flex flex-col items-start">\n                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-0.5 flex items-center gap-1.5">\n                      <Facebook className="w-3.5 h-3.5 text-blue-600" />'
);

content = content.replace(
  '</div>\n\n                  <div>\n                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-0.5 flex items-center gap-1.5">\n                      <Instagram className="w-3.5 h-3.5 text-pink-600" />',
  '</div>\n\n                  <div className="flex flex-col items-start">\n                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-0.5 flex items-center gap-1.5">\n                      <Instagram className="w-3.5 h-3.5 text-pink-600" />'
);

content = content.replace(
  '</div>\n\n                  <div>\n                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-0.5 flex items-center gap-1.5">\n                      <svg className="w-3.5 h-3.5 text-slate-950 dark:text-white fill-current"',
  '</div>\n\n                  <div className="flex flex-col items-start">\n                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-0.5 flex items-center gap-1.5">\n                      <svg className="w-3.5 h-3.5 text-slate-950 dark:text-white fill-current"'
);

content = content.replace(
  '</div>\n\n                  <div>\n                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-0.5 flex items-center gap-1.5">\n                      <span className="w-3.5 h-3.5 flex items-center justify-center text-xs">📍</span>',
  '</div>\n\n                  <div className="flex flex-col items-start">\n                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-0.5 flex items-center gap-1.5">\n                      <span className="w-3.5 h-3.5 flex items-center justify-center text-xs">📍</span>'
);

// Card 5: Logo
content = content.replace(
  '<div className="space-y-3">\n                  <div>\n                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-0.5">{lang === \'ar\' ? \'كتابة رمز/حروف شعار مخصص (مثال: ✨ أو KF)\'',
  '<div className="space-y-3">\n                  <div className="flex flex-col items-start">\n                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-0.5">{lang === \'ar\' ? \'كتابة رمز/حروف شعار مخصص (مثال: ✨ أو KF)\''
);

content = content.replace(
  '</div>\n\n                  <div>\n                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-0.5">{lang === \'ar\' ? \'أو ارفع صورة الشعار الخاص بمطعمك\'',
  '</div>\n\n                  <div className="flex flex-col items-start">\n                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-0.5">{lang === \'ar\' ? \'أو ارفع صورة الشعار الخاص بمطعمك\''
);

content = content.replace(
  '</div>\n\n                  <div>\n                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-0.5">{lang === \'ar\' ? \'أو اختر سريعاً من الرموز الجاهزة:\'',
  '</div>\n\n                  <div className="flex flex-col items-start">\n                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-0.5">{lang === \'ar\' ? \'أو اختر سريعاً من الرموز الجاهزة:\''
);

fs.writeFileSync(filePath, content, "utf8");
console.log("Successfully aligned all input fields to the start (right in RTL)!");
