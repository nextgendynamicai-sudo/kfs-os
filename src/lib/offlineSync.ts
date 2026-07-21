"use client";

import { setIndexedDBValue, getIndexedDBValue } from "./indexedDB";

export interface OfflineAction {
  id: string;
  type: "TRANSACTION" | "PRODUCT_CREATE" | "EXPENSE" | "CUSTOMER_RECHARGE" | "Z_REPORT";
  payload: any;
  timestamp: string;
  attempts: number;
}

const OFFLINE_QUEUE_KEY = "kfs_offline_sync_queue";

/**
 * Agrega una acción a la cola de sincronización offline (IndexedDB)
 */
export async function enqueueOfflineAction(type: OfflineAction["type"], payload: any): Promise<OfflineAction> {
  const action: OfflineAction = {
    id: `off_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    type,
    payload,
    timestamp: new Date().toISOString(),
    attempts: 0
  };

  try {
    const queue: OfflineAction[] = (await getIndexedDBValue(OFFLINE_QUEUE_KEY)) || [];
    queue.push(action);
    await setIndexedDBValue(OFFLINE_QUEUE_KEY, queue);
    console.log(`[KFS Offline Engine] Acción guardada en cola local:`, action);
  } catch (err) {
    console.warn(`[KFS Offline Engine] Error guardando en IndexedDB. Usando fallback localStorage`, err);
    try {
      const existing = localStorage.getItem(OFFLINE_QUEUE_KEY);
      const queue: OfflineAction[] = existing ? JSON.parse(existing) : [];
      queue.push(action);
      localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
    } catch (e) {
      console.error("[KFS Offline Engine] Fallo crítico guardando cola de sync:", e);
    }
  }

  return action;
}

/**
 * Obtiene las acciones pendientes de sincronización
 */
export async function getOfflineQueue(): Promise<OfflineAction[]> {
  try {
    const queue = await getIndexedDBValue(OFFLINE_QUEUE_KEY);
    if (Array.isArray(queue)) return queue;
  } catch (e) {
    // Fallback localStorage
  }

  if (typeof window !== "undefined") {
    try {
      const existing = localStorage.getItem(OFFLINE_QUEUE_KEY);
      return existing ? JSON.parse(existing) : [];
    } catch (e) {
      return [];
    }
  }
  return [];
}

/**
 * Limpia la cola offline tras sincronizar con éxito
 */
export async function clearOfflineQueue(): Promise<void> {
  try {
    await setIndexedDBValue(OFFLINE_QUEUE_KEY, []);
  } catch (e) {
    // ignore
  }
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(OFFLINE_QUEUE_KEY);
    } catch (e) {
      // ignore
    }
  }
}

/**
 * Procesa y sincroniza la cola de acciones offline con Supabase cuando vuelve la conexión
 */
export async function processOfflineQueue(
  syncToRelationalFn?: (data: any) => Promise<void>
): Promise<{ syncedCount: number; errors: number }> {
  const queue = await getOfflineQueue();
  if (!queue || queue.length === 0) {
    return { syncedCount: 0, errors: 0 };
  }

  console.log(`[KFS Offline Engine] Procesando ${queue.length} acciones pendientes de sincronización...`);
  let syncedCount = 0;
  let errors = 0;

  for (const action of queue) {
    try {
      if (syncToRelationalFn) {
        await syncToRelationalFn(action.payload);
      }
      syncedCount++;
    } catch (err) {
      console.error(`[KFS Offline Engine] Error sincronizando acción ${action.id}:`, err);
      errors++;
    }
  }

  if (errors === 0) {
    await clearOfflineQueue();
    console.log(`[KFS Offline Engine] Cola offline vaciada con éxito. (${syncedCount} sincros)`);
  }

  return { syncedCount, errors };
}
