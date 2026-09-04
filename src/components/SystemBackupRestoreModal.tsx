"use client";

import React, { useState, useRef } from "react";
import { ModalPortal } from "./ModalPortal";
import { Download, Upload, ShieldCheck, Database, X, AlertCircle, FileJson, CheckCircle2, RefreshCw } from "lucide-react";
import { playSyncChime, playCashDrawerSound } from "../lib/utils";

interface SystemBackupRestoreModalProps {
  db: any;
  setDb: React.Dispatch<React.SetStateAction<any>>;
  onClose: () => void;
  showToast: (msg: string, type?: string) => void;
}

export const SystemBackupRestoreModal: React.FC<SystemBackupRestoreModalProps> = ({
  db,
  setDb,
  onClose,
  showToast
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [importStats, setImportStats] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. Export Backup
  const handleExportBackup = () => {
    try {
      setIsProcessing(true);
      playSyncChime();

      const backupData = {
        kfsBackupVersion: "8.0.0",
        exportedAt: new Date().toISOString(),
        metadata: {
          clientsCount: db.clients?.length || 0,
          productsCount: db.products?.length || 0,
          customersCount: db.customers?.length || 0,
          transactionsCount: db.transactions?.length || 0,
          promotorasCount: db.promotoras?.length || 0,
          ridersCount: db.riders?.length || 0,
        },
        payload: {
          clients: db.clients || [],
          products: db.products || [],
          customers: db.customers || [],
          promotoras: db.promotoras || [],
          riders: db.riders || [],
          vendedores: db.vendedores || [],
          transactions: db.transactions || [],
          orders: db.orders || [],
          crm: db.crm || [],
          vales: db.vales || [],
          coupons: db.coupons || [],
          posTerminals: db.posTerminals || [],
          kfsGlobalProducts: db.kfsGlobalProducts || [],
          kfsRewardTasks: db.kfsRewardTasks || [],
          kfsRewardSubmissions: db.kfsRewardSubmissions || [],
          storeSettings: db.storeSettings || {},
          kreatekCore: db.kreatekCore || {}
        }
      };

      const jsonStr = JSON.stringify(backupData, null, 2);
      const blob = new Blob([jsonStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      const filename = `kfs_inmune_backup_${new Date().toISOString().split("T")[0]}_${Date.now().toString().slice(-4)}.json`;
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showToast(`Respaldo descargado: ${filename}`, "success");
    } catch (err: any) {
      showToast("Error al generar el respaldo: " + err.message, "error");
    } finally {
      setIsProcessing(false);
    }
  };

  // 2. Import & Safe Merge Backup (Rule 1 Compliant)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        setIsProcessing(true);
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);

        // Validate structure
        const incoming = parsed.payload || parsed;
        if (!incoming.clients && !incoming.products && !incoming.transactions) {
          throw new Error("El archivo no tiene el formato válido de respaldo KFS OS.");
        }

        // Merge helper by ID preserving existing real entries
        const mergeById = (existingList: any[] = [], incomingList: any[] = []) => {
          const map = new Map();
          // First add existing
          existingList.forEach(item => {
            if (item && item.id) map.set(item.id, item);
          });
          // Then merge incoming (upsert)
          incomingList.forEach(item => {
            if (item && item.id) {
              map.set(item.id, { ...(map.get(item.id) || {}), ...item });
            }
          });
          return Array.from(map.values());
        };

        setDb((prev: any) => {
          const mergedClients = mergeById(prev.clients, incoming.clients);
          const mergedProducts = mergeById(prev.products, incoming.products);
          const mergedCustomers = mergeById(prev.customers, incoming.customers);
          const mergedPromotoras = mergeById(prev.promotoras, incoming.promotoras);
          const mergedRiders = mergeById(prev.riders, incoming.riders);
          const mergedVendedores = mergeById(prev.vendedores, incoming.vendedores);
          const mergedTransactions = mergeById(prev.transactions, incoming.transactions);
          const mergedOrders = mergeById(prev.orders, incoming.orders);
          const mergedCoupons = mergeById(prev.coupons, incoming.coupons);

          const stats = {
            clients: mergedClients.length,
            products: mergedProducts.length,
            customers: mergedCustomers.length,
            transactions: mergedTransactions.length
          };
          setImportStats(stats);

          return {
            ...prev,
            clients: mergedClients,
            products: mergedProducts,
            customers: mergedCustomers,
            promotoras: mergedPromotoras,
            riders: mergedRiders,
            vendedores: mergedVendedores,
            transactions: mergedTransactions,
            orders: mergedOrders,
            coupons: mergedCoupons,
            crm: mergeById(prev.crm, incoming.crm),
            vales: mergeById(prev.vales, incoming.vales),
            posTerminals: mergeById(prev.posTerminals, incoming.posTerminals),
          };
        });

        playCashDrawerSound();
        showToast("¡Respaldo importado y fusionado con éxito (Regla 1 protegida)!", "success");
      } catch (err: any) {
        showToast("Error importando archivo: " + err.message, "error");
      } finally {
        setIsProcessing(false);
      }
    };
    reader.readAsText(file);
  };

  return (
    <ModalPortal>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[99999] flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
        <div className="w-full max-w-lg bg-slate-900 border border-violet-500/30 rounded-3xl p-6 shadow-2xl flex flex-col items-center gap-6 relative">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>

          {/* Header */}
          <div className="text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600/30 border border-emerald-400/30 text-emerald-300 flex items-center justify-center mx-auto mb-2">
              <Database size={24} />
            </div>
            <h2 className="text-xl font-black text-white">Bóveda & Respaldo Inmune</h2>
            <p className="text-xs text-gray-400">Exporta e importa tus datos sin depender de ningún servidor externo</p>
          </div>

          {/* Summary Box */}
          <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-2 bg-black/40 border border-white/10 rounded-2xl p-4 text-center">
            <div>
              <p className="text-[10px] text-gray-400 uppercase font-mono">Comercios</p>
              <p className="text-lg font-black text-violet-400">{db.clients?.length || 0}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase font-mono">Productos</p>
              <p className="text-lg font-black text-emerald-400">{db.products?.length || 0}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase font-mono">Clientes</p>
              <p className="text-lg font-black text-amber-400">{db.customers?.length || 0}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase font-mono">Ventas</p>
              <p className="text-lg font-black text-blue-400">{db.transactions?.length || 0}</p>
            </div>
          </div>

          {/* Action Cards */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Card 1: Export */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-violet-300 font-bold text-sm mb-1">
                  <Download size={18} /> Descargar Copia
                </div>
                <p className="text-xs text-gray-400">
                  Guarda un archivo <code className="text-violet-300">.json</code> en tu computadora o pendrive con todo tu inventario y ventas.
                </p>
              </div>

              <button
                onClick={handleExportBackup}
                disabled={isProcessing}
                className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-black text-xs transition-all shadow-md shadow-violet-600/30 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <FileJson size={16} /> Exportar Respaldo
              </button>
            </div>

            {/* Card 2: Import */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm mb-1">
                  <Upload size={18} /> Restaurar Copia
                </div>
                <p className="text-xs text-gray-400">
                  Fusiona de forma segura un respaldo previo sin borrar ninguna venta ni producto actual.
                </p>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
              />

              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition-all shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <RefreshCw size={16} className={isProcessing ? "animate-spin" : ""} /> Cargar Archivo .JSON
              </button>
            </div>
          </div>

          {/* Import Stats Badge */}
          {importStats && (
            <div className="w-full bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-4 flex items-center gap-3 text-emerald-300 text-xs animate-fade-in">
              <CheckCircle2 size={24} className="flex-shrink-0" />
              <div>
                <strong className="block font-bold">Respaldo integrado correctamente:</strong>
                <span>{importStats.products} productos y {importStats.transactions} transacciones consolidadas en base de datos.</span>
              </div>
            </div>
          )}

          {/* Footer Security Note */}
          <div className="flex items-center gap-2 text-[10px] text-gray-500">
            <ShieldCheck size={14} className="text-emerald-400" />
            <span>Fusión no destructiva garantizada bajo la Regla 1 del Ecosistema KFS OS.</span>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
};
