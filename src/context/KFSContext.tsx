"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { supabase, isSupabaseConfigured } from "./supabase";

const MOCK_BCV_RATES = {
  USD: 36.45,
  EUR: 39.20
};

const initialDB = {
  promotoras: [],
  clients: [],
  vendedores: [],
  products: [],
  transactions: [],
  orders: [],
  expenses: [],
  crm: [], // { id, phone, totalSpent, purchasesCount, lastPurchase }
  vales: [], // { id, recipientName, type, amountUSD, surchargePct, totalDueUSD, dueDate, status, timestamp }
  posTerminals: [], // { id, name, status, assignedVendedorId, type, connectionInfo, transactionsCount, totalAmountUSD, clientId }
  zReports: [], // { id, vendedorId, clientId, totalUSD, bs, usd, zelle, date }
  kreatekCore: {
    totalTransactions: 0,
    earningsEUR: 0, // gross
    netEarningsEUR: 0,
    adBudgetEUR: 0
  }
};

interface KFSContextType {
  isClient: boolean;
  isBooting: boolean;
  view: string;
  setView: (view: string) => void;
  currentUser: any;
  setCurrentUser: (user: any) => void;
  toast: { show: boolean; message: string; type: string };
  showToast: (message: string, type?: "success" | "error") => void;
  rates: typeof MOCK_BCV_RATES;
  db: typeof initialDB;
  setDb: React.Dispatch<React.SetStateAction<typeof initialDB>>;
  formatUSD: (val: number) => string;
  formatEUR: (val: number) => string;
  handleLogin: (role: string, password: string, email?: string | null) => void;
  logout: () => void;
  registerClient: (clientData: any, promotoraId: string, kfsFeePercentage: number) => void;
  registerPromotora: (promoData: any) => void;
  approvePromotora: (id: string) => void;
  rejectPromotora: (id: string) => void;
  settlePromotoraEarnings: (promotoraId: string) => void;
  addProduct: (productData: any) => void;
  addExpense: (expenseData: any) => void;
  processPurchase: (product: any, paymentMethod?: string, applyIva?: boolean, customerPhone?: string) => any;
  submitOnlineOrder: (product: any, paymentMethod: string, applyIva: boolean, paymentReference: string, customerPhone?: string) => void;
  approveOrder: (orderId: string) => void;
  rejectOrder: (orderId: string) => void;
  generateZReport: (vendedorId: string, clientId: string) => void;
  networkState: "online" | "mesh" | "offline";
  setNetworkState: (state: "online" | "mesh" | "offline") => void;
  smsConciliator: (smsText: string) => { matched: boolean; order?: any; bank?: string; amount?: number; reference?: string; phone?: string; error?: string };
  registerCrmExpress: (idCard: string, name: string, surname: string, phone?: string) => void;
  ghostTrapLocked: boolean;
  setGhostTrapLocked: (locked: boolean) => void;
  createVale: (valeData: any) => void;
  payVale: (valeId: string, amount: number) => void;
  registerPosTerminal: (posData: any) => void;
  deletePosTerminal: (posId: string) => void;
}

const KFSContext = createContext<KFSContextType | undefined>(undefined);

