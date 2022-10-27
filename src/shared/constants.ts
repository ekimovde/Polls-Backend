export interface ApiWrapper<T> {
  status?: string;
  description?: string;
  response: T;
}
