export abstract class AppError extends Error {
  public statusCode: number;
  public status: 'error' | 'fail';
  public isOperational: boolean;

  constructor(
    message: string,
    statusCode = 500,
    status: 'error' | 'fail' = 'error',
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.status = status;
    this.isOperational = true;
    Object.setPrototypeOf(this, new.target.prototype);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      statusCode: this.statusCode,
      status: this.status,
    };
  }
}

export class ApiError extends AppError {
  public errors?: unknown;

  constructor(message: string, statusCode = 400, errors?: unknown) {
    // For client errors default to 'fail'
    super(message, statusCode, statusCode >= 500 ? 'error' : 'fail');
    this.errors = errors;
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  static BadRequest(message = 'Bad Request', errors?: unknown) {
    return new ApiError(message, 400, errors);
  }

  static Unauthorized(message = 'Unauthorized') {
    return new ApiError(message, 401);
  }

  static Forbidden(message = 'Forbidden') {
    return new ApiError(message, 403);
  }

  static NotFound(message = 'Not Found') {
    return new ApiError(message, 404);
  }

  static Internal(message = 'Internal Server Error') {
    return new ApiError(message, 500);
  }
}

export class TMDBApiError extends AppError {
  public originalError?: unknown;

  constructor(message: string, statusCode = 502, originalError?: unknown) {
    // treat TMDB upstream errors as server errors by default
    super(message, statusCode, 'error');
    this.originalError = originalError;
    Object.setPrototypeOf(this, TMDBApiError.prototype);
  }

  toJSON() {
    return {
      ...super.toJSON(),
      originalError: this.originalError,
    };
  }
}

export class ConfigurationError extends AppError {
  constructor(message: string) {
    super(message, 500, 'error');
    Object.setPrototypeOf(this, ConfigurationError.prototype);
  }
}
