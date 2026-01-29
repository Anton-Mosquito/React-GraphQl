import type { Point, DrawFigure } from '../types/canvas';

/**
 * Calculates the Euclidean distance between two points
 * @param p1 - First point
 * @param p2 - Second point
 * @returns The distance between the two points
 */
export const getDistance = (p1: Point, p2: Point): number => {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Simplifies an array of points by removing points that are too close together
 * Uses the Douglas-Peucker algorithm variant for line simplification
 * @param points - Array of points to simplify
 * @param tolerance - Minimum distance between points to keep (default: 2)
 * @returns Simplified array of points
 */
export const simplifyPoints = (points: Point[], tolerance = 2): Point[] => {
  if (points.length <= 2) return points;

  const simplified: Point[] = [points[0]];
  let prev = points[0];

  for (let i = 1; i < points.length - 1; i++) {
    const current = points[i];
    if (getDistance(prev, current) > tolerance) {
      simplified.push(current);
      prev = current;
    }
  }

  simplified.push(points[points.length - 1]);
  return simplified;
};

/**
 * Checks if a point is within the bounds of a canvas
 * @param point - Point to check
 * @param width - Canvas width
 * @param height - Canvas height
 * @returns True if point is within bounds (inclusive), false otherwise
 */
export const isPointInBounds = (point: Point, width: number, height: number): boolean => {
  return point.x >= 0 && point.x <= width && point.y >= 0 && point.y <= height;
};

/**
 * Clamps a point to stay within canvas bounds
 * @param point - Point to clamp
 * @param width - Canvas width
 * @param height - Canvas height
 * @returns New point clamped to canvas bounds
 */
export const clampPoint = (point: Point, width: number, height: number): Point => {
  return {
    x: Math.max(0, Math.min(width, point.x)),
    y: Math.max(0, Math.min(height, point.y)),
  };
};

/**
 * Draws a smooth line using quadratic Bézier curves for better visual quality
 * Falls back to straight lines for fewer than 3 points
 * @param ctx - Canvas 2D rendering context
 * @param points - Array of points to draw the line through
 */
export const smoothLine = (ctx: CanvasRenderingContext2D, points: Point[]): void => {
  if (points.length < 3) {
    // For fewer than 3 points, draw a regular line
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();
    return;
  }

  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);

  for (let i = 1; i < points.length - 2; i++) {
    const xc = (points[i].x + points[i + 1].x) / 2;
    const yc = (points[i].y + points[i + 1].y) / 2;
    ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
  }

  ctx.quadraticCurveTo(
    points[points.length - 2].x,
    points[points.length - 2].y,
    points[points.length - 1].x,
    points[points.length - 1].y,
  );

  ctx.stroke();
};

/**
 * Serializes a canvas to a base64 encoded PNG string
 * @param canvas - HTML canvas element to serialize
 * @returns Base64 encoded PNG data URL
 */
export const canvasToBase64 = (canvas: HTMLCanvasElement): string => {
  return canvas.toDataURL('image/png');
};

/**
 * Loads a base64 encoded image onto a canvas context
 * @param ctx - Canvas 2D rendering context to draw on
 * @param base64 - Base64 encoded image data URL
 * @returns Promise that resolves when image is loaded and drawn
 */
export const loadBase64ToCanvas = (
  ctx: CanvasRenderingContext2D,
  base64: string,
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      resolve();
    };
    img.onerror = reject;
    img.src = base64;
  });
};

/**
 * Calculates the bounding box that encompasses all points in the given figures
 * @param figures - Array of drawing figures to calculate bounds for
 * @returns Bounding box with min/max coordinates, or null if no figures provided
 */
export const getBoundingBox = (
  figures: DrawFigure[],
): {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
} | null => {
  if (figures.length === 0) return null;

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  figures.forEach((figure) => {
    figure.points.forEach((point) => {
      minX = Math.min(minX, point.x);
      minY = Math.min(minY, point.y);
      maxX = Math.max(maxX, point.x);
      maxY = Math.max(maxY, point.y);
    });
  });

  return { minX, minY, maxX, maxY };
};
