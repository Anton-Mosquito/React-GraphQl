import WebSocket from 'ws';
import { z } from 'zod';

export type FigureType = 'brush' | 'rect' | 'circle' | 'eraser';

export interface Point {
  x: number;
  y: number;
}

export interface Figure {
  type: FigureType;
  color?: string;
  stroke?: number;
  points?: Point[];
  radius?: number;
  width?: number;
  height?: number;
}

export interface ConnectionMessage {
  method: 'connection';
  username: string;
  id?: string; // optional room id
}

export interface DrawMessage {
  method: 'draw';
  figure: Figure;
}

export type WsMessage = ConnectionMessage | DrawMessage;

export interface ExtendedWebSocket extends WebSocket {
  id?: string; // room id
  username?: string;
}

// Zod schemas for runtime validation
export const PointSchema = z.object({
  x: z.number(),
  y: z.number(),
});

export const FigureSchema = z.object({
  type: z.enum(['brush', 'rect', 'circle', 'eraser']),
  color: z.string().optional(),
  stroke: z.number().optional(),
  points: z.array(PointSchema).optional(),
  radius: z.number().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
});

export const ConnectionMessageSchema = z.object({
  method: z.literal('connection'),
  username: z.string(),
  id: z.string().optional(),
});

export const DrawMessageSchema = z.object({
  method: z.literal('draw'),
  figure: FigureSchema,
});

export const WsMessageSchema = z.discriminatedUnion('method', [
  ConnectionMessageSchema,
  DrawMessageSchema,
]);

export type WsMessageSchemaType = z.infer<typeof WsMessageSchema>;
