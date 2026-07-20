const fs = require("fs");
const file = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/TenantUsersView.tsx";

if (fs.existsSync(file)) {
  let content = fs.readFileSync(file, "utf8");

  // 1. Add translations for Arabic
  const arTarget = `    waiterLabel: "ويتر / مقدم طعام (Waiter)",
    workerLabel: "عامل / موظف (Worker)",`;
  const arReplacement = `    waiterLabel: "ويتر / مقدم طعام (Waiter)",
    workerLabel: "عامل / موظف (Worker)",
    deliveryLabel: "عامل توصيل / سائق (Delivery)",
    deliveries: "عمال التوصيل",`;
  content = content.replace(arTarget, arReplacement);

  // Add translations for English
  const enTarget = `    waiterLabel: "Waiter / Server (Waiter)",
    workerLabel: "Worker / Employee (Worker)",`;
  const enReplacement = `    waiterLabel: "Waiter / Server (Waiter)",
    workerLabel: "Worker / Employee (Worker)",
    deliveryLabel: "Delivery Driver (Delivery)",
    deliveries: "Delivery Drivers",`;
  content = content.replace(enTarget, enReplacement);

  // Add translations for Turkish
  const trTarget = `    waiterLabel: "Garson / Servis Elemanı (Waiter)",
    workerLabel: "İşçi / Çalışan (Worker)",`;
  const trReplacement = `    waiterLabel: "Garson / Servis Elemanı (Waiter)",
    workerLabel: "İşçi / Çalışan (Worker)",
    deliveryLabel: "Kurye / Sürücü (Delivery)",
    deliveries: "Kuryeler",`;
  content = content.replace(trTarget, trReplacement);

  // 2. Add case "delivery" in getRoleBadge
  const badgeTarget = `      case "worker":
        return <span className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded-lg text-xs font-bold border border-slate-300 flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {usersTranslations[lang].workerLabel}</span>;`;
  const badgeReplacement = `      case "worker":
        return <span className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded-lg text-xs font-bold border border-slate-300 flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {usersTranslations[lang].workerLabel}</span>;
      case "delivery":
        return <span className="px-2.5 py-1 bg-sky-100 text-sky-800 rounded-lg text-xs font-bold border border-sky-300 flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {usersTranslations[lang].deliveryLabel}</span>;`;
  content = content.replace(badgeTarget, badgeReplacement);

  // 3. Add delivery to the select options
  const optionTarget = `                    <option value="worker">Worker</option>`;
  // Since worker has dynamic text: <option value="worker">👷 {usersTranslations[lang].workerLabel}</option>
  // Let's match:
  const optionTarget2 = `<option value="worker">👷 {usersTranslations[lang].workerLabel}</option>`;
  const optionReplacement2 = `<option value="worker">👷 {usersTranslations[lang].workerLabel}</option>
                    <option value="delivery">🛵 {usersTranslations[lang].deliveryLabel}</option>`;
  content = content.replace(optionTarget2, optionReplacement2);

  // 4. Update the statistics layout cards:
  // Change grid-cols-4 or grid-cols-2 lg:grid-cols-4 to grid-cols-2 md:grid-cols-5
  const gridTarget = `        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">`;
  const gridReplacement = `        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">`;
  content = content.replace(gridTarget, gridReplacement);

  // Add the delivery driver count card after waiter card
  const countCardTarget = `          <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm flex items-center gap-3">
            <div className="w-11 h-11 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center text-xl">🍽️</div>
            <div>
              <div className="text-xs text-slate-400 font-bold">{usersTranslations[lang].waiters}</div>
              <div className="text-lg font-black text-slate-800 font-sans">
                {users.filter(u => u.role === "waiter").length} {usersTranslations[lang].usersUnit}
              </div>
            </div>
          </div>`;

  const countCardReplacement = countCardTarget + `\n          <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm flex items-center gap-3">
            <div className="w-11 h-11 bg-sky-50 text-sky-600 rounded-xl flex items-center justify-center text-xl">🛵</div>
            <div>
              <div className="text-xs text-slate-400 font-bold">{usersTranslations[lang].deliveries}</div>
              <div className="text-lg font-black text-slate-800 font-sans">
                {users.filter(u => u.role === "delivery").length} {usersTranslations[lang].usersUnit}
              </div>
            </div>
          </div>`;

  content = content.replace(countCardTarget, countCardReplacement);

  fs.writeFileSync(file, content, "utf8");
  console.log("Successfully added delivery role configurations to TenantUsersView.tsx!");
} else {
  console.log("File not found!");
}
