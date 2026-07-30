"use client";

import React, { useState, useMemo } from "react";
import { useKFS } from "../../context/KFSContext";
import { RewardTask, RewardSubmission, RewardCategory, TaskVerificationType, TargetAudienceRole } from "../../types/rewards";
import {
  Zap, Plus, CheckCircle, XCircle, Clock, QrCode, MapPin, Upload,
  Gift, Trophy, Star, Shield, AlertCircle, Eye, Trash2, Edit, RefreshCw,
  Search, Filter, Check, X, Sparkles, ChevronRight, Layers, UserCheck
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { motion, AnimatePresence } from "framer-motion";

export const ArchitectRewardsManager: React.FC = () => {
  const { db, currentUser, createRewardTask, toggleRewardTaskStatus, deleteRewardTask, approveRewardSubmission, rejectRewardSubmission, showToast } = useKFS() as any;

  // Active admin tab
  const [adminTab, setAdminTab] = useState<"tasks" | "submissions" | "analytics">("submissions");
  const [submissionFilter, setSubmissionFilter] = useState<"PENDING" | "APPROVED" | "REJECTED" | "ALL">("PENDING");

  // Create Task Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [pointsReward, setPointsReward] = useState<number>(250);
  const [category, setCategory] = useState<RewardCategory>("SCAN_QR");
  const [verificationType, setVerificationType] = useState<TaskVerificationType>("AUTOMATIC_QR");
  const [targetAudience, setTargetAudience] = useState<TargetAudienceRole>("ALL");
  const [requirements, setRequirements] = useState("");
  const [qrCodeSecret, setQrCodeSecret] = useState("");

  // Viewing Media / QR modal
  const [viewingQrTask, setViewingQrTask] = useState<RewardTask | null>(null);
  const [viewingProofMedia, setViewingProofMedia] = useState<{ src: string; title: string } | null>(null);
  const [rejectionModalSub, setRejectionModalSub] = useState<RewardSubmission | null>(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState("");

  // Read tasks & submissions from context DB
  const rewardTasks: RewardTask[] = db?.rewardTasks || [];
  const rewardSubmissions: RewardSubmission[] = db?.rewardSubmissions || [];

  // Filtered Submissions
  const filteredSubmissions = useMemo(() => {
    if (submissionFilter === "ALL") return rewardSubmissions;
    return rewardSubmissions.filter(s => s.status === submissionFilter);
  }, [rewardSubmissions, submissionFilter]);

  // Analytics Metrics
  const stats = useMemo(() => {
    const totalApproved = rewardSubmissions.filter(s => s.status === "APPROVED");
    const totalPending = rewardSubmissions.filter(s => s.status === "PENDING");
    const totalPointsDisbursed = totalApproved.reduce((sum, s) => sum + (s.pointsAwarded || 0), 0);
    const activeTasksCount = rewardTasks.filter(t => t.status === "ACTIVE").length;

    return {
      totalPointsDisbursed,
      approvedCount: totalApproved.length,
      pendingCount: totalPending.length,
      activeTasksCount
    };
  }, [rewardSubmissions, rewardTasks]);

  // Generate QR secret code
  const handleGenerateQrSecret = () => {
    const secret = `AXIS-NITRO-QR-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    setQrCodeSecret(secret);
    showToast("🔑 Secreto QR generado", "success");
  };

  // Submit Create Task
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim() || !taskDescription.trim()) {
      showToast("Por favor completa el título y la descripción", "error");
      return;
    }

    try {
      await createRewardTask({
        title: taskTitle,
        description: taskDescription,
        pointsReward: Number(pointsReward) || 100,
        category,
        verificationType,
        targetAudience,
        requirements: requirements || undefined,
        qrCodeSecret: qrCodeSecret || (verificationType === "AUTOMATIC_QR" ? `AXIS-${Date.now()}` : undefined)
      });

      setShowCreateModal(false);
      setTaskTitle("");
      setTaskDescription("");
      setPointsReward(250);
      setRequirements("");
      setQrCodeSecret("");
    } catch (err: any) {
      showToast(err.message || "Error al crear tarea", "error");
    }
  };

  // Approve Submission
  const handleApprove = async (sub: RewardSubmission) => {
    try {
      await approveRewardSubmission(sub.id, currentUser?.name || "Arquitecto Core");
    } catch (err: any) {
      showToast(err.message || "Error al aprobar entrega", "error");
    }
  };

  // Reject Submission
  const handleConfirmReject = async () => {
    if (!rejectionModalSub) return;
    try {
      await rejectRewardSubmission(
        rejectionModalSub.id, 
        rejectionReasonInput || "Prueba insuficiente o no válida", 
        currentUser?.name || "Arquitecto Core"
      );
      setRejectionModalSub(null);
      setRejectionReasonInput("");
    } catch (err: any) {
      showToast(err.message || "Error al rechazar entrega", "error");
    }
  };

  return (
    <div className="w-full bg-slate-950/90 rounded-3xl border border-violet-500/30 p-5 shadow-2xl text-slate-100 font-sans space-y-6">
      {/* Panel Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-amber-500 to-violet-600 shadow-lg shadow-amber-500/20 text-slate-950">
            <Zap size={24} className="fill-slate-950" />
          </div>
          <div>
            <h2 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
              Gestor de Recompensas Axis Points <span className="text-xs font-bold uppercase bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2.5 py-0.5 rounded-full">Arquitecto Engine</span>
            </h2>
            <p className="text-xs text-slate-400">
              Configuración de acciones físicas, aprobación de entregas y desembolso automático de Axis Points.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 rounded-2xl font-black text-xs bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all hover:scale-105"
        >
          <Plus size={16} /> Crear Tarea de Recompensa
        </button>
      </div>

      {/* Stats Header Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs font-bold uppercase text-slate-400">Axis Points Desembolsados</span>
          <div className="text-2xl font-black text-amber-400 mt-1 flex items-baseline gap-1">
            <span>{stats.totalPointsDisbursed.toLocaleString()}</span>
            <span className="text-xs font-bold text-amber-500">AP</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs font-bold uppercase text-slate-400">Pendientes de Revisión</span>
          <div className="text-2xl font-black text-amber-400 mt-1 flex items-center gap-2">
            <span>{stats.pendingCount}</span>
            {stats.pendingCount > 0 && (
              <span className="text-xs font-bold bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full animate-pulse">
                Acción Requerida
              </span>
            )}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs font-bold uppercase text-slate-400">Entregas Aprobadas</span>
          <div className="text-2xl font-black text-emerald-400 mt-1">
            {stats.approvedCount}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs font-bold uppercase text-slate-400">Acciones Físicas Activas</span>
          <div className="text-2xl font-black text-purple-400 mt-1">
            {stats.activeTasksCount}
          </div>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-slate-800">
        <button
          onClick={() => setAdminTab("submissions")}
          className={`px-5 py-3 font-bold text-xs border-b-2 transition-all flex items-center gap-2 ${
            adminTab === "submissions"
              ? "border-amber-400 text-amber-400 bg-amber-500/5"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Clock size={16} /> Revisiones de Entregas
          {stats.pendingCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-slate-950">
              {stats.pendingCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setAdminTab("tasks")}
          className={`px-5 py-3 font-bold text-xs border-b-2 transition-all flex items-center gap-2 ${
            adminTab === "tasks"
              ? "border-amber-400 text-amber-400 bg-amber-500/5"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Layers size={16} /> Tareas y QR Físicos ({rewardTasks.length})
        </button>
      </div>

      {/* TAB 1: REVISIÓN DE ENTREGAS */}
      {adminTab === "submissions" && (
        <div className="space-y-4">
          {/* Status Filters */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              {[
                { id: "PENDING", label: "Pendientes", color: "bg-amber-500 text-slate-950" },
                { id: "APPROVED", label: "Aprobadas", color: "bg-emerald-500 text-slate-950" },
                { id: "REJECTED", label: "Rechazadas", color: "bg-red-500 text-white" },
                { id: "ALL", label: "Todas", color: "bg-slate-800 text-slate-200" }
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setSubmissionFilter(f.id as any)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    submissionFilter === f.id
                      ? f.color
                      : "bg-slate-900 text-slate-400 hover:bg-slate-800"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Submissions List */}
          {filteredSubmissions.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-2xl bg-slate-900/50 border border-slate-800">
              <CheckCircle size={40} className="mx-auto text-slate-600 mb-3" />
              <h3 className="text-sm font-bold text-slate-300">No hay entregas en esta sección</h3>
              <p className="text-xs text-slate-500 mt-1">
                Todas las entregas de usuarios han sido procesadas.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredSubmissions.map((sub) => (
                <div
                  key={sub.id}
                  className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 relative"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                    <div>
                      <span className="text-[11px] font-bold uppercase text-amber-400 tracking-wider">
                        {sub.userRole || "USUARIO"}
                      </span>
                      <h3 className="text-sm font-black text-white">{sub.taskTitle}</h3>
                      <p className="text-xs text-slate-400">
                        Usuario: <span className="text-slate-200 font-bold">{sub.userName}</span> ({sub.userEmail || sub.userId})
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-xs font-black text-amber-400 block">+{sub.pointsAwarded} NP</span>
                        <span className="text-[10px] text-slate-500">
                          {new Date(sub.submittedAt).toLocaleDateString()} {new Date(sub.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <div className="shrink-0">
                        {sub.status === "APPROVED" && (
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                            ✓ Aprobada
                          </span>
                        )}
                        {sub.status === "REJECTED" && (
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/40">
                            ✕ Rechazada
                          </span>
                        )}
                        {sub.status === "PENDING" && (
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40 animate-pulse">
                            ⏳ Pendiente
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Submission Details */}
                  <div className="grid md:grid-cols-2 gap-3 text-xs">
                    {sub.submissionData.proofText && (
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                        <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Detalle / Texto enviado:</span>
                        <p className="text-slate-300 font-mono">{sub.submissionData.proofText}</p>
                      </div>
                    )}

                    {sub.submissionData.qrCodeRead && (
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                        <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Código QR Escaneado:</span>
                        <p className="text-amber-400 font-mono">{sub.submissionData.qrCodeRead}</p>
                      </div>
                    )}

                    {sub.submissionData.latitude && sub.submissionData.longitude && (
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2">
                        <MapPin size={16} className="text-purple-400 shrink-0" />
                        <div>
                          <span className="text-[10px] font-bold text-slate-500 uppercase block">Coordenadas GPS:</span>
                          <span className="text-slate-300 font-mono">{sub.submissionData.latitude.toFixed(5)}, {sub.submissionData.longitude.toFixed(5)}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Image Proof */}
                  {sub.submissionData.proofImage && (
                    <div className="pt-2">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Comprobante Adjunto:</span>
                      <div className="relative w-full max-w-xs h-40 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 group">
                        <img src={sub.submissionData.proofImage} alt="Prueba" className="w-full h-full object-cover" />
                        <button
                          onClick={() => setViewingProofMedia({ src: sub.submissionData.proofImage!, title: sub.taskTitle })}
                          className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs font-bold text-white gap-2"
                        >
                          <Eye size={16} /> Ver Imagen Completa
                        </button>
                      </div>
                    </div>
                  )}

                  {sub.rejectionReason && (
                    <p className="text-xs text-red-400 bg-red-500/10 p-2.5 rounded-xl border border-red-500/20">
                      <strong>Motivo de rechazo:</strong> {sub.rejectionReason}
                    </p>
                  )}

                  {/* Action Buttons for Pending */}
                  {sub.status === "PENDING" && (
                    <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                      <button
                        onClick={() => setRejectionModalSub(sub)}
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 transition-colors flex items-center gap-1.5"
                      >
                        <XCircle size={14} /> Rechazar
                      </button>
                      <button
                        onClick={() => handleApprove(sub)}
                        className="px-5 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5"
                      >
                        <CheckCircle size={14} /> Aprobar y Desembolsar +{sub.pointsAwarded} NP
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: TAREAS Y CÓDIGOS QR */}
      {adminTab === "tasks" && (
        <div className="space-y-4">
          <div className="grid gap-3">
            {rewardTasks.map((task) => (
              <div
                key={task.id}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shrink-0">
                    {task.category === "SCAN_QR" && <QrCode size={20} />}
                    {task.category === "VISIT_MERCHANT" && <MapPin size={20} />}
                    {task.category === "BUY_PRODUCT" && <Upload size={20} />}
                    {task.category === "REFERRAL" && <Trophy size={20} />}
                    {task.category === "SOCIAL_PROOF" && <Star size={20} />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white">{task.title}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        task.status === "ACTIVE" ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-800 text-slate-400"
                      }`}>
                        {task.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{task.description}</p>
                    <span className="text-[11px] font-mono text-amber-400 block mt-1">
                      Recompensa: +{task.pointsReward} Axis Points | Público: {task.targetAudience}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center">
                  {task.qrCodeSecret && (
                    <button
                      onClick={() => setViewingQrTask(task)}
                      className="p-2 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/40 text-xs font-bold flex items-center gap-1.5"
                    >
                      <QrCode size={16} /> Ver QR
                    </button>
                  )}

                  <button
                    onClick={() => toggleRewardTaskStatus(task.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors ${
                      task.status === "ACTIVE"
                        ? "bg-amber-500/20 text-amber-300 border-amber-500/30 hover:bg-amber-500/30"
                        : "bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/30"
                    }`}
                  >
                    {task.status === "ACTIVE" ? "Pausar" : "Activar"}
                  </button>

                  <button
                    onClick={() => deleteRewardTask(task.id)}
                    className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30"
                    title="Eliminar tarea"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: CREAR NUEVA TAREA DE RECOMPENSA */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Zap className="text-amber-400 fill-amber-400" size={20} />
                  <h3 className="text-base font-black text-white">Nueva Tarea de Recompensa en la Vida Real</h3>
                </div>
                <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Título de la Tarea / Acción:</label>
                  <input
                    type="text"
                    required
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    placeholder="Ej: Escaneo QR en Restaurante Aliado..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Descripción e Instrucciones:</label>
                  <textarea
                    rows={2}
                    required
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                    placeholder="Explica qué debe hacer el usuario para ganar los puntos..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-300 block mb-1">Recompensa (Axis Points):</label>
                    <input
                      type="number"
                      required
                      min={10}
                      value={pointsReward}
                      onChange={(e) => setPointsReward(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-amber-400 font-bold focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-300 block mb-1">Público Objetivo:</label>
                    <select
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="ALL">Todos los Usuarios</option>
                      <option value="CUSTOMERS">Solo Clientes / Consumidores</option>
                      <option value="CLIENTS">Solo Comercios / Dueños</option>
                      <option value="RIDERS">Solo Riders</option>
                      <option value="PROMOTORAS">Solo Promotoras</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-300 block mb-1">Categoría:</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="SCAN_QR">Escaneo QR Físico</option>
                      <option value="VISIT_MERCHANT">Visita Presencial (GPS)</option>
                      <option value="BUY_PRODUCT">Compra de Producto</option>
                      <option value="REFERRAL">Referir Usuario</option>
                      <option value="SOCIAL_PROOF">Reseña / Redes</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-300 block mb-1">Tipo de Verificación:</label>
                    <select
                      value={verificationType}
                      onChange={(e) => setVerificationType(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="AUTOMATIC_QR">Código QR Automático</option>
                      <option value="LOCATION_GPS">Ubicación GPS Presencial</option>
                      <option value="RECEIPT_UPLOAD">Subida de Comprobante / Foto</option>
                      <option value="MANUAL_APPROVAL">Aprobación Manual por Arquitecto</option>
                    </select>
                  </div>
                </div>

                {verificationType === "AUTOMATIC_QR" && (
                  <div className="space-y-1 bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <label className="font-bold text-slate-300 block">Código / Secreto del QR:</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={qrCodeSecret}
                        onChange={(e) => setQrCodeSecret(e.target.value)}
                        placeholder="Secret QR code string..."
                        className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 font-mono text-amber-400"
                      />
                      <button
                        type="button"
                        onClick={handleGenerateQrSecret}
                        className="px-3 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold"
                      >
                        Generar
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 rounded-xl font-bold text-slate-400 hover:text-white"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl font-black bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/20"
                  >
                    Crear y Desplegar Tarea
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: VER CÓDIGO QR */}
      <AnimatePresence>
        {viewingQrTask && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-center space-y-4">
              <h3 className="text-base font-black text-white">{viewingQrTask.title}</h3>
              <p className="text-xs text-slate-400">Imprime o proyecta este código QR en el comercio para que los usuarios lo escaneen.</p>

              <div className="p-4 bg-white rounded-2xl inline-block shadow-xl mx-auto">
                <QRCodeSVG value={viewingQrTask.qrCodeSecret || viewingQrTask.id} size={180} />
              </div>

              <p className="text-xs font-mono text-amber-400">Secreto: {viewingQrTask.qrCodeSecret}</p>

              <button
                onClick={() => setViewingQrTask(null)}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
              >
                Cerrar Visor
              </button>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: VER MEDIA / COMPROBANTE COMPLETO */}
      <AnimatePresence>
        {viewingProofMedia && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
            <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-2xl space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white">{viewingProofMedia.title}</h4>
                <button onClick={() => setViewingProofMedia(null)} className="text-slate-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>
              <div className="w-full max-h-[75vh] overflow-hidden rounded-2xl bg-slate-950 border border-slate-800">
                <img src={viewingProofMedia.src} alt="Media" className="w-full h-full object-contain mx-auto" />
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: RECHAZAR CON MOTIVO */}
      <AnimatePresence>
        {rejectionModalSub && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
              <h3 className="text-base font-black text-white">Rechazar Entrega de Usuario</h3>
              <p className="text-xs text-slate-400">Indica el motivo por el cual rechazas esta entrega de {rejectionModalSub.userName}:</p>

              <textarea
                rows={3}
                value={rejectionReasonInput}
                onChange={(e) => setRejectionReasonInput(e.target.value)}
                placeholder="Ej: Foto borrosa, el código QR ya venció..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
              />

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setRejectionModalSub(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmReject}
                  className="px-5 py-2 rounded-xl text-xs font-black bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/20"
                >
                  Confirmar Rechazo
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
