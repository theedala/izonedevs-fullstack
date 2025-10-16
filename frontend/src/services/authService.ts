import { apiClient, AuthTokens, LoginCredentials, RegisterData, User, ApiResponse } from './api';

export class AuthService {
  static async login(credentials: LoginCredentials): Promise<AuthTokens> {
    try {
      const formData = new FormData();
      formData.append('username', credentials.username);
      formData.append('password', credentials.password);

      console.log('Making login request to:', `${apiClient['baseURL']}/auth/login`);
      console.log('Credentials:', { username: credentials.username, password: '***' });

      const response = await fetch(`${apiClient['baseURL']}/auth/login`, {
        method: 'POST',
        body: formData,
      });

      console.log('Login response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Login error response:', errorText);
        
        // Try to parse as JSON for error details
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.detail || 'Invalid credentials');
        } catch {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      }

      const result = await response.json();
      console.log('Login successful, got tokens');
      return result;
    } catch (error) {
      console.error('AuthService.login error:', error);
      throw error;
    }
  }

  static async loginJson(credentials: LoginCredentials): Promise<AuthTokens> {
    return apiClient.post<AuthTokens>('/auth/login-json', credentials);
  }

  static async register(userData: RegisterData): Promise<ApiResponse> {
    return apiClient.post<ApiResponse>('/auth/register', userData);
  }

  static async adminCreateUser(userData: RegisterData): Promise<ApiResponse> {
    return apiClient.post<ApiResponse>('/auth/admin-create-user', userData);
  }

  static async getCurrentUser(): Promise<User> {
    return apiClient.get<User>('/users/me');
  }

  static async updateProfile(userData: Partial<User>): Promise<User> {
    return apiClient.put<User>('/users/me', userData);
  }

  static async refreshToken(refreshToken: string): Promise<AuthTokens> {
    return apiClient.post<AuthTokens>('/auth/refresh', { refresh_token: refreshToken });
  }

  static async logout(): Promise<void> {
    // Clear tokens from local storage
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
}