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
  name: string;
}

export interface CreateUserDTO {
  username: string;
  name: string;
  email: string;
  // WiFaKey client-side: chỉ gửi kết quả đã tính, không gửi ảnh hay embedding
  helper_data_b64: string;
  mask_b64: string;
  key_hash_b64: string;
}

export interface DeltaResponseDto {
  helper_data_b64: string;
  mask_b64: string;
}

// ========== AUTH TYPES ==========
export interface LoginDTO {
  username: string;
  c_prime_b64: string;
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

export interface OAuthValidateParams {
  client_id: string;
  redirect_uri: string;
  scope: string;
  response_type: string;
  state: string;
  nonce: string;
  code_challenge: string;
  code_challenge_method: string;
}

export interface OAuth2ValidateClientResponseDto {
  clientName: string;
  clientIcon?: string;
  clientHomepageUrl?: string;
  scopes: string[];
}

export interface OAuthAuthorizeRequestDto {
  client_id: string;
  redirect_uri: string;
  scope: string;
  state: string;
  nonce: string;
  code_challenge: string;
  code_challenge_method: string;
  // WiFaKey client-side: hash_k thay cho image
  hash_k_b64: string;
}

export type OAuthAuthorizeResponseDto =
  | {
    consent_required: true;
    pending_scopes: string[];
    client_name: string;
    redirect_url?: never;
  }
  | {
    consent_required: false;
    redirect_url: string;
    pending_scopes?: never;
    client_name?: never;
  };

export interface OAuthConsentRequestDto {
  client_id: string;
  redirect_uri: string;
  scope: string;
  state: string;
  nonce: string;
  code_challenge: string;
  code_challenge_method: string;
}

export interface AuthorizedApplication {
  id: string;
  grantedScopes: string[];
  grantedAt: string;
  updatedAt: string;
  clientName: string;
  clientIcon?: string;
}

export interface AuthorizedApplicationResponseDto {
  items: AuthorizedApplication[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
}

export interface ClientMemberResponseDto {
  id: string;
  clientId: string;
  clientName: string;
  clientIcon?: string;
  createdAt: string;
  role: "OWNER" | "ADMIN" | "DEVELOPER";
}

export interface SecretUserDto {
  userId: string;
  name: string;
  avatar?: string;
}

export interface ClientSecret {
  secretId: string;
  maskedValue: string; // Chỉ hiển thị dạng ****1234
  createdAt: string;
  createdByUser: SecretUserDto;
  revokedAt: string | null;
  revokedByUser: SecretUserDto | null;
  active: boolean;
}

export interface ClientCredentialsResponseDto {
  id: string;
  clientId: string;
  clientName: string;
  clientIcon?: string;
  redirectUri: string;
  clientHomePageUrl?: string;
  createdAt: string;
  role: "OWNER" | "ADMIN" | "DEVELOPER";
  clientSecrets: ClientSecret[];
}

export interface NewClientSecretResponseDto {
  secretId: string;
  secretValue: string; // Giá trị đầy đủ của secret mới tạo (chỉ trả về lần này duy nhất)
}

export interface UpdateClientRequestDto {
  clientName: string;
  redirectUri: string;
}

export interface EnrollNewClientRequestDto {
  clientName: string;
  redirectUri: string;
}

export interface EnrollNewClientResponseDto {
  id: string;
}

export interface MemberOfClientDto {
  userId: string;
  name: string;
  email: string;
  avatar?: string;
  role: "OWNER" | "ADMIN" | "DEVELOPER";
  addedAt: string;
}

export interface MemberIsPendingDto {
  invitationId: string;
  inviteeEmail: string;
  avatar?: string;
  role: "ADMIN" | "DEVELOPER";
  status: "PENDING";
  expiresAt: string;
  createdAt: string;
  invitedByName: string;
}

export interface UserSearchDto {
  userId: string;
  username: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface InviteUserRequest {
  userId: string;
  role: "ADMIN" | "DEVELOPER";
}

export interface InvitationPreviewResponseDto {
  clientName: string;
  role: "ADMIN" | "DEVELOPER";
  invitedByName: string;
  invitedByEmail: string;
  inviteeEmail: string;
  expiresAt: string;
}

export interface AcceptInvitationResponseDto {
  clientId: string;
}

export interface UpdateMemberRoleRequestDto {
  memberId: string;
  role: string;
}