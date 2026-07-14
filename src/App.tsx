import React, { useState, useEffect } from "react";
import { Tenant, Category, MenuItem, RestaurantTable, ActivePortalView, Order, TenantUser } from "./types";
import { Navbar } from "./components/Navbar";
import { SaaSPortalView } from "./components/SaaSPortalView";
import { POSDashboardView } from "./components/POSDashboardView";
import { AdminPanelView } from "./components/AdminPanelView";
import { DigitalMenuView } from "./components/DigitalMenuView";
import { AIAssistantView } from "./components/AIAssistantView";
import { PostgreSQLExportView } from "./components/PostgreSQLExportView";
import { SuperAdminDashboard } from "./components/SuperAdminDashboard";
import SuperAdminLogin from "./components/SuperAdminLogin";
import { TenantLoginCheckoutView } from "./components/TenantLoginCheckoutView";
import { TenantUsersView } from "./components/TenantUsersView";
import { SaaSSubscriptionsView } from "./components/SaaSSubscriptionsView";
import { KitchenDisplayView } from "./components/KitchenDisplayView";
import { LandingPageView } from "./components/LandingPageView";
import { SaaSAuthView } from "./components/SaaSAuthView";
import { SaaSOnboardingModal } from "./components/SaaSOnboardingModal";
import { TermsView } from "./components/TermsView";
import { getThemeClasses } from "./utils/theme";
import { Store, RefreshCw, AlertCircle } from "lucide-react";

