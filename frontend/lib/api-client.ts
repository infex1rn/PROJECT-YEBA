// API client for backend communication

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: any[];
}

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
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || data.message || 'Request failed',
          errors: data.errors,
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error: any) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: error.message || 'Network error',
      };
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
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (response.success && response.data?.token) {
      this.setToken(response.data.token);
    }

    return response;
  }

  async logout() {
    this.clearToken();
  }

  // Design endpoints
  async getDesigns(params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    sortBy?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.category) queryParams.append('category', params.category);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);

    const query = queryParams.toString();
    return this.request(`/designs${query ? `?${query}` : ''}`);
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
    return this.request('/admin/dashboard/stats');
  }

  async getAllUsers(params?: {
    page?: number;
    limit?: number;
    role?: string;
    status?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.role) queryParams.append('role', params.role);
    if (params?.status) queryParams.append('status', params.status);

    const query = queryParams.toString();
    return this.request(`/admin/users${query ? `?${query}` : ''}`);
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
  }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.category) queryParams.append('category', params.category);

    const query = queryParams.toString();
    return this.request(`/admin/designs${query ? `?${query}` : ''}`);
  }

  async moderateDesign(designId: number, action: string, notes?: string) {
    return this.request(`/admin/designs/${designId}/moderate`, {
      method: 'PUT',
      body: JSON.stringify({ action, notes }),
    });
  }

  async getAllTransactions(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);

    const query = queryParams.toString();
    return this.request(`/admin/transactions${query ? `?${query}` : ''}`);
  }

  async getAllWithdrawals(params?: { page?: number; limit?: number; status?: string }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);

    const query = queryParams.toString();
    return this.request(`/admin/withdrawals${query ? `?${query}` : ''}`);
  }

  async updateWithdrawal(withdrawalId: number, action: string, notes?: string) {
    return this.request(`/admin/withdrawals/${withdrawalId}`, {
      method: 'PUT',
      body: JSON.stringify({ action, notes }),
    });
  }

  async getReports(params?: { page?: number; limit?: number; status?: string }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);

    const query = queryParams.toString();
    return this.request(`/admin/reports${query ? `?${query}` : ''}`);
  }
}

// Export a singleton instance
export const apiClient = new ApiClient(API_URL);
export default apiClient;
