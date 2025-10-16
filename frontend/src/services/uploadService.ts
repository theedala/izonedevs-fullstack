import { apiClient, ApiResponse } from './api';

export interface UploadResponse {
  filename: string;
  url: string;
  category?: string;
  original_name?: string;
}

export class UploadService {
  static async uploadImage(
    file: File,
    category = 'general',
    resize = true
  ): Promise<ApiResponse<UploadResponse>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);
    formData.append('resize', resize.toString());
    
    return apiClient.uploadFile<ApiResponse<UploadResponse>>('/upload/image', formData);
  }

  static async uploadAvatar(file: File): Promise<ApiResponse<{ avatar_url: string }>> {
    const formData = new FormData();
    formData.append('file', file);
    
    return apiClient.uploadFile<ApiResponse<{ avatar_url: string }>>('/upload/avatar', formData);
  }

  static async uploadFile(
    file: File,
    category = 'documents'
  ): Promise<ApiResponse<UploadResponse>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);
    
    return apiClient.uploadFile<ApiResponse<UploadResponse>>('/upload/file', formData);
  }

  static validateImageFile(file: File): boolean {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    return allowedTypes.includes(file.type);
  }

  static validateFileSize(file: File, maxSizeMB = 10): boolean {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
  }

  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}