import { apiClient, ApiResponse } from './api';

export interface EventRegistrationData {
  name: string;
  email: string;
  phone?: string;
  organization?: string;
  experience_level?: string;
  interests?: string;
  dietary_restrictions?: string;
  special_requirements?: string;
}

export interface EventRegistration {
  id: number;
  event_id: number;
  name: string;
  email: string;
  phone?: string;
  organization?: string;
  experience_level?: string;
  interests?: string;
  dietary_restrictions?: string;
  special_requirements?: string;
  qr_code_path?: string;
  registration_status: string;
  created_at: string;
  event?: {
    id: number;
    title: string;
    start_date: string;
    location?: string;
  };
}

export interface EventRegistrationFilters {
  page?: number;
  size?: number;
  event_id?: number;
  status?: string;
  search?: string;
}

export interface PaginatedEventRegistrations {
  items: EventRegistration[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export class EventRegistrationService {
  static async registerForEvent(
    eventId: number, 
    data: EventRegistrationData
  ): Promise<EventRegistration> {
    return apiClient.post<EventRegistration>(`/event-registrations/${eventId}/register`, data);
  }

  static async getRegistrations(
    filters: EventRegistrationFilters = {}
  ): Promise<PaginatedEventRegistrations> {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.size) params.append('size', filters.size.toString());
    if (filters.event_id) params.append('event_id', filters.event_id.toString());
    if (filters.status) params.append('status', filters.status);
    if (filters.search) params.append('search', filters.search);
    
    const query = params.toString();
    return apiClient.get<PaginatedEventRegistrations>(
      `/event-registrations/registrations${query ? `?${query}` : ''}`
    );
  }

  static async updateRegistrationStatus(
    registrationId: number, 
    status: string
  ): Promise<ApiResponse> {
    return apiClient.put<ApiResponse>(
      `/event-registrations/registrations/${registrationId}/status`, 
      { status }
    );
  }

  static async deleteRegistration(registrationId: number): Promise<ApiResponse> {
    return apiClient.delete<ApiResponse>(`/event-registrations/registrations/${registrationId}`);
  }

  static async exportRegistrations(filters: EventRegistrationFilters = {}): Promise<Blob> {
    const params = new URLSearchParams();
    
    if (filters.event_id) params.append('event_id', filters.event_id.toString());
    if (filters.status) params.append('status', filters.status);
    
    const query = params.toString();
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
    
    // Use the same auth method as other services
    const token = localStorage.getItem('access_token'); // Fixed: was 'token', should be 'access_token'
    if (!token) {
      throw new Error('Authentication required. Please log in as an admin.');
    }
    
    console.log('Export request with token:', token ? 'Token present' : 'No token'); // Debug log
    
    // Use direct fetch with proper authentication for blob response
    const response = await fetch(
      `${API_BASE_URL}/event-registrations/registrations/export${query ? `?${query}` : ''}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
      }
    );

    console.log('Export response status:', response.status); // Debug log

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      
      try {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          errorMessage = errorData.detail || errorData.message || errorMessage;
        } else {
          const errorText = await response.text();
          if (errorText) errorMessage = errorText;
        }
      } catch (e) {
        // Use default error message if parsing fails
      }
      
      console.error('Export API error:', response.status, errorMessage);
      
      if (response.status === 401) {
        throw new Error('Authentication failed. Please log in as an admin.');
      } else if (response.status === 403) {
        throw new Error('Access denied. Admin privileges required.');
      } else {
        throw new Error(errorMessage);
      }
    }

    const blob = await response.blob();
    
    // Verify we got an Excel file
    if (blob.size === 0) {
      throw new Error('Export returned empty file');
    }
    
    console.log('Export successful, blob size:', blob.size); // Debug log
    
    return blob;
  }
}

