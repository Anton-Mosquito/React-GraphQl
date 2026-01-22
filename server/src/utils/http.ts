import { logger } from "./logger.js";
import { TMDBApiError } from "./errors.js";

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
  if (!params) return "";

  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });

  const query = searchParams.toString();
  return query ? `?${query}` : "";
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
    this.baseURL = baseURL.endsWith("/") ? baseURL.slice(0, -1) : baseURL;
    this.defaultHeaders = {
      "Content-Type": "application/json",
      ...defaultHeaders,
    };
  }

  async get<T>(
    endpoint: string,
    options: FetchOptions = {},
  ): Promise<FetchResponse<T>> {
    const { params, timeout, headers, ...fetchOptions } = options;
    const url = `${this.baseURL}${endpoint}${buildSearchParams(params)}`;

    logger.debug("HTTP GET request", { url, params });

    try {
      const response = await fetchWithTimeout(
        url,
        {
          method: "GET",
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
        logger.error("HTTP request failed", {
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

      const data = await response.json();

      return {
        data: data as T,
        status: response.status,
        statusText: response.statusText,
      };
    } catch (error) {
      if (error instanceof TMDBApiError) {
        throw error;
      }

      if (error instanceof Error && error.name === "AbortError") {
        logger.error("HTTP request timeout", { url, timeout });
        throw new TMDBApiError("Request timeout", 408, error);
      }

      if (error instanceof TypeError) {
        logger.error("Network error", { url, error: error.message });
        throw new TMDBApiError("Network error", undefined, error);
      }

      logger.error("Unexpected HTTP error", { url, error });
      throw new TMDBApiError("Unexpected error occurred", undefined, error);
    }
  }

  async post<T, D = unknown>(
    endpoint: string,
    data?: D,
    options: FetchOptions = {},
  ): Promise<FetchResponse<T>> {
    const { params, timeout, headers, ...fetchOptions } = options;
    const url = `${this.baseURL}${endpoint}${buildSearchParams(params)}`;

    logger.debug("HTTP POST request", { url, data });

    try {
      const response = await fetchWithTimeout(
        url,
        {
          method: "POST",
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
        logger.error("HTTP POST request failed", {
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

      return {
        data: responseData as T,
        status: response.status,
        statusText: response.statusText,
      };
    } catch (error) {
      if (error instanceof TMDBApiError) {
        throw error;
      }

      logger.error("POST request error", { url, error });
      throw new TMDBApiError("Request failed", undefined, error);
    }
  }
}

export function createTMDBClient(baseURL: string): HttpClient {
  return new HttpClient(baseURL, {
    Accept: "application/json",
  });
}
