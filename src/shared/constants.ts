export const DEFAULT_COUNT_OF_USER_PROGRESS = 0;
export const DEFAULT_TOTAL_OF_USER_PROGRESS = 100;

export const DEFAULT_LIMIT_OF_POPULAR_POLLS = 5;

export const SORT_ATTR_FOR_POLLS = 'created';
export const SORT_TYPE_FOR_POLLS = 'DESC';

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

export interface UserProgressResponse {
  created: UserProgressValue;
  consists: UserProgressValue;
  participation: UserProgressValue;
}

export interface UserProgressValue {
  count: number;
  total: number;
}
