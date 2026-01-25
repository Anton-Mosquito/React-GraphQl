import WebSocket from 'ws';
import { z } from 'zod';

// ============================================================================
// Zod Schemas for Runtime Validation
// ============================================================================

/**
 * Schema for a point coordinate
 */
export const PointSchema = z.object({
  x: z.number().finite(),
  y: z.number().finite(),
});

/**
 * Schema for drawing figure
 * Supports: brush, rectangle, circle, eraser
 */
export const FigureSchema = z.object({
  type: z.enum(['brush', 'rect', 'circle', 'eraser']),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/)
    .optional(), // Hex color
  stroke: z.number().positive().max(100).optional(), // Max stroke width 100px
  points: z.array(PointSchema).max(10000).optional(), // Limit points to prevent DoS
  radius: z.number().positive().max(5000).optional(), // Max radius 5000px
  width: z.number().positive().max(10000).optional(), // Max width 10000px
  height: z.number().positive().max(10000).optional(), // Max height 10000px
});

/**
 * Schema for connection message (user joins/leaves)
 */
export const ConnectionMessageSchema = z.object({
  method: z.literal('connection'),
  username: z.string().min(1).max(50).trim(),
  id: z.string().uuid().optional(), // Room ID
});

/**
 * Schema for draw message (user draws something)
 */
export const DrawMessageSchema = z.object({
  method: z.literal('draw'),
  figure: FigureSchema,
  username: z.string().min(1).max(50).trim().optional(), // Optional: who drew it
});

/**
 * Discriminated union schema for all WebSocket messages
 */
export const WsMessageSchema = z.discriminatedUnion('method', [
  ConnectionMessageSchema,
  DrawMessageSchema,
]);

// ============================================================================
// TypeScript Types (inferred from Zod schemas)
// ============================================================================

export type Point = z.infer<typeof PointSchema>;
export type Figure = z.infer<typeof FigureSchema>;
export type FigureType = Figure['type'];
export type ConnectionMessage = z.infer<typeof ConnectionMessageSchema>;
export type DrawMessage = z.infer<typeof DrawMessageSchema>;
export type WsMessage = z.infer<typeof WsMessageSchema>;

// ============================================================================
// Extended WebSocket Interface
// ============================================================================

/**
 * Extended WebSocket with custom properties for tracking user state
 */
export interface ExtendedWebSocket extends WebSocket {
  /** Unique room/session ID */
  id?: string;
  /** Username of the connected user */
  username?: string;
  /** Timestamp when user connected */
  connectedAt?: Date;
  /** Flag to track if initial connection message was received */
  isInitialized?: boolean;
}

// ============================================================================
// WebSocket Events
// ============================================================================

/**
 * Types of events that can be broadcast to clients
 */
export enum WsEventType {
  USER_CONNECTED = 'user_connected',
  USER_DISCONNECTED = 'user_disconnected',
  DRAW = 'draw',
  ERROR = 'error',
}

/**
 * Broadcast event structure
 */
export interface BroadcastEvent {
  type: WsEventType;
  timestamp: string;
  data: WsMessage | { message: string };
}
