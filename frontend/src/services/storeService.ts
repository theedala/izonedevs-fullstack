import { apiClient, Product, PaginatedResponse, ApiResponse } from './api';

export interface ProductFilters {
  page?: number;
  size?: number;
  category?: string;
  featured?: boolean;
  available?: boolean;
  search?: string;
}

export interface ProductCreateData {
  name: string;
  description: string;
  price: number;
  image_url?: string;
  category: string;
  stock_quantity?: number;
}

export class StoreService {
  static async getProducts(filters: ProductFilters = {}): Promise<PaginatedResponse<Product>> {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.size) params.append('size', filters.size.toString());
    if (filters.category) params.append('category', filters.category);
    if (filters.featured !== undefined) params.append('featured', filters.featured.toString());
    if (filters.available !== undefined) params.append('available', filters.available.toString());
    if (filters.search) params.append('search', filters.search);
    
    const query = params.toString();
    return apiClient.get<PaginatedResponse<Product>>(`/store/products${query ? `?${query}` : ''}`);
  }

  static async getProduct(id: number): Promise<Product> {
    return apiClient.get<Product>(`/store/products/${id}`);
  }

  static async createProduct(data: ProductCreateData): Promise<Product> {
    return apiClient.post<Product>('/store/products', data);
  }

  static async updateProduct(id: number, data: Partial<ProductCreateData>): Promise<Product> {
    return apiClient.put<Product>(`/store/products/${id}`, data);
  }

  static async deleteProduct(id: number): Promise<ApiResponse> {
    return apiClient.delete<ApiResponse>(`/store/products/${id}`);
  }

  static async getCategories(): Promise<string[]> {
    return apiClient.get<string[]>('/store/categories');
  }

  static async getFeaturedProducts(): Promise<PaginatedResponse<Product>> {
    return this.getProducts({ featured: true, available: true, size: 8 });
  }

  static async getMyOrders(page = 1, size = 10): Promise<PaginatedResponse> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('size', size.toString());
    
    return apiClient.get<PaginatedResponse>(`/store/orders/my?${params.toString()}`);
  }
}