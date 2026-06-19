import React, { useState } from "react";
import { BookOpen, FileText, Award, Star, ShoppingCart, X, HelpCircle, Check, UserCheck, PenTool, Camera, MonitorPlay } from "lucide-react";
import { useMerchantFee } from "../hooks/useMerchantFee";
import { useWalletEngine } from "../hooks/useWalletEngine";

interface ProductItem {
  id: string;
  name: string;
  priceUSD: number;
  pointsPrice: number;
  icon: any;
  image?: string;
  description: string;
}

interface FlowExpressCatalogProps {
  currentUser: any;
  formatUSD: (val: number) => string;
}

export function FlowExpressCatalog({ currentUser, formatUSD }: FlowExpressCatalogProps) {
  const { processSplitPayment } = useMerchantFee();
  const { rechargeCustomerWallet, awardCashback } = useWalletEngine();

  const [showRechargeModal, setShowRechargeModal] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [purchasedProducts, setPurchasedProducts] = useState<string[]>([]);

  const digitalProducts: ProductItem[] = [
    {
      id: "prod_dig_1",
      name: "Curso Express",
      priceUSD: 0.50,
      pointsPrice: 500,
      icon: BookOpen,
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800",
      description: "Aprende los fundamentos del float financiero y la liquidez prepagada en 15 minutos."
    },
    {
      id: "prod_dig_2",
      name: "Plantillas Legales SENIAT (B2B)",
      priceUSD: 5.00,
      pointsPrice: 5000,
      icon: FileText,
      image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800",
      description: "Contratos de co-pago y formatos de facturación fiscal listos para imprimir y usar."
    },
    {
      id: "prod_dig_3",
      name: "Asesoría 1-a-1 Kreatek",
      priceUSD: 8.00,
      pointsPrice: 8000,
      icon: Award,
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800",
      description: "Sesión estratégica remota con un asesor especializado en escalamiento y optimización de caja."
    },
    {
      id: "prod_dig_4",
      name: "Modelo IA + Guía de Negocio",
      priceUSD: 10.00,
      pointsPrice: 10000,
      icon: Star,
      image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=800",
      description: "Script generativo de IA para descripciones de tienda e integraciones de API BCV."
    },
    {
      id: "prod_dig_5",
      name: "Asesoría con CEO y Fundador",
      priceUSD: 30.00,
      pointsPrice: 30000,
      icon: UserCheck,
      image: "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&q=80&w=800",
      description: "Reunión ejecutiva para evaluar la visión, escalabilidad y oportunidades de tu negocio directamente con el CEO."
    },
    {
      id: "prod_dig_6",
      name: "20 Diseños para Marketing",
      priceUSD: 25.00,
      pointsPrice: 25000,
      icon: PenTool,
      image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=800",
      description: "Paquete de 20 diseños gráficos premium adaptados a tu marca para redes sociales y campañas publicitarias."
    },
    {
      id: "prod_dig_7",
      name: "8 Reels Profesionales",
      priceUSD: 90.00,
      pointsPrice: 90000,
      icon: Camera,
      image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=800",
      description: "Creación, edición y montaje de 8 Reels/TikToks dinámicos enfocados en conversión y viralidad."
    },
    {
      id: "prod_dig_8",
      name: "5 Pautas Publicitarias (Grabación y Edición)",
      priceUSD: 300.00,
      pointsPrice: 300000,
      icon: MonitorPlay,
      image: "https://images.unsplash.com/photo-1601506521937-0121a7fc2a6b?auto=format&fit=crop&q=80&w=800",
      description: "Producción completa de 5 pautas publicitarias de alto impacto con equipo profesional (grabación y edición incluidas)."
    }
  ];

  const handlePurchase = (product: ProductItem) => {
    if (!currentUser) {
      alert("Debes iniciar sesión para adquirir productos.");
      return;
    }

    const userKP = currentUser.k_points_balance || 0;
    const userReal = currentUser.real_balance || 0;

    // Convert points to USD equivalent (1000 KP = $1.00)
    const pointsUSDValue = userKP / 1000;
    const totalUserBalanceUSD = userReal + pointsUSDValue;

    if (totalUserBalanceUSD < product.priceUSD) {
      setSelectedProduct(product);
      setShowRechargeModal(true);
      return;
    }

    // Determine how much K-Points and Real USD to use
    // We spend as much K-Points as possible first (since they expire)
    const pointsToUse = Math.min(userKP, product.pointsPrice);
    const usdEquivalentUsed = pointsToUse / 1000;
    const realUSDNeeded = Math.max(0, product.priceUSD - usdEquivalentUsed);

    // Call the split payment processor.
    // Flow Express digital catalog is a virtual Kreatek store, let's use client ID "kfs-express"
    const tx = processSplitPayment("kfs-express", currentUser.phone, product.priceUSD, pointsToUse);

    if (tx) {
      // Award 1% cashback on the real balance portion spent
      if (realUSDNeeded > 0) {
        awardCashback(currentUser.phone, realUSDNeeded);
      }
      setPurchasedProducts((prev) => [...prev, product.id]);
    }
  };

  const handleModalRecharge = (amount: number) => {
    if (!currentUser) return;
    rechargeCustomerWallet(currentUser.phone, amount, currentUser.referred_by_promoter_id);
    setShowRechargeModal(false);
  };

  return (
    <div className="bg-[#EEF2F5] shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] border-none rounded-[2.5rem] p-6 md:p-8 space-y-6">
      <div>
        <h3 className="text-xl font-black text-violet-900 flex items-center gap-2">
          <ShoppingCart size={24} className="text-violet-600" /> Catálogo Flow Express
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          Tienda digital nativa KFS. Canjea tus K-Points acumulados o usa Pago Híbrido.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {digitalProducts.map((p) => {
          const Icon = p.icon;
          const isOwned = purchasedProducts.includes(p.id);

          return (
            <div
              key={p.id}
              className="bg-[#EEF2F5] shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] border-none rounded-3xl overflow-hidden flex flex-col justify-between transition-all group"
            >
              <div>
                {p.image && (
                  <div className="h-40 w-full relative overflow-hidden bg-gray-200">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute top-3 right-3 w-10 h-10 rounded-xl bg-white/80 backdrop-blur-md text-violet-600 flex items-center justify-center shadow-lg border border-white">
                      <Icon size={20} />
                    </div>
                  </div>
                )}
                <div className="p-6 space-y-3">
                  <h4 className="font-black text-violet-900 text-lg group-hover:text-violet-600 transition-colors leading-tight">
                    {p.name}
                  </h4>
                  <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider bg-violet-100 px-3 py-1 rounded-full inline-block shadow-inner">
                    {p.pointsPrice.toLocaleString()} KP / {formatUSD(p.priceUSD)}
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed mt-2 line-clamp-3">
                    {p.description}
                  </p>
                </div>
              </div>
              
              <div className="p-6 pt-0 mt-auto">

              {isOwned ? (
                <div className="w-full bg-emerald-100 border-none text-emerald-600 font-black text-xs py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-[inset_2px_2px_5px_#a7f3d0,inset_-2px_-2px_5px_#ffffff]">
                  <Check size={16} /> Adquirido / Desbloqueado
                </div>
              ) : (
                <button
                  onClick={() => handlePurchase(p)}
                  className="w-full bg-violet-600 text-white font-black text-xs py-3.5 rounded-2xl hover:bg-violet-700 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-[0_10px_20px_rgba(139,92,246,0.3)] border-none"
                >
                  Adquirir con Pago Híbrido
                </button>
              )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Recharge Required Modal */}
      {showRechargeModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-gray-900/40 backdrop-blur-md px-4">
          <div className="bg-[#EEF2F5] border-none rounded-[2.5rem] p-8 max-w-md w-full text-violet-900 shadow-[20px_20px_60px_#d1d9e6,-20px_-20px_60px_#ffffff] relative animate-fade-in space-y-6">
            <button
              onClick={() => setShowRechargeModal(false)}
              className="absolute top-6 right-6 p-2 text-gray-400 hover:text-red-500 transition-colors cursor-pointer bg-white rounded-full shadow-sm hover:shadow-md"
            >
              <X size={20} />
            </button>

            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto text-red-500 shadow-inner">
                <HelpCircle size={40} />
              </div>
              <h4 className="text-2xl font-black text-violet-900">Saldo Insuficiente</h4>
              <p className="text-sm text-gray-500 leading-relaxed">
                Tu saldo consolidado (K-Points + Saldo Real) es insuficiente para adquirir <strong className="text-violet-700">{selectedProduct?.name}</strong>.
              </p>
              <div className="bg-white rounded-2xl p-4 flex justify-between items-center text-sm font-bold shadow-sm">
                <span className="text-gray-500">Monto Requerido:</span>
                <span className="text-violet-600 text-lg font-black">
                  {selectedProduct ? formatUSD(selectedProduct.priceUSD) : ""}
                </span>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-200">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest text-center">
                Recarga Express ahora (Recibe Bono KP)
              </p>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => handleModalRecharge(5)}
                  className="bg-white text-violet-600 hover:bg-violet-600 hover:text-white rounded-2xl py-3 px-2 text-center transition-all cursor-pointer font-black text-sm shadow-[0_5px_15px_rgba(139,92,246,0.15)] border-none"
                >
                  $5 <br/><span className="text-[9px] font-bold opacity-80 block mt-1">+2K KP</span>
                </button>
                <button
                  onClick={() => handleModalRecharge(10)}
                  className="bg-white text-violet-600 hover:bg-violet-600 hover:text-white rounded-2xl py-3 px-2 text-center transition-all cursor-pointer font-black text-sm shadow-[0_5px_15px_rgba(139,92,246,0.15)] border-none"
                >
                  $10 <br/><span className="text-[9px] font-bold opacity-80 block mt-1">+5K KP</span>
                </button>
                <button
                  onClick={() => handleModalRecharge(20)}
                  className="bg-white text-violet-600 hover:bg-violet-600 hover:text-white rounded-2xl py-3 px-2 text-center transition-all cursor-pointer font-black text-sm shadow-[0_5px_15px_rgba(139,92,246,0.15)] border-none"
                >
                  $20 <br/><span className="text-[9px] font-bold opacity-80 block mt-1">+12K KP</span>
                </button>
              </div>
            </div>

            <div className="text-center pt-2">
              <button
                onClick={() => setShowRechargeModal(false)}
                className="text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors cursor-pointer bg-transparent border-none"
              >
                Cancelar y regresar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
