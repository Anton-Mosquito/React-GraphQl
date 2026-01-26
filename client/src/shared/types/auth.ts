import { type UserRole } from '@/entities/User/model/consts/consts';

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    username: string;
    avatar?: string;
    roles?: UserRole[];
  };
}