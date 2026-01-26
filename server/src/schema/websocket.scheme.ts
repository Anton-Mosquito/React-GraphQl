import { z } from 'zod';
import {
  MAX_STROKE_WIDTH,
  MAX_POINTS,
  MAX_RADIUS,
  MAX_DIMENSION,
  MAX_USERNAME_LENGTH,
} from '../constants/index.js';

const finiteNumber = z.number().finite();
const hexColor = z
  .string()
  .regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color format');
const username = z.string().trim().min(1).max(MAX_USERNAME_LENGTH);
const uuid = z.string().uuid();

export const pointSchema = z
  .object({
    x: finiteNumber,
    y: finiteNumber,
  })
  .strict();

export const FigureType = z.enum(['brush', 'rect', 'circle', 'eraser']);

export const figureSchema = z
  .object({
    type: FigureType,
    color: hexColor.optional(),
    stroke: z.number().positive().max(MAX_STROKE_WIDTH).optional(),
    points: z.array(pointSchema).max(MAX_POINTS).optional(),
    radius: z.number().positive().max(MAX_RADIUS).optional(),
    width: z.number().positive().max(MAX_DIMENSION).optional(),
    height: z.number().positive().max(MAX_DIMENSION).optional(),
  })
  .strict()
  .superRefine((data, ctx) => {
    switch (data.type) {
      case 'brush':
        if (!data.points || data.points.length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Brush requires at least one point',
            path: ['points'],
          });
        }
        break;
      case 'rect':
        if (!data.width || !data.height) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Rectangle requires width and height',
            path: ['width'],
          });
        }
        break;
      case 'circle':
        if (!data.radius) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Circle requires radius',
            path: ['radius'],
          });
        }
        break;
      case 'eraser':
        if (!data.points || data.points.length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Eraser requires at least one point',
            path: ['points'],
          });
        }
        break;
    }
  });

export const connectionMessageSchema = z
  .object({
    method: z.literal('connection'),
    username,
    id: uuid.optional(),
  })
  .strict();

export const drawMessageSchema = z
  .object({
    method: z.literal('draw'),
    figure: figureSchema,
    username: username.optional(),
  })
  .strict();

export const wsMessageSchema = z.discriminatedUnion('method', [
  connectionMessageSchema,
  drawMessageSchema,
]);

// Inferred types
export type Point = z.infer<typeof pointSchema>;
export type Figure = z.infer<typeof figureSchema>;
export type FigureTypeEnum = z.infer<typeof FigureType>;
export type ConnectionMessage = z.infer<typeof connectionMessageSchema>;
export type DrawMessage = z.infer<typeof drawMessageSchema>;
export type WsMessage = z.infer<typeof wsMessageSchema>;