export default function App() {
  const [lang, setLang] = useState<'ar' | 'en' | 'tr'>(() => (localStorage.getItem('appLanguage') as 'ar' | 'en' | 'tr') || 'ar');
  const [tenants, setTenants] = useState<Tenant[]>([]);

  useEffect(() => {
    localStorage.setItem('appLanguage', lang);
  }, [lang]);
  
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(() => {
    const saved = localStorage.getItem("currentTenant");
    return saved ? JSON.parse(saved) : null;
  });

  const [currentUser, setCurrentUser] = useState<TenantUser | null>(() => {
    const saved = localStorage.getItem("currentUser");
    return saved ? JSON.parse(saved) : null;
  });

  const [activeView, setActiveView] = useState<ActivePortalView>(() => {
    const saved = localStorage.getItem("activeView");
    return (saved as ActivePortalView) || "landing_page";
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [tables, setTables] = useState<RestaurantTable[]>([]);
  
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [showOnboardModal, setShowOnboardModal] = useState<boolean>(false);

  // Sync states to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("currentUser");
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentTenant) {
      localStorage.setItem("currentTenant", JSON.stringify(currentTenant));
    } else {
      localStorage.removeItem("currentTenant");
    }
  }, [currentTenant]);

  useEffect(() => {
    if (activeView !== 'super_admin_dashboard' && activeView !== 'super_admin_login') {
      localStorage.setItem("activeView", activeView);
    }
  }, [activeView]);

  // Handle login success from SaaSAuthView
  const handleLoginSuccess = (isSuperAdmin: boolean, user?: TenantUser, tenant?: Tenant) => {
    if (isSuperAdmin) {
      localStorage.setItem("isSuperAdmin", "true");
      setActiveView('super_admin_dashboard');
      fetchTenants();
    } else if (user && tenant) {
      setCurrentTenant(tenant);
      setCurrentUser(user);
      fetchTenants();
      
      // Route based on user permissions
      if (user.permissions.canManagePOS) {
        setActiveView('pos_dashboard');
      } else if (user.permissions.canManageMenu) {
        setActiveView('admin_panel');
      } else {
        setActiveView('digital_menu');
      }
    }
  };

  // Approve or reject pending tenant from super admin view
  const handleApproveTenant = (tenantId: string) => {
    setTenants(prev => prev.map(t => t.id === tenantId ? { ...t, status: 'active' } : t));
  };
  const handleRejectTenant = (tenantId: string) => {
    setTenants(prev => prev.filter(t => t.id !== tenantId));
  };
  // Whenever currentTenant changes, fetch its categories, items, and tables
  useEffect(() => {
    if (currentTenant) {
      fetchTenantData(currentTenant.id);
    }
  }, [currentTenant?.id]);

  // Check URL query param, subdomain or path for routing on mount
  useEffect(() => {
    // Capture the initial pathname and search parameters synchronously on mount
    const originalPathname = window.location.pathname;
    const originalSearch = window.location.search;

    const initializeApp = async () => {
      try {
        setLoading(true);
        setError("");

        // 1. Fetch all tenants (only one API call on mount!)
        const res = await fetch("/api/tenants");
        if (!res.ok) throw new Error("Failed to fetch tenants from server");
        const data = await res.json();
        
        let loadedTenants: Tenant[] = [];
        if (Array.isArray(data)) {
          setTenants(data);
          loadedTenants = data;
        }

        // 2. Validate current tenant & user if logged in (prevent browser mismatch from causing problems)
        if (currentTenant && currentUser && loadedTenants.length > 0) {
          const latest = loadedTenants.find(t => t.id === currentTenant.id);
          if (!latest || latest.status === "suspended") {
            const isSA = localStorage.getItem("isSuperAdmin") === "true";
            if (!isSA) {
              setCurrentUser(null);
              setCurrentTenant(null);
              localStorage.removeItem("currentUser");
              localStorage.removeItem("currentTenant");
              localStorage.setItem("activeView", "landing_page");
            }
          } else {
            setCurrentTenant(latest);
          }
        }

        // Select first restaurant by default if none selected
        if (!currentTenant && loadedTenants.length > 0) {
          setCurrentTenant(loadedTenants[0]);
        }

        // 3. Resolve active view based on subdomain, pathname or search params
        const hostname = window.location.hostname;
        const parts = hostname.split('.');
        let sub: string | null = null;
        
        if (parts.length > 2) {
          if (parts[0] !== 'sa' && parts[0] !== 'admin' && parts[0] !== 'www') {
            sub = parts[0].toLowerCase();
          } else if (parts[0] === 'sa' || parts[0] === 'admin') {
            sub = parts[0].toLowerCase();
          }
        } else if (parts.length === 2 && parts[1] === 'localhost') {
          sub = parts[0].toLowerCase();
        }

        const params = new URLSearchParams(originalSearch);
        const viewParam = params.get('view');
        const previewTenantId = params.get("preview_tenant") || params.get("tenant");
        
        // A. Is this a Super Admin path/subdomain?
        const isSuperAdminRoute = sub === 'sa' || sub === 'admin' || originalPathname === '/sa' || viewParam === 'admin' || viewParam === 'sa' || viewParam === 'super_admin';
        
        const isSA = localStorage.getItem("isSuperAdmin") === "true";
        console.log("[App Router] isSuperAdminRoute:", isSuperAdminRoute, "subdomain:", sub, "originalPathname:", originalPathname, "isSA:", isSA);

        if (isSuperAdminRoute) {
          if (isSA) {
            console.log("[App Router] Setting view to super_admin_dashboard");
            setActiveView('super_admin_dashboard');
          } else {
            console.log("[App Router] Setting view to super_admin_login (isSA is false)");
            setActiveView('super_admin_login');
          }
        }
        // B. Is there a valid logged-in user session (not Super Admin)?
        // If they are logged in, we preserve their dashboard view instead of throwing them to login/landing!
        else if (currentTenant && currentUser) {
          console.log("[App Router] Logged in user detected. Restoring dashboard session...");
          const saved = localStorage.getItem("activeView");
          // If they manually opened /menu, let them see the digital menu even if they are logged in
          if (originalPathname === '/menu' || originalPathname.includes('/menu')) {
            setActiveView('digital_menu');
          } else if (saved && saved !== 'super_admin_dashboard' && saved !== 'super_admin_login' && saved !== 'landing_page') {
            setActiveView(saved as ActivePortalView);
          } else {
            // Fallback based on permissions
            if (currentUser.permissions.canManagePOS) {
              setActiveView('pos_dashboard');
            } else if (currentUser.permissions.canManageMenu) {
              setActiveView('admin_panel');
            } else {
              setActiveView('digital_menu');
            }
          }
        }
        // C. Is this a customer digital menu request via IP or query parameter? (e.g. /menu?tenant=ammar)
        else if ((originalPathname === '/menu' || originalPathname.includes('/menu')) && previewTenantId) {
          const target = loadedTenants.find(t => t.id === previewTenantId || t.subdomain.toLowerCase() === previewTenantId.toLowerCase());
          if (target) {
            setCurrentTenant(target);
            setActiveView('digital_menu');
          } else {
            setActiveView('landing_page');
          }
        }
        // D. Is this a preview tenant parameter request?
        else if (previewTenantId) {
          const target = loadedTenants.find(t => t.id === previewTenantId || t.subdomain.toLowerCase() === previewTenantId.toLowerCase());
          if (target) {
            setCurrentTenant(target);
            const usersRes = await fetch(`/api/tenants/${target.id}/users`);
            const users = await usersRes.json();
            if (Array.isArray(users) && users.length > 0) {
              const owner = users.find((u: TenantUser) => u.role === "owner") || users[0];
              setCurrentUser(owner);
            }
            setActiveView("pos_dashboard");
          }
        }
        // E. Is this a Tenant subdomain route?
        else if (sub && sub !== 'sa' && sub !== 'admin' && sub !== 'www') {
          const targetTenant = loadedTenants.find(t => t.subdomain.toLowerCase() === sub);
          if (targetTenant) {
            setCurrentTenant(targetTenant);
            if (originalPathname === '/menu' || originalPathname.includes('/menu')) {
              setActiveView('digital_menu');
            } else {
              setActiveView('tenant_login');
            }
          } else {
            setActiveView('landing_page');
          }
        }
        // F. Normal SaaS Landing Page route
        else {
          const saved = localStorage.getItem("activeView");
          if (saved && saved !== 'super_admin_dashboard' && saved !== 'super_admin_login') {
            setActiveView(saved as ActivePortalView);
          } else {
            setActiveView('landing_page');
          }
        }
      } catch (err: any) {
        console.error("Initialization error:", err);
        setError("تعذر الاتصال بالخادم، يرجى تحديث الصفحة");
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  // Synchronize browser address bar URL with activeView state
  useEffect(() => {
    if (loading) return; // Do not alter the URL pathname while loading and resolving routing on mount!
    
    // We only alter path history if we are not on a custom tenant subdomain (which handles its own routing)
    const hostname = window.location.hostname;
    const parts = hostname.split('.');
    const hasTenantSubdomain = (parts.length > 2 && parts[0] !== 'www' && parts[0] !== 'sa' && parts[0] !== 'admin') || 
                               (parts.length === 2 && parts[1] === 'localhost' && parts[0] !== 'sa' && parts[0] !== 'admin');
    
    if (!hasTenantSubdomain) {
      if (activeView === 'super_admin_dashboard' || activeView === 'super_admin_login') {
        if (window.location.pathname !== '/sa') {
          window.history.pushState({}, '', '/sa');
        }
      } else {
        if (window.location.pathname === '/sa') {
          window.history.pushState({}, '', '/');
        }
      }
    }
  }, [activeView, loading]);

  // Whenever activeView changes, if it is super_admin_dashboard, refetch tenants
  useEffect(() => {
    if (activeView === 'super_admin_dashboard') {
      fetchTenants();
    }
  }, [activeView]);

  const fetchTenants = async (isInitialLoad = false) => {
    try {
      const res = await fetch("/api/tenants");
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setTenants(data);
        
        // If currentTenant is set, verify it is still valid and active (only for regular tenant users)
        if (currentTenant && currentUser) {
          const latest = data.find(t => t.id === currentTenant.id);
          if (!latest || latest.status === "suspended") {
            const isSA = localStorage.getItem("isSuperAdmin") === "true";
            if (!isSA) {
              handleLogout();
              if (latest?.status === "suspended") {
                alert("⚠️ تم إيقاف حساب مطعمك مؤقتاً من قبل الإدارة. يرجى التواصل مع الدعم الفني.");
              }
            }
            return;
          } else {
            // Keep in sync
            setCurrentTenant(latest);
          }
        }

        if (isInitialLoad && !currentTenant) {
          setCurrentTenant(data[0]); // Select first restaurant by default
        }
      }
    } catch (err) {
      setError("تعذر الاتصال بالخادم، يرجى تحديث الصفحة");
    } finally {
      setLoading(false);
    }
  };

  const fetchTenantData = async (tenantId: string) => {
    try {
      const [catsRes, itemsRes, tablesRes] = await Promise.all([
        fetch(`/api/tenants/${tenantId}/categories`),
        fetch(`/api/tenants/${tenantId}/items`),
        fetch(`/api/tenants/${tenantId}/tables`)
      ]);

      const [catsData, itemsData, tablesData] = await Promise.all([
        catsRes.json(),
        itemsRes.json(),
        tablesRes.json()
      ]);

      if (Array.isArray(catsData)) setCategories(catsData);
      if (Array.isArray(itemsData)) setItems(itemsData);
      if (Array.isArray(tablesData)) setTables(tablesData);
    } catch (err) {
      console.error("Failed to fetch tenant data:", err);
    }
  };

  // Handlers for state updates
  const handleTenantCreated = (newTenant: Tenant) => {
    setTenants((prev) => [...prev, newTenant]);
    setCurrentTenant(newTenant);
    setActiveView("pos_dashboard");
  };

  const handleUpdateTenant = (updated: Tenant) => {
    setTenants((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    setCurrentTenant(updated);
  };

  const handleAddCategory = async (nameAr: string, icon: string, nameEn?: string, nameTr?: string) => {
    if (!currentTenant) return;
    try {
      const res = await fetch(`/api/tenants/${currentTenant.id}/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nameAr, icon, nameEn, nameTr })
      });
      const newCat = await res.json();
      setCategories((prev) => [...prev, newCat]);
    } catch (err) {
      alert("فشل في إضافة القسم");
    }
  };

  const handleUpdateCategory = async (id: string, nameAr: string, icon: string, nameEn?: string, nameTr?: string) => {
    if (!currentTenant) return;
    try {
      const res = await fetch(`/api/tenants/${currentTenant.id}/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nameAr, icon, nameEn, nameTr })
      });
      if (res.ok) {
        const updatedCat = await res.json();
        setCategories((prev) => prev.map((c) => (c.id === id ? updatedCat : c)));
      } else {
        let errMsg = "فشل في تعديل القسم";
        try {
          const data = await res.json();
          if (data && data.error) errMsg = data.error;
        } catch (e) {}
        alert(errMsg);
      }
    } catch (err) {
      alert("فشل في تعديل القسم");
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!currentTenant) return;
    try {
      const res = await fetch(`/api/tenants/${currentTenant.id}/categories/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setCategories((prev) => prev.filter((c) => c.id !== id));
      } else {
        let errMsg = "فشل في حذف القسم";
        try {
          const data = await res.json();
          if (data && data.error) errMsg = data.error;
        } catch (e) {}
        alert(errMsg);
      }
    } catch (err) {
      alert("فشل في حذف القسم");
    }
  };

  const handleReorderCategories = async (orderedIds: string[]) => {
    if (!currentTenant) return;
    try {
      const res = await fetch(`/api/tenants/${currentTenant.id}/categories/reorder`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedIds })
      });
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      alert("فشل في إعادة ترتيب الأقسام");
    }
  };

  const handleAddItem = async (item: Partial<MenuItem>) => {
    if (!currentTenant) return;
    try {
      const res = await fetch(`/api/tenants/${currentTenant.id}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item)
      });
      const newItem = await res.json();
      setItems((prev) => [...prev, newItem]);
    } catch (err) {
      alert("فشل في إضافة الطبق");
    }
  };

  const handleUpdateItem = async (id: string, updates: Partial<MenuItem>) => {
    if (!currentTenant) return;
    try {
      const res = await fetch(`/api/tenants/${currentTenant.id}/items/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates)
      });
      const updated = await res.json();
      setItems((prev) => prev.map((i) => (i.id === id ? updated : i)));
    } catch (err) {
      alert("فشل في تعديل الطبق");
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!currentTenant) return;
    try {
      await fetch(`/api/tenants/${currentTenant.id}/items/${id}`, {
        method: "DELETE"
      });
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      alert("فشل في حذف الطبق");
    }
  };

  const handleUpdateTable = async (id: string, updates: Partial<RestaurantTable>) => {
    if (!currentTenant) return;
    try {
      const res = await fetch(`/api/tenants/${currentTenant.id}/tables/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates)
      });
      const updated = await res.json();
      setTables((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      alert("فشل في تحديث الطاولة");
    }
  };

  function handleLogout() {
    setCurrentUser(null);
    setCurrentTenant(null);
    localStorage.removeItem("isSuperAdmin");
    setActiveView("landing_page");
  }

  const handlePortalSelectTenant = async (tenant: Tenant) => {
    setCurrentTenant(tenant);
    try {
      const res = await fetch(`/api/tenants/${tenant.id}/users`);
      const users = await res.json();
      if (Array.isArray(users) && users.length > 0) {
        const owner = users.find((u: TenantUser) => u.role === "owner") || users[0];
        setCurrentUser(owner);
      }
    } catch (e) {
      console.error("Failed to fetch tenant owner:", e);
    }
    setActiveView("pos_dashboard");
  };

  const handleVisitTenant = async (tenant: Tenant) => {
    setCurrentTenant(tenant);
    try {
      const res = await fetch(`/api/tenants/${tenant.id}/users`);
      const users = await res.json();
      if (Array.isArray(users) && users.length > 0) {
        const owner = users.find((u: TenantUser) => u.role === "owner") || users[0];
        setCurrentUser(owner);
      }
    } catch (e) {
      console.error("Failed to fetch tenant owner for preview:", e);
    }
    setActiveView("pos_dashboard");
  };

  // Standalone Marketing / Auth Views (No Navbar/Layout)
  if (activeView === 'landing_page') return <LandingPageView onSelectView={setActiveView} />;
  if (activeView === 'auth_login') return (
    <SaaSAuthView mode="login" onSelectView={setActiveView} onLoginSuccess={handleLoginSuccess} />
  );
  if (activeView === 'auth_signup') return (
    <SaaSAuthView mode="signup" onSelectView={setActiveView} onLoginSuccess={handleLoginSuccess} />
  );
  if (activeView === 'terms') return <TermsView onSelectView={setActiveView} />;
  if (activeView === 'super_admin_dashboard') return (
    <SuperAdminDashboard
      tenants={tenants}
      onSelectView={setActiveView}
      onRefreshTenants={fetchTenants}
      onVisitTenant={handleVisitTenant}
    />
  );

  if (activeView === 'super_admin_login') return (
    <SuperAdminLogin onLoginSuccess={() => {
      localStorage.setItem("isSuperAdmin", "true");
      setActiveView('super_admin_dashboard');
    }} />
  );

  // Custom QR Digital Menu for customers (Standalone, no headers/footers)
  if (activeView === 'digital_menu' && !currentUser) {
    if (loading) {
      return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center space-y-4 font-sans" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
          <Store className="w-16 h-16 text-indigo-500 animate-bounce mx-auto animate-pulse" />
          <h2 className="text-lg font-bold text-slate-700">
            {lang === 'ar' ? 'جاري تحميل منيو المطعم...' : lang === 'tr' ? 'Restoran menüsü yükleniyor...' : 'Loading restaurant menu...'}
          </h2>
        </div>
      );
    }
    if (!currentTenant) {
      return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-800 p-6 text-center space-y-4 font-sans" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-xl font-bold">
            {lang === 'ar' ? 'عذراً، لم نجد هذا المطعم' : lang === 'tr' ? 'Üzgünüz, bu restoranı bulamadık' : 'Sorry, we could not find this restaurant'}
          </h2>
        </div>
      );
    }
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans transition-colors duration-200 p-4" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        <main className="flex-1 max-w-4xl w-full mx-auto py-2">
          <DigitalMenuView
            tenant={currentTenant}
            categories={categories}
            items={items}
            tables={tables}
            onOrderCreated={(ord) => {}}
            lang={lang}
          />
        </main>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-800 p-6 text-center space-y-4 font-sans" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center text-3xl shadow-sm animate-pulse">
          <Store className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold">
          {lang === 'ar' ? 'جاري تشغيل منصة ريستو كلاود (RestoCloud)...' : lang === 'tr' ? 'RestoCloud platformu başlatılıyor...' : 'Launching RestoCloud platform...'}
        </h2>
        <p className="text-xs text-slate-500">
          {lang === 'ar' ? 'تحميل بيانات المستأجرين، لوحة الكاشير POS، وقوائم الطعام' : lang === 'tr' ? 'Kiracı verileri, POS kasiyer paneli ve yemek menüleri yükleniyor' : 'Loading tenant data, POS cashier panel, and food menus'}
        </p>
      </div>
    );
  }

  if (error || !currentTenant) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-800 p-6 text-center space-y-4 font-sans" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold">
          {lang === 'ar' ? 'حدث خطأ في تحميل النظام' : lang === 'tr' ? 'Sistem yüklenirken bir hata oluştu' : 'An error occurred while loading the system'}
        </h2>
        <p className="text-sm text-slate-500">
          {error ? (
            lang === 'ar' ? error : lang === 'tr' ? 'Bağlantı hatası' : 'Connection error'
          ) : (
            lang === 'ar' ? 'تعذر العثور على مطاعم مسجلة' : lang === 'tr' ? 'Kayıtlı restoran bulunamadı' : 'No registered restaurants found'
          )}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-sm cursor-pointer"
        >
          {lang === 'ar' ? 'إعادة المحاولة' : lang === 'tr' ? 'Tekrar Dene' : 'Retry'}
        </button>
      </div>
    );
  }

  const theme = getThemeClasses(currentTenant.themeColor);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans transition-colors duration-200" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      
      {/* Top Header Bar */}
      <Navbar
        tenants={tenants}
        currentTenant={currentTenant}
        onSelectTenant={(t) => setCurrentTenant(t)}
        activeView={activeView}
        onSelectView={(v) => setActiveView(v)}
        onOpenNewTenantModal={() => setShowOnboardModal(true)}
        currentUser={currentUser}
        onLogout={handleLogout}
        lang={lang}
        onLangChange={setLang}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {activeView === "saas_portal" && (
          <SaaSPortalView
            tenants={tenants}
            onSelectTenant={(t) => {
              setCurrentTenant(t);
            }}
            onSelectView={(v) => setActiveView(v)}
            onOpenNewTenantModal={() => setShowOnboardModal(true)}
            onUpdateTenant={(upd) => setTenants(prev => prev.map(t => t.id === upd.id ? upd : t))}
            onDeleteTenant={(id) => setTenants(prev => prev.filter(t => t.id !== id))}
          />
        )}

        {activeView === "tenant_login" && (
          <TenantLoginCheckoutView
            tenants={tenants}
            onTenantCreated={(newT) => {
              setTenants(prev => [...prev, newT]);
              setCurrentTenant(newT);
            }}
            onSelectTenant={handlePortalSelectTenant}
            onNavigateToSaaSPortal={() => setActiveView("saas_portal")}
            lang={lang}
          />
        )}

        {activeView === "pos_dashboard" && (
          <POSDashboardView
            tenant={currentTenant}
            categories={categories}
            items={items}
            tables={tables}
            onOrderCreated={(newOrd) => {
              // Optionally refresh tables or show toast
            }}
            onUpdateTableStatus={(tblId, st) => {
              handleUpdateTable(tblId, { status: st });
            }}
            lang={lang}
          />
        )}

        {activeView === "admin_panel" && (
          <AdminPanelView
            tenant={currentTenant}
            categories={categories}
            items={items}
            tables={tables}
            onUpdateTenant={handleUpdateTenant}
            onAddCategory={handleAddCategory}
            onAddItem={handleAddItem}
            onUpdateItem={handleUpdateItem}
            onDeleteItem={handleDeleteItem}
            onUpdateTable={handleUpdateTable}
            onUpdateCategory={handleUpdateCategory}
            onDeleteCategory={handleDeleteCategory}
            onReorderCategories={handleReorderCategories}
            lang={lang}
          />
        )}

        {activeView === "tenant_users" && (
          <TenantUsersView currentTenant={currentTenant} />
        )}

        {activeView === "saas_subscriptions" && (
          <SaaSSubscriptionsView
            tenants={tenants}
            currentTenant={currentTenant}
            isSuperAdmin={true}
          />
        )}

        {activeView === "digital_menu" && (
          <DigitalMenuView
            tenant={currentTenant}
            categories={categories}
            items={items}
            tables={tables}
            onOrderCreated={(ord) => {
              // Could alert POS or just display confirmation
            }}
            lang={lang}
          />
        )}

        {activeView === "ai_assistant" && (
          <AIAssistantView tenant={currentTenant} lang={lang} />
        )}

        {activeView === "postgres_export" && (
          <PostgreSQLExportView tenant={currentTenant} />
        )}

        {activeView === "kitchen_display" && (
          <KitchenDisplayView tenant={currentTenant} lang={lang} />
        )}

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500 mt-auto shadow-sm print:hidden">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">
              {lang === 'ar' ? 'ريستو كلاود (RestoCloud)' : 'RestoCloud'}
            </span>
            <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-lg border border-slate-200 font-medium text-[10px]">
              SaaS Multi-Tenant
            </span>
            <span>
              {lang === 'ar' ? '— نظام مبيعات وإدارة المطاعم متعدد المستأجرين (SaaS POS)' : lang === 'tr' ? '— Çok Kiracılı Restoran Yönetim ve POS Sistemi (SaaS POS)' : '— Multi-Tenant Restaurant POS & Management System (SaaS POS)'}
            </span>
          </div>
          <div className="flex items-center gap-4">
            {!currentUser && (
              <>
                <button onClick={() => setActiveView("saas_portal")} className="hover:text-indigo-600 transition-colors cursor-pointer">
                  {lang === 'ar' ? 'بوابة المستأجرين' : lang === 'tr' ? 'Kiracı Portalı' : 'Tenants Portal'}
                </button>
                <button onClick={() => setActiveView("postgres_export")} className="hover:text-indigo-600 transition-colors cursor-pointer">
                  {lang === 'ar' ? 'تصدير PostgreSQL / VPS' : lang === 'tr' ? 'PostgreSQL / VPS Dışa Aktar' : 'Export PostgreSQL / VPS'}
                </button>
              </>
            )}
            <span className="font-mono text-[11px]" dir="ltr">v2.5 Pro</span>
          </div>
        </div>
      </footer>

      {/* SaaS Onboarding Modal */}
      <SaaSOnboardingModal
        isOpen={showOnboardModal}
        onClose={() => setShowOnboardModal(false)}
        onTenantCreated={handleTenantCreated}
      />
    </div>
  );
}
