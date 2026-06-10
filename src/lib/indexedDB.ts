"use client";

const DB_NAME = "KFS_OS_OFFLINE_DB";
const STORE_NAME = "kfs_state_store";
const DB_VERSION = 1;

export function initIndexedDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      reject(new Error("IndexedDB is not supported on this environment."));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      reject(new Error("Failed to open IndexedDB: " + (event.target as any).error?.message));
    };

    request.onsuccess = (event) => {
      resolve((event.target as any).result);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as any).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
  });
}

export function setIndexedDBValue(key: string, value: any): Promise<void> {
  return new Promise((resolve, reject) => {
    initIndexedDB()
      .then((db) => {
        const transaction = db.transaction([STORE_NAME], "readwrite");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.put(value, key);

        request.onsuccess = () => {
          resolve();
        };

        request.onerror = (event) => {
          reject(new Error("IndexedDB write error: " + (event.target as any).error?.message));
        };

        transaction.oncomplete = () => {
          db.close();
        };
      })
      .catch(reject);
  });
}

export function getIndexedDBValue(key: string): Promise<any> {
  return new Promise((resolve, reject) => {
    initIndexedDB()
      .then((db) => {
        const transaction = db.transaction([STORE_NAME], "readonly");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(key);

        request.onsuccess = (event) => {
          resolve((event.target as any).result);
        };

        request.onerror = (event) => {
          reject(new Error("IndexedDB read error: " + (event.target as any).error?.message));
        };

        transaction.oncomplete = () => {
          db.close();
        };
      })
      .catch(reject);
  });
}
