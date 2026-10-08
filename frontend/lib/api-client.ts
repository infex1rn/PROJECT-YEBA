import type { AdminPayload, AdminUser, AdminDesign, AdminTransaction, AdminWithdrawal, AdminReport, SiteSettings } from './admin-types';

// API client for backend communication

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: any[];
}

export interface SessionUser { id: number; name: string; email: string; role: 'BUYER' | 'DESIGNER' | 'ADMIN'; }
export interface MarketplaceDesign {
  id: number; title: string; description: string | null; category: string; price: number;
  watermarkedPreviewUrl: string; createdAt: string;
  designer: { id: number; name: string; rating: number };
}
export interface DesignListPayload {
  success: boolean; designs: MarketplaceDesign[];
  pagination: { currentPage: number; totalPages: number; totalItems: number; itemsPerPage: number };
}
export interface DashboardStatsPayload {
  success: boolean;
  data: { totalUsers: number; totalDesigners: number; totalBuyers: number; totalDesigns: number;
    approvedDesigns: number; pendingDesigns: number; rejectedDesigns: number; totalRevenue: number;
    totalTransactions: number; pendingWithdrawals: { amount: number; count: number };
    monthlyUsers: { month: string; users: number }[]; monthlySales: { month: string; sales: number }[] };
}
interface AuthPayload { success: boolean; user: SessionUser; token: string; }

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    // Load token from localStorage if available (client-side only)
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  getToken() {
    return this.token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const headers = new Headers(options.headers);
    headers.set('Content-Type', 'application/json');

    if (this.token) {
      headers.set('Authorization', `Bearer ${this.token}`);
    }

    const controller = new AbortController();
    const abort = () => controller.abort();
    if (options.signal?.aborted) controller.abort();
    options.signal?.addEventListener('abort', abort, { once: true });
    const timeout = setTimeout(abort, 15000);
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers,
        signal: controller.signal,
      });

      const data = await response.json();

      if (typeof data !== 'object' || data === null || typeof data.success !== 'boolean') {
        return { success: false, error: 'The server returned an unexpected response. Please reload and retry.' };
      }
      if (!response.ok || !data.success) {
        return {
          success: false,
          error: typeof data.error === 'string' ? data.error : typeof data.message === 'string' ? data.message : 'Request failed',
          errors: data.errors,
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: controller.signal.aborted ? 'Request cancelled or timed out. Please retry.' : 'Unable to reach the server. Please retry.',
      };
    } finally {
      clearTimeout(timeout);
      options.signal?.removeEventListener('abort', abort);
    }
  }

  // Auth endpoints
  async registerBuyer(data: { name: string; email: string; password: string }) {
    return this.request('/auth/register/buyer', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async registerDesigner(data: {
    name: string;
    email: string;
    password: string;
    bio?: string;
    portfolioLink?: string;
  }) {
    return this.request('/auth/register/designer', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(data: { email: string; password: string }) {
    const response = await this.request<AuthPayload>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (response.success && response.data?.token) {
      this.setToken(response.data.token);
    }

    return response;
  }

  async getSession(signal?: AbortSignal) {
    return this.request<{ success: boolean; user: SessionUser }>('/auth/me', { signal, cache: 'no-store' });
  }

  async logout() {
    const result = await this.request('/auth/logout', { method: 'POST' });
    if (result.success) this.clearToken();
    return result;
  }

  // Design endpoints
  async getDesigns(params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    sortBy?: string;
  }, signal?: AbortSignal) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.category) queryParams.append('category', params.category);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);

    const query = queryParams.toString();
    return this.request<DesignListPayload>(`/designs${query ? `?${query}` : ''}`, { signal });
  }

  async getDesign(id: number) {
    return this.request(`/designs/${id}`);
  }

  async createDesign(data: {
    title: string;
    description?: string;
    category: string;
    price: number;
    fileUrl: string;
    watermarkedPreviewUrl: string;
  }) {
    return this.request('/designs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateDesign(
    id: number,
    data: {
      title?: string;
      description?: string;
      price?: number;
    }
  ) {
    return this.request(`/designs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteDesign(id: number) {
    return this.request(`/designs/${id}`, {
      method: 'DELETE',
    });
  }

  // User endpoints
  async getUser(id: number) {
    return this.request(`/users/${id}`);
  }

  async getDesigner(id: number) {
    return this.request(`/users/designers/${id}`);
  }

  // Admin endpoints
  async getDashboardStats() {
    return this.request<DashboardStatsPayload>('/admin/stats');
  }

  async getAllUsers(params?: {
    page?: number;
    limit?: number;
    role?: string;
    status?: string;
    search?: string;
  }, signal?: AbortSignal) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.role) queryParams.append('role', params.role);
    if (params?.status) queryParams.append('status', params.status);

    if (params?.search) queryParams.append('search', params.search);
    const query = queryParams.toString();
    return this.request<AdminPayload<AdminUser, 'users'>>(`/admin/users${query ? `?${query}` : ''}`, { signal });
  }

  async updateUserStatus(userId: number, status: string, reason?: string) {
    return this.request(`/admin/users/${userId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, reason }),
    });
  }

  async getAllDesignsAdmin(params?: {
    page?: number;
    limit?: number;
    status?: string;
    category?: string;
    search?: string;
  }, signal?: AbortSignal) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.category) queryParams.append('category', params.category);

    if (params?.search) queryParams.append('search', params.search);
    const query = queryParams.toString();
    return this.request<AdminPayload<AdminDesign, 'designs'>>(`/admin/designs${query ? `?${query}` : ''}`, { signal });
  }

  async moderateDesign(designId: number, status: string, reason?: string) {
    return this.request(`/admin/designs/${designId}/moderate`, {
      method: 'PUT',
      body: JSON.stringify({ status, reason }),
    });
  }

  async deleteDesignAdmin(designId: number) {
    return this.request(`/admin/designs/${designId}`, {
      method: 'DELETE',
    });
  }

  async getAllTransactions(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }, signal?: AbortSignal) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);

    const query = queryParams.toString();
    return this.request<AdminPayload<AdminTransaction, 'transactions'>>(`/admin/transactions${query ? `?${query}` : ''}`, { signal });
  }

  async getAllWithdrawals(params?: { page?: number; limit?: number; status?: string }, signal?: AbortSignal) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);

    const query = queryParams.toString();
    return this.request<AdminPayload<AdminWithdrawal, 'withdrawals'>>(`/admin/withdrawals${query ? `?${query}` : ''}`, { signal });
  }

  async processWithdrawal(withdrawalId: number, status: string, reason?: string) {
    return this.request(`/admin/withdrawals/${withdrawalId}/process`, {
      method: 'PUT',
      body: JSON.stringify({ status, reason }),
    });
  }

  async processRefund(transactionId: number, reason?: string) {
    return this.request(`/admin/transactions/${transactionId}/refund`, {
      method: 'PUT',
      body: JSON.stringify({ reason }),
    });
  }

  async deleteUser(userId: number) {
    return this.request(`/admin/users/${userId}`, {
      method: 'DELETE',
    });
  }

  async getReports(params?: { page?: number; limit?: number; status?: string }, signal?: AbortSignal) {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.status) query.set('status', params.status);
    return this.request<AdminPayload<AdminReport, 'reports'>>(`/admin/reports?${query}`, { signal });
  }

  async verifyUser(id: number, verified: boolean) {
    return this.request(`/admin/users/${id}/verification`, { method: 'PUT', body: JSON.stringify({ verified }) });
  }

  async decideReport(id: number, data: { status: string; expectedStatus: string; resolution: string }) {
    return this.request(`/admin/reports/${id}/status`, { method: 'PUT', body: JSON.stringify(data) });
  }

  async getSiteSettings(signal?: AbortSignal) {
    return this.request<{ success: boolean; data: SiteSettings }>('/settings', { signal, cache: 'no-store' });
  }

  async getAdminSettings(signal?: AbortSignal) {
    return this.request<{ success: boolean; data: SiteSettings }>('/admin/settings', { signal, cache: 'no-store' });
  }

  async updateSettings(settings: Omit<SiteSettings, 'id' | 'updatedAt'>) {
    return this.request('/admin/settings', { method: 'PUT', body: JSON.stringify(settings) });
  }

}

// Export a singleton instance
export const apiClient = new ApiClient(API_URL);
export default apiClient;
