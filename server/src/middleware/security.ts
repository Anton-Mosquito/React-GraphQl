import { Request, Response, NextFunction } from 'express';

export function securityHeaders(
  _req: Request,
  res: Response,
  next: NextFunction,
): void {
  // Remove X-Powered-By header
  res.removeHeader('X-Powered-By');

  // Set security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');

  next();
}

export function requestLogger(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  const start = Date.now();

  _res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(
      `${req.method} ${req.path} - ${_res.statusCode} - ${duration}ms`,
    );
  });

  next();
}
