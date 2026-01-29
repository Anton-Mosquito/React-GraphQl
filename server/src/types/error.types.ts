export interface ErrorResponse {
  error: 'error' | 'fail';
  message: string;
  errors?: unknown;
}
