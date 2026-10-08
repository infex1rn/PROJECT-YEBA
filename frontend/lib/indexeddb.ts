import type { MarketplaceDesign as Design } from './api-client';

/**
 * IndexedDB Storage Utility
 * Stores offline data and retains changes awaiting server acknowledgment
 */

const DB_NAME = 'deepfold-db';
const DB_VERSION = 1;

// Store names
const STORES = {
  DESIGNS: 'designs',
  USERS: 'users',
  FAVORITES: 'favorites',
  CART: 'cart',
  DRAFTS: 'drafts',
  SETTINGS: 'settings',
  SYNC_QUEUE: 'sync_queue',
} as const;

interface SyncQueueItem {
  id: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  store: string;
  data: any;
  timestamp: number;
  retries: number;
}

class IndexedDBManager {
  private db: IDBDatabase | null = null;

  /**
   * Initialize the database
   */
  async init(): Promise<IDBDatabase> {
    if (this.db) return this.db;

    return new Promise((resolve, reject) => {
      const request = globalThis.indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(request.result);
      };

      request.onupgradeneeded = (event: any) => {
        const db = event.target.result as IDBDatabase;

        // Create stores if they don't exist
        if (!db.objectStoreNames.contains(STORES.DESIGNS)) {
          const designStore = db.createObjectStore(STORES.DESIGNS, { keyPath: 'id' });
          designStore.createIndex('category', 'category', { unique: false });
          designStore.createIndex('designer', 'designer.id', { unique: false });
          designStore.createIndex('createdAt', 'createdAt', { unique: false });
        }

        if (!db.objectStoreNames.contains(STORES.USERS)) {
          db.createObjectStore(STORES.USERS, { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains(STORES.FAVORITES)) {
          const favStore = db.createObjectStore(STORES.FAVORITES, { keyPath: 'id' });
          favStore.createIndex('userId', 'userId', { unique: false });
        }

        if (!db.objectStoreNames.contains(STORES.CART)) {
          const cartStore = db.createObjectStore(STORES.CART, { keyPath: 'id' });
          cartStore.createIndex('userId', 'userId', { unique: false });
        }

        if (!db.objectStoreNames.contains(STORES.DRAFTS)) {
          db.createObjectStore(STORES.DRAFTS, { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains(STORES.SETTINGS)) {
          db.createObjectStore(STORES.SETTINGS, { keyPath: 'key' });
        }

        if (!db.objectStoreNames.contains(STORES.SYNC_QUEUE)) {
          const syncStore = db.createObjectStore(STORES.SYNC_QUEUE, { keyPath: 'id', autoIncrement: true });
          syncStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });
  }

  /**
   * Generic add operation
   */
  async add<T>(storeName: string, data: T): Promise<IDBValidKey> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.add(data);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Generic get operation
   */
  async get<T>(storeName: string, key: IDBValidKey): Promise<T | undefined> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(key);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Generic getAll operation
   */
  async getAll<T>(storeName: string): Promise<T[]> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Generic update operation
   */
  async update<T>(storeName: string, data: T): Promise<IDBValidKey> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(data);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Generic delete operation
   */
  async delete(storeName: string, key: IDBValidKey): Promise<void> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(key);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Clear all data from a store
   */
  async clear(storeName: string): Promise<void> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Query by index
   */
  async getByIndex<T>(storeName: string, indexName: string, value: any): Promise<T[]> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const index = store.index(indexName);
      const request = index.getAll(value);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Add to sync queue
   */
  async addToSyncQueue(action: 'CREATE' | 'UPDATE' | 'DELETE', store: string, data: any): Promise<void> {
    const item: Partial<SyncQueueItem> = {
      action,
      store,
      data,
      timestamp: Date.now(),
      retries: 0,
    };
    await this.add(STORES.SYNC_QUEUE, item);
  }

  /**
   * Process sync queue
   */
  async processSyncQueue(): Promise<void> {
    const queue = await this.getAll<SyncQueueItem>(STORES.SYNC_QUEUE);
    
    if (queue.length > 0) {
      throw new Error('Offline changes remain queued: authenticated server synchronization is not available');
    }
  }

  async replaceDesigns(designs: Design[]): Promise<void> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORES.DESIGNS, 'readwrite');
      transaction.oncomplete = () => resolve();
      transaction.onabort = () => reject(transaction.error || new Error('Design cache update aborted'));
      transaction.onerror = () => reject(transaction.error);
      const store = transaction.objectStore(STORES.DESIGNS);
      try {
        store.clear();
        for (const design of designs) store.put(design);
      } catch (error) {
        transaction.abort();
        reject(error);
      }
    });
  }

  // Design-specific methods
  designs = {
    add: (design: Design) => this.add(STORES.DESIGNS, design),
    get: (id: number) => this.get<Design>(STORES.DESIGNS, id),
    getAll: () => this.getAll<Design>(STORES.DESIGNS),
    update: (design: Design) => this.update(STORES.DESIGNS, design),
    delete: (id: number) => this.delete(STORES.DESIGNS, id),
    getByCategory: (category: string) => this.getByIndex<Design>(STORES.DESIGNS, 'category', category),
  };

  // Cart-specific methods
  cart = {
    add: (item: any) => this.add(STORES.CART, item),
    getAll: () => this.getAll(STORES.CART),
    update: (item: any) => this.update(STORES.CART, item),
    delete: (id: string) => this.delete(STORES.CART, id),
    clear: () => this.clear(STORES.CART),
  };

  // Favorites-specific methods
  favorites = {
    add: (item: any) => this.add(STORES.FAVORITES, item),
    getAll: () => this.getAll(STORES.FAVORITES),
    delete: (id: string) => this.delete(STORES.FAVORITES, id),
  };

  // Settings-specific methods
  settings = {
    get: (key: string) => this.get(STORES.SETTINGS, key),
    set: (key: string, value: any) => this.update(STORES.SETTINGS, { key, value }),
    delete: (key: string) => this.delete(STORES.SETTINGS, key),
  };
}

// Export singleton instance
export const indexedDB = new IndexedDBManager();
