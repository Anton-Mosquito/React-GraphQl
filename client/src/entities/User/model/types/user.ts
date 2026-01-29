import { type JsonSettings } from './jsonSettings';
import { type UserRole } from '../consts/consts';

export interface User {
  id: string;
  email: string;
  isActivated: boolean;
  username?: string;
  avatar?: string;
  roles?: UserRole[];
  jsonSettings?: JsonSettings;
}

export interface UserSchema {
  authData?: User;
  _inited: boolean;
}
