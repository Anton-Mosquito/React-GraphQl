import { downloadCanvas, copyCanvasToClipboard, exportCanvas } from './canvasExport';
import {
  loadBase64ToCanvas,
  smoothLine,
  simplifyPoints,
  getBoundingBox,
  canvasToBase64,
  isPointInBounds,
  getDistance,
} from './canvasHelpers';
import type {
  DrawFigure,
  BrushFigure,
  EraserFigure,
  SprayFigure,
  GlowFigure,
  DashedFigure,
  TexturedFigure,
  GradientFigure,
} from '../types/canvas';

/**
 * Canvas Drawing Service
 * Handles all canvas drawing operations to eliminate code duplication
 */
export class CanvasDrawingService {
  private ctx: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
  }

  /**
   * Draws a single figure on canvas
   */
  drawFigure(figure: DrawFigure): void {
    switch (figure.type) {
      case 'brush':
        this.drawBrush(figure);
        break;
      case 'eraser':
        this.drawEraser(figure);
        break;
      case 'spray':
        this.drawSpray(figure);
        break;
      case 'glow':
        this.drawGlow(figure);
        break;
      case 'dashed':
        this.drawDashed(figure);
        break;
      case 'textured':
        this.drawTextured(figure);
        break;
      case 'gradient':
        this.drawGradient(figure);
        break;
      case 'rect':
        // TODO: Implement rectangle drawing
        break;
      case 'circle':
        // TODO: Implement circle drawing
        break;
      default:
        console.warn('Unknown figure type:', figure);
    }
  }

  /**
   * Draws a brush stroke
   */
  private drawBrush(figure: BrushFigure): void {
    const { points, color, stroke } = figure;

    if (points.length < 2) return;

    this.ctx.save();
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = stroke;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';

    smoothLine(this.ctx, points);

    this.ctx.restore();
  }

  /**
   * Draws an eraser stroke (white brush)
   */
  private drawEraser(figure: EraserFigure): void {
    const { points, stroke } = figure;

    if (points.length < 2) return;

    this.ctx.save();
    this.ctx.strokeStyle = '#FFFFFF';
    this.ctx.lineWidth = stroke;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';

    smoothLine(this.ctx, points);

    this.ctx.restore();
  }

  /**
   * Draws with spray effect (dispersion)
   */
  private drawSpray(figure: SprayFigure): void {
    const { point, color, size, density = 50 } = figure;

    this.ctx.fillStyle = color;

    for (let i = 0; i < density; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * size;
      const x = point.x + Math.cos(angle) * radius;
      const y = point.y + Math.sin(angle) * radius;

      this.ctx.fillRect(x, y, 1, 1);
    }
  }

  /**
   * Draws with glow effect
   */
  private drawGlow(figure: GlowFigure): void {
    const { points, color, lineWidth } = figure;

    this.ctx.save();

    // Draw multiple layers with different opacity
    for (let i = 3; i > 0; i--) {
      this.ctx.strokeStyle = color;
      this.ctx.lineWidth = lineWidth * (i * 1.5);
      this.ctx.globalAlpha = 0.2 / i;
      this.ctx.lineCap = 'round';
      this.ctx.lineJoin = 'round';

      smoothLine(this.ctx, points);
    }

    // Main line
    this.ctx.globalAlpha = 1;
    this.ctx.lineWidth = lineWidth;
    smoothLine(this.ctx, points);

    this.ctx.restore();
  }

  /**
   * Draws dashed line
   */
  private drawDashed(figure: DashedFigure): void {
    const { points, color, lineWidth } = figure;

    this.ctx.save();
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = lineWidth;
    this.ctx.setLineDash([10, 5]);
    this.ctx.lineCap = 'round';

    smoothLine(this.ctx, points);

    this.ctx.restore();
  }

  /**
   * Draws with texture
   */
  private drawTextured(figure: TexturedFigure): void {
    const { points, color, lineWidth, texture } = figure;

    this.ctx.save();
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = lineWidth;

    switch (texture) {
      case 'rough':
        // Add random deviations
        this.ctx.globalAlpha = 0.8;
        for (let i = 0; i < points.length - 1; i++) {
          this.ctx.beginPath();
          this.ctx.moveTo(
            points[i].x + (Math.random() - 0.5) * 2,
            points[i].y + (Math.random() - 0.5) * 2,
          );
          this.ctx.lineTo(
            points[i + 1].x + (Math.random() - 0.5) * 2,
            points[i + 1].y + (Math.random() - 0.5) * 2,
          );
          this.ctx.stroke();
        }
        break;

      case 'chalk':
        // Chalk effect with multiple thin lines
        for (let j = 0; j < 3; j++) {
          this.ctx.globalAlpha = 0.3;
          this.ctx.beginPath();
          for (let i = 0; i < points.length; i++) {
            const offset = (Math.random() - 0.5) * lineWidth * 0.5;
            if (i === 0) {
              this.ctx.moveTo(points[i].x + offset, points[i].y + offset);
            } else {
              this.ctx.lineTo(points[i].x + offset, points[i].y + offset);
            }
          }
          this.ctx.stroke();
        }
        break;

      case 'marker':
        // Marker effect with slightly blurred edges
        this.ctx.shadowColor = color;
        this.ctx.shadowBlur = 2;
        smoothLine(this.ctx, points);
        break;
    }

    this.ctx.restore();
  }

  /**
   * Draws gradient line
   */
  private drawGradient(figure: GradientFigure): void {
    const { points, startColor, endColor, lineWidth } = figure;

    if (points.length < 2) return;

    this.ctx.save();
    this.ctx.lineWidth = lineWidth;
    this.ctx.lineCap = 'round';

    const gradient = this.ctx.createLinearGradient(
      points[0].x,
      points[0].y,
      points[points.length - 1].x,
      points[points.length - 1].y,
    );
    gradient.addColorStop(0, startColor);
    gradient.addColorStop(1, endColor);

    this.ctx.strokeStyle = gradient;
    smoothLine(this.ctx, points);

    this.ctx.restore();
  }

  /**
   * Clears the entire canvas
   */
  clear(width: number, height: number): void {
    this.ctx.clearRect(0, 0, width, height);
  }

  /**
   * Redraws the entire canvas from an array of figures
   */
  redrawAll(figures: DrawFigure[], width: number, height: number): void {
    this.clear(width, height);
    figures.forEach((figure) => this.drawFigure(figure));
  }

  /**
   * Draws an image from base64 data
   */
  async drawImage(base64: string): Promise<void> {
    return loadBase64ToCanvas(this.ctx, base64);
  }

  /**
   * Optimizes a figure for network transmission by simplifying points
   */
  optimizeFigureForNetwork(figure: DrawFigure): DrawFigure {
    if (figure.points.length <= 3) return figure;

    const simplifiedPoints = simplifyPoints(figure.points, 1.5); // Tighter tolerance for network

    return {
      ...figure,
      points: simplifiedPoints,
    };
  }

  /**
   * Gets the bounding box of an array of figures
   */
  getFiguresBoundingBox(figures: DrawFigure[]) {
    return getBoundingBox(figures);
  }

  /**
   * Exports the canvas as a base64 encoded PNG
   */
  exportAsBase64(): string {
    return canvasToBase64(this.canvas);
  }

  /**
   * Checks if a point is within canvas bounds
   */
  isPointInCanvasBounds(x: number, y: number): boolean {
    return isPointInBounds({ x, y }, this.canvas.width, this.canvas.height);
  }

  /**
   * Calculates distance between two points
   */
  getDistanceBetweenPoints(p1: { x: number; y: number }, p2: { x: number; y: number }): number {
    return getDistance(p1, p2);
  }

  /**
   * Downloads the canvas as an image file
   */
  downloadCanvas(filename = 'canvas-drawing.png'): void {
    downloadCanvas(this.canvas, filename);
  }

  /**
   * Copies the canvas content to clipboard
   */
  async copyToClipboard(): Promise<void> {
    return copyCanvasToClipboard(this.canvas);
  }

  /**
   * Exports canvas in different formats
   */
  exportCanvas(format: 'png' | 'jpeg' | 'webp' = 'png', quality = 0.92): string {
    return exportCanvas(this.canvas, format, quality);
  }
}
