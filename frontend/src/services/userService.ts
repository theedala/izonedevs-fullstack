import { apiClient } from './api';
import type { User, PaginatedResponse, ApiResponse } from './api';

export interface UserUpdateData {
  email?: string;
  full_name?: string;
  bio?: string;
  skills?: string;
  avatar_url?: string;
}

export interface UserQueryParams {
  page?: number;
  size?: number;
  role?: string;
  search?: string;
}

export class UserService {
  static async getUsers(params: UserQueryParams = {}): Promise<PaginatedResponse<User>> {
    const queryString = new URLSearchParams();
    if (params.page) queryString.append('page', params.page.toString());
    if (params.size) queryString.append('size', params.size.toString());
    if (params.role) queryString.append('role', params.role);
    if (params.search) queryString.append('search', params.search);
    
    const endpoint = `/users${queryString.toString() ? '?' + queryString.toString() : ''}`;
    return await apiClient.get<PaginatedResponse<User>>(endpoint);
  }

  static async getUserById(id: number): Promise<User> {
    return await apiClient.get<User>(`/users/${id}`);
  }

  static async updateUser(id: number, userData: UserUpdateData): Promise<ApiResponse<User>> {
    return await apiClient.put<ApiResponse<User>>(`/users/${id}`, userData);
  }

  static async updateUserRole(id: number, role: string): Promise<ApiResponse<User>> {
    return await apiClient.put<ApiResponse<User>>(`/users/${id}/role`, { role });
  }

  static async deleteUser(id: number): Promise<ApiResponse<void>> {
    return await apiClient.delete<ApiResponse<void>>(`/users/${id}`);
  }

  static async getCurrentUser(): Promise<User> {
    return await apiClient.get<User>('/users/me');
  }

  static async updateCurrentUser(userData: UserUpdateData): Promise<ApiResponse<User>> {
    return await apiClient.put<ApiResponse<User>>('/users/me', userData);
  }
}