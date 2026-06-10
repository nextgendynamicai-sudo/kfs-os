import React, { useState } from "react";
import { BookOpen, FileText, Award, Star, ShoppingCart, X, HelpCircle, Check } from "lucide-react";
import { useMerchantFee } from "../hooks/useMerchantFee";
import { useWalletEngine } from "../hooks/useWalletEngine";

interface ProductItem {
  id: string;
  name: string;
  priceUSD: number;
  pointsPrice: number;
  icon: any;
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
      description: "Aprende los fundamentos del float financiero y la liquidez prepagada en 15 minutos."
    },
    {
      id: "prod_dig_2",
      name: "Plantillas Legales SENIAT (B2B)",
      priceUSD: 5.00,
      pointsPrice: 5000,
      icon: FileText,
      description: "Contratos de co-pago y formatos de facturación fiscal listos para imprimir y usar."
    },
    {
      id: "prod_dig_3",
      name: "Asesoría 1-a-1 Kreatek",
      priceUSD: 8.00,
      pointsPrice: 8000,
      icon: Award,
      description: "Sesión estratégica remota con un asesor especializado en escalamiento y optimización de caja."
    },
    {
      id: "prod_dig_4",
      name: "Modelo IA + Guía de Negocio",
      priceUSD: 10.00,
      pointsPrice: 10000,
      icon: Star,
      description: "Script generativo de IA para descripciones de tienda e integraciones de API BCV."
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
    <div className="bg-[#0D1530]/60 backdrop-blur-xl border border-white/15 rounded-[2.5rem] p-6 md:p-8 shadow-2xl space-y-6">
      <div>
        <h3 className="text-xl font-black text-[#C5A184] flex items-center gap-2">
          <ShoppingCart size={24} /> Catálogo Flow Express
        </h3>
        <p className="text-xs text-gray-400 mt-1">
          Tienda digital nativa KFS. Canjea tus K-Points acumulados o usa Pago Híbrido.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {digitalProducts.map((p) => {
          const Icon = p.icon;
          const isOwned = purchasedProducts.includes(p.id);

          return (
            <div
              key={p.id}
              className="bg-black/35 border border-white/5 rounded-2xl p-5 flex flex-col justify-between hover:border-[#C5A184]/40 transition-all gap-4 group"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#C5A184]/10 text-[#C5A184] flex items-center justify-center font-bold">
                    <Icon size={20} />
                  </div>
                  <div>
                    <h4 className="font-black text-gray-100 text-sm md:text-base group-hover:text-[#C5A184] transition-colors">
                      {p.name}
                    </h4>
                    <p className="text-[10px] text-gray-500 font-mono">
                      {p.pointsPrice.toLocaleString()} KP / {formatUSD(p.priceUSD)}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {p.description}
                </p>
              </div>

              {isOwned ? (
                <div className="w-full bg-green-500/10 border border-green-500/30 text-green-400 font-black text-xs py-3 rounded-xl flex items-center justify-center gap-2">
                  <Check size={14} /> Adquirido / Desbloqueado
                </div>
              ) : (
                <button
                  onClick={() => handlePurchase(p)}
                  className="w-full bg-[#C5A184] text-[#0A1128] font-black text-xs py-3 rounded-xl hover:scale-[1.02] active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-lg border border-white/10"
                >
                  Adquirir con Pago Híbrido
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Recharge Required Modal */}
      {showRechargeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md px-4">
          <div className="bg-[#0A1128] border border-[#C5A184]/30 rounded-[2.5rem] p-6 max-w-md w-full text-white shadow-2xl relative animate-fade-in space-y-6">
            <button
              onClick={() => setShowRechargeModal(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-red-500/10 rounded-full border border-red-500/30 flex items-center justify-center mx-auto text-red-400">
                <HelpCircle size={32} />
              </div>
              <h4 className="text-xl font-black text-gray-100">Saldo Insuficiente</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Tu saldo consolidado (K-Points + Saldo Real) es insuficiente para adquirir **{selectedProduct?.name}**.
              </p>
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex justify-between text-xs font-mono">
                <span>Necesitas:</span>
                <span className="text-[#C5A184] font-bold">
                  {selectedProduct ? formatUSD(selectedProduct.priceUSD) : ""}
                </span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest text-center">
                Recarga Express ahora (Recibe Bono KP)
              </p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleModalRecharge(5)}
                  className="bg-[#C5A184]/15 hover:bg-[#C5A184] hover:text-[#0A1128] border border-[#C5A184]/35 rounded-xl py-3 px-1 text-center transition-all cursor-pointer font-black text-xs"
                >
                  $5 (+2K KP)
                </button>
                <button
                  onClick={() => handleModalRecharge(10)}
                  className="bg-[#C5A184]/20 hover:bg-[#C5A184] hover:text-[#0A1128] border border-[#C5A184]/45 rounded-xl py-3 px-1 text-center transition-all cursor-pointer font-black text-xs relative overflow-hidden"
                >
                  $10 (+5K KP)
                </button>
                <button
                  onClick={() => handleModalRecharge(20)}
                  className="bg-[#C5A184]/25 hover:bg-[#C5A184] hover:text-[#0A1128] border border-[#C5A184]/55 rounded-xl py-3 px-1 text-center transition-all cursor-pointer font-black text-xs"
                >
                  $20 (+12K KP)
                </button>
              </div>
            </div>

            <div className="text-center pt-2">
              <button
                onClick={() => setShowRechargeModal(false)}
                className="text-xs text-gray-400 hover:text-white transition-colors cursor-pointer"
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
