import { apiClient, GalleryItem, PaginatedResponse, ApiResponse } from './api';

export interface GalleryFilters {
  page?: number;
  size?: number;
  category?: string;
  featured?: boolean;
}

export interface GalleryItemCreateData {
  title: string;
  description?: string;
  image_url: string;
  category?: string;
}

export class GalleryService {
  static async getGalleryItems(filters: GalleryFilters = {}): Promise<PaginatedResponse<GalleryItem>> {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.size) params.append('size', filters.size.toString());
    if (filters.category) params.append('category', filters.category);
    if (filters.featured !== undefined) params.append('featured', filters.featured.toString());
    
    const query = params.toString();
    return apiClient.get<PaginatedResponse<GalleryItem>>(`/gallery${query ? `?${query}` : ''}`);
  }

  static async getGalleryItem(id: number): Promise<GalleryItem> {
    return apiClient.get<GalleryItem>(`/gallery/${id}`);
  }

  static async createGalleryItem(data: GalleryItemCreateData): Promise<GalleryItem> {
    return apiClient.post<GalleryItem>('/gallery', data);
  }

  static async deleteGalleryItem(id: number): Promise<ApiResponse> {
    return apiClient.delete<ApiResponse>(`/gallery/${id}`);
  }

  static async uploadImage(
    file: File,
    title: string,
    description?: string,
    category?: string
  ): Promise<ApiResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    if (description) formData.append('description', description);
    if (category) formData.append('category', category);
    
    return apiClient.uploadFile<ApiResponse>('/gallery/upload', formData);
  }

  static async getCategories(): Promise<string[]> {
    return apiClient.get<string[]>('/gallery/categories');
  }

  static async getFeaturedItems(): Promise<PaginatedResponse<GalleryItem>> {
    return this.getGalleryItems({ featured: true, size: 6 });
  }
}