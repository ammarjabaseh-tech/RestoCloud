const fs = require("fs");
const filePath = "c:/Users/ammar/OneDrive/Desktop/RestoCloud/src/components/POSDashboardView.tsx";
let content = fs.readFileSync(filePath, "utf8");

// 1. Add activeNotifications state at line 336
const stateHook = `  const [activeNotifications, setActiveNotifications] = useState<{ id: string; message: string; type: "pending" | "ready" }[]>([]);

  React.useEffect(() => {
    if (activeNotifications.length > 0) {
      const timer = setTimeout(() => {
        setActiveNotifications(prev => prev.slice(1));
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [activeNotifications.length]);\n`;

content = content.replace(
  '  const [offlineQueueCount, setOfflineQueueCount] = useState<number>(0);',
  '  const [offlineQueueCount, setOfflineQueueCount] = useState<number>(0);\n' + stateHook
);

// 2. Add Audio synthesis helper functions & update order polling logic
const oldPollingEffect = `  // Silent polling of orders every 10 seconds for real-time mobile order receipt
  React.useEffect(() => {
    fetchHistoryOrders();
    const interval = setInterval(() => {
      fetch(\`/api/tenants/\${tenant.id}/orders\`)
        .then(res => res.json())
        .then(data => {
          setHistoryOrders(data);
        })
        .catch(err => console.error("Silent polling failed:", err));
    }, 10000);
    return () => clearInterval(interval);
  }, [tenant.id]);`;

const newPollingEffect = `  const playPendingOrderChime = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      
      // Chime 1
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(523.25, ctx.currentTime);
      gain1.gain.setValueAtTime(0.35, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      osc1.start(ctx.currentTime);
      osc1.stop(ctx.currentTime + 0.35);

      // Chime 2
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(659.25, ctx.currentTime + 0.15);
      gain2.gain.setValueAtTime(0, ctx.currentTime);
      gain2.gain.setValueAtTime(0.35, ctx.currentTime + 0.15);
      gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc2.start(ctx.currentTime + 0.15);
      osc2.stop(ctx.currentTime + 0.5);
    } catch (e) {
      console.warn("AudioContext pending chime blocked:", e);
    }
  };

  const playWaiterBellChime = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "triangle";
      osc.frequency.setValueAtTime(880.00, ctx.currentTime);
      gain.gain.setValueAtTime(0.45, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.85);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.85);
    } catch (e) {
      console.warn("AudioContext waiter chime blocked:", e);
    }
  };

  // Silent polling of orders every 10 seconds for real-time mobile order receipt & live alerts
  React.useEffect(() => {
    fetchHistoryOrders();
    const interval = setInterval(() => {
      fetch(\`/api/tenants/\${tenant.id}/orders\`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setHistoryOrders(prev => {
              const prevMap = new Map(prev.map(o => [o.id, o]));
              data.forEach(newOrder => {
                const oldOrder = prevMap.get(newOrder.id);
                // 1. New customer pending order placed
                if (!oldOrder && newOrder.orderStatus === "pending") {
                  const tblName = tables.find(t => t.id === newOrder.tableId)?.tableNumber || newOrder.tableId || "";
                  const msg = lang === 'ar'
                    ? \`🛎️ طلب جديد معلق من طاولة \${tblName} بانتظار موافقتك!\`
                    : \`🛎️ New pending order from Table \${tblName} needs approval!\`;
                  playPendingOrderChime();
                  setActiveNotifications(n => [...n, { id: newOrder.id + "-pending", message: msg, type: "pending" }]);
                }
                // 2. Kitchen marks order as ready -> Notify Waiter
                if (oldOrder && oldOrder.orderStatus === "preparing" && newOrder.orderStatus === "ready") {
                  const tblName = tables.find(t => t.id === newOrder.tableId)?.tableNumber || newOrder.tableId || "";
                  const msg = lang === 'ar'
                    ? \`🍽️ طلب طاولة \${tblName} جاهز في المطبخ للتسليم!\`
                    : \`🍽️ Table \${tblName} order is ready for delivery!\`;
                  playWaiterBellChime();
                  setActiveNotifications(n => [...n, { id: newOrder.id + "-ready", message: msg, type: "ready" }]);
                }
              });
              return data;
            });
          }
        })
        .catch(err => console.error("Silent polling failed:", err));
    }, 10000);
    return () => clearInterval(interval);
  }, [tenant.id, tables, lang]);`;

content = content.replace(oldPollingEffect, newPollingEffect);

// 3. Make ready table card flash in the main tables tab grid
const oldTableGridButton = `                    className={\`p-4 rounded-3xl border text-center transition-all flex flex-col items-center justify-center gap-2 cursor-pointer hover:scale-102 hover:shadow-xs \${
                      statusStyles[t.status] || "bg-slate-50 text-slate-700 border-slate-200"
                    }\`}`;

const newTableGridButton = `                    className={\`p-4 rounded-3xl border text-center transition-all flex flex-col items-center justify-center gap-2 cursor-pointer hover:scale-102 hover:shadow-xs \${
                      historyOrders.some(o => (o.tableId === t.id || o.tableId === t.tableNumber) && o.orderStatus === "ready")
                        ? "bg-emerald-50 border-emerald-400 dark:bg-emerald-950/20 dark:border-emerald-850 animate-pulse ring-4 ring-emerald-550/20 text-emerald-800 dark:text-emerald-400 font-extrabold"
                        : statusStyles[t.status] || "bg-slate-50 text-slate-700 border-slate-200"
                    }\`}`;

content = content.replace(oldTableGridButton, newTableGridButton);

// 4. Render Toast notification banner at the bottom before closing </div>
const closingDiv = `</div>\n  );\n};\n`;
const toastMarkup = `      {/* Floating Toast Notifications */}
      <div className="fixed bottom-6 left-6 z-[9999] space-y-3 max-w-sm w-full pointer-events-none" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        {activeNotifications.map((notif) => (
          <div
            key={notif.id}
            className={\`p-4 rounded-2xl border shadow-xl flex items-center justify-between gap-3 pointer-events-auto animate-in slide-in-from-left-8 duration-300 \${
              notif.type === "pending"
                ? "bg-indigo-650 border-indigo-500 shadow-indigo-600/20 text-white"
                : "bg-emerald-650 border-emerald-500 shadow-emerald-600/20 text-white"
            }\`}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-lg shrink-0">{notif.type === "pending" ? "🛎️" : "🍽️"}</span>
              <p className="text-xs font-bold leading-relaxed">{notif.message}</p>
            </div>
            <button
              onClick={() => setActiveNotifications(prev => prev.filter(n => n.id !== notif.id))}
              className="text-white/60 hover:text-white text-xs shrink-0 cursor-pointer font-bold px-1"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

</div>\n  );\n};\n`;

content = content.replace(closingDiv, toastMarkup);

fs.writeFileSync(filePath, content, "utf8");
console.log("Successfully integrated real-time customer and waiter notifications into POSDashboardView!");
