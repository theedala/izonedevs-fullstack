import { apiClient, PaginatedResponse, ApiResponse } from './api';

export interface Partner {
  id: number;
  name: string;
  description?: string;
  logo_url?: string;
  website_url?: string;
  category?: string;
  is_active: boolean;
  featured: boolean;
  created_at: string;
}

export interface PartnerCreateData {
  name: string;
  description?: string;
  logo_url?: string;
  website_url?: string;
  category?: string;
}

export interface PartnerFilters {
  page?: number;
  size?: number;
  category?: string;
  is_active?: boolean;
  featured?: boolean;
}

export class PartnersService {
  static async getPartners(filters: PartnerFilters = {}): Promise<PaginatedResponse<Partner>> {
    const params = new URLSearchParams();
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.size) params.append('size', filters.size.toString());
    if (filters.category) params.append('category', filters.category);
    if (filters.is_active !== undefined) params.append('is_active', filters.is_active.toString());
    if (filters.featured !== undefined) params.append('featured', filters.featured.toString());
    
    return apiClient.get<PaginatedResponse<Partner>>(`/partners?${params.toString()}`);
  }

  static async getPartner(id: number): Promise<Partner> {
    return apiClient.get<Partner>(`/partners/${id}`);
  }

  static async createPartner(data: PartnerCreateData): Promise<ApiResponse> {
    return apiClient.post<ApiResponse>('/partners', data);
  }

  static async updatePartner(id: number, data: PartnerCreateData): Promise<ApiResponse> {
    return apiClient.put<ApiResponse>(`/partners/${id}`, data);
  }

  static async deletePartner(id: number): Promise<ApiResponse> {
    return apiClient.delete<ApiResponse>(`/partners/${id}`);
  }

  static async toggleFeatured(id: number): Promise<ApiResponse> {
    return apiClient.patch<ApiResponse>(`/partners/${id}/toggle-featured`, {});
  }

  static async toggleActive(id: number): Promise<ApiResponse> {
    return apiClient.patch<ApiResponse>(`/partners/${id}/toggle-active`, {});
  }
}