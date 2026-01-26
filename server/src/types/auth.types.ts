import { Request } from 'express';
import { TokenPayload } from '#schema/index.js';

export interface AuthRequest extends Request {
  user?: TokenPayload;
}
