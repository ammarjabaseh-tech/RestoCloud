export type ThemeColor = 'emerald' | 'amber' | 'rose' | 'indigo' | 'violet' | 'slate' | 'cyan' | 'orange';

export interface Tenant {
  id: string;
  subdomain: string;
  nameAr: string;
  logo: string;
  themeColor: ThemeColor;
  currency: string;
  taxRate: number; // Percentage e.g. 15
  address: string;
  phone: string;
  ownerName: string;
  status: 'active' | 'trial' | 'suspended' | 'pending_payment' | 'pending_approval';
  createdAt: string;
  super_admin_login?: string;
  bannerImage?: string;
  slogan?: string;
  wifiPassword?: string;
  wifiName?: string;
  ownerEmail?: string;
  password?: string;
  subscriptionPlan?: 'lite' | 'starter' | 'pro';
  subscriptionAmount?: number;
  subscriptionDate?: string;
  isOpen?: boolean;
  facebookUrl?: string;
  instagramUrl?: string;
  tiktokUrl?: string;
  locationUrl?: string;
}

export interface Category {
  id: string;
  tenantId: string;
  nameAr: string;
  nameEn?: string;
  nameTr?: string;
  icon: string;
  orderIndex: number;
}

export interface MenuItem {
  id: string;
  tenantId: string;
  categoryId: string;
  nameAr: string;
  nameEn?: string;
  nameTr?: string;
  descriptionAr: string;
  descriptionEn?: string;
  descriptionTr?: string;
  price: number;
  costPrice: number; // التكلفة التقريبية للطبق لحساب هامش الربح
  calories?: number;
  image: string;
  isAvailable: boolean;
  isBestSeller?: boolean;
  preparationTimeMin?: number;
}

export interface RestaurantTable {
  id: string;
  tenantId: string;
  tableNumber: number;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved' | 'needs_cleaning';
  currentOrderId?: string;
}

export type TableItem = RestaurantTable;

export interface OrderItem {
  id: string;
  itemId: string;
  nameAr: string;
  price: number;
  quantity: number;
  notes?: string;
}

export type OrderType = 'dine_in' | 'takeaway' | 'delivery';
export type PaymentMethod = 'cash' | 'card' | 'pending' | 'credit';
export type PaymentStatus = 'paid' | 'pending' | 'refunded';
export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  orderNumber: string; // e.g. #SH-104
  tenantId: string;
  orderType: OrderType;
  tableNumber?: number;
  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
  items: OrderItem[];
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  createdAt: string;
  createdAtIso?: string;
  cashierName: string;
  deliveryDriverName?: string;
}

export type ActivePortalView = 'landing_page' | 'auth_login' | 'auth_signup' | 'terms' | 'super_admin_dashboard' | 'super_admin_login' | 'saas_portal' | 'pos_dashboard' | 'admin_panel' | 'digital_menu' | 'postgres_export' | 'ai_assistant' | 'tenant_login' | 'tenant_users' | 'saas_subscriptions' | 'delivery_view' | 'kitchen_display';

export type UserRole = 'owner' | 'manager' | 'cashier' | 'waiter' | 'worker' | 'delivery';

export interface TenantUser {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  phone?: string;
  password?: string;
  role: UserRole;
  status: 'active' | 'inactive';
  permissions: {
    canManagePOS: boolean;       // صلاحية شاشة الكاشير ونقاط البيع
    canManageMenu: boolean;      // صلاحية إدارة المنيو والأصناف والطاولات
    canManageUsers: boolean;     // صلاحية إدارة الموظفين والمستخدمين
    canViewReports: boolean;     // صلاحية التقارير المالية والذكاء الاصطناعي
    canManageSettings: boolean;  // صلاحية إعدادات المطعم والاشتراك
    canAccessWaiter: boolean;    // صلاحية شاشة الويتر
    canAccessDelivery: boolean;  // صلاحية شاشة التوصيل
  };
  createdAt: string;
  avatar?: string;
}

export interface TenantSubscriptionInvoice {
  id: string;
  invoiceNumber: string;
  tenantId: string;
  tenantName: string;
  plan: 'starter' | 'pro' | 'enterprise';
  amount: number;
  billingPeriod: string;
  issueDate: string;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
}

export interface DailySalesSummary {
  date: string;
  totalOrders: number;
  totalRevenue: number;
  cashRevenue: number;
  cardRevenue: number;
  dineInOrders: number;
  takeawayOrders: number;
  deliveryOrders: number;
}

export interface AIAnalysisResponse {
  insights: string[];
  suggestions: {
    title: string;
    description: string;
    estimatedProfitBoost: string;
  }[];
  pricingAdvice: string;
}

export interface Printer {
  id: string;
  tenantId: string;
  name: string;
  connectionType: 'network' | 'usb' | 'bluetooth';
  ipAddress?: string;
  port?: number;
  paperSize: '80mm' | '58mm';
  printerRole: 'receipt' | 'kitchen' | 'bar' | 'general';
  isActive: boolean;
  assignedCategories?: string[]; // IDs of categories assigned to this printer
}
