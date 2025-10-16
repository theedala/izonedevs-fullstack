import { apiClient, Community, PaginatedResponse, ApiResponse } from './api';

export interface CommunityFilters {
  page?: number;
  size?: number;
  category?: string;
  search?: string;
}

export interface CommunityCreateData {
  name: string;
  description: string;
  category: string;
  image_url?: string;
}

export class CommunitiesService {
  static async getCommunities(filters: CommunityFilters = {}): Promise<PaginatedResponse<Community>> {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.size) params.append('size', filters.size.toString());
    if (filters.category) params.append('category', filters.category);
    if (filters.search) params.append('search', filters.search);
    
    const query = params.toString();
    return apiClient.get<PaginatedResponse<Community>>(`/communities${query ? `?${query}` : ''}`);
  }

  static async getCommunity(id: number): Promise<Community> {
    return apiClient.get<Community>(`/communities/${id}`);
  }

  static async createCommunity(data: CommunityCreateData): Promise<Community> {
    return apiClient.post<Community>('/communities', data);
  }

  static async updateCommunity(id: number, data: Partial<CommunityCreateData>): Promise<Community> {
    return apiClient.put<Community>(`/communities/${id}`, data);
  }

  static async deleteCommunity(id: number): Promise<ApiResponse> {
    return apiClient.delete<ApiResponse>(`/communities/${id}`);
  }

  static async joinCommunity(id: number): Promise<ApiResponse> {
    return apiClient.post<ApiResponse>(`/communities/${id}/join`);
  }

  static async leaveCommunity(id: number): Promise<ApiResponse> {
    return apiClient.post<ApiResponse>(`/communities/${id}/leave`);
  }

  static async getCategories(): Promise<string[]> {
    return apiClient.get<string[]>('/communities/categories');
  }

  static async toggleActive(id: number, isActive: boolean): Promise<ApiResponse> {
    return apiClient.put<ApiResponse>(`/communities/${id}/active`, { is_active: isActive });
  }
}