export function KFSProvider({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false);
  const [isBooting, setIsBooting] = useState(true);
  const [view, setView] = useState("login"); 
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [rates, setRates] = useState(MOCK_BCV_RATES);
  const [db, setDb] = useState<any>(initialDB);
  const [networkState, setNetworkState] = useState<"online" | "mesh" | "offline">("online");
  const [ghostTrapLocked, setGhostTrapLocked] = useState(false);

  const ghostTrapActive = useRef(true);

  // Hydration and Boot timer
  useEffect(() => {
    setIsClient(true);
    
    // Sincronización con el Banco Central de Venezuela (API Route)
    fetch("/api/bcv")
      .then(res => res.json())
      .then(data => {
        if (data.USD && data.EUR) {
          setRates({ USD: data.USD, EUR: data.EUR });
          console.log("BCV Rates Synced:", data);
        }
      })
      .catch(err => console.error("Fallo al obtener BCV, usando mock", err))
      .finally(() => {
        setIsBooting(false);
      });

    try {
      const saved = localStorage.getItem("kreatek_os_db");
      if (saved) {
        setDb(JSON.parse(saved));
      }
      
      if (isSupabaseConfigured && navigator.onLine) {
        let tempDb = null;
        try { if (saved) tempDb = JSON.parse(saved); } catch(e){}
        const syncId = tempDb?.clients?.[0]?.id || "kfs-general-db";
        
        supabase
          .from("kfs_store_states")
          .select("db_state")
          .eq("id", syncId)
          .single()
          .then(({ data }: any) => {
            if (data && data.db_state) {
              setDb(data.db_state);
              console.log("[Supabase Cloud] Base de datos restaurada desde la nube.");
            }
          })
          .catch((err: any) => console.log("Supabase initial sync bypass:", err));
      }
    } catch (error) {
      console.warn("Entorno restringido detectado. Activando memoria volátil.");
    }

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(err => console.error("SW failed", err));
    }
  }, []);

  // Save DB to LocalStorage & Supabase Cloud
  useEffect(() => {
    if (!isClient) return;
    try {
      localStorage.setItem("kreatek_os_db", JSON.stringify(db));
      
      if (isSupabaseConfigured && networkState === "online") {
        const syncId = currentUser?.id || db.clients?.[0]?.id || "kfs-general-db";
        supabase
          .from("kfs_store_states")
          .upsert({
            id: syncId,
            db_state: db,
            updated_at: new Date().toISOString()
          })
          .then(({ error }: any) => {
            if (error) console.error("Error al sincronizar con Supabase:", error);
            else console.log("[Supabase Cloud] Estado sincronizado asíncronamente.");
          });
      }
    } catch (error) {
      // Ignorar bloqueos locales
    }
  }, [db, isClient, networkState, currentUser]);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  const formatUSD = (val: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(val);
  const formatEUR = (val: number) => new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(val);

  const handleLogin = (role: string, password: string, email: string | null = null) => {
    const isProvisional = password === "123123";

    if (role === "core" && (password === "199521" || isProvisional)) {
      setCurrentUser({ role: "core", name: "El Arquitecto" });
      setView("core");
      showToast("KFS OS Accesado. Bienvenido, Arquitecto.");
    } else if (role === "promotora") {
      if (password === "1995" || isProvisional) {
        setCurrentUser({ role: "promotora", name: "Promotora Alpha", id: "p1" });
        setView("promotora");
        showToast("Sesión de Promotora Maestra Iniciada.");
      } else {
        const promo = db.promotoras.find((p: any) => p.email === email && p.password === password);
        if (promo) {
          if (promo.status === 'pending') {
            showToast("Su cuenta está pendiente de aprobación por KFS.", "error");
          } else {
            setCurrentUser({ ...promo, role: "promotora" });
            setView("promotora");
            showToast(`Hub Promotora Accesado: ${promo.name}`);
          }
        } else {
          showToast("Credenciales de promotora inválidas.", "error");
        }
      }
    } else if (role === "dueño") {
      if (password === "1234" || isProvisional) {
        const client = db.clients.find((c: any) => c.email === email) || db.clients[0];
        if (client) {
          setCurrentUser({ ...client, role: "dueño" });
          setView("client");
          showToast(`Bienvenido al comercio: ${client.company}`);
        } else {
          showToast("Dueño no encontrado. Regístrese.", "error");
        }
      } else {
        const client = db.clients.find((c: any) => c.email === email && c.password === password);
        if (client) {
          setCurrentUser({ ...client, role: "dueño" });
          setView("client");
          showToast(`Bienvenido al comercio: ${client.company}`);
        } else {
          showToast("Credenciales de dueño incorrectas.", "error");
        }
      }
    } else if (role === "vendedor") {
      if (isProvisional) {
        const vendedorDemo = db.vendedores[0];
        if (vendedorDemo) {
          setCurrentUser({ ...vendedorDemo, role: "vendedor" });
          setView("vendedor");
          showToast(`Terminal de Vendedor activado: ${vendedorDemo.name}`);
        } else {
          showToast("No hay vendedores registrados para usar la clave provisional.", "error");
        }
      } else {
        const vendedor = db.vendedores.find((v: any) => v.email === email && v.password === password);
        if (vendedor) {
           setCurrentUser({ ...vendedor, role: "vendedor" });
           setView("vendedor");
           showToast(`Terminal de Vendedor activado: ${vendedor.name}`);
        } else {
           showToast("Credenciales de vendedor inválidas.", "error");
        }
      }
    } else if (role === "marketplace") {
      setView("marketplace");
    } else {
      showToast("Credenciales inválidas.", "error");
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setView("login");
  };

  const registerClient = (clientData: any, promotoraId: string, kfsFeePercentage: number) => {
    const newClient = { 
      ...clientData, 
      id: `c${Date.now()}`, 
      salesUSD: 0, 
      promotoraId, 
      rating: 5.0, 
      reviewCount: 0,
      kfsFeePercentage, // 0.03, 0.05, 0.10
      kfsFeesOwedUSD: 0
    };

    setDb((prev: any) => {
      const updatedPromotoras = prev.promotoras.map((p: any) => {
        if (p.id === promotoraId) {
          return { ...p, setups: (p.setups || 0) + 1 };
        }
        return p;
      });
      return { ...prev, clients: [...prev.clients, newClient], promotoras: updatedPromotoras };
    });

    showToast("Setup de Cliente completado con éxito.");
    if (view !== "promotora") setView("login");
  };

  const registerPromotora = (promoData: any) => {
    const newPromo = { ...promoData, id: `p${Date.now()}`, setups: 0, earningsEUR: 0, status: 'pending' };
    setDb((prev: any) => ({ ...prev, promotoras: [...prev.promotoras, newPromo] }));
    showToast("Solicitud enviada. En espera de aprobación.");
    setView("login");
  };

  const approvePromotora = (id: string) => {
    setDb((prev: any) => ({
      ...prev,
      promotoras: prev.promotoras.map((p: any) => p.id === id ? { ...p, status: 'active' } : p)
    }));
    showToast("Promotora activada.");
  };

  const rejectPromotora = (id: string) => {
    setDb((prev: any) => ({
      ...prev,
      promotoras: prev.promotoras.filter((p: any) => p.id !== id)
    }));
    showToast("Solicitud rechazada y eliminada.");
  };

  const settlePromotoraEarnings = (promotoraId: string) => {
    setDb((prev: any) => ({
      ...prev,
      promotoras: prev.promotoras.map((p: any) => 
        p.id === promotoraId ? { ...p, passiveEarningsEUR: 0 } : p
      )
    }));
    showToast("Regalías liquidadas y saldo reseteado a 0.", "success");
  };

  const addProduct = (productData: any) => {
    setDb((prev: any) => ({ ...prev, products: [...prev.products, { ...productData, id: `prod${Date.now()}` }] }));
    showToast("Producto sincronizado con el Marketplace.");
  };

  const addExpense = (expenseData: any) => {
    setDb((prev: any) => ({ ...prev, expenses: [...(prev.expenses || []), { ...expenseData, id: `exp${Date.now()}` }] }));
    showToast("Egreso registrado contablemente.");
  };

  const processPurchase = (product: any, paymentMethod: string = "cash", applyIva: boolean = false, customerPhone: string = "") => {
    if (product.stock !== undefined && product.stock <= 0) {
      showToast("Producto agotado", "error");
      return null;
    }

    const priceUSD = product.priceUSD;
    const ivaUSD = applyIva ? priceUSD * 0.16 : 0;
    const isForeign = ['zelle', 'cash_usd', 'cash_eur', 'binance'].includes(paymentMethod);
    const igtfUSD = isForeign ? (priceUSD + ivaUSD) * 0.03 : 0;
    const totalUSD = priceUSD + ivaUSD + igtfUSD;
    const receiptNumber = `REC-${Date.now().toString().slice(-4)}`;

    let transactionObj: any = null;

    setDb((prev: any) => {
      const client = prev.clients.find((c: any) => c.id === product.clientId);
      const kfsFeePercentage = client?.kfsFeePercentage || 0.03; // default fallback
      const kreatekPctFeeUSD = priceUSD * kfsFeePercentage; // % de venta bruta
      const posFeeUSD = 0.04;
      const kreatekTotalFeeUSD = kreatekPctFeeUSD + posFeeUSD;
      const kreatekTotalFeeEUR = (kreatekTotalFeeUSD * rates.USD) / rates.EUR;
      
      const promotoraFeeEUR = kreatekTotalFeeEUR * 0.20; // Promotora gana 20%
      const kreatekNetEUR = kreatekTotalFeeEUR - promotoraFeeEUR;
      const adBudgetEUR = kreatekNetEUR * 0.20; // 20% de ganancia neta para ads
      const finalNetEUR = kreatekNetEUR - adBudgetEUR;

      const updatedClients = prev.clients.map((c: any) => 
        c.id === product.clientId ? { 
          ...c, 
          salesUSD: (c.salesUSD || 0) + priceUSD,
          kfsFeesOwedUSD: (c.kfsFeesOwedUSD || 0) + kreatekTotalFeeUSD
        } : c
      );

      const updatedPromotoras = prev.promotoras.map((p: any) => 
        p.id === client?.promotoraId ? {
          ...p,
          passiveEarningsEUR: (p.passiveEarningsEUR || 0) + promotoraFeeEUR
        } : p
      );

      const updatedProducts = prev.products.map((p: any) => 
        p.id === product.id && p.stock !== undefined ? { ...p, stock: p.stock - 1 } : p
      );

      if (ghostTrapActive.current) {
        console.log(`[Ghost Protocol] Detonando captura de datos para tx_id: ${Date.now()}`);
      }
      
      transactionObj = {
        id: `tx${Date.now()}`, 
        productId: product.id, 
        amountUSD: totalUSD,
        subtotalUSD: priceUSD,
        ivaUSD,
        igtfUSD,
        paymentMethod,
        receiptNumber,
        kreatekFeeEUR: kreatekTotalFeeEUR,
        customerPhone,
        vendedorId: currentUser?.role === 'vendedor' ? currentUser.id : null,
        clientId: product.clientId,
        timestamp: new Date().toISOString()
      };

      // Handle CRM
      let updatedCrm = prev.crm || [];
      if (customerPhone) {
        const existing = updatedCrm.find((c: any) => c.phone === customerPhone);
        if (existing) {
          updatedCrm = updatedCrm.map((c: any) => c.phone === customerPhone ? {
            ...c, totalSpent: c.totalSpent + totalUSD, purchasesCount: c.purchasesCount + 1, lastPurchase: new Date().toISOString()
          } : c);
        } else {
          updatedCrm = [...updatedCrm, { id: `crm${Date.now()}`, phone: customerPhone, totalSpent: totalUSD, purchasesCount: 1, lastPurchase: new Date().toISOString() }];
        }
      }

      // Handle Vales balance deduction
      let updatedVales = prev.vales || [];
      if (paymentMethod === "vale_credit" && customerPhone) {
        const activeValeIndex = updatedVales.findIndex((v: any) => (v.recipientName === customerPhone || v.id === customerPhone) && v.status === "pending");
        if (activeValeIndex !== -1) {
          const vale = updatedVales[activeValeIndex];
          const rem = Math.max(0, vale.totalDueUSD - totalUSD);
          updatedVales = updatedVales.map((v: any, idx: number) => idx === activeValeIndex ? {
            ...v,
            totalDueUSD: rem,
            status: rem <= 0.01 ? "paid" : "pending"
          } : v);
        }
      }

      // Handle POS Integrated stats
      let updatedPosTerminals = prev.posTerminals || [];
      if (paymentMethod === "pos_integrated") {
        const currentVendedorId = currentUser?.role === 'vendedor' ? currentUser.id : null;
        updatedPosTerminals = updatedPosTerminals.map((p: any) => {
          if (p.assignedVendedorId === currentVendedorId && p.clientId === product.clientId) {
            return {
              ...p,
              transactionsCount: (p.transactionsCount || 0) + 1,
              totalAmountUSD: (p.totalAmountUSD || 0) + totalUSD
            };
          }
          return p;
        });
      }

      return {
        ...prev,
        clients: updatedClients,
        promotoras: updatedPromotoras,
        products: updatedProducts,
        crm: updatedCrm,
        vales: updatedVales,
        posTerminals: updatedPosTerminals,
        transactions: [...prev.transactions, transactionObj],
        kreatekCore: {
          totalTransactions: (prev.kreatekCore.totalTransactions || 0) + 1,
          earningsEUR: (prev.kreatekCore.earningsEUR || 0) + kreatekTotalFeeEUR,
          netEarningsEUR: (prev.kreatekCore.netEarningsEUR || 0) + finalNetEUR,
          adBudgetEUR: (prev.kreatekCore.adBudgetEUR || 0) + adBudgetEUR
        }
      };
    });
    
    showToast(`Compra procesada. Recibo ${receiptNumber}`);
    
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("kfs-purchase", { detail: { ...product, finalTotalUSD: totalUSD } }));
    }
    
    return transactionObj;
  };

  const submitOnlineOrder = (product: any, paymentMethod: string, applyIva: boolean, paymentReference: string, customerPhone: string = "") => {
    if (product.stock !== undefined && product.stock <= 0) {
      showToast("Producto agotado", "error");
      return;
    }

    const priceUSD = product.priceUSD;
    const ivaUSD = applyIva ? priceUSD * 0.16 : 0;
    const isForeign = ['zelle', 'cash_usd', 'cash_eur', 'binance'].includes(paymentMethod);
    const igtfUSD = isForeign ? (priceUSD + ivaUSD) * 0.03 : 0;
    const totalUSD = priceUSD + ivaUSD + igtfUSD;

    setDb((prev: any) => {
      const updatedProducts = prev.products.map((p: any) => 
        p.id === product.id && p.stock !== undefined ? { ...p, stock: p.stock - 1 } : p
      );

      const orderObj = {
        id: `ord${Date.now()}`,
        productId: product.id,
        clientId: product.clientId, // to identify which store it belongs to
        amountUSD: totalUSD,
        subtotalUSD: priceUSD,
        ivaUSD,
        igtfUSD,
        paymentMethod,
        paymentReference,
        customerPhone,
        status: 'pending',
        timestamp: new Date().toISOString()
      };

      return {
        ...prev,
        products: updatedProducts,
        orders: [...(prev.orders || []), orderObj]
      };
    });

    showToast("Orden enviada a revisión del comercio.");
  };

  const approveOrder = (orderId: string) => {
    const order = db.orders.find((o: any) => o.id === orderId);
    if (!order) return;

    const receiptNumber = `ONL-${Date.now().toString().slice(-4)}`;

    setDb((prev: any) => {
      const client = prev.clients.find((c: any) => c.id === order.clientId);
      const kfsFeePercentage = client?.kfsFeePercentage || 0.03;
      const kreatekTotalFeeUSD = order.subtotalUSD * kfsFeePercentage; // Online orders do NOT have the $0.04 POS fee
      const kreatekTotalFeeEUR = (kreatekTotalFeeUSD * rates.USD) / rates.EUR;
      
      const promotoraFeeEUR = kreatekTotalFeeEUR * 0.20;
      const kreatekNetEUR = kreatekTotalFeeEUR - promotoraFeeEUR;
      const adBudgetEUR = kreatekNetEUR * 0.20;
      const finalNetEUR = kreatekNetEUR - adBudgetEUR;

      const updatedClients = prev.clients.map((c: any) => 
        c.id === order.clientId ? { 
          ...c, 
          salesUSD: (c.salesUSD || 0) + order.subtotalUSD,
          kfsFeesOwedUSD: (c.kfsFeesOwedUSD || 0) + kreatekTotalFeeUSD 
        } : c
      );

      const updatedPromotoras = prev.promotoras.map((p: any) => 
        p.id === client?.promotoraId ? {
          ...p,
          passiveEarningsEUR: (p.passiveEarningsEUR || 0) + promotoraFeeEUR
        } : p
      );

      const transactionObj = {
        id: `tx${Date.now()}`, 
        productId: order.productId, 
        amountUSD: order.amountUSD,
        subtotalUSD: order.subtotalUSD,
        ivaUSD: order.ivaUSD,
        igtfUSD: order.igtfUSD,
        paymentMethod: order.paymentMethod,
        receiptNumber,
        kreatekFeeEUR: kreatekTotalFeeEUR,
        reference: order.paymentReference,
        customerPhone: order.customerPhone,
        clientId: order.clientId,
        timestamp: new Date().toISOString()
      };

      // Handle CRM for online orders
      let updatedCrm = prev.crm || [];
      if (order.customerPhone) {
        const existing = updatedCrm.find((c: any) => c.phone === order.customerPhone);
        if (existing) {
          updatedCrm = updatedCrm.map((c: any) => c.phone === order.customerPhone ? {
            ...c, totalSpent: c.totalSpent + order.amountUSD, purchasesCount: c.purchasesCount + 1, lastPurchase: new Date().toISOString()
          } : c);
        } else {
          updatedCrm = [...updatedCrm, { id: `crm${Date.now()}`, phone: order.customerPhone, totalSpent: order.amountUSD, purchasesCount: 1, lastPurchase: new Date().toISOString() }];
        }
      }

      return {
        ...prev,
        clients: updatedClients,
        promotoras: updatedPromotoras,
        crm: updatedCrm,
        orders: prev.orders.filter((o: any) => o.id !== orderId),
        transactions: [...prev.transactions, transactionObj],
        kreatekCore: {
          totalTransactions: (prev.kreatekCore.totalTransactions || 0) + 1,
          earningsEUR: (prev.kreatekCore.earningsEUR || 0) + kreatekTotalFeeEUR,
          netEarningsEUR: (prev.kreatekCore.netEarningsEUR || 0) + finalNetEUR,
          adBudgetEUR: (prev.kreatekCore.adBudgetEUR || 0) + adBudgetEUR
        }
      };
    });

    showToast("Pago validado y orden procesada.");
  };

  const rejectOrder = (orderId: string) => {
    setDb((prev: any) => {
      const order = prev.orders.find((o: any) => o.id === orderId);
      if (!order) return prev;
      
      const updatedProducts = prev.products.map((p: any) => 
        p.id === order.productId && p.stock !== undefined ? { ...p, stock: p.stock + 1 } : p
      );

      return {
        ...prev,
        products: updatedProducts,
        orders: prev.orders.filter((o: any) => o.id !== orderId)
      };
    });
    setGhostTrapLocked(true);
    showToast("¡CRÍTICO! Intento de rechazo de orden online interceptado. Terminal bloqueado.", "error");
  };

  const generateZReport = (vendedorId: string, clientId: string) => {
    setDb((prev: any) => {
      const shiftTxs = prev.transactions.filter((tx: any) => tx.vendedorId === vendedorId && tx.clientId === clientId && !tx.zReported);
      
      if (shiftTxs.length === 0) {
        showToast("No hay transacciones nuevas para cerrar turno.", "error");
        return prev;
      }

      let totalUSD = 0;
      let breakdown: any = {};
      shiftTxs.forEach((tx: any) => {
        totalUSD += tx.amountUSD;
        breakdown[tx.paymentMethod] = (breakdown[tx.paymentMethod] || 0) + tx.amountUSD;
      });

      const zReportObj = {
        id: `z${Date.now()}`,
        vendedorId,
        clientId,
        totalUSD,
        breakdown,
        txCount: shiftTxs.length,
        timestamp: new Date().toISOString()
      };

      const updatedTxs = prev.transactions.map((tx: any) => 
        (tx.vendedorId === vendedorId && tx.clientId === clientId && !tx.zReported) 
          ? { ...tx, zReported: true } 
          : tx
      );

      showToast("Corte de Caja Exitoso (Reporte Z Generado).");
      return {
        ...prev,
        transactions: updatedTxs,
        zReports: [...(prev.zReports || []), zReportObj]
      };
    });
  };

  const smsConciliator = (smsText: string) => {
    let bank = "Pago Móvil";
    let amount = 0;
    let reference = "";
    let phone = "";

    const text = smsText.toLowerCase();

    if (text.includes("mercantil")) bank = "Mercantil";
    else if (text.includes("banesco")) bank = "Banesco";
    else if (text.includes("provincial")) bank = "Provincial";
    else if (text.includes("venezuela") || text.includes("bdv")) bank = "Banco de Venezuela";
    else if (text.includes("zelle")) bank = "Zelle";

    // Extract reference
    const refMatch = smsText.match(/(?:ref|referencia|nro|aprobacion|confirmacion)[:\s#]*([0-9]+)/i) || smsText.match(/\b([0-9]{6,12})\b/);
    if (refMatch) {
      reference = refMatch[1];
    }

    // Extract amount
    const amtMatch = smsText.match(/(?:bs\.?\s*|usd\s*|\$\s*)([0-9.,]+)/i) || smsText.match(/([0-9.,]+)\s*(?:bs|usd)/i);
    if (amtMatch) {
      const rawAmt = amtMatch[1];
      if (rawAmt.includes('.') && rawAmt.includes(',')) {
        amount = parseFloat(rawAmt.replace(/\./g, '').replace(/,/g, '.'));
      } else if (rawAmt.includes(',')) {
        amount = parseFloat(rawAmt.replace(/,/g, '.'));
      } else {
        amount = parseFloat(rawAmt);
      }
    }

    // Extract phone
    const phoneMatch = smsText.match(/\b(04\d{9})\b/);
    if (phoneMatch) {
      phone = phoneMatch[1];
    }

    if (!reference) {
      return { matched: false, error: "No se detectó un número de referencia válido en el SMS." };
    }

    // Search pending online orders
    const pendingOrder = db.orders.find((o: any) => o.paymentReference === reference && o.status === 'pending');

    if (pendingOrder) {
      approveOrder(pendingOrder.id);
      return {
        matched: true,
        order: pendingOrder,
        bank,
        amount,
        reference,
        phone
      };
    }

    return {
      matched: false,
      bank,
      amount,
      reference,
      phone,
      error: `Pago de Bs. ${amount} (Ref: ${reference}) leído con éxito, pero no coincide con ninguna orden online pendiente.`
    };
  };

  const registerCrmExpress = (idCard: string, name: string, surname: string, phone: string = "") => {
    setDb((prev: any) => {
      let updatedCrm = prev.crm || [];
      const existing = updatedCrm.find((c: any) => c.idCard === idCard);
      if (existing) {
        updatedCrm = updatedCrm.map((c: any) => c.idCard === idCard ? {
          ...c, name, surname, phone: phone || c.phone, lastPurchase: new Date().toISOString()
        } : c);
      } else {
        updatedCrm = [...updatedCrm, {
          id: `crm${Date.now()}`,
          idCard,
          name,
          surname,
          phone: phone || `0414-${Math.floor(1000000 + Math.random() * 9000000)}`,
          totalSpent: 0,
          purchasesCount: 0,
          lastPurchase: new Date().toISOString()
        }];
      }
      return {
        ...prev,
        crm: updatedCrm
      };
    });
  };

  const createVale = (valeData: any) => {
    const newVale = {
      ...valeData,
      id: `VALE-${Date.now().toString().slice(-4)}`,
      totalDueUSD: valeData.amountUSD * (1 + (valeData.surchargePct || 0)),
      status: "pending",
      timestamp: new Date().toISOString()
    };
    setDb((prev: any) => ({
      ...prev,
      vales: [...(prev.vales || []), newVale]
    }));
    showToast(`Vale emitido con éxito: ${newVale.id}`);
  };

  const payVale = (valeId: string, amount: number) => {
    setDb((prev: any) => {
      const updatedVales = (prev.vales || []).map((v: any) => {
        if (v.id === valeId) {
          const rem = Math.max(0, v.totalDueUSD - amount);
          return {
            ...v,
            totalDueUSD: rem,
            status: rem <= 0.01 ? "paid" : v.status
          };
        }
        return v;
      });
      return { ...prev, vales: updatedVales };
    });
    showToast(`Abono registrado para vale: ${valeId}`);
  };

  const registerPosTerminal = (posData: any) => {
    const newPos = {
      ...posData,
      id: `POS-${Date.now().toString().slice(-4)}`,
      status: "connected",
      transactionsCount: 0,
      totalAmountUSD: 0,
      timestamp: new Date().toISOString()
    };
    setDb((prev: any) => ({
      ...prev,
      posTerminals: [...(prev.posTerminals || []), newPos]
    }));
    showToast(`Punto de Venta registrado con éxito: ${newPos.name}`, "success");
  };

  const deletePosTerminal = (posId: string) => {
    setDb((prev: any) => ({
      ...prev,
      posTerminals: (prev.posTerminals || []).filter((p: any) => p.id !== posId)
    }));
    showToast("Terminal POS retirado contablemente.");
  };

  return (
    <KFSContext.Provider value={{
      isClient, isBooting, view, setView, currentUser, setCurrentUser,
      toast, showToast, rates, db, setDb, formatUSD, formatEUR,
      handleLogin, logout, registerClient, registerPromotora, approvePromotora, rejectPromotora, settlePromotoraEarnings,
      addProduct, addExpense, processPurchase, submitOnlineOrder, approveOrder, rejectOrder, generateZReport,
      networkState, setNetworkState, smsConciliator, registerCrmExpress,
      ghostTrapLocked, setGhostTrapLocked, createVale, payVale, registerPosTerminal, deletePosTerminal
    }}>
      {children}
    </KFSContext.Provider>
  );
}

export function useKFS() {
  const context = useContext(KFSContext);
  if (context === undefined) {
    throw new Error("useKFS must be used within a KFSProvider");
  }
  return context;
}
