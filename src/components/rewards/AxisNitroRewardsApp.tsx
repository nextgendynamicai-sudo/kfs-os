"use client";

import React, { useState, useMemo } from "react";
import { useKFS } from "../../context/KFSContext";
import { RewardTask, RewardSubmission, RewardCategory } from "../../types/rewards";
import {
  Zap, Award, CheckCircle, Clock, XCircle, MapPin, QrCode, Upload,
  Gift, Trophy, Star, ChevronRight, Filter, Sparkles, AlertCircle, Camera, Search,
  Check, ArrowUpRight, ArrowLeft, Info, Flame, Shield, Layers
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const AxisNitroRewardsApp: React.FC = () => {
  const { currentUser, db, submitRewardTaskProof, showToast, setView } = useKFS() as any;

  // Active tab state
  const [activeTab, setActiveTab] = useState<"tasks" | "my_submissions" | "leaderboard" | "catalog">("tasks");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedTask, setSelectedTask] = useState<RewardTask | null>(null);

  // Proof submission form state
  const [proofText, setProofText] = useState("");
  const [proofImage, setProofImage] = useState("");
  const [qrInput, setQrInput] = useState("");
  const [userLat, setUserLat] = useState<number | null>(null);
  const [userLng, setUserLng] = useState<number | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate current user Axis Nitro Points
  const userPoints = useMemo(() => {
    if (!currentUser) return 0;
    if (currentUser.k_points_balance !== undefined) return currentUser.k_points_balance;
    if (currentUser.kfsPoints !== undefined) return currentUser.kfsPoints;
    if (currentUser.points !== undefined) return currentUser.points;
    return 0;
  }, [currentUser]);

  // Active tasks list
  const activeTasks: RewardTask[] = useMemo(() => {
    const tasks = db?.rewardTasks || [];
    if (!tasks || tasks.length === 0) return [];
    
    return tasks.filter((t: RewardTask) => {
      if (t.status !== "ACTIVE") return false;
      if (t.targetAudience === "ALL") return true;
      if (!currentUser) return true;
      
      const roleUpper = (currentUser.role || "CUSTOMER").toUpperCase();
      if (t.targetAudience === "CUSTOMERS" && (roleUpper.includes("CUST") || roleUpper.includes("CLIENTE"))) return true;
      if (t.targetAudience === "RIDERS" && roleUpper.includes("RIDER")) return true;
      if (t.targetAudience === "PROMOTORAS" && roleUpper.includes("PROMO")) return true;
      if (t.targetAudience === "CLIENTS" && (roleUpper.includes("CLIENT") || roleUpper.includes("DUEÑO"))) return true;
      
      return true;
    });
  }, [db?.rewardTasks, currentUser]);

  // User's submissions
  const mySubmissions: RewardSubmission[] = useMemo(() => {
    const subs = db?.rewardSubmissions || [];
    if (!currentUser) return subs;

    return subs.filter((s: RewardSubmission) => 
      s.userId === currentUser.id || 
      s.userId === currentUser.phone || 
      s.userEmail === currentUser.email
    );
  }, [db?.rewardSubmissions, currentUser]);

  // Filter tasks by category
  const filteredTasks = useMemo(() => {
    if (selectedCategory === "ALL") return activeTasks;
    return activeTasks.filter(t => t.category === selectedCategory);
  }, [activeTasks, selectedCategory]);

  // Handle GPS location capture
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      showToast("Geolocalización no soportada en este navegador", "error");
      return;
    }
    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLat(pos.coords.latitude);
        setUserLng(pos.coords.longitude);
        setIsGettingLocation(false);
        showToast("📍 Ubicación GPS capturada exitosamente", "success");
      },
      (err) => {
        setIsGettingLocation(false);
        showToast(`Error al obtener ubicación: ${err.message}`, "error");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Image upload handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setProofImage(event.target?.result as string);
      showToast("📷 Imagen de comprobante cargada", "success");
    };
    reader.readAsDataURL(file);
  };

  // Handle Task Proof Submission
  const handleSubmitTask = async () => {
    if (!selectedTask) return;
    if (!currentUser) {
      showToast("Debes iniciar sesión para realizar esta tarea", "error");
      return;
    }

    // Validation check
    if (selectedTask.verificationType === "AUTOMATIC_QR" && !qrInput.trim()) {
      showToast("Por favor escanea o ingresa el código QR de la tarea", "error");
      return;
    }
    if (selectedTask.verificationType === "LOCATION_GPS" && (!userLat || !userLng)) {
      showToast("Por favor presiona 'Obtener Ubicación GPS' para verificar tu visita", "error");
      return;
    }
    if (selectedTask.verificationType === "RECEIPT_UPLOAD" && !proofImage && !proofText) {
      showToast("Por favor adjunta una foto de tu factura o comprobante", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      await submitRewardTaskProof(selectedTask.id, {
        proofText,
        proofImage,
        qrCodeRead: qrInput,
        latitude: userLat || undefined,
        longitude: userLng || undefined
      });

      setSelectedTask(null);
      setProofText("");
      setProofImage("");
      setQrInput("");
      setUserLat(null);
      setUserLng(null);
      setActiveTab("my_submissions");
    } catch (err: any) {
      showToast(err.message || "Error al enviar prueba de la tarea", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper badge renderers
  const getCategoryLabel = (cat: RewardCategory) => {
    switch (cat) {
      case "SCAN_QR": return { label: "Escaneo QR", icon: QrCode, color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" };
      case "VISIT_MERCHANT": return { label: "Visita Local", icon: MapPin, color: "bg-purple-500/20 text-purple-400 border-purple-500/30" };
      case "BUY_PRODUCT": return { label: "Compra", icon: Upload, color: "bg-amber-500/20 text-amber-400 border-amber-500/30" };
      case "REFERRAL": return { label: "Referido", icon: Trophy, color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30" };
      case "SOCIAL_PROOF": return { label: "Redes Sociales", icon: Star, color: "bg-pink-500/20 text-pink-400 border-pink-500/30" };
      default: return { label: "Acción", icon: Zap, color: "bg-violet-500/20 text-violet-400 border-violet-500/30" };
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"><CheckCircle size={14} /> Aprobada</span>;
      case "REJECTED":
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/40"><XCircle size={14} /> Rechazada</span>;
      default:
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40 animate-pulse"><Clock size={14} /> En Revisión</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-24 selection:bg-amber-500 selection:text-black">
      {/* Top Header Card */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-xl border-b border-slate-800/80 px-4 py-4 shadow-2xl">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 via-violet-600 to-indigo-600 p-[2px] shadow-lg shadow-violet-900/40">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <Zap size={22} className="text-amber-400 fill-amber-400 animate-pulse" />
                </div>
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-black text-slate-950">
                ✓
              </span>
            </div>
            <div>
              <h1 className="text-base font-black tracking-tight text-white flex items-center gap-1.5">
                Axis Rewards <span className="text-[10px] uppercase font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full">PWA</span>
              </h1>
              <p className="text-xs text-slate-400 font-medium">
                {currentUser ? (currentUser.name || currentUser.company || currentUser.email || "Cliente Registrado") : "Inicia Sesión para Acumular Puntos"}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              if (typeof window !== "undefined" && window.history.length > 1) {
                window.history.back();
              } else {
                window.location.href = "/";
              }
            }}
            className="p-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 transition-all border border-slate-700/50 cursor-pointer hover:scale-105 active:scale-95 shadow-md"
            title="Volver atrás"
          >
            <ArrowLeft size={20} />
          </button>
        </div>

        {/* User Axis Points Hero Card */}
        <div className="max-w-md mx-auto mt-4 p-4 rounded-3xl bg-gradient-to-br from-violet-950/80 via-slate-900 to-slate-950 border border-violet-500/30 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center justify-between relative z-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400/90 flex items-center gap-1">
                <Sparkles size={14} className="text-amber-400" /> Saldo Axis Points
              </span>
              <div className="text-3xl font-black text-white tracking-tight mt-1 flex items-baseline gap-2">
                <span>{userPoints.toLocaleString()}</span>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                  AP
                </span>
              </div>
            </div>

            <div className="text-right">
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-violet-500/20 border border-violet-500/40 text-violet-300 text-xs font-bold">
                <Flame size={14} className="text-amber-400 fill-amber-400" /> Racha: 0 días
              </div>
              <p className="text-[11px] text-slate-400 mt-1 font-medium">Nivel: <span className="text-amber-400 font-bold">Axis Gold ⚡</span></p>
            </div>
          </div>

          {/* Level Progress Bar */}
          <div className="mt-4 relative z-10">
            <div className="flex justify-between text-[11px] font-bold text-slate-400 mb-1">
              <span>Siguiente Nivel: Axis Platinum</span>
              <span>{userPoints} / 1000 AP</span>
            </div>
            <div className="w-full h-2.5 bg-slate-950/80 rounded-full overflow-hidden border border-slate-800">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-violet-500 rounded-full transition-all duration-500 shadow-lg shadow-amber-500/50" 
                style={{ width: `${Math.min(100, (userPoints / 1000) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-md mx-auto px-4 mt-6">
        {/* Navigation Tabs */}
        <div className="flex bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 mb-6 shadow-inner">
          <button
            onClick={() => setActiveTab("tasks")}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "tasks"
                ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Zap size={16} /> Acciones
          </button>
          <button
            onClick={() => setActiveTab("my_submissions")}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 relative ${
              activeTab === "my_submissions"
                ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Clock size={16} /> Mis Entregas
            {mySubmissions.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping absolute top-2 right-3" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("catalog")}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "catalog"
                ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Gift size={16} /> Canjes
          </button>
        </div>

        {/* TAB 1: ACCIONES DISPONIBLES */}
        {activeTab === "tasks" && (
          <div className="space-y-4">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {[
                { id: "ALL", label: "Todas" },
                { id: "SCAN_QR", label: "QR Scans" },
                { id: "VISIT_MERCHANT", label: "Visitas GPS" },
                { id: "BUY_PRODUCT", label: "Compras" },
                { id: "REFERRAL", label: "Referidos" },
                { id: "SOCIAL_PROOF", label: "Redes" }
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                    selectedCategory === cat.id
                      ? "bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20"
                      : "bg-slate-900/80 text-slate-400 border-slate-800 hover:bg-slate-800"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Tasks Feed */}
            {filteredTasks.length === 0 ? (
              <div className="text-center py-12 px-4 rounded-3xl bg-slate-900/60 border border-slate-800/80">
                <Shield size={40} className="mx-auto text-slate-600 mb-3" />
                <h3 className="text-sm font-bold text-slate-300">No hay acciones disponibles en esta categoría</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                  El Arquitecto está configurando nuevas recompensas en la vida real. ¡Vuelve pronto!
                </p>
              </div>
            ) : (
              <div className="grid gap-3">
                {filteredTasks.map((task) => {
                  const catInfo = getCategoryLabel(task.category);
                  const IconComp = catInfo.icon;

                  return (
                    <motion.div
                      key={task.id}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setSelectedTask(task)}
                      className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800/90 hover:border-amber-500/40 transition-all cursor-pointer shadow-lg group relative overflow-hidden"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex gap-3">
                          <div className={`p-3 rounded-2xl border ${catInfo.color} shrink-0 self-start`}>
                            <IconComp size={22} />
                          </div>
                          <div>
                            <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${catInfo.color} mb-1`}>
                              {catInfo.label}
                            </span>
                            <h3 className="text-sm font-black text-white group-hover:text-amber-400 transition-colors">
                              {task.title}
                            </h3>
                            <p className="text-xs text-slate-400 line-clamp-2 mt-0.5">
                              {task.description}
                            </p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="inline-flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 px-2.5 py-1 rounded-xl font-black text-xs">
                            <Zap size={13} className="fill-amber-400" /> +{task.pointsReward} AP
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <Info size={12} className="text-slate-500" /> {task.requirements || "Verificación requerida"}
                        </span>
                        <span className="text-amber-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          Realizar Acción <ChevronRight size={14} />
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MIS ENTREGAS */}
        {activeTab === "my_submissions" && (
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Clock size={14} className="text-amber-400" /> Historial de Revisiones ({mySubmissions.length})
            </h2>

            {mySubmissions.length === 0 ? (
              <div className="text-center py-12 px-4 rounded-3xl bg-slate-900/60 border border-slate-800">
                <Clock size={40} className="mx-auto text-slate-600 mb-3" />
                <h3 className="text-sm font-bold text-slate-300">Aún no has completado acciones</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Elige una tarea de la pestaña "Acciones" y sube tu comprobante para ganar Axis Points.
                </p>
              </div>
            ) : (
              mySubmissions.map((sub) => (
                <div key={sub.id} className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-white">{sub.taskTitle}</h4>
                      <p className="text-[11px] text-slate-400">
                        Enviado el {new Date(sub.submittedAt).toLocaleDateString()} a las {new Date(sub.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    {getStatusBadge(sub.status)}
                  </div>

                  {sub.submissionData.proofText && (
                    <p className="text-xs bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-slate-300 font-mono">
                      "{sub.submissionData.proofText}"
                    </p>
                  )}

                  {sub.submissionData.proofImage && (
                    <div className="relative w-full h-28 rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                      <img src={sub.submissionData.proofImage} alt="Comprobante" className="w-full h-full object-cover" />
                    </div>
                  )}

                  {sub.rejectionReason && (
                    <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                      <AlertCircle size={14} className="shrink-0" />
                      <span>Motivo de rechazo: {sub.rejectionReason}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/50">
                    <span className="text-slate-400">Recompensa:</span>
                    <span className="font-bold text-amber-400">+{sub.pointsAwarded} Axis Points</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 3: BÓVEDA DE CANJE */}
        {activeTab === "catalog" && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 to-violet-500/10 border border-amber-500/30 text-xs text-amber-300 flex items-center gap-2">
              <Sparkles size={18} className="text-amber-400 shrink-0" />
              <span>Canjea tus Axis Points por beneficios exclusivos en comercios afiliados del ecosistema KFS OS.</span>
            </div>

            <div className="grid gap-3">
              {[
                { id: "reward_1", title: "Vale de Descuento $5 USD", cost: 5000, type: "Comercio Afiliado", icon: Gift },
                { id: "reward_2", title: "Delivery Gratis en Tu Próxima Compra", cost: 2000, type: "FlowExpress", icon: Zap },
                { id: "reward_3", title: "Recarga Telefónica $2 USD", cost: 2500, type: "Móvil Directo", icon: Star },
                { id: "reward_4", title: "Membresía Nitro VIP (1 Mes)", cost: 10000, type: "Ecosistema KFS", icon: Trophy }
              ].map((item) => (
                <div key={item.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                      <item.icon size={22} />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">{item.type}</span>
                      <h4 className="text-sm font-bold text-white">{item.title}</h4>
                      <span className="text-xs font-black text-amber-400">{item.cost.toLocaleString()} Axis Points</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (userPoints >= item.cost) {
                        showToast(`¡Solicitud de canje enviada para "${item.title}"!`, "success");
                      } else {
                        showToast(`No tienes suficientes Axis Points (requieres ${item.cost.toLocaleString()})`, "error");
                      }
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                      userPoints >= item.cost
                        ? "bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20"
                        : "bg-slate-800 text-slate-500 cursor-not-allowed"
                    }`}
                  >
                    Canjear
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* PROOF SUBMISSION MODAL */}
      <AnimatePresence>
        {selectedTask && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Zap className="text-amber-400 fill-amber-400" size={20} />
                  <h3 className="text-base font-black text-white">Completar Acción</h3>
                </div>
                <button
                  onClick={() => setSelectedTask(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <XCircle size={20} />
                </button>
              </div>

              <div>
                <h4 className="text-base font-bold text-amber-400">{selectedTask.title}</h4>
                <p className="text-xs text-slate-300 mt-1">{selectedTask.description}</p>
                <div className="mt-2 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black">
                  Recompensa: +{selectedTask.pointsReward} Axis Points
                </div>
              </div>

              {/* Specific inputs by verification type */}
              {selectedTask.verificationType === "AUTOMATIC_QR" && (
                <div className="space-y-2 pt-2">
                  <label className="text-xs font-bold text-slate-300 block">Código QR del Comercio / Tarea:</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={qrInput}
                      onChange={(e) => setQrInput(e.target.value)}
                      placeholder="Escanea o escribe el código QR..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 pr-10"
                    />
                    <QrCode size={18} className="absolute right-3 top-2.5 text-amber-400" />
                  </div>
                </div>
              )}

              {selectedTask.verificationType === "LOCATION_GPS" && (
                <div className="space-y-2 pt-2">
                  <label className="text-xs font-bold text-slate-300 block">Verificación de Ubicación GPS:</label>
                  <button
                    type="button"
                    onClick={handleGetLocation}
                    disabled={isGettingLocation}
                    className="w-full py-3 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-300 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all"
                  >
                    <MapPin size={16} /> {isGettingLocation ? "Capturando coordenadas..." : userLat ? `GPS Confirmado (${userLat.toFixed(4)}, ${userLng?.toFixed(4)})` : "Obtener Ubicación GPS"}
                  </button>
                </div>
              )}

              {/* General proof image & notes */}
              <div className="space-y-3 pt-2 border-t border-slate-800">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Nota / Detalles de la Acción:</label>
                  <textarea
                    rows={2}
                    value={proofText}
                    onChange={(e) => setProofText(e.target.value)}
                    placeholder="Escribe detalles adicionales o código de factura..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Comprobante de Foto / Captura:</label>
                  <div className="flex items-center gap-2">
                    <label className="flex-1 cursor-pointer py-2.5 px-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs text-slate-300 flex items-center justify-center gap-2 transition-colors">
                      <Camera size={16} className="text-amber-400" />
                      <span>{proofImage ? "Cambiar Imagen" : "Adjuntar Foto"}</span>
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  </div>

                  {proofImage && (
                    <div className="mt-2 relative w-full h-32 rounded-xl overflow-hidden border border-amber-500/30 bg-slate-950">
                      <img src={proofImage} alt="Vista previa" className="w-full h-full object-cover" />
                      <button
                        onClick={() => setProofImage("")}
                        className="absolute top-2 right-2 p-1 rounded-full bg-slate-950/80 text-white hover:bg-red-600"
                      >
                        <XCircle size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Submission Action */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedTask(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSubmitTask}
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                >
                  <Zap size={14} className="fill-slate-950" />
                  {isSubmitting ? "Enviando..." : "Enviar para Revisión"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
