/**
 * Data Synchronization Manager
 * Handles sync between IndexedDB and backend API
 */

import { indexedDB } from './indexeddb';
import { apiClient } from './api-client';

interface SyncStatus {
  isOnline: boolean;
  lastSync: Date | null;
  isSyncing: boolean;
  queueSize: number;
}

class SyncManager {
  private syncStatus: SyncStatus = {
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    lastSync: null,
    isSyncing: false,
    queueSize: 0,
  };

  private syncInterval: NodeJS.Timeout | null = null;
  private listeners: Set<(status: SyncStatus) => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      // Listen for online/offline events
      window.addEventListener('online', () => this.handleOnline());
      window.addEventListener('offline', () => this.handleOffline());

      // Start periodic sync
      this.startPeriodicSync();
    }
  }

  /**
   * Handle online event
   */
  private handleOnline() {
    this.syncStatus.isOnline = true;
    this.notifyListeners();
    this.syncAll();
  }

  /**
   * Handle offline event
   */
  private handleOffline() {
    this.syncStatus.isOnline = false;
    this.notifyListeners();
  }

  /**
   * Start periodic background sync
   */
  private startPeriodicSync() {
    // Sync every 5 minutes
    this.syncInterval = setInterval(() => {
      if (this.syncStatus.isOnline) {
        this.syncAll();
      }
    }, 5 * 60 * 1000);
  }

  /**
   * Stop periodic sync
   */
  stopPeriodicSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  /**
   * Subscribe to sync status changes
   */
  subscribe(listener: (status: SyncStatus) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Notify all listeners of status change
   */
  private notifyListeners() {
    this.listeners.forEach(listener => listener({ ...this.syncStatus }));
  }

  /**
   * Get current sync status
   */
  getStatus(): SyncStatus {
    return { ...this.syncStatus };
  }

  /**
   * Sync all data from backend to IndexedDB
   */
  async syncAll(): Promise<void> {
    if (!this.syncStatus.isOnline || this.syncStatus.isSyncing) {
      return;
    }

    this.syncStatus.isSyncing = true;
    this.notifyListeners();

    try {
      // Sync designs
      await this.syncDesigns();

      // Process sync queue (pending offline actions)
      await indexedDB.processSyncQueue();

      this.syncStatus.lastSync = new Date();
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      this.syncStatus.isSyncing = false;
      this.notifyListeners();
    }
  }

  /**
   * Sync designs from backend to IndexedDB
   */
  private async syncDesigns(): Promise<void> {
    try {
      const response = await apiClient.getDesigns({ page: 1, limit: 100 });
      
      if (response.designs) {
        // Clear existing designs
        await indexedDB.clear('designs');

        // Add new designs
        for (const design of response.designs) {
          await indexedDB.designs.add(design);
        }
      }
    } catch (error) {
      console.error('Failed to sync designs:', error);
      throw error;
    }
  }

  /**
   * Sync favorites from backend
   */
  async syncFavorites(userId: string): Promise<void> {
    try {
      // Implement API call to fetch favorites
      // const favorites = await apiClient.getFavorites(userId);
      
      // Clear and add favorites
      // await indexedDB.clear('favorites');
      // for (const fav of favorites) {
      //   await indexedDB.favorites.add(fav);
      // }
    } catch (error) {
      console.error('Failed to sync favorites:', error);
    }
  }

  /**
   * Sync cart from backend
   */
  async syncCart(userId: string): Promise<void> {
    try {
      // Implement API call to fetch cart
      // const cart = await apiClient.getCart(userId);
      
      // Clear and add cart items
      // await indexedDB.clear('cart');
      // for (const item of cart) {
      //   await indexedDB.cart.add(item);
      // }
    } catch (error) {
      console.error('Failed to sync cart:', error);
    }
  }

  /**
   * Queue an action for sync when online
   */
  async queueAction(action: 'CREATE' | 'UPDATE' | 'DELETE', store: string, data: any): Promise<void> {
    await indexedDB.addToSyncQueue(action, store, data);
    this.syncStatus.queueSize += 1;
    this.notifyListeners();

    // Try to sync immediately if online
    if (this.syncStatus.isOnline) {
      await indexedDB.processSyncQueue();
      this.syncStatus.queueSize = 0;
      this.notifyListeners();
    }
  }

  /**
   * Manual sync trigger
   */
  async manualSync(): Promise<void> {
    await this.syncAll();
  }
}

// Export singleton instance
export const syncManager = new SyncManager();
