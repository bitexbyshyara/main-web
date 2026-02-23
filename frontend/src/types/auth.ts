export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  userId: string;
  tenantId: string;
  role: 'STAFF' | 'MANAGER';
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
}

export interface ErrorResponse {
  error: string;
  message: string;
  details?: Record<string, string>;
  timestamp: string;
}
