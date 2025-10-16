import { apiClient, Event, PaginatedResponse, ApiResponse } from './api';

export interface EventFilters {
  page?: number;
  size?: number;
  status?: string;
  featured?: boolean;
  upcoming?: boolean;
}

export interface EventCreateData {
  title: string;
  description: string;
  content?: string;
  image_url?: string;
  start_date: string;
  end_date: string;
  location?: string;
  is_online?: boolean;
  meeting_url?: string;
  max_attendees?: number;
  registration_fee?: number;
  community_id?: number;
}

export class EventsService {
  static async getEvents(filters: EventFilters = {}): Promise<PaginatedResponse<Event>> {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.size) params.append('size', filters.size.toString());
    if (filters.status) params.append('status', filters.status);
    if (filters.featured !== undefined) params.append('featured', filters.featured.toString());
    if (filters.upcoming !== undefined) params.append('upcoming', filters.upcoming.toString());
    
    const query = params.toString();
    return apiClient.get<PaginatedResponse<Event>>(`/events${query ? `?${query}` : ''}`);
  }

  static async getEvent(id: number): Promise<Event> {
    return apiClient.get<Event>(`/events/${id}`);
  }

  static async createEvent(data: EventCreateData): Promise<Event> {
    return apiClient.post<Event>('/events', data);
  }

  static async updateEvent(id: number, data: Partial<EventCreateData>): Promise<Event> {
    return apiClient.put<Event>(`/events/${id}`, data);
  }

  static async deleteEvent(id: number): Promise<ApiResponse> {
    return apiClient.delete<ApiResponse>(`/events/${id}`);
  }

  static async registerForEvent(id: number): Promise<ApiResponse> {
    return apiClient.post<ApiResponse>(`/events/${id}/register`);
  }

  static async unregisterFromEvent(id: number): Promise<ApiResponse> {
    return apiClient.post<ApiResponse>(`/events/${id}/unregister`);
  }

  static async getUpcomingEvents(): Promise<PaginatedResponse<Event>> {
    return this.getEvents({ upcoming: true, size: 6 });
  }

  static async getFeaturedEvents(): Promise<PaginatedResponse<Event>> {
    return this.getEvents({ featured: true, size: 3 });
  }
}