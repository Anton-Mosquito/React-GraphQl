// ============================================================================
// common.ts
// ============================================================================
import { z } from 'zod';

export const userIdSchema = z.string().uuid('Invalid user ID format');

export type UserId = z.infer<typeof userIdSchema>;
