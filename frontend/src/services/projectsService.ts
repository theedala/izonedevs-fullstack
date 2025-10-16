import { apiClient, Project, PaginatedResponse, ApiResponse } from './api';

export interface ProjectFilters {
  page?: number;
  size?: number;
  community_id?: number;
  status?: string;
  difficulty?: string;
  featured?: boolean;
  search?: string;
}

export interface ProjectCreateData {
  title: string;
  description: string;
  content?: string;
  image_url?: string;
  github_url?: string;
  demo_url?: string;
  technologies: string[];
  category?: string;
  status?: string;
  featured?: boolean;
  difficulty?: string;
  community_id?: number;
}

export class ProjectsService {
  static async getProjects(filters: ProjectFilters = {}): Promise<PaginatedResponse<Project>> {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.size) params.append('size', filters.size.toString());
    if (filters.community_id) params.append('community_id', filters.community_id.toString());
    if (filters.status) params.append('status', filters.status);
    if (filters.difficulty) params.append('difficulty', filters.difficulty);
    if (filters.featured !== undefined) params.append('featured', filters.featured.toString());
    if (filters.search) params.append('search', filters.search);
    
    const query = params.toString();
    return apiClient.get<PaginatedResponse<Project>>(`/projects${query ? `?${query}` : ''}`);
  }

  static async getProject(id: number): Promise<Project> {
    return apiClient.get<Project>(`/projects/${id}`);
  }

  static async createProject(data: ProjectCreateData): Promise<Project> {
    return apiClient.post<Project>('/projects', data);
  }

  static async updateProject(id: number, data: Partial<ProjectCreateData>): Promise<Project> {
    return apiClient.put<Project>(`/projects/${id}`, data);
  }

  static async deleteProject(id: number): Promise<ApiResponse> {
    return apiClient.delete<ApiResponse>(`/projects/${id}`);
  }

  static async toggleFeatured(id: number, featured: boolean): Promise<ApiResponse> {
    return apiClient.put<ApiResponse>(`/projects/${id}/feature`, { featured });
  }

  static async getFeaturedProjects(): Promise<PaginatedResponse<Project>> {
    return this.getProjects({ featured: true, size: 6 });
  }
}