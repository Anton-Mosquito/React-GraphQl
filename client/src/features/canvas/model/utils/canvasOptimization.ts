/**
 * Canvas Optimizer
 * Throttles canvas redraw operations to ~60fps for better performance
 */
export class CanvasOptimizer {
  private lastRedraw = 0;
  private readonly REDRAW_THROTTLE = 16; // ~60fps (1000ms / 60 = 16.67ms)

  /**
   * Checks if enough time has passed since last redraw
   * @returns true if redraw should proceed, false if throttled
   */
  shouldRedraw(): boolean {
    const now = Date.now();
    if (now - this.lastRedraw > this.REDRAW_THROTTLE) {
      this.lastRedraw = now;
      return true;
    }
    return false;
  }

  /**
   * Resets the throttle timer
   */
  reset(): void {
    this.lastRedraw = 0;
  }
}
