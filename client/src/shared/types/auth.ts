import { type User } from '@/entities/User';

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}
