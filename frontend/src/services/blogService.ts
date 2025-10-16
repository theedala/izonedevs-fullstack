import { apiClient, BlogPost, PaginatedResponse, ApiResponse } from './api';

export interface BlogFilters {
  page?: number;
  size?: number;
  status?: string;
  featured?: boolean;
  search?: string;
}

export interface BlogPostCreateData {
  title: string;
  excerpt?: string;
  content: string;
  image_url?: string;
  status?: string;
}

export class BlogService {
  static async getBlogPosts(filters: BlogFilters = {}): Promise<PaginatedResponse<BlogPost>> {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.size) params.append('size', filters.size.toString());
    if (filters.status && filters.status.trim()) params.append('status', filters.status);
    if (filters.featured !== undefined) params.append('featured', filters.featured.toString());
    if (filters.search) params.append('search', filters.search);
    
    const query = params.toString();
    console.log('BlogService: Making request to:', `/blog${query ? `?${query}` : ''}`);
    const response = await apiClient.get<PaginatedResponse<BlogPost>>(`/blog${query ? `?${query}` : ''}`);
    console.log('BlogService: Received response:', response);
    return response;
  }

  static async getBlogPost(id: number): Promise<BlogPost> {
    return apiClient.get<BlogPost>(`/blog/${id}`);
  }

  static async getBlogPostBySlug(slug: string): Promise<BlogPost> {
    return apiClient.get<BlogPost>(`/blog/slug/${slug}`);
  }

  static async createBlogPost(data: BlogPostCreateData): Promise<BlogPost> {
    console.log('BlogService: Creating blog post with data:', data);
    const response = await apiClient.post<BlogPost>('/blog', data);
    console.log('BlogService: Blog post created, response:', response);
    return response;
  }

  static async updateBlogPost(id: number, data: Partial<BlogPostCreateData>): Promise<BlogPost> {
    return apiClient.put<BlogPost>(`/blog/${id}`, data);
  }

  static async deleteBlogPost(id: number): Promise<ApiResponse> {
    return apiClient.delete<ApiResponse>(`/blog/${id}`);
  }

  static async getFeaturedPosts(): Promise<PaginatedResponse<BlogPost>> {
    return this.getBlogPosts({ featured: true, status: 'published', size: 3 });
  }

  static async getRecentPosts(): Promise<PaginatedResponse<BlogPost>> {
    return this.getBlogPosts({ status: 'published', size: 6 });
  }
}