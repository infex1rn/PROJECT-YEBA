export interface AdminPagination { page: number; limit: number; total: number; totalPages: number }
export interface AdminUser {
  id: number; name: string; email: string; role: string; status: string; verified: boolean; createdAt: string;
  designer: { totalEarnings: number; rating: number } | null; buyer: { totalSpent: number } | null;
}
export interface AdminDesign {
  id: number; title: string; description: string | null; category: string; price: number;
  status: string; archivedAt: string | null; watermarkedPreviewUrl: string; createdAt: string;
  designer: { user: { name: string; email: string } };
}
export interface AdminTransaction {
  id: number; amount: number; paymentStatus: string; paymentMethod: string; designTitle: string;
  createdAt: string; buyer: { user: { name: string; email: string } };
}
export interface AdminWithdrawal {
  id: number; amount: number; status: string; createdAt: string; processedAt: string | null;
  designer: { user: { name: string; email: string } };
}
export interface AdminReport {
  id: number; reporterId: number; type: string; subjectId: number; reason: string; description: string;
  status: string; resolution: string | null; moderatorId: number | null; createdAt: string;
}
export interface SiteSettings {
  id: number; version: number; maintenanceMode: boolean; userRegistration: boolean;
  designApproval: boolean; categories: string[]; updatedAt: string;
}
export interface AdminPayload<T, K extends string> {
  success: boolean; data: Record<K, T[]> & { pagination: AdminPagination };
}
