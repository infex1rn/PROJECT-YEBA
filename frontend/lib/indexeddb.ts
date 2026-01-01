/**
 * IndexedDB Storage Utility
 * Provides offline data persistence with automatic sync
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

interface Design {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  designer: any;
  createdAt: string;
  updatedAt: string;
}

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
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
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
    
    for (const item of queue) {
      try {
        // Process sync item (implement actual API sync logic)
        console.log('Processing sync:', item);
        
        // On success, remove from queue
        await this.delete(STORES.SYNC_QUEUE, item.id);
      } catch (error) {
        // Increment retries
        item.retries += 1;
        if (item.retries > 3) {
          // Remove after 3 failed attempts
          await this.delete(STORES.SYNC_QUEUE, item.id);
        } else {
          await this.update(STORES.SYNC_QUEUE, item);
        }
      }
    }
  }

  // Design-specific methods
  designs = {
    add: (design: Design) => this.add(STORES.DESIGNS, design),
    get: (id: string) => this.get<Design>(STORES.DESIGNS, id),
    getAll: () => this.getAll<Design>(STORES.DESIGNS),
    update: (design: Design) => this.update(STORES.DESIGNS, design),
    delete: (id: string) => this.delete(STORES.DESIGNS, id),
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
