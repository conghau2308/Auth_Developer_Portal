// types/api.types.ts

// ========== USER TYPES ==========
export interface User {
  userId: string;
  email: string;
  name: string;
  avatar?: string;
  phone?: string;
  role: 'USER' | 'ADMIN' | 'MODERATOR';
  isActive: boolean;
}

// DTO = Data Transfer Object (data gửi lên server)
export interface UpdateUserDTO {
  name?: string;
  phone?: string;
  address?: string;
  // Chỉ include các field được phép update
  // Không có id, email, role (do backend control)
}

export interface CreateUserDTO {
  username: string;
  name: string;
  email: string;
  image_b64: string;
}

// ========== AUTH TYPES ==========
export interface LoginDTO {
  username: string;
  imageBase64: string;
}

export interface LoginResponse {
  user: User;
  message: string;
}

// ========== PRODUCT TYPES ==========
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  stock: number;
  createdAt: string;
}

export interface CreateProductDTO {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
}

// ========== API RESPONSE WRAPPER ==========
// Nếu backend trả về format: { data: {...}, message: '', success: true }
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

// Pagination response
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// ========== ERROR TYPES ==========
export interface ApiError {
  message: string;
  code: string;
  details?: Record<string, string[]>; // Validation errors
}