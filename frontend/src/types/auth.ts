export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  userId: string;
  tenantId: string;
  tenantSlug: string;
  role: 'STAFF' | 'MANAGER';
  email: string;
}

export interface RegisterRequest {
  restaurantName: string;
  email: string;
  phone?: string;
  password: string;
  tier?: number;
}

export interface RegisterResponse {
  token: string;
  userId: string;
  tenantId: string;
  tenantSlug: string;
  role: string;
  email: string;
}

export interface ErrorResponse {
  error: string;
  message: string;
  details?: Record<string, string>;
  timestamp: string;
}
