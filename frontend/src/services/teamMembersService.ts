import { apiClient, PaginatedResponse, ApiResponse } from './api';

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio?: string;
  image_url?: string;
  email?: string;
  github_url?: string;
  linkedin_url?: string;
  twitter_url?: string;
  is_active: boolean;
  order_priority: number;
  created_at: string;
}

export interface TeamMemberCreateData {
  name: string;
  role: string;
  bio?: string;
  image_url?: string;
  email?: string;
  github_url?: string;
  linkedin_url?: string;
  twitter_url?: string;
  order_priority?: number;
}

export interface TeamMemberFilters {
  page?: number;
  size?: number;
  is_active?: boolean;
}

export class TeamMembersService {
  static async getTeamMembers(filters: TeamMemberFilters = {}): Promise<PaginatedResponse<TeamMember>> {
    const params = new URLSearchParams();
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.size) params.append('size', filters.size.toString());
    if (filters.is_active !== undefined) params.append('is_active', filters.is_active.toString());
    
    return apiClient.get<PaginatedResponse<TeamMember>>(`/team-members?${params.toString()}`);
  }

  static async getTeamMember(id: number): Promise<TeamMember> {
    return apiClient.get<TeamMember>(`/team-members/${id}`);
  }

  static async createTeamMember(data: TeamMemberCreateData): Promise<ApiResponse> {
    return apiClient.post<ApiResponse>('/team-members', data);
  }

  static async updateTeamMember(id: number, data: TeamMemberCreateData): Promise<ApiResponse> {
    return apiClient.put<ApiResponse>(`/team-members/${id}`, data);
  }

  static async deleteTeamMember(id: number): Promise<ApiResponse> {
    return apiClient.delete<ApiResponse>(`/team-members/${id}`);
  }

  static async toggleActive(id: number): Promise<ApiResponse> {
    return apiClient.patch<ApiResponse>(`/team-members/${id}/toggle-active`, {});
  }

  static async updateOrder(id: number, orderPriority: number): Promise<ApiResponse> {
    return apiClient.patch<ApiResponse>(`/team-members/${id}/order`, { order_priority: orderPriority });
  }
}