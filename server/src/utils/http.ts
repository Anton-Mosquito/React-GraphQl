import { z } from 'zod';
import { TMDBApiError } from './errors.js';
import { logger } from './logger.js';

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
  timeout?: number;
}

interface FetchResponse<T> {
  data: T;
  status: number;
  statusText: string;
}

function buildSearchParams(
  params?: Record<string, string | number | boolean | undefined>,
): string {
  if (!params) return '';

  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });

  const query = searchParams.toString();
  return query ? `?${query}` : '';
}

async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeout: number = 30000,
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

export class HttpClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseURL: string, defaultHeaders: Record<string, string> = {}) {
    this.baseURL = baseURL.endsWith('/') ? baseURL.slice(0, -1) : baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...defaultHeaders,
    };
  }

  /**
   * GET request with Zod schema validation
   * @param endpoint - API endpoint
   * @param schema - Zod schema for response validation
   * @param options - Fetch options
   * @returns Validated response data
   */
  async getValidated<T extends z.ZodType>(
    endpoint: string,
    schema: T,
    options: FetchOptions = {},
  ): Promise<FetchResponse<z.infer<T>>> {
    const { params, timeout, headers, ...fetchOptions } = options;
    const url = `${this.baseURL}${endpoint}${buildSearchParams(params)}`;

    logger.debug('HTTP GET request (validated)', { url, params });

    try {
      const response = await fetchWithTimeout(
        url,
        {
          method: 'GET',
          headers: {
            ...this.defaultHeaders,
            ...headers,
          },
          ...fetchOptions,
        },
        timeout,
      );

      if (!response.ok) {
        const errorText = await response.text();
        logger.error('HTTP request failed', {
          url,
          status: response.status,
          statusText: response.statusText,
          body: errorText,
        });

        throw new TMDBApiError(
          `HTTP ${response.status}: ${response.statusText}`,
          response.status,
        );
      }

      const rawData = await response.json();

      // Validate response with Zod schema
      try {
        const validatedData = schema.parse(rawData);

        return {
          data: validatedData,
          status: response.status,
          statusText: response.statusText,
        };
      } catch (validationError) {
        logger.error('Response validation failed', {
          url,
          error:
            validationError instanceof Error
              ? validationError.message
              : 'Unknown validation error',
        });
        throw new TMDBApiError(
          'Invalid response format from TMDB API',
          502,
          validationError,
        );
      }
    } catch (error) {
      if (error instanceof TMDBApiError) {
        throw error;
      }

      if (error instanceof Error && error.name === 'AbortError') {
        logger.error('HTTP request timeout', { url, timeout });
        throw new TMDBApiError('Request timeout', 408, error);
      }

      if (error instanceof TypeError) {
        logger.error('Network error', { url, error: error.message });
        throw new TMDBApiError('Network error', undefined, error);
      }

      logger.error('Unexpected HTTP error', { url, error });
      throw new TMDBApiError('Unexpected error occurred', undefined, error);
    }
  }

  // Overload: validated response with Zod schema
  async post<T, D = unknown>(
    endpoint: string,
    data: D | undefined,
    options: FetchOptions,
    schema: z.ZodType<T>,
  ): Promise<FetchResponse<T>>;

  // Overload: unvalidated response (returns unknown)
  async post(
    endpoint: string,
    data?: unknown,
    options?: FetchOptions,
  ): Promise<FetchResponse<unknown>>;

  async post<T = unknown, D = unknown>(
    endpoint: string,
    data?: D,
    options: FetchOptions = {},
    schema?: z.ZodType<T>,
  ): Promise<FetchResponse<T> | FetchResponse<unknown>> {
    const { params, timeout, headers, ...fetchOptions } = options;
    const url = `${this.baseURL}${endpoint}${buildSearchParams(params)}`;

    logger.debug('HTTP POST request', { url, data });

    try {
      const response = await fetchWithTimeout(
        url,
        {
          method: 'POST',
          headers: {
            ...this.defaultHeaders,
            ...headers,
          },
          body: data ? JSON.stringify(data) : undefined,
          ...fetchOptions,
        },
        timeout,
      );

      if (!response.ok) {
        const errorText = await response.text();
        logger.error('HTTP POST request failed', {
          url,
          status: response.status,
          statusText: response.statusText,
          body: errorText,
        });

        throw new TMDBApiError(
          `HTTP ${response.status}: ${response.statusText}`,
          response.status,
        );
      }

      const responseData = await response.json();

      if (schema) {
        try {
          const validated = schema.parse(responseData);
          return {
            data: validated,
            status: response.status,
            statusText: response.statusText,
          } as FetchResponse<T>;
        } catch (validationError) {
          logger.error('Response validation failed (POST)', {
            url,
            error:
              validationError instanceof Error
                ? validationError.message
                : String(validationError),
          });
          throw new TMDBApiError(
            'Invalid response format from TMDB API',
            502,
            validationError,
          );
        }
      }

      // No schema provided — return unknown payload
      return {
        data: responseData as unknown,
        status: response.status,
        statusText: response.statusText,
      };
    } catch (error: unknown) {
      if (error instanceof TMDBApiError) {
        throw error;
      }

      logger.error('POST request error', {
        url,
        error: error instanceof Error ? error.message : String(error),
      });
      throw new TMDBApiError('Request failed', undefined, error as unknown);
    }
  }
}

export function createTMDBClient(baseURL: string): HttpClient {
  return new HttpClient(baseURL, {
    Accept: 'application/json',
  });
}
