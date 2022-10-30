export interface ApiResponse {
  status?: string;
  description?: string;
}

export interface ApiWrapper<T> extends ApiResponse {
  response: T;
}

export interface AuthTokensData {
  accessToken: string;
  refreshToken: string;
  access_token: string;
  refresh_token: string;
}

export interface AuthTokenPayload {
  id: number;
  email: string;
}
