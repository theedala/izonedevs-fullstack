import { apiClient, ContactMessage, PaginatedResponse, ApiResponse } from './api';

export interface ContactFilters {
  page?: number;
  size?: number;
  status?: string;
  search?: string;
}

export class ContactService {
  static async sendMessage(data: Omit<ContactMessage, 'id' | 'is_read' | 'created_at'>): Promise<ApiResponse> {
    return apiClient.post<ApiResponse>('/contact', data);
  }

  static async getMessages(filters: ContactFilters = {}): Promise<PaginatedResponse<ContactMessage>> {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.size) params.append('size', filters.size.toString());
    if (filters.status) params.append('status', filters.status);
    if (filters.search) params.append('search', filters.search);
    
    const query = params.toString();
    return apiClient.get<PaginatedResponse<ContactMessage>>(`/contact${query ? `?${query}` : ''}`);
  }

  static async getMessage(id: number): Promise<ContactMessage> {
    return apiClient.get<ContactMessage>(`/contact/${id}`);
  }

  static async markAsRead(id: number): Promise<ApiResponse> {
    return apiClient.put<ApiResponse>(`/contact/${id}/read`, { is_read: true });
  }

  static async updateMessageStatus(id: number, status: string): Promise<ApiResponse> {
    return apiClient.put<ApiResponse>(`/contact/${id}/status`, { status });
  }

  static async deleteMessage(id: number): Promise<ApiResponse> {
    return apiClient.delete<ApiResponse>(`/contact/${id}`);
  }

  static async getStats(): Promise<any> {
    return apiClient.get('/contact/stats');
  }
}