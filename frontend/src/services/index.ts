// Export all services for easy import
export * from './api';
export * from './authService';
export * from './communitiesService';
export * from './projectsService';
export * from './eventsService';
export * from './eventRegistrationService';
export * from './blogService';
export * from './storeService';
export * from './galleryService';
export * from './contactService';
export * from './uploadService';
export * from './userService';
export * from './partnersService';
export * from './teamMembersService';

// Re-export commonly used types
export type {
  User,
  Community,
  Project,
  Event,
  BlogPost,
  Product,
  GalleryItem,
  ContactMessage,
  AuthTokens,
  LoginCredentials,
  RegisterData,
  ApiResponse,
  PaginatedResponse
} from './api';