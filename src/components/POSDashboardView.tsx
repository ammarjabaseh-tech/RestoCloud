import React, { useState, useMemo } from "react";
import { Tenant, Category, MenuItem, RestaurantTable, OrderItem, OrderType, PaymentMethod, Order, Printer } from "../types";
import { getThemeClasses } from "../utils/theme";
import { RestaurantLogo } from "./RestaurantLogo";
import confetti from "canvas-confetti";
import { 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  ShoppingCart, 
  CreditCard, 
  Banknote, 
  Clock, 
  Printer as PrinterIcon, 
  CheckCircle2, 
  UtensilsCrossed, 
  ShoppingBag, 
  Bike, 
  Sparkles, 
  Receipt, 
  AlertCircle,
  X,
  User,
  Phone,
  MapPin,
  RefreshCw,
  History,
  Bell,
  WifiOff
} from "lucide-react";
const posTranslations = {
  ar: {
    cancelConfirm: "هل أنت متأكد من رفض وإلغاء هذا الطلب؟",
    clearCartConfirm: "هل أنت متأكد من مسح جميع الأصناف من السلة؟",
    selectTableAlert: "يرجى تحديد رقم الطاولة للطلب الداخلي",
    dineInLabel: "طاولة رقم",
    takeawayLabel: "عميل سفري",
    deliveryLabel: "توصيل",
    generalCashier: "الكاشير العام",
    reviewInvoice: "الكاشير العام (فاتورة مراجعة)",
    posTitle: "نقطة البيع والكاشير (POS)",
    trialAlert: "⏳ تجريبي: متبقي",
    days: "يوم",
    activeCashier: "كاشير نشط",
    newSale: "🛒 كاشير (بيع جديد)",
    ordersList: "📋 قائمة طلبات المطعم",
    invoiceHistory: "سجل الفواتير (طباعة)",
    searchPlaceholder: "ابحث عن وجبة...",
    cartTitle: "سلة المشتريات (الفاتورة)",
    totalItems: "إجمالي الأصناف",
    clearBtn: "مسح",
    dineIn: "طاولات",
    takeaway: "سفري",
    delivery: "توصيل",
    selectTable: "اختر الطاولة:",
    tablesAvailable: "طاولات متاحة",
    table: "طاولة",
    customerNamePlaceholder: "اسم العميل (اختياري)",
    phonePlaceholder: "رقم الهاتف",
    addressPlaceholder: "عنوان التوصيل بالتفصيل *",
    subtotal: "المجموع الفرعي:",
    vat: "ضريبة القيمة المضافة",
    discount: "الخصم:",
    totalRequired: "الإجمالي المطلوب:",
    paymentMethod: "طريقة الدفع:",
    cash: "كاش (نقدي)",
    card: "شبكة / بطاقة",
    deferred: "آجل (معلق)",
    draftInvoice: "فاتورة مبدئية",
    holdInvoice: "تعليق",
    completing: "جاري الإتمام...",
    completeAndPrint: "إتمام وطباعة",
    activeOrders: "الطلبات النشطة",
    pendingOrders: "بانتظار الموافقة",
    preparingOrders: "تحت التحضير",
    readyOrders: "جاهز للتسليم",
    archivedOrders: "المؤرشفة (المنتهية)",
    ordersSearchPlaceholder: "ابحث برقم الطلب أو اسم الزبون...",
    orderStatusPending: "معلق (موافقة)",
    orderStatusPreparing: "في المطبخ",
    orderStatusReady: "جاهز للتسليم",
    orderStatusDelivered: "تم التسليم",
    orderStatusCancelled: "ملغي",
    orderNote: "💡 ملاحظة:",
    finalTotal: "الإجمالي النهائي",
    cancelOrder: "رفض وإلغاء الطلب",
    approveBtn: "موافقة",
    printKitchen: "طباعة إيصال المطبخ",
    readyBtn: "جاهز",
    printInvoice: "طباعة الفاتورة",
    deliveredBtn: "تم التسليم",
    reprintBtn: "إعادة طباعة",
    noOrdersTitle: "لا توجد طلبات في هذا القسم حالياً",
    noOrdersDesc: "ستظهر الطلبات الحية والنشطة هنا بمجرد وصولها لتسهيل إدارتها.",
    printPreviewTitle: "معاينة الفاتورة للطباعة",
    printPreviewDraftTitle: "معاينة الفاتورة المبدئية",
    printerLabel: "الطابعة:",
    closeAndNew: "إغلاق وطلب جديد",
    printReceiptBtn: "طباعة الإيصال (🖨️)",
    historyTitle: "سجل فواتير وطلبات المطعم (إعادة الطباعة)",
    historyDesc: "اختر الفاتورة لعرض الإيصال وطباعته فوراً عبر المتصفح",
    issuedInvoices: "فواتير المطعم الصادرة",
    pendingMobileOrders: "طلبات الجوال المعلقة (QR)",
    historySearchPlaceholder: "ابحث برقم الفاتورة، اسم العميل...",
    refreshBtn: "تحديث الفواتير",
    loadingHistory: "جاري تحميل سجل الفواتير...",
    noMatchingInvoices: "لا توجد فواتير أو طلبات معلقة مطابقة",
    noMatchingInvoicesDesc: "ستظهر هنا فواتير المطعم أو طلبات الكاستمر القادمة من المنيو الرقمي",
    cashPayment: "نقدي (Cash)",
    cardPayment: "بطاقة",
    pendingPayment: "انتظار الموافقة",
    deferredPayment: "آجل",
    declineOrder: "رفض الطلب",
    approveAndPrepare: "موافق وتحضير",
    closeBtn: "إغلاق"
  },
  en: {
    cancelConfirm: "Are you sure you want to decline and cancel this order?",
    clearCartConfirm: "Are you sure you want to clear all items from the cart?",
    selectTableAlert: "Please select a table number for dine-in orders",
    dineInLabel: "Table No.",
    takeawayLabel: "Takeaway Customer",
    deliveryLabel: "Delivery",
    generalCashier: "General Cashier",
    reviewInvoice: "General Cashier (Draft Invoice)",
    posTitle: "Point of Sale & Cashier (POS)",
    trialAlert: "⏳ Trial:",
    days: "days left",
    activeCashier: "Active Cashier",
    newSale: "🛒 Cashier (New Sale)",
    ordersList: "📋 Active Restaurant Orders",
    invoiceHistory: "Invoice History (Print)",
    searchPlaceholder: "Search for a meal...",
    cartTitle: "Shopping Cart (Receipt)",
    totalItems: "Total Items",
    clearBtn: "Clear",
    dineIn: "Dine In",
    takeaway: "Takeaway",
    delivery: "Delivery",
    selectTable: "Select Table:",
    tablesAvailable: "tables available",
    table: "Table",
    customerNamePlaceholder: "Customer Name (Optional)",
    phonePlaceholder: "Phone Number",
    addressPlaceholder: "Detailed Delivery Address *",
    subtotal: "Subtotal:",
    vat: "VAT",
    discount: "Discount:",
    totalRequired: "Total Amount:",
    paymentMethod: "Payment Method:",
    cash: "Cash",
    card: "Card / POS Terminal",
    deferred: "Deferred (Pending)",
    draftInvoice: "Draft Receipt",
    holdInvoice: "Hold",
    completing: "Completing...",
    completeAndPrint: "Pay & Print",
    activeOrders: "Active Orders",
    pendingOrders: "Pending Approval",
    preparingOrders: "Preparing",
    readyOrders: "Ready",
    archivedOrders: "Archived (Done)",
    ordersSearchPlaceholder: "Search by order no. or customer name...",
    orderStatusPending: "Pending Approval",
    orderStatusPreparing: "In Kitchen",
    orderStatusReady: "Ready for Pickup",
    orderStatusDelivered: "Delivered",
    orderStatusCancelled: "Cancelled",
    orderNote: "💡 Note:",
    finalTotal: "Final Total",
    cancelOrder: "Reject & Cancel Order",
    approveBtn: "Approve",
    printKitchen: "Print Kitchen Ticket",
    readyBtn: "Ready",
    printInvoice: "Print Invoice",
    deliveredBtn: "Mark Delivered",
    reprintBtn: "Reprint",
    noOrdersTitle: "No orders in this section currently",
    noOrdersDesc: "Live and active orders will appear here once they arrive to make them easy to manage.",
    printPreviewTitle: "Invoice Print Preview",
    printPreviewDraftTitle: "Draft Invoice Preview",
    printerLabel: "Printer:",
    closeAndNew: "Close & New Order",
    printReceiptBtn: "Print Receipt (🖨️)",
    historyTitle: "Invoice History & Orders (Reprint)",
    historyDesc: "Select an invoice to display the receipt and print it via browser",
    issuedInvoices: "Issued Invoices",
    pendingMobileOrders: "Pending Mobile Orders (QR)",
    historySearchPlaceholder: "Search by invoice ID, customer...",
    refreshBtn: "Refresh Invoices",
    loadingHistory: "Loading invoice history...",
    noMatchingInvoices: "No matching invoices or pending orders",
    noMatchingInvoicesDesc: "Restaurant invoices or customer orders coming from the digital menu will appear here.",
    cashPayment: "Cash",
    cardPayment: "Card",
    pendingPayment: "Pending Approval",
    deferredPayment: "Deferred",
    declineOrder: "Decline Order",
    approveAndPrepare: "Approve & Prep",
    closeBtn: "Close"
  },
  tr: {
    cancelConfirm: "Bu siparişi reddetmek ve iptal etmek istediğinizden emin misiniz?",
    clearCartConfirm: "Sepetteki tüm ürünleri temizlemek istediğinizden emin misiniz?",
    selectTableAlert: "Lütfen masada servis için masa numarası seçin",
    dineInLabel: "Masa No.",
    takeawayLabel: "Gel-Al Müşterisi",
    deliveryLabel: "Paket Servis",
    generalCashier: "Genel Kasiyer",
    reviewInvoice: "Genel Kasiyer (Taslak Fatura)",
    posTitle: "Satış Noktası ve Kasiyer (POS)",
    trialAlert: "⏳ Deneme:",
    days: "gün kaldı",
    activeCashier: "Aktif Kasiyer",
    newSale: "🛒 Kasa (Yeni Satış)",
    ordersList: "📋 Aktif Restoran Siparişleri",
    invoiceHistory: "Fatura Geçmişi (Yazdır)",
    searchPlaceholder: "Bir yemek arayın...",
    cartTitle: "Alışveriş Sepeti (Fatura)",
    totalItems: "Toplam Ürün",
    clearBtn: "Temizle",
    dineIn: "Masada Servis",
    takeaway: "Gel-Al",
    delivery: "Paket Servis",
    selectTable: "Masa Seç:",
    tablesAvailable: "boş masa var",
    table: "Masa",
    customerNamePlaceholder: "Müşteri Adı (İsteğe bağlı)",
    phonePlaceholder: "Telefon Numarası",
    addressPlaceholder: "Detaylı Teslimat Adresi *",
    subtotal: "Ara Toplam:",
    vat: "KDV",
    discount: "İndirim:",
    totalRequired: "Toplam Tutar:",
    paymentMethod: "Ödeme Yöntemi:",
    cash: "Nakit",
    card: "Kart / POS Cihazı",
    deferred: "Veresiye (Beklemede)",
    draftInvoice: "Taslak Fiş",
    holdInvoice: "Beklet",
    completing: "Tamamlanıyor...",
    completeAndPrint: "Öde ve Yazdır",
    activeOrders: "Aktif Siparişler",
    pendingOrders: "Onay Bekleyenler",
    preparingOrders: "Hazırlanıyor",
    readyOrders: "Hazır",
    archivedOrders: "Arşivlendi (Bitti)",
    ordersSearchPlaceholder: "Sipariş no veya müşteri adıyla ara...",
    orderStatusPending: "Onay Bekliyor",
    orderStatusPreparing: "Mutfakta",
    orderStatusReady: "Teslime Hazır",
    orderStatusDelivered: "Teslim Edildi",
    orderStatusCancelled: "İptal Edildi",
    orderNote: "💡 Not:",
    finalTotal: "Genel Toplam",
    cancelOrder: "Siparişi İptal Et",
    approveBtn: "Onayla",
    printKitchen: "Mutfak Fişi Yazdır",
    readyBtn: "Hazır",
    printInvoice: "Fatura Yazdır",
    deliveredBtn: "Teslim Edildi",
    reprintBtn: "Tekrar Yazdır",
    noOrdersTitle: "Şu anda bu bölümde sipariş yok",
    noOrdersDesc: "Canlı ve aktif siparişler geldikçe burada görünecektir.",
    printPreviewTitle: "Fatura Önizleme",
    printPreviewDraftTitle: "Taslak Fatura Önizleme",
    printerLabel: "Yazıcı:",
    closeAndNew: "Kapat ve Yeni Sipariş",
    printReceiptBtn: "Fiş Yazdır (🖨️)",
    historyTitle: "Fatura Geçmişi ve Siparişler (Tekrar Yazdır)",
    historyDesc: "Fişi görüntülemek ve tarayıcıdan yazdırmak için fatura seçin",
    issuedInvoices: "Kesilen Faturalar",
    pendingMobileOrders: "Bekleyen Mobil Siparişler (QR)",
    historySearchPlaceholder: "Fatura ID veya müşteri adıyla ara...",
    refreshBtn: "Faturaları Yenile",
    loadingHistory: "Fatura geçmişi yükleniyor...",
    noMatchingInvoices: "Eşleşen fatura veya bekleyen sipariş yok",
    noMatchingInvoicesDesc: "Restoran faturaları veya dijital menüden gelen siparişler burada görünecektir.",
    cashPayment: "Nakit",
    cardPayment: "Kart",
    pendingPayment: "Onay Bekliyor",
    deferredPayment: "Veresiye",
    declineOrder: "Reddet",
    approveAndPrepare: "Onayla ve Hazırla",
    closeBtn: "Kapat"
  }
};

import { POSInvoiceReceipt } from "./POSInvoiceReceipt";

interface POSDashboardViewProps {
  tenant: Tenant;
  categories: Category[];
  items: MenuItem[];
  tables: RestaurantTable[];
  onOrderCreated: (order: Order) => void;
  onUpdateTableStatus: (tableId: string, status: any) => void;
  onUpdateTenant?: (tenant: Tenant) => void;
  lang?: 'ar' | 'en' | 'tr';
}

export const POSDashboardView: React.FC<POSDashboardViewProps> = ({
  tenant,
  categories,
  items,
  tables,
  onOrderCreated,
  onUpdateTableStatus,
  onUpdateTenant,
  lang = 'ar'
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [orderType, setOrderType] = useState<OrderType>("dine_in");
  const [selectedTable, setSelectedTable] = useState<number | undefined>(tables[0]?.tableNumber || 1);
  const [customerName, setCustomerName] = useState<string>("");
  const [customerPhone, setCustomerPhone] = useState<string>("");
  const [customerAddress, setCustomerAddress] = useState<string>("");
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [isDraftPrint, setIsDraftPrint] = useState<boolean>(false);
  const [showOrderHistoryModal, setShowOrderHistoryModal] = useState<boolean>(false);
  const [historyOrders, setHistoryOrders] = useState<Order[]>([]);
  const [historyLoading, setHistoryLoading] = useState<boolean>(false);
  const [historySearch, setHistorySearch] = useState<string>("");
  const [historyTab, setHistoryTab] = useState<"all" | "pending">("all");
  const [currentUser] = useState<TenantUser | null>(() => {
    const saved = localStorage.getItem("currentUser");
    return saved ? JSON.parse(saved) : null;
  });
  const [posMode, setPosMode] = useState<"sales" | "orders" | "tables">(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        if (u.role === "waiter") return "tables";
      } catch (e) {}
    }
    return "sales";
  });
  const [editingTableStatus, setEditingTableStatus] = useState<RestaurantTable | null>(null);
  const [posOrderTab, setPosOrderTab] = useState<"all" | "pending" | "preparing" | "ready" | "archived">("all");
  const [showMobileCart, setShowMobileCart] = useState<boolean>(false);
  const [offlineQueueCount, setOfflineQueueCount] = useState<number>(0);
  const [activeNotifications, setActiveNotifications] = useState<{ id: string; message: string; type: "pending" | "ready" }[]>([]);

  React.useEffect(() => {
    if (activeNotifications.length > 0) {
      const timer = setTimeout(() => {
        setActiveNotifications(prev => prev.slice(1));
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [activeNotifications.length]);


  React.useEffect(() => {
    if (cart.length === 0) {
      setShowMobileCart(false);
    }
  }, [cart.length]);

  const toggleRestaurantStatus = async () => {
    const updatedStatus = tenant.isOpen === false;
    const updated: Tenant = {
      ...tenant,
      isOpen: updatedStatus
    };
    try {
      const res = await fetch(`/api/tenants/${tenant.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated)
      });
      if (res.ok) {
        const data = await res.json();
        onUpdateTenant && onUpdateTenant(data);
      }
    } catch (err) {
      console.error("Failed to update restaurant status:", err);
    }
  };

  const syncOfflineOrders = async () => {
    const queue = JSON.parse(localStorage.getItem("offline_orders_queue") || "[]");
    if (queue.length === 0) {
      setOfflineQueueCount(0);
      return;
    }
    
    setOfflineQueueCount(queue.length);
    console.log(`[Offline Sync] Found ${queue.length} offline orders to sync.`);
    
    let successCount = 0;
    const remainingQueue = [];
    
    for (const order of queue) {
      try {
        const res = await fetch(`/api/tenants/${tenant.id}/orders`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderType: order.orderType,
            tableNumber: order.tableNumber,
            customerName: order.customerName,
            customerPhone: order.customerPhone,
            customerAddress: order.customerAddress,
            items: order.items,
            subtotal: order.subtotal,
            taxAmount: order.taxAmount,
            discountAmount: order.discountAmount,
            total: order.total,
            paymentMethod: order.paymentMethod,
            paymentStatus: order.paymentStatus,
            cashierName: order.cashierName || "Offline Cashier",
            createdAt: order.createdAt
          })
        });
        
        if (res.ok) {
          successCount++;
          const syncedOrder = await res.json();
          onOrderCreated(syncedOrder);
        } else {
          remainingQueue.push(order);
        }
      } catch (err) {
        console.error("[Offline Sync] Failed to sync order:", order.id, err);
        remainingQueue.push(order);
      }
    }
    
    localStorage.setItem("offline_orders_queue", JSON.stringify(remainingQueue));
    setOfflineQueueCount(remainingQueue.length);
    
    if (successCount > 0) {
      alert(lang === 'ar'
        ? `🟢 تم بنجاح مزامنة وإرسال (${successCount}) طلبات كانت محفوظة محلياً إلى السيرفر!`
        : `🟢 Successfully synced (${successCount}) offline orders to the server!`
      );
    }
  };

  React.useEffect(() => {
    const queue = JSON.parse(localStorage.getItem("offline_orders_queue") || "[]");
    setOfflineQueueCount(queue.length);

    if (navigator.onLine) {
      syncOfflineOrders();
    }

    const handleOnline = () => {
      syncOfflineOrders();
    };

    window.addEventListener("online", handleOnline);
    
    const interval = setInterval(() => {
      if (navigator.onLine) {
        syncOfflineOrders();
      }
    }, 30000);

    return () => {
      window.removeEventListener("online", handleOnline);
      clearInterval(interval);
    };
  }, [tenant.id]);

  const pendingSelfOrders = useMemo(() => {
    return historyOrders.filter(o => o.orderStatus === "pending");
  }, [historyOrders]);

  // Printers integration
  const [printers, setPrinters] = useState<Printer[]>([]);
  const [selectedPrinterId, setSelectedPrinterId] = useState<string>("");

  React.useEffect(() => {
    fetch(`/api/tenants/${tenant.id}/printers`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setPrinters(data);
          const defaultPrinter = data.find(p => p.printerRole === 'receipt' && p.isActive) || data[0];
          if (defaultPrinter) setSelectedPrinterId(defaultPrinter.id);
        }
      })
      .catch(err => console.error("Failed to load printers:", err));
  }, [tenant.id]);

  const handlePrintOrder = async (order: Order, printRole: 'receipt' | 'kitchen') => {
    if (!selectedPrinterId) {
      window.print();
      return;
    }
    const printer = printers.find(p => p.id === selectedPrinterId);
    if (!printer || printer.connectionType !== 'network') {
      window.print();
      return;
    }

    try {
      const res = await fetch(`/api/tenants/${tenant.id}/orders/${order.id}/print`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ printerId: printer.id, printRole })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert("✅ " + data.message);
      } else if (data.webPrintFallback) {
        window.print();
      } else {
        alert("❌ " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("❌ فشل الاتصال بالطابعة الشبكية، جاري التحويل لطباعة المتصفح...");
    }
  };

  const getTrialDaysLeft = () => {
    if (tenant.status !== 'trial') return null;
    const createdDate = new Date(tenant.createdAt || new Date());
    const trialEndDate = new Date(createdDate.getTime() + 14 * 24 * 60 * 60 * 1000);
    const diffTime = trialEndDate.getTime() - new Date().getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };


  const playPendingOrderChime = () => {
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
      fetch(`/api/tenants/${tenant.id}/orders`)
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
                    ? `🛎️ طلب جديد معلق من طاولة ${tblName} بانتظار موافقتك!`
                    : `🛎️ New pending order from Table ${tblName} needs approval!`;
                  playPendingOrderChime();
                  setActiveNotifications(n => [...n, { id: newOrder.id + "-pending", message: msg, type: "pending" }]);
                }
                // 2. Kitchen marks order as ready -> Notify Waiter
                if (oldOrder && oldOrder.orderStatus === "preparing" && newOrder.orderStatus === "ready") {
                  const tblName = tables.find(t => t.id === newOrder.tableId)?.tableNumber || newOrder.tableId || "";
                  const msg = lang === 'ar'
                    ? `🍽️ طلب طاولة ${tblName} جاهز في المطبخ للتسليم!`
                    : `🍽️ Table ${tblName} order is ready for delivery!`;
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
  }, [tenant.id, tables, lang]);

  const handleApproveOrder = async (orderId: string) => {
    try {
      const res = await fetch(`/api/tenants/${tenant.id}/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderStatus: "preparing" })
      });
      if (res.ok) {
        const updated = await res.json();
        setHistoryOrders(prev => prev.map(o => o.id === orderId ? updated : o));
        onOrderCreated(updated); // triggers cashier modal display/printing if needed
        
        // Success sound chime
        try {
          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
          const ctx = new AudioContextClass();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(523.25, ctx.currentTime);
          osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1);
          osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2);
          gain.gain.setValueAtTime(0.15, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.45);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.45);
        } catch (e) {}
      }
    } catch (e) {
      console.error("Failed to approve order:", e);
    }
  };

  const handleRejectOrder = async (orderId: string) => {
    if (!confirm(posTranslations[lang].cancelConfirm)) return;
    try {
      const res = await fetch(`/api/tenants/${tenant.id}/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderStatus: "cancelled" })
      });
      if (res.ok) {
        const updated = await res.json();
        setHistoryOrders(prev => prev.map(o => o.id === orderId ? updated : o));
      }
    } catch (e) {
      console.error("Failed to reject order:", e);
    }
  };

  const theme = getThemeClasses(tenant.themeColor);

  // Filter items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchCat = selectedCategory === "all" || item.categoryId === selectedCategory;
      const matchSearch = item.nameAr.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.descriptionAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (item.nameEn || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (item.nameTr || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (item.descriptionEn || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (item.descriptionTr || "").toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch && item.isAvailable;
    });
  }, [items, selectedCategory, searchQuery]);

  // Cart Calculations
  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  const taxRate = tenant.taxRate || 15;
  const taxAmount = useMemo(() => {
    return Number(((subtotal * taxRate) / 100).toFixed(2));
  }, [subtotal, taxRate]);

  const total = useMemo(() => {
    const calc = subtotal + taxAmount - discountAmount;
    return calc > 0 ? Number(calc.toFixed(2)) : 0;
  }, [subtotal, taxAmount, discountAmount]);

  // Cart Actions
  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.itemId === item.id);
      if (existing) {
        return prev.map((i) => (i.itemId === item.id ? { ...i, quantity: i.quantity + 1 } : i));
      } else {
        return [
          ...prev,
          {
            id: `oi-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            itemId: item.id,
            nameAr: item.nameAr,
            price: item.price,
            quantity: 1
          }
        ];
      }
    });
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((i) => {
          if (i.itemId === itemId) {
            const newQty = i.quantity + delta;
            return newQty > 0 ? { ...i, quantity: newQty } : null;
          }
          return i;
        })
        .filter(Boolean) as OrderItem[];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((i) => i.itemId !== itemId));
  };

  const updateNotes = (itemId: string, notes: string) => {
    setCart((prev) => prev.map((i) => (i.itemId === itemId ? { ...i, notes } : i)));
  };

  const clearCart = () => {
    if (cart.length === 0) return;
    if (confirm(posTranslations[lang].clearCartConfirm)) {
      setCart([]);
      setDiscountAmount(0);
    }
  };

  // Submit Order
  const handleCheckout = async (statusOverride?: 'paid' | 'pending') => {
    if (cart.length === 0) return;
    if (orderType === "dine_in" && !selectedTable) {
      alert(posTranslations[lang].selectTableAlert);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/tenants/${tenant.id}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderType,
          tableNumber: orderType === "dine_in" ? selectedTable : undefined,
          customerName: customerName || (orderType === "dine_in" ? `${posTranslations[lang].dineInLabel} ${selectedTable}` : posTranslations[lang].takeawayLabel),
          customerPhone,
          customerAddress: orderType === "delivery" ? customerAddress : undefined,
          items: cart,
          subtotal,
          taxAmount,
          discountAmount,
          total,
          paymentMethod: statusOverride === 'pending' ? 'pending' : paymentMethod,
          paymentStatus: statusOverride === 'pending' ? 'pending' : 'paid',
          cashierName: posTranslations[lang].generalCashier
        })
      });

      const newOrder = await res.json();
      if (!res.ok) throw new Error(newOrder.error || (lang === 'ar' ? "فشل في إتمام الطلب" : lang === 'tr' ? "Sipariş tamamlanamadı" : "Failed to place order"));

      // Trigger Confetti!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}

      onOrderCreated(newOrder);
      setCompletedOrder(newOrder);
      
      // Auto update table status to occupied if it was dine-in
      if (orderType === "dine_in" && selectedTable) {
        const tblObj = tables.find(t => t.tableNumber === selectedTable);
        if (tblObj) {
          onUpdateTableStatus(tblObj.id, "occupied");
        }
      }

      // Reset cart
      setCart([]);
      setCustomerName("");
      setCustomerPhone("");
      setCustomerAddress("");
      setDiscountAmount(0);

      // Redirect waiter to tables view
      if (currentUser?.role === 'waiter') {
        setPosMode("tables");
      }
    } catch (err: any) {
      console.error("Order submission error:", err);
      
      const isNetworkError = !navigator.onLine || 
                            err.message.includes("Failed to fetch") || 
                            err.message.includes("network error") || 
                            err.message.includes("NetworkError") ||
                            err.message.includes("Failed to execute 'fetch'");
                            
      if (isNetworkError) {
        const offlineId = `offline-${Date.now()}`;
        const offlineOrder = {
          id: offlineId,
          orderNumber: `OFF-${Math.floor(1000 + Math.random() * 9000)}`,
          orderType,
          tableNumber: orderType === "dine_in" ? selectedTable : undefined,
          customerName: customerName || (orderType === "dine_in" ? `${posTranslations[lang].dineInLabel} ${selectedTable}` : posTranslations[lang].takeawayLabel),
          customerPhone,
          customerAddress: orderType === "delivery" ? customerAddress : undefined,
          items: cart.map(i => ({
            ...i,
            itemId: i.itemId,
            nameAr: i.nameAr,
            price: Number(i.price),
            quantity: Number(i.quantity)
          })),
          subtotal,
          taxAmount,
          discountAmount,
          total,
          paymentMethod: statusOverride === 'pending' ? 'pending' : paymentMethod,
          paymentStatus: statusOverride === 'pending' ? 'pending' : 'paid',
          orderStatus: 'pending',
          createdAt: new Date().toISOString(),
          isOffline: true
        };

        const queue = JSON.parse(localStorage.getItem("offline_orders_queue") || "[]");
        queue.push(offlineOrder);
        localStorage.setItem("offline_orders_queue", JSON.stringify(queue));

        try {
          confetti({
            particleCount: 50,
            spread: 50,
            origin: { y: 0.6 }
          });
        } catch (e) {}

        onOrderCreated(offlineOrder as any);
        setCompletedOrder(offlineOrder as any);
        
        // Auto update table status to occupied if it was dine-in
        if (orderType === "dine_in" && selectedTable) {
          const tblObj = tables.find(t => t.tableNumber === selectedTable);
          if (tblObj) {
            onUpdateTableStatus(tblObj.id, "occupied");
          }
        }

        setCart([]);
        setDiscountAmount(0);
        setCustomerName("");
        setCustomerPhone("");
        setCustomerAddress("");
        
        setOfflineQueueCount(queue.length);

        // Redirect waiter to tables view
        if (currentUser?.role === 'waiter') {
          setPosMode("tables");
        }
        
        alert(lang === 'ar' 
          ? "🔴 انقطع الاتصال بالإنترنت! تم حفظ الفاتورة محلياً بنجاح وسنقوم بمزامنتها تلقائياً عند عودة الشبكة. يمكنك الاستمرار في العمل وطباعة الفاتورة."
          : "🔴 Connection offline! Order saved locally. It will sync automatically when connection returns. You can continue selling and printing receipts."
        );
        setIsSubmitting(false);
        return;
      }
      
      alert(err.message || (lang === 'ar' ? "حدث خطأ في الاتصال" : lang === 'tr' ? "Bağlantı hatası oluştu" : "Connection error occurred"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrintDraft = () => {
    if (cart.length === 0) {
      alert(lang === 'ar' ? "يرجى إضافة أصناف إلى السلة أولاً لطباعة الفاتورة المبدئية" : lang === 'tr' ? "Lütfen taslak fatura yazdırmak için önce sepete ürün ekleyin" : "Please add items to cart first to print draft invoice");
      return;
    }
    const draftOrder: Order = {
      id: `draft-${Date.now()}`,
      orderNumber: `#DRAFT-${Math.floor(1000 + Math.random() * 9000)}`,
      tenantId: tenant.id,
      orderType,
      tableNumber: orderType === "dine_in" ? selectedTable : undefined,
      customerName: customerName || (orderType === "dine_in" ? `${posTranslations[lang].dineInLabel} ${selectedTable}` : posTranslations[lang].takeawayLabel),
      customerPhone,
      customerAddress: orderType === "delivery" ? customerAddress : undefined,
      items: cart,
      subtotal,
      taxAmount,
      discountAmount,
      total,
      paymentMethod: paymentMethod,
      paymentStatus: "pending",
      orderStatus: "preparing",
      createdAt: new Date().toLocaleTimeString(lang === 'ar' ? 'ar-SA' : lang === 'tr' ? 'tr-TR' : 'en-US', { hour: '2-digit', minute: '2-digit' }),
      cashierName: posTranslations[lang].reviewInvoice
    };
    setIsDraftPrint(true);
    setCompletedOrder(draftOrder);
  };

  const fetchHistoryOrders = async () => {
    setHistoryLoading(true);
    try {
      const res = await fetch(`/api/tenants/${tenant.id}/orders`);
      if (res.ok) {
        const data = await res.json();
        setHistoryOrders(data);
      }
    } catch (e) {
      console.error("Failed to fetch orders:", e);
    } finally {
      setHistoryLoading(false);
    }
  };

  const renderCart = (isMobile = false) => {
    return (
      <div className={`flex flex-col h-full overflow-hidden ${isMobile ? 'bg-white' : ''}`}>
        {/* Cart Header */}
        <div className="p-4 bg-slate-100 text-slate-800 flex items-center justify-between border-b border-slate-200">
          <div className="flex items-center gap-2">
            {isMobile && (
              <button
                onClick={() => setShowMobileCart(false)}
                className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-slate-700 cursor-pointer ml-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <div className="w-8 h-8 rounded-lg bg-white text-indigo-600 border border-slate-200 flex items-center justify-center shadow-2xs">
              <ShoppingCart className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">{posTranslations[lang].cartTitle}</h3>
              <p className="text-[10px] text-slate-500">{posTranslations[lang].totalItems}: {cart.reduce((sum, i) => sum + i.quantity, 0)}</p>
            </div>
          </div>
          
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs text-rose-600 hover:text-rose-700 flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-rose-50 transition-colors font-bold border border-rose-200"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{posTranslations[lang].clearBtn}</span>
            </button>
          )}
        </div>
        {/* Order Type Selector Tabs */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 space-y-3">
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-200/70 rounded-xl">
            <button
              onClick={() => setOrderType("dine_in")}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all ${
                orderType === "dine_in"
                  ? `${theme.primaryBg} text-white shadow-sm`
                  : "text-slate-600 hover:bg-white/70"
              }`}
            >
              <UtensilsCrossed className="w-3.5 h-3.5" />
              <span>{posTranslations[lang].dineIn}</span>
            </button>

            <button
              onClick={() => setOrderType("takeaway")}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all ${
                orderType === "takeaway"
                  ? `${theme.primaryBg} text-white shadow-sm`
                  : "text-slate-600 hover:bg-white/70"
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{posTranslations[lang].takeaway}</span>
            </button>

            <button
              onClick={() => setOrderType("delivery")}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all ${
                orderType === "delivery"
                  ? `${theme.primaryBg} text-white shadow-sm`
                  : "text-slate-600 hover:bg-white/70"
              }`}
            >
              <Bike className="w-3.5 h-3.5" />
              <span>{posTranslations[lang].delivery}</span>
            </button>
          </div>

          {/* Conditional Inputs based on Order Type */}
          {orderType === "dine_in" ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span>{posTranslations[lang].selectTable}</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-sans">
                  {tables.filter(t => t.status === "available").length} {posTranslations[lang].tablesAvailable}
                </span>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                {tables.map((t) => {
                  const isOccupied = t.status === "occupied";
                  const isSelected = selectedTable === t.tableNumber;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTable(t.tableNumber)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold shrink-0 border transition-all flex items-center gap-1.5 ${
                        isSelected
                          ? "bg-emerald-600 text-white border-emerald-600 ring-2 ring-emerald-500/30"
                          : isOccupied
                          ? "bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800/60"
                          : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-emerald-500"
                      }`}
                    >
                      <span>{posTranslations[lang].table} {t.tableNumber}</span>
                      <span className={`w-2 h-2 rounded-full ${isOccupied ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder={posTranslations[lang].customerNamePlaceholder}
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-1 focus:ring-emerald-500 outline-none"
                />
                <input
                  type="text"
                  placeholder={posTranslations[lang].phonePlaceholder}
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-1 focus:ring-emerald-500 outline-none"
                />
              </div>
              {orderType === "delivery" && (
                <input
                  type="text"
                  placeholder={posTranslations[lang].addressPlaceholder}
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-1 focus:ring-emerald-500 outline-none"
                />
              )}
            </div>
          )}
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-slate-100 dark:divide-slate-800">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-3">
              <ShoppingCart className="w-12 h-12 stroke-1 text-slate-300 dark:text-slate-700" />
              <div>
                <p className="text-sm font-bold text-slate-600 dark:text-slate-300">
                  {lang === 'ar' ? 'السلة فارغة حالياً' : lang === 'tr' ? 'Sepetiniz boş' : 'Cart is empty'}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {lang === 'ar' ? 'اضغط على أي صنف من قائمة المنيو لإضافته هنا' : lang === 'tr' ? 'Eklemek için menüden bir ürüne tıklayın' : 'Click any item from the menu to add it here'}
                </p>
              </div>
            </div>
          ) : (
            cart.map((item) => {
              const menuItem = items.find(i => i.id === item.itemId);
              const itemName = menuItem 
                ? (lang === 'en' && menuItem.nameEn ? menuItem.nameEn : lang === 'tr' && menuItem.nameTr ? menuItem.nameTr : menuItem.nameAr)
                : item.nameAr;
              return (
                <div key={item.id} className="pt-3 first:pt-0 flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{itemName}</h4>
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                        {(item.price * item.quantity).toFixed(0)} {tenant.currency}
                      </span>
                    </div>
                    <p className={`text-[10px] text-slate-400 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{item.price} {tenant.currency} / {lang === 'ar' ? 'للصنف' : lang === 'tr' ? 'adet' : 'item'}</p>
                    <input
                      type="text"
                      placeholder={lang === 'ar' ? 'ملاحظات (بدون بصل، إكسترا صوص...)' : lang === 'tr' ? 'Notlar (soğansız, ekstra sos...)' : 'Notes (no onions, extra sauce...)'}
                      value={item.notes || ""}
                      onChange={(e) => updateNotes(item.itemId, e.target.value)}
                      className="w-full mt-1 px-2 py-0.5 text-[9px] rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Quantity Control Buttons */}
                  <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl shrink-0">
                    <button
                      onClick={() => updateQuantity(item.itemId, -1)}
                      className="w-6 h-6 rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-white flex items-center justify-center hover:bg-slate-200 transition-colors shadow-sm text-xs font-bold"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center font-bold text-xs text-slate-900 dark:text-white">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.itemId, 1)}
                      className={`w-6 h-6 rounded-lg ${theme.primaryBg} text-white flex items-center justify-center hover:opacity-90 transition-colors shadow-sm text-xs font-bold`}
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.itemId)}
                    className="text-slate-400 hover:text-rose-500 p-1 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Financial Footer & Payment */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 space-y-3">
          
          {/* Summary Breakdown */}
          <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex justify-between">
              <span>{posTranslations[lang].subtotal}</span>
              <span className="font-semibold">{subtotal.toFixed(2)} {tenant.currency}</span>
            </div>
            <div className="flex justify-between">
              <span>{posTranslations[lang].vat} ({taxRate}%):</span>
              <span className="font-semibold">{taxAmount.toFixed(2)} {tenant.currency}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>{posTranslations[lang].discount}</span>
              <div className="flex items-center gap-1 w-24">
                <input
                  type="number"
                  min="0"
                  max={subtotal}
                  value={discountAmount || ""}
                  onChange={(e) => setDiscountAmount(Number(e.target.value) || 0)}
                  placeholder="0"
                  className="w-full px-2 py-0.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-left font-mono text-xs outline-none"
                />
                <span className="text-[10px]">{tenant.currency}</span>
              </div>
            </div>
            <div className="flex justify-between text-sm font-black text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-700">
              <span>{posTranslations[lang].totalRequired}</span>
              <span className="text-base text-emerald-600 dark:text-emerald-400">{total.toFixed(2)} {tenant.currency}</span>
            </div>
          </div>

          {/* Payment Method Tabs */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400">{posTranslations[lang].paymentMethod}</label>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                onClick={() => setPaymentMethod("cash")}
                className={`flex items-center justify-center gap-1 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  paymentMethod === "cash"
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-emerald-500"
                }`}
              >
                <Banknote className="w-3.5 h-3.5" />
                <span>{posTranslations[lang].cash}</span>
              </button>

              <button
                onClick={() => setPaymentMethod("card")}
                className={`flex items-center justify-center gap-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                  paymentMethod === "card"
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-500"
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>{posTranslations[lang].card}</span>
              </button>

              <button
                onClick={() => setPaymentMethod("pending")}
                className={`flex items-center justify-center gap-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                  paymentMethod === "pending"
                    ? "bg-amber-600 text-white border-amber-600 shadow-md"
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-amber-500"
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>{posTranslations[lang].deferred}</span>
              </button>
            </div>
          </div>

          {/* Main Action Buttons */}
          <div className="grid grid-cols-12 gap-2 pt-1">
            <button
              onClick={handlePrintDraft}
              disabled={cart.length === 0 || isSubmitting}
              className="col-span-3 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs border border-slate-300 dark:border-slate-700 transition-colors flex flex-col sm:flex-row items-center justify-center gap-1 disabled:opacity-40"
              title={posTranslations[lang].draftInvoice}
            >
              <PrinterIcon className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              <span>{posTranslations[lang].draftInvoice}</span>
            </button>

            <button
              onClick={() => handleCheckout('pending')}
              disabled={cart.length === 0 || isSubmitting}
              className="col-span-3 py-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 font-bold text-xs transition-colors flex flex-col sm:flex-row items-center justify-center gap-1 disabled:opacity-40"
              title={currentUser?.role === 'waiter' ? (lang === 'ar' ? "إرسال للمطبخ" : "Send to Kitchen") : posTranslations[lang].holdInvoice}
            >
              <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>{currentUser?.role === 'waiter' ? (lang === 'ar' ? "إرسال للمطبخ" : "Send to Kitchen") : posTranslations[lang].holdInvoice}</span>
            </button>

            <button
              onClick={() => handleCheckout()}
              disabled={cart.length === 0 || isSubmitting}
              className={`col-span-6 py-3 rounded-xl ${theme.primaryBg} ${theme.primaryHover} text-white font-black text-xs sm:text-sm shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-1.5 disabled:opacity-40`}
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{posTranslations[lang].completing}</span>
                </>
              ) : (
                <>
                  <Receipt className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="truncate">
                    {currentUser?.role === "waiter" 
                      ? (lang === 'ar' ? 'تأكيد وإرسال الطلب' : 'Confirm & Send Order')
                      : `${posTranslations[lang].completeAndPrint} (${total.toFixed(0)} ${tenant.currency})`}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };


  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 animate-in fade-in duration-200" dir="rtl">
      
      {offlineQueueCount > 0 && (
        <div className="lg:col-span-12 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 p-4 rounded-3xl flex items-center justify-between gap-4 animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-3">
            <WifiOff className="w-5 h-5 text-rose-600 dark:text-rose-400 animate-pulse shrink-0" />
            <div>
              <p className="text-xs font-bold">
                {lang === 'ar' 
                  ? `أنت تعمل في وضع عدم الاتصال بالشبكة (Offline). لديك (${offlineQueueCount}) طلبات معلقة محفوظة محلياً.` 
                  : `You are working offline. You have (${offlineQueueCount}) cached orders pending sync.`
                }
              </p>
              <p className="text-[10px] opacity-80 mt-0.5">
                {lang === 'ar'
                  ? "سيتم إرسال الطلبات تلقائياً للسيرفر فور عودة الاتصال بالإنترنت. يمكنك الاستمرار في تسجيل الطلبات وطباعة الفواتير كالمعتاد."
                  : "Orders will sync to the server automatically once network connection is restored. You can keep taking and printing orders."
                }
              </p>
            </div>
          </div>
          <button 
            onClick={syncOfflineOrders}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-[10px] font-bold transition-all shadow-sm shrink-0 cursor-pointer"
          >
            {lang === 'ar' ? "مزامنة الآن" : "Sync Now"}
          </button>
        </div>
      )}

      {/* POS Top Header Bar (12 Cols) */}
      <div className="lg:col-span-12 bg-white p-3.5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-4 flex-1 justify-between md:justify-start">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center text-lg border border-slate-200 overflow-hidden">
                <RestaurantLogo logo={tenant.logo} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span>{posTranslations[lang].posTitle}</span>
                  {tenant.status === 'trial' && (
                    <span className="text-[10px] bg-amber-100 dark:bg-amber-950 text-amber-855 dark:text-amber-300 border border-amber-200 dark:border-amber-900 px-2.5 py-0.5 rounded-full animate-pulse font-bold">
                      {posTranslations[lang].trialAlert} {getTrialDaysLeft()} {posTranslations[lang].days}
                    </span>
                  )}
                </h2>
                <p className="text-[10px] text-slate-500">{lang === 'ar' ? tenant.nameAr : (tenant.nameEn || tenant.nameAr)} - {posTranslations[lang].activeCashier}</p>
              </div>
            </div>

            {/* Cashier Quick Restaurant Status Toggle */}
            {currentUser?.role !== "waiter" && (
              <div className="flex items-center gap-2 border-r border-slate-200 pr-3 mr-1 font-sans">
                <button
                  type="button"
                  onClick={toggleRestaurantStatus}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-extrabold flex items-center gap-1.5 transition-all shadow-3xs cursor-pointer border ${
                    tenant.isOpen !== false
                      ? "bg-emerald-50 text-emerald-700 border-emerald-250/70 hover:bg-emerald-100/70"
                      : "bg-rose-50 text-rose-700 border-rose-250/70 hover:bg-rose-100/70"
                  }`}
                  title={lang === 'ar' ? 'تغيير حالة استقبال الطلبات للمنيو' : 'Toggle online ordering status'}
                >
                  <span className={`w-2 h-2 rounded-full ${tenant.isOpen !== false ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                  <span>
                    {tenant.isOpen !== false
                      ? (lang === 'ar' ? 'المنيو: مفتوح' : lang === 'tr' ? 'Menü: Açık' : 'Menu: Open')
                      : (lang === 'ar' ? 'المنيو: مغلق' : lang === 'tr' ? 'Menü: Kapalı' : 'Menu: Closed')
                    }
                  </span>
                </button>
              </div>
            )}
          </div>

          {currentUser && (
            <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl overflow-x-auto border border-slate-200 no-scrollbar">
              <button
                onClick={() => setPosMode("sales")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  posMode === "sales"
                    ? `${theme.primaryBg} text-white shadow-sm font-bold`
                    : "text-slate-600 hover:bg-white/70"
                }`}
              >
                {posTranslations[lang].newSale}
              </button>
              <button
                onClick={() => {
                  setPosMode("orders");
                  fetchHistoryOrders();
                }}
                className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  posMode === "orders"
                    ? `${theme.primaryBg} text-white shadow-sm font-bold`
                    : "text-slate-600 hover:bg-white/70"
                }`}
              >
                <span>{posTranslations[lang].ordersList}</span>
                {pendingSelfOrders.length > 0 && (
                  <span className="absolute -top-1.5 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-black flex items-center justify-center animate-pulse">
                    {pendingSelfOrders.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setPosMode("tables")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  posMode === "tables"
                    ? `${theme.primaryBg} text-white shadow-sm font-bold`
                    : "text-slate-600 hover:bg-white/70"
                }`}
              >
                <span>{lang === 'ar' ? 'حالة الطاولات' : lang === 'tr' ? 'Masa Durumu' : 'Tables Status'}</span>
              </button>
            </div>
          )}

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {currentUser?.role !== "waiter" && (
                <button
                  onClick={() => {
                    fetchHistoryOrders();
                    setHistoryTab("all");
                    setShowOrderHistoryModal(true);
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] border border-slate-200 transition-colors whitespace-nowrap shadow-xs cursor-pointer"
                  title={posTranslations[lang].invoiceHistory}
                >
                  <History className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{posTranslations[lang].invoiceHistory}</span>
                  <span className="sm:hidden">{lang === 'ar' ? 'الفواتير' : lang === 'tr' ? 'Faturalar' : 'Invoices'}</span>
                </button>
              )}

              {posMode === "sales" && (
                <div className="relative w-full sm:w-48">
                  <Search className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder={posTranslations[lang].searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pr-8 pl-3 py-1.5 rounded-xl text-xs bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery("")}
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Categories horizontal tabs (sales only) */}
          {posMode === "sales" && (
            <div className="flex items-center gap-1 overflow-x-auto pb-1 border-t pt-3 border-slate-100 no-scrollbar">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-300 border shadow-3xs cursor-pointer ${
                  selectedCategory === "all"
                    ? `${theme.primaryBg} text-white border-transparent shadow-xs`
                    : "bg-white hover:bg-slate-50 text-slate-600 border-slate-200/80"
                }`}
              >
                <span>🔥</span>
                <span>{lang === 'ar' ? 'الكل' : lang === 'tr' ? 'Tümü' : 'All'} ({items.filter(i => i.isAvailable).length})</span>
              </button>

              {categories.map((cat) => {
                const count = items.filter((i) => i.categoryId === cat.id && i.isAvailable).length;
                const isSelected = selectedCategory === cat.id;
                const catName = lang === 'en' && cat.nameEn ? cat.nameEn : lang === 'tr' && cat.nameTr ? cat.nameTr : cat.nameAr;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-300 border shadow-3xs cursor-pointer ${
                      isSelected
                        ? `${theme.primaryBg} text-white border-transparent shadow-xs`
                        : "bg-white hover:bg-slate-50 text-slate-600 border-slate-200/80"
                    }`}
                  >
                    {cat.icon.startsWith("http") || cat.icon.startsWith("data:image") ? (
                      <img src={cat.icon} alt="" className="w-4.5 h-4.5 object-cover rounded shrink-0" />
                    ) : (
                      <span className="text-[10px] shrink-0">{cat.icon}</span>
                    )}
                    <span>{catName}</span>
                    <span className={`text-[8px] font-mono px-1 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

      {/* Right Column (8 Cols): Menu Grid (sales mode only) */}
      {posMode === "sales" && (
        <div className="lg:col-span-8 space-y-4 pos-menu-column animate-in fade-in duration-200">

        {/* Meal Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm space-y-3">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center text-3xl">
              🔍
            </div>
            <h3 className="text-sm font-bold text-slate-800">
              {lang === 'ar' ? 'لا توجد أصناف تطابق البحث' : lang === 'tr' ? 'Arama sonucu bulunamadı' : 'No items match search'}
            </h3>
            <p className="text-xs text-slate-500">
              {lang === 'ar' ? 'جرب البحث بكلمات أخرى أو اختر قسماً مختلفاً من المنيو' : lang === 'tr' ? 'Farklı kelimelerle aramayı deneyin veya başka kategori seçin' : 'Try searching with other keywords or choose another category'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2">
            {filteredItems.map((item) => {
              const inCartQty = cart.find((i) => i.itemId === item.id)?.quantity || 0;
              const itemName = lang === 'en' && item.nameEn ? item.nameEn : lang === 'tr' && item.nameTr ? item.nameTr : item.nameAr;
              const itemDesc = lang === 'en' && item.descriptionEn ? item.descriptionEn : lang === 'tr' && item.descriptionTr ? item.descriptionTr : item.descriptionAr;
              return (
                <div
                  key={item.id}
                  onClick={() => addToCart(item)}
                  className={`bg-white rounded-lg border transition-all duration-200 cursor-pointer overflow-hidden flex flex-col justify-between group hover:shadow-xs transform hover:-translate-y-0.5 ${
                    inCartQty > 0 
                      ? "border-indigo-500 ring-2 ring-indigo-500/10 bg-indigo-50/20" 
                      : "border-slate-200 hover:border-slate-300 shadow-3xs"
                  }`}
                >
                  {/* Image & Badges */}
                  <div className="relative h-14 w-full overflow-hidden bg-slate-50 border-b border-slate-100">
                    <img
                      src={item.image}
                      alt={itemName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent" />
                    
                    {item.isBestSeller && (
                      <span className={`absolute top-1 bg-amber-500 text-white text-[7px] font-black px-1.5 py-0.1 rounded-full shadow-sm flex items-center gap-0.5 ${lang === 'ar' ? 'right-1' : 'left-1'}`}>
                        <span>★</span>
                        <span>{lang === 'ar' ? 'مميز' : lang === 'tr' ? 'Popüler' : 'Featured'}</span>
                      </span>
                    )}

                    {inCartQty > 0 && (
                      <span className={`absolute top-1 ${lang === 'ar' ? 'left-1' : 'right-1'} ${theme.primaryBg} text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-sm animate-pulse`}>
                        {inCartQty}
                      </span>
                    )}
                  </div>

                  {/* Text Details & Price */}
                  <div className="p-1.5 flex-1 flex flex-col justify-between space-y-1">
                    <div className="space-y-0.5">
                      <h4 className="text-[10px] font-black text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-1">
                        {itemName}
                      </h4>
                      <p className="text-[8px] text-slate-400 line-clamp-1 leading-snug">
                        {itemDesc}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-50">
                      <span className="text-[10px] font-black text-slate-950">
                        {item.price} <span className="text-[8px] font-normal text-slate-400">{tenant.currency}</span>
                      </span>
                      <span className="text-[8px] font-medium text-slate-400 bg-slate-50 px-1 py-0.1 rounded border border-slate-100">
                        {item.preparationTimeMin || 15} {lang === 'ar' ? 'د' : lang === 'tr' ? 'dk' : 'min'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      )}


      {/* Left Column (4 Cols): Cart & POS Invoice Register */}
      {posMode === "sales" && (
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col h-[calc(100vh-180px)] sticky top-20 overflow-hidden pos-cart-column hidden lg:flex">
          {renderCart(false)}
        </div>
      )}

      {/* Live Orders Management Page (orders mode only) */}
      {posMode === "orders" && (
        <div className="lg:col-span-12 space-y-4 animate-in fade-in duration-200 pos-orders-dashboard">
          {/* Header tabs for statuses */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {(["all", "pending", "preparing", "ready", "archived"] as const).map(tab => {
                const count = tab === "all" 
                  ? historyOrders.filter(o => o.orderStatus !== "delivered" && o.orderStatus !== "cancelled").length
                  : tab === "archived"
                  ? historyOrders.filter(o => o.orderStatus === "delivered" || o.orderStatus === "cancelled").length
                  : historyOrders.filter(o => o.orderStatus === tab).length;
                  
                const label = 
                  tab === "all" ? "الطلبات النشطة" :
                  tab === "pending" ? "بانتظار الموافقة" :
                  tab === "preparing" ? "تحت التحضير" :
                  tab === "ready" ? "جاهز للتسليم" : "المؤرشفة (المنتهية)";
                  
                const badgeColor = 
                  tab === "pending" ? "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400" :
                  tab === "preparing" ? "bg-indigo-100 text-indigo-850 dark:bg-indigo-950/40 dark:text-indigo-400" :
                  tab === "ready" ? "bg-emerald-100 text-emerald-850 dark:bg-emerald-950/40 dark:text-emerald-400" : "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400";

                return (
                  <button
                    key={tab}
                    onClick={() => setPosOrderTab(tab)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                      posOrderTab === tab
                        ? `${theme.primaryBg} text-white shadow-sm font-bold`
                        : "text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    <span>{label}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-black ${posOrderTab === tab ? "bg-white/20 text-white" : badgeColor}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
            
            {/* Search filter for orders */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="ابحث برقم الطلب أو اسم الزبون..."
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
                className="w-full pr-8 pl-3 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Orders Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {historyOrders
              .filter(o => {
                const matchSearch = o.orderNumber.toLowerCase().includes(historySearch.toLowerCase()) || 
                                    (o.customerName && o.customerName.toLowerCase().includes(historySearch.toLowerCase()));
                const matchTab = 
                  posOrderTab === "all" ? o.orderStatus !== "delivered" && o.orderStatus !== "cancelled" :
                  posOrderTab === "archived" ? o.orderStatus === "delivered" || o.orderStatus === "cancelled" :
                  o.orderStatus === posOrderTab;
                return matchSearch && matchTab;
              })
              .map(order => (
                <div key={order.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 shadow-sm flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all">
                  
                  {/* Order header */}
                  <div className="pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-black text-sm text-slate-900 dark:text-white">{order.orderNumber}</span>
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.2 rounded">
                          {order.orderType === 'dine_in' ? `طاولة ${order.tableNumber}` : order.orderType === 'takeaway' ? 'سفري' : 'توصيل'}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        <span>{order.createdAt}</span>
                        <span className="mx-1">•</span>
                        <span>{order.customerName || 'عميل'}</span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      order.orderStatus === "pending" ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-400 animate-pulse" :
                      order.orderStatus === "preparing" ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-400" :
                      order.orderStatus === "ready" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400 animate-pulse" :
                      order.orderStatus === "delivered" ? "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400" : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-400"
                    }`}>
                      {order.orderStatus === "pending" ? "معلق (موافقة)" :
                       order.orderStatus === "preparing" ? "في المطبخ" :
                       order.orderStatus === "ready" ? "جاهز للتسليم" :
                       order.orderStatus === "delivered" ? "تم التسليم" : "ملغي"}
                    </span>
                  </div>

                  {/* Order items list */}
                  <div className="py-3 flex-1 divide-y divide-slate-100/60 dark:divide-slate-800/60">
                    {order.items.map((item, idx) => {
                      const dbItem = items.find(i => i.id === item.itemId);
                      const itemName = dbItem
                        ? (lang === 'en' && dbItem.nameEn ? dbItem.nameEn : lang === 'tr' && dbItem.nameTr ? dbItem.nameTr : dbItem.nameAr)
                        : item.nameAr;
                      return (
                        <div key={idx} className="py-2 first:pt-0 last:pb-0 text-xs">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-bold text-slate-800 dark:text-slate-200">{itemName}</span>
                            <span className="font-mono font-black text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.2 rounded">x{item.quantity}</span>
                          </div>
                          {item.notes && (
                            <p className="text-[10px] text-amber-600 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-950/20 px-2 py-0.5 rounded border border-amber-100 dark:border-amber-900/30 mt-1">
                              {lang === 'ar' ? '💡 ملاحظة:' : lang === 'tr' ? '💡 Not:' : '💡 Note:'} {item.notes}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Pricing and Actions */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4 mt-2">
                    <div className="text-right">
                      <p className="text-[9px] text-slate-400 font-bold">الإجمالي النهائي</p>
                      <p className="font-black text-sm text-emerald-600 dark:text-emerald-400 font-mono">
                        {order.total.toFixed(2)} {tenant.currency}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {order.orderStatus === "pending" && (
                        <>
                          <button
                            onClick={() => handleRejectOrder(order.id)}
                            className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-all cursor-pointer"
                            title="رفض وإلغاء الطلب"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleApproveOrder(order.id)}
                            className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1 cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>موافقة</span>
                          </button>
                        </>
                      )}

                      {order.orderStatus === "preparing" && (
                        <>
                          <button
                            onClick={() => {
                              setIsDraftPrint(false);
                              setCompletedOrder(order);
                            }}
                            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 text-xs font-bold transition-all cursor-pointer"
                            title="طباعة إيصال المطبخ"
                          >
                            <PrinterIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={async () => {
                              const res = await fetch(`/api/tenants/${tenant.id}/orders/${order.id}`, {
                                method: "PUT",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ orderStatus: "ready" })
                              });
                              if (res.ok) {
                                const updated = await res.json();
                                setHistoryOrders(prev => prev.map(o => o.id === order.id ? updated : o));
                              }
                            }}
                            className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1 cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>جاهز</span>
                          </button>
                        </>
                      )}

                      {order.orderStatus === "ready" && (
                        <>
                          <button
                            onClick={() => {
                              setIsDraftPrint(false);
                              setCompletedOrder(order);
                            }}
                            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 text-xs font-bold transition-all cursor-pointer"
                            title="طباعة الفاتورة"
                          >
                            <PrinterIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={async () => {
                              const res = await fetch(`/api/tenants/${tenant.id}/orders/${order.id}`, {
                                method: "PUT",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ orderStatus: "delivered" })
                              });
                              if (res.ok) {
                                const updated = await res.json();
                                setHistoryOrders(prev => prev.map(o => o.id === order.id ? updated : o));
                              }
                            }}
                            className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1 cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>تم التسليم</span>
                          </button>
                        </>
                      )}

                      {(order.orderStatus === "delivered" || order.orderStatus === "cancelled") && (
                        <button
                          onClick={() => {
                            setIsDraftPrint(false);
                            setCompletedOrder(order);
                          }}
                          className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <PrinterIcon className="w-3.5 h-3.5" />
                          <span>إعادة طباعة</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            
            {historyOrders.filter(o => {
              const matchSearch = o.orderNumber.toLowerCase().includes(historySearch.toLowerCase()) || 
                                  (o.customerName && o.customerName.toLowerCase().includes(historySearch.toLowerCase()));
              const matchTab = 
                posOrderTab === "all" ? o.orderStatus !== "delivered" && o.orderStatus !== "cancelled" :
                posOrderTab === "archived" ? o.orderStatus === "delivered" || o.orderStatus === "cancelled" :
                o.orderStatus === posOrderTab;
              return matchSearch && matchTab;
            }).length === 0 && (
              <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-12 text-center text-slate-500 text-sm space-y-2">
                <Receipt className="w-12 h-12 mx-auto text-slate-300" />
                <p className="font-bold text-slate-800 dark:text-slate-200">لا توجد طلبات في هذا القسم حالياً</p>
                <p className="text-xs text-slate-400">ستظهر الطلبات الحية والنشطة هنا بمجرد وصولها لتسهيل إدارتها.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tables Status View */}
      {posMode === "tables" && (
        <div className="lg:col-span-12 space-y-4 animate-in fade-in duration-200 pos-tables-dashboard">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-150 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  {lang === 'ar' ? 'إدارة حالات طاولات الصالة' : 'Manage Hall Tables Status'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {lang === 'ar' ? 'انقر على أي طاولة لتحديث حالتها فوراً لمتابعة الحجوزات والخدمة.' : 'Click any table to update its status.'}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 text-xs font-bold font-sans">
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-emerald-250/60 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>{lang === 'ar' ? `متاح (${tables.filter(t => t.status === 'available').length})` : 'Available'}</span>
                </span>
                <span className="px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 border border-rose-250/60 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  <span>{lang === 'ar' ? `مشغول (${tables.filter(t => t.status === 'occupied').length})` : 'Occupied'}</span>
                </span>
                <span className="px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 border border-blue-250/60 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <span>{lang === 'ar' ? `محجوز (${tables.filter(t => t.status === 'reserved').length})` : 'Reserved'}</span>
                </span>
                <span className="px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border border-amber-250/60 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <span>{lang === 'ar' ? `بحاجة لتنظيف (${tables.filter(t => t.status === 'needs_cleaning').length})` : 'Needs Cleaning'}</span>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
              {tables.map((t) => {
                const statusLabels = {
                  available: lang === 'ar' ? 'متاح' : 'Available',
                  occupied: lang === 'ar' ? 'مشغول' : 'Occupied',
                  reserved: lang === 'ar' ? 'محجوز' : 'Reserved',
                  needs_cleaning: lang === 'ar' ? 'بحاجة لتنظيف' : 'Needs Cleaning'
                };

                const statusStyles = {
                  available: "bg-emerald-50/60 dark:bg-emerald-950/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/40 hover:bg-emerald-100/50",
                  occupied: "bg-rose-50/60 dark:bg-rose-950/10 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-900/40 hover:bg-rose-100/50",
                  reserved: "bg-blue-50/60 dark:bg-blue-950/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-900/40 hover:bg-blue-100/50",
                  needs_cleaning: "bg-amber-50/60 dark:bg-amber-950/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/40 hover:bg-amber-100/50"
                };

                const statusDot = {
                  available: "bg-emerald-500",
                  occupied: "bg-rose-500",
                  reserved: "bg-blue-500",
                  needs_cleaning: "bg-amber-500"
                };

                return (
                  <button
                    key={t.id}
                    onClick={() => setEditingTableStatus(t)}
                    className={`p-4 rounded-3xl border text-center transition-all flex flex-col items-center justify-center gap-2 cursor-pointer hover:scale-102 hover:shadow-xs ${
                      historyOrders.some(o => (o.tableId === t.id || o.tableId === t.tableNumber) && o.orderStatus === "ready")
                        ? "bg-emerald-50 border-emerald-400 dark:bg-emerald-950/20 dark:border-emerald-850 animate-pulse ring-4 ring-emerald-550/20 text-emerald-800 dark:text-emerald-400 font-extrabold"
                        : statusStyles[t.status] || "bg-slate-50 text-slate-700 border-slate-200"
                    }`}
                  >
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                      {lang === 'ar' ? 'طاولة' : 'Table'}
                    </span>
                    <span className="text-3xl font-black font-mono leading-none">
                      {t.tableNumber}
                    </span>
                    <div className="flex items-center gap-1 mt-1 bg-white/70 dark:bg-slate-900/70 px-2 py-0.5 rounded-full border border-slate-100 dark:border-slate-800">
                      <span className={`w-1.5 h-1.5 rounded-full ${statusDot[t.status]}`} />
                      <span className="text-[9px] font-bold">{statusLabels[t.status]}</span>
                    </div>
                    <span className="text-[9px] text-slate-400 dark:text-slate-500 font-medium">
                      👤 {t.capacity} {lang === 'ar' ? 'كراسي' : 'Seats'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Table Status Edit Modal */}
      {editingTableStatus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl relative space-y-6 text-right" dir="rtl">
            <button
              onClick={() => setEditingTableStatus(null)}
              className="absolute top-4 left-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1.5 text-center">
              <span className="text-3xl">🍽️</span>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                تعديل حالة الطاولة {editingTableStatus.tableNumber}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                السعة الاستيعابية: {editingTableStatus.capacity} كراسي
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setSelectedTable(editingTableStatus.tableNumber);
                setOrderType("dine_in");
                setPosMode("sales");
                setEditingTableStatus(null);
              }}
              className="w-full py-3 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>🛒</span>
              <span>{lang === 'ar' ? 'تسجيل طلب جديد لهذه الطاولة' : lang === 'tr' ? 'Masa için Yeni Sipariş Al' : 'Take New Order for Table'}</span>
            </button>

            <div className="grid grid-cols-2 gap-2 font-sans">
              {(["available", "occupied", "reserved", "needs_cleaning"] as const).map((status) => {
                const labels = {
                  available: "🟢 متاح (Available)",
                  occupied: "🔴 مشغول (Occupied)",
                  reserved: "🔵 محجوز (Reserved)",
                  needs_cleaning: "🟡 بحاجة لتنظيف"
                };

                const isSelected = editingTableStatus.status === status;

                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setEditingTableStatus({ ...editingTableStatus, status })}
                    className={`py-3 px-2 rounded-xl border text-xs font-bold transition-all text-center flex items-center justify-center cursor-pointer ${
                      isSelected
                        ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-md scale-102"
                        : "bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-750 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    {labels[status]}
                  </button>
                );
              })}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setEditingTableStatus(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (onUpdateTableStatus) {
                    await onUpdateTableStatus(editingTableStatus.id, editingTableStatus.status);
                  }
                  setEditingTableStatus(null);
                }}
                className={`flex-1 py-2.5 rounded-xl ${theme.primaryBg} ${theme.primaryHover} text-white text-xs font-bold shadow-md transition-colors cursor-pointer`}
              >
                حفظ التعديل
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Thermal Receipt Preview Modal */}
      {completedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200 receipt-print-wrapper">
          <div className="bg-white text-slate-900 rounded-3xl max-w-sm w-full p-4 sm:p-6 shadow-2xl border border-slate-200 space-y-4 font-mono text-center relative print:shadow-none print:border-none print:max-w-none print:w-full print:p-0 print:rounded-none">
            
            <button
              onClick={() => {
                setCompletedOrder(null);
                setIsDraftPrint(false);
              }}
              className="absolute top-4 left-4 p-1.5 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors font-sans print:hidden"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Print Header Controls (Hidden during print) */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 font-sans print:hidden">
              <span className="font-bold text-xs text-slate-500 flex items-center gap-1.5">
                <PrinterIcon className="w-4 h-4 text-emerald-600" />
                <span>{isDraftPrint ? posTranslations[lang].printPreviewDraftTitle : posTranslations[lang].printPreviewTitle}</span>
              </span>
              <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-mono">
                {completedOrder.orderNumber}
              </span>
            </div>

            {/* The Dedicated Printable Receipt Component */}
            <div className="max-h-[65vh] overflow-y-auto pr-1 print:max-h-none print:overflow-visible no-scrollbar">
               <POSInvoiceReceipt tenant={tenant} order={completedOrder} isDraft={isDraftPrint} lang={lang} />
            </div>

            {/* Printer Selection (Hidden during print) */}
            {printers.length > 0 && (
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs font-sans print:hidden" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                <span className="text-slate-500 font-bold whitespace-nowrap">{posTranslations[lang].printerLabel}</span>
                <select
                  value={selectedPrinterId}
                  onChange={e => setSelectedPrinterId(e.target.value)}
                  className="w-full bg-transparent font-bold outline-none cursor-pointer text-slate-800"
                >
                  {printers.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.connectionType === 'network' ? `IP: ${p.ipAddress}` : 'USB'}) - {p.printerRole === 'kitchen' ? 'مطبخ' : 'كاشير'}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Actions Toolbar (Hidden during print) */}
            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 font-sans print:hidden">
              <button
                onClick={() => {
                  setCompletedOrder(null);
                  setIsDraftPrint(false);
                }}
                className="py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                {posTranslations[lang].closeAndNew}
              </button>
              <button
                onClick={() => {
                  handlePrintOrder(completedOrder, 'receipt');
                }}
                className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
              >
                <PrinterIcon className="w-4 h-4" />
                <span>{posTranslations[lang].printReceiptBtn}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order History & Invoices Register Modal */}
      {showOrderHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200 print:hidden font-sans" dir="rtl">
          <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-3xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            {/* Header */}
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center">
                  <History className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">سجل فواتير وطلبات المطعم (إعادة الطباعة)</h3>
                  <p className="text-xs text-slate-500">اختر الفاتورة لعرض الإيصال وطباعته فوراً عبر نافذة المتصفح</p>
                </div>
              </div>
              <button
                onClick={() => setShowOrderHistoryModal(false)}
                className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tab selection */}
            <div className="flex items-center gap-1.5 p-3 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setHistoryTab("all")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  historyTab === "all"
                    ? "bg-slate-900 text-white font-bold shadow-sm"
                    : "text-slate-600 hover:bg-white/70"
                }`}
              >
                فواتير المطعم الصادرة
              </button>
              <button
                onClick={() => setHistoryTab("pending")}
                className={`relative px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  historyTab === "pending"
                    ? "bg-amber-600 text-white font-bold shadow-sm"
                    : "text-slate-600 hover:bg-white/70"
                }`}
              >
                <span>طلبات الجوال المعلقة (QR)</span>
                {pendingSelfOrders.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-black flex items-center justify-center animate-pulse">
                    {pendingSelfOrders.length}
                  </span>
                )}
              </button>
            </div>

            {/* Toolbar / Search */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 bg-white dark:bg-slate-900">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="ابحث برقم الفاتورة، اسم العميل..."
                  value={historySearch}
                  onChange={(e) => setHistorySearch(e.target.value)}
                  className="w-full pr-10 pl-4 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button
                onClick={fetchHistoryOrders}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${historyLoading ? 'animate-spin' : ''}`} />
                <span>تحديث الفواتير</span>
              </button>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {historyLoading ? (
                <div className="py-12 text-center text-slate-500 text-sm flex flex-col items-center gap-2">
                  <RefreshCw className="w-6 h-6 animate-spin text-indigo-500" />
                  <span>جاري تحميل سجل الفواتير...</span>
                </div>
              ) : historyOrders.filter(o => {
                const matchSearch = o.orderNumber.toLowerCase().includes(historySearch.toLowerCase()) || 
                                    (o.customerName && o.customerName.toLowerCase().includes(historySearch.toLowerCase()));
                const matchTab = historyTab === 'pending' ? o.orderStatus === 'pending' : o.orderStatus !== 'pending';
                return matchSearch && matchTab;
              }).length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-sm space-y-1">
                  <Receipt className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                  <p className="font-bold">لا توجد فواتير أو طلبات معلقة مطابقة</p>
                  <p className="text-xs text-slate-400">ستظهر هنا فواتير المطعم أو طلبات الكاستمر القادمة من المنيو الرقمي</p>
                </div>
              ) : (
                historyOrders
                  .filter(o => {
                    const matchSearch = o.orderNumber.toLowerCase().includes(historySearch.toLowerCase()) || 
                                        (o.customerName && o.customerName.toLowerCase().includes(historySearch.toLowerCase()));
                    const matchTab = historyTab === 'pending' ? o.orderStatus === 'pending' : o.orderStatus !== 'pending';
                    return matchSearch && matchTab;
                  })
                  .map((ord) => (
                    <div
                      key={ord.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 hover:border-indigo-400 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-mono font-black text-xs text-emerald-600 dark:text-emerald-400">
                          {ord.orderNumber.replace('#', '')}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-900 dark:text-white font-mono">{ord.orderNumber}</span>
                            <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold">
                              {ord.orderType === 'dine_in' ? `طاولة ${ord.tableNumber}` : ord.orderType === 'takeaway' ? 'سفري' : 'توصيل'}
                            </span>
                            {ord.orderStatus === 'pending' && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-400 font-black animate-pulse">
                                معلق (ينتظر الموافقة)
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                            <span>{ord.createdAt}</span>
                            <span>•</span>
                            <span>{ord.customerName || 'عميل نقدي'}</span>
                            <span>•</span>
                            <span>{ord.items.length} أصناف</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200 dark:border-slate-700">
                        <div className="text-right ml-2">
                          <div className="font-black text-sm text-emerald-600 dark:text-emerald-400 font-mono">
                            {ord.total.toFixed(2)} {tenant.currency}
                          </div>
                          <div className="text-[10px] text-slate-400 font-bold">
                            {ord.paymentMethod === 'cash' ? 'نقدي (Cash)' : ord.paymentMethod === 'card' ? 'بطاقة' : ord.paymentMethod === 'pending' ? 'انتظار الموافقة' : 'آجل'}
                          </div>
                        </div>

                        {ord.orderStatus === 'pending' ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleRejectOrder(ord.id)}
                              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 transition-all cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>رفض الطلب</span>
                            </button>
                            <button
                              onClick={() => handleApproveOrder(ord.id)}
                              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>موافق وتحضير</span>
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setIsDraftPrint(false);
                              setCompletedOrder(ord);
                              setShowOrderHistoryModal(false);
                            }}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-sm"
                          >
                            <PrinterIcon className="w-3.5 h-3.5" />
                            <span>طباعة الفاتورة</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-left">
              <button
                onClick={() => setShowOrderHistoryModal(false)}
                className="px-5 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    
      {/* Mobile Cart Floating Action Button */}
      {posMode === "sales" && cart.length > 0 && (
        <div className="lg:hidden fixed bottom-6 left-6 right-6 z-45">
          <button
            onClick={() => setShowMobileCart(true)}
            className="w-full flex items-center justify-between px-6 py-4 bg-indigo-650 hover:bg-indigo-700 text-white rounded-2xl shadow-xl font-bold animate-bounce cursor-pointer border border-indigo-500/30"
          >
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-xl">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <div className="text-right">
                <p className="text-[10px] text-indigo-200 leading-none">{lang === 'ar' ? 'عرض السلة' : lang === 'tr' ? 'Sepeti Göster' : 'View Cart'}</p>
                <p className="text-xs font-black mt-0.5">{cart.reduce((sum, i) => sum + i.quantity, 0)} {lang === 'ar' ? 'أصناف' : lang === 'tr' ? 'Ürün' : 'items'}</p>
              </div>
            </div>
            <div className="text-lg font-black font-sans">
              {total.toFixed(0)} {tenant.currency}
            </div>
          </button>
        </div>
      )}

      {/* Mobile Cart Drawer Overlay */}
      {showMobileCart && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex justify-end animate-in fade-in duration-200" dir="rtl">
          <div className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl slide-in-from-left duration-300">
            {renderCart(true)}
          </div>
        </div>
      )}

      {/* Floating Toast Notifications */}
      <div className="fixed bottom-6 left-6 z-[9999] space-y-3 max-w-sm w-full pointer-events-none" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        {activeNotifications.map((notif) => (
          <div
            key={notif.id}
            className={`p-4 rounded-2xl border shadow-xl flex items-center justify-between gap-3 pointer-events-auto animate-in slide-in-from-left-8 duration-300 ${
              notif.type === "pending"
                ? "bg-indigo-650 border-indigo-500 shadow-indigo-600/20 text-white"
                : "bg-emerald-650 border-emerald-500 shadow-emerald-600/20 text-white"
            }`}
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

</div>
  );
};
