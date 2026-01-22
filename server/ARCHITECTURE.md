# Архітектура сервера — Movie GraphQL Server

Документ детально описує архітектуру сервера, встановлені пакети, змінні середовища й вміст кожного файлу в папці `server/` (версія станом на 22.01.2026).

**Коротко**
- Проєкт: TypeScript GraphQL server для доступу до TMDB API (The Movie Database).
- Технології: Node.js (ESM), TypeScript, Express 5, Apollo Server 5, Native Fetch, модульна архітектура.
- Розгортання: компілюється в `dist/` через `tsc`, є Dockerfile і .env приклади.

**Вимоги до середовища**
- Node.js >= 18.0.0
- npm >= 9.0.0
- Обов'язкові змінні оточення (див. розділ нижче)

---

**Пакети (exact list з package.json)**
- dependencies:
  - `@apollo/server` ^5.0.0 — Apollo Server 5 (GraphQL server core)
  - `@as-integrations/express5` ^1.1.2 — інтеграція Apollo Server з Express 5
  - `cors` ^2.8.5 — CORS middleware
  - `date-fns` ^3.6.0 — утиліти для роботи з датами
  - `dotenv` ^17.2.3 — завантаження `.env`
  - `express` ^5.2.1 — HTTP сервер
  - `graphql` ^16.9.0 — GraphQL core

- devDependencies:
  - `@graphql-tools/schema` ^10.0.0 — допоміжні інструменти для схем (dev-time)
  - `@types/cors` ^2.8.19, `@types/express` ^5.0.6, `@types/node` ^25.0.10 — TypeScript типи
  - `nodemon` ^3.1.11 — автоматичний рестарт в розробці
  - `ts-node` ^10.9.2 — запуск TS в dev
  - `typescript` ^5.9.3 — компілятор TypeScript

**Скрипти (package.json)**
- `compile`: `tsc` — компіляція TypeScript у `dist/`
- `start`: `npm run compile && node ./dist/index.js` — збірка й запуск
- `postbuild`: копіювання `schema.graphql` у `dist` після build
- `type-check`: `tsc --noEmit`

**TSConfig (ключові опції)**
- `target: ES2022`, `module: NodeNext`, `moduleResolution: NodeNext` — ESM/modern Node.
- `outDir: ./dist`, `rootDir: ./src`.
- `strict: true`, генерація `.d.ts` (`declaration: true`), source maps (`sourceMap: true`).

---

## Змінні середовища (обов'язкові)
- `TMDB_API_KEY` — ключ TMDB API.
- `TMDB_API_BASE_URL` — базова URL TMDB API (наприклад `https://api.themoviedb.org/3`).
- `TMDB_IMAGE_BASE_PATH` — базовий шлях до зображень (наприклад `https://image.tmdb.org/t/p/w500`).
- `PORT` — порт сервера (за замовчуванням 4000).
- `NODE_ENV` — `development` | `production`.

Файл `.env.example` містить приклади значень (копіювати/перейменувати в `.env`).

---

## Архітектура і потік запиту
1. `src/index.ts` — точка входу. Створює Express додаток, HTTP сервер і Apollo Server, підключає middleware, реєструє GraphQL endpoint `/graphql`, статичну видачу клієнта та health endpoint `/health`.
2. Запити до GraphQL обробляються сховищем типів (`schema.graphql`) і резолверами (`src/resolvers`).
3. Резолвери використовують модулі в `src/modules` для отримання даних з TMDB через `src/utils/http.ts` (HTTP client wrapper з таймаутом та обробкою помилок).
4. Модулі перетворюють сирі TMDB відповіді в доменні об'єкти (`modules/movies/entities/*`) і повертають їх резолверам.
5. Middleware обробляють заголовки безпеки, логування запитів та глобальну обробку помилок.

---

## Детальний опис файлів (server/)

- **[package.json](package.json)**: список залежностей, скрипти `compile`, `start`, `type-check`, engines з Node.js вимогами.
- **[tsconfig.json](tsconfig.json)**: TypeScript конфіг для збірки ES2022/NodeNext, `rootDir` -> `src`, `outDir` -> `dist`, строгі типи та мапи декларацій.
- **[Dockerfile](Dockerfile)**: (контейнеризація) інструкції для упакування сервера в Docker image (стандартні кроки: copy, npm ci, build, run). (Файл у репозиторії: використовується для production-збірки.)
  
  Повний вміст `Dockerfile`:

  ```dockerfile
  FROM node:18-alpine AS builder

  WORKDIR /app

  COPY package*.json ./
  RUN npm ci

  COPY . .
  RUN npm run build

  FROM node:18-alpine

  WORKDIR /app

  COPY package*.json ./
  RUN npm ci --only=production

  COPY --from=builder /app/dist ./dist
  COPY --from=builder /app/src/schema.graphql ./dist/schema.graphql

  EXPOSE 4000

  ENV NODE_ENV=production

  CMD ["node", "dist/index.js"]

  ```
- **.env, .env.example**: приклади й реальні значення конфігурації; `.env.example` — шаблон.
- **.gitignore, .dockerignore**: стандартні ігноровані файли/папки (`node_modules`, `dist`, `.env`, тощо).
- **CHECKLIST.md**: проектний чеклист (локальні правила/інструкції по запуску/сборці — містить інструкції для розробника).
- **README.md**: проєктний README (опис, швидкий старт). 

---

### src/

- **[src/index.ts](src/index.ts)**
  - Точка входу. Основні дії:
    - Завантажує `schema.graphql` у `typeDefs`.
    - Імпортує `resolvers` із `src/resolvers/index.ts`.
    - Створює `ApolloServer` з плагінами: `ApolloServerPluginDrainHttpServer`, `ApolloServerPluginLandingPageLocalDefault`.
    - Налаштовує middleware: `securityHeaders`, `requestLogger` (тільки в development), `cors`, `express.json`.
    - Підключає `expressMiddleware(server, { context })` на маршруті `/graphql`.
    - Статичне розміщення клієнта із `../../client/build`.
    - Health endpoint `/health` та простий REST `/rest`.
    - Останнім middleware — `errorHandler`.
    - Логування url'ів сервера після старту.

    Повний вміст `src/index.ts`:

    ```typescript
    import fs from "fs";
    import path from "path";
    import express from "express";
    import http from "http";
    import { ApolloServer } from "@apollo/server";
    import { expressMiddleware } from "@as-integrations/express5";
    import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
    import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
    import cors from "cors";
    import { fileURLToPath } from "url";
    import resolvers from "./resolvers/index.js";
    import { config } from "./config/index.js";
    import { logger } from "./utils/index.js";
    import { GraphQLContext } from "./types/index.js";
    import {
      errorHandler,
      securityHeaders,
      requestLogger,
    } from "./middleware/index.js";

    // ES modules compatibility
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    // Load GraphQL schema
    const typeDefs = fs.readFileSync(
      path.join(__dirname, "schema.graphql"),
      "utf8",
    );

    interface ContextParams {
      req: express.Request;
      res: express.Response;
    }

    async function startApolloServer() {
      const app = express();
      const httpServer = http.createServer(app);

      // Create Apollo Server instance
      const server = new ApolloServer<GraphQLContext>({
        typeDefs,
        resolvers: resolvers as any,
        plugins: [
          ApolloServerPluginDrainHttpServer({ httpServer }),
          ApolloServerPluginLandingPageLocalDefault({
            embed: true,
            includeCookies: true,
          }),
        ],
        formatError: (formattedError) => {
          // Log errors
          logger.error("GraphQL Error", {
            message: formattedError.message,
            path: formattedError.path,
            extensions: formattedError.extensions,
          });
          // Don't expose internal errors in production
          if (config.nodeEnv === "production") {
            if (formattedError.extensions?.code === "INTERNAL_SERVER_ERROR") {
              return {
                message: "An internal error occurred",
                extensions: {
                  code: "INTERNAL_SERVER_ERROR",
                },
              };
            }
          }

          return formattedError;
        },
      });

      // Start Apollo Server
      await server.start();

      // Apply security headers early
      app.use(securityHeaders);

      // Request logging in development
      if (config.nodeEnv === "development") {
        app.use(requestLogger);
      }

      // CORS configuration
      const corsOptions = {
        origin:
          config.nodeEnv === "production"
            ? process.env.ALLOWED_ORIGINS?.split(",") || []
            : "*",
        credentials: true,
      };

      // GraphQL endpoint
      app.use(
        "/graphql",
        cors<cors.CorsRequest>(corsOptions),
        express.json({ limit: "10mb" }),
        expressMiddleware(server, {
          context: async ({ req, res }: ContextParams): Promise<GraphQLContext> => {
            const locale = (req.headers.locale as string) || "en-US";

            return {
              locale,
              req,
              res,
            };
          },
        }),
      );

      // Static files for client
      app.use(express.static(path.join(__dirname, "../../client/build")));
      app.use(express.static("public"));

      // Health check endpoint
      app.get("/health", (_req, res) => {
        res.json({
          status: "ok",
          timestamp: new Date().toISOString(),
          environment: config.nodeEnv,
        });
      });

      // REST test endpoint (optional, can be removed)
      app.get("/rest", (_req, res) => {
        res.json({ data: "rest works" });
      });

      // Serve client for all other routes
      app.get(/.*/, (_req, res) => {
        res.sendFile(path.join(__dirname, "../../client/build/index.html"));
      });

      // Error handling middleware (must be last)
      app.use(errorHandler);

      // Start server
      await new Promise<void>((resolve) =>
        httpServer.listen({ port: config.port }, resolve),
      );

      logger.info(`🚀 Server ready at http://localhost:${config.port}/graphql`);
      logger.info(`📊 GraphQL Playground: http://localhost:${config.port}/graphql`);
      logger.info(`🏥 Health check: http://localhost:${config.port}/health`);
      logger.info(`🌍 Environment: ${config.nodeEnv}`);
    }

    // Start server and handle errors
    startApolloServer().catch((error) => {
      logger.error("Failed to start server", { error });
      process.exit(1);
    });
    ```

- **[src/schema.graphql](src/schema.graphql)**
  - GraphQL SDL: опис `Query` (movies, moviesByIds, genres), типи `Movies`, `Movie`, `Genre`, `MoviesFilterInput` та enum `SORT_DIRECTION`.

  Повний вміст `src/schema.graphql`:

  ```graphql
  type Query {
    movies(filter: MoviesFilterInput): Movies
    moviesByIds(ids: [Int]): [Movie]
    genres: [Genre]
  }

  input MoviesFilterInput {
    page: Int
    sortBy: String
    sortDirection: SORT_DIRECTION
    includeAdult: Boolean
    year: Int
    primaryReleaseYear: Int
    genre: Int
  }

  enum SORT_DIRECTION {
    desc
    asc
  }

  type Movies {
    page: Int!
    totalResults: Int!
    totalPages: Int!
    results: [Movie!]!
  }

  type Movie {
    id: ID!
    title: String!
    originalTitle: String
    releaseDate(format: String): String!
    posterPath: String
    genres: [Genre]
    adult: Boolean
    overview: String
    originalLanguage: String
    backdropPath: String
    popularity: Float
    voteCount: Int
    video: Boolean
    voteAverage: Float
  }

  type Genre {
    id: Int!
    name: String
  }

  ```

- **[src/config/index.ts](src/config/index.ts)**
  - Завантажує `.env` через `dotenv`.
  - Функція `validateConfig()` перевіряє наявність `TMDB_API_KEY`, `TMDB_API_BASE_URL`, `TMDB_IMAGE_BASE_PATH` і викидає помилку, якщо відсутні.
  - Експортує `config` об'єкт із `port`, `nodeEnv`, `tmdb` (apiKey, apiBaseUrl, imageBasePath).
  - Також експортує старі імена `API_KEY`, `IMAGE_BASE_PATH`, `API_BASE_URL` для сумісності.

  Код `src/config/index.ts` (повний вміст):

  ```typescript
  import dotenv from 'dotenv';
  import path from 'path';
  import { fileURLToPath } from 'url';

  // ES modules compatibility
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  // Load environment variables
  dotenv.config({ path: path.resolve(__dirname, '../../.env') });

  interface Config {
    port: number;
    nodeEnv: string;
    tmdb: {
      apiKey: string;
      apiBaseUrl: string;
      imageBasePath: string;
    };
  }

  function validateConfig(): Config {
    const requiredEnvVars = [
      'TMDB_API_KEY',
      'TMDB_API_BASE_URL',
      'TMDB_IMAGE_BASE_PATH',
    ];

    const missing = requiredEnvVars.filter((key) => !process.env[key]);

    if (missing.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missing.join(', ')}`
      );
    }

    return {
      port: parseInt(process.env.PORT || '4000', 10),
      nodeEnv: process.env.NODE_ENV || 'development',
      tmdb: {
        apiKey: process.env.TMDB_API_KEY!,
        apiBaseUrl: process.env.TMDB_API_BASE_URL!,
        imageBasePath: process.env.TMDB_IMAGE_BASE_PATH!,
      },
    };
  }

  export const config = validateConfig();

  // Legacy exports for backward compatibility
  export const API_KEY = config.tmdb.apiKey;
  export const IMAGE_BASE_PATH = config.tmdb.imageBasePath;
  export const API_BASE_URL = config.tmdb.apiBaseUrl;
  ```

- **Middleware** (src/middleware)
  - **[src/middleware/index.ts](src/middleware/index.ts)** — реберний файл, що ре-експортує middleware модулі.
  - **[src/middleware/security.ts](src/middleware/security.ts)**
    - `securityHeaders(req, res, next)` — видаляє заголовок `X-Powered-By`, встановлює `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `X-XSS-Protection: 1; mode=block`.
    - `requestLogger(req, res, next)` — простий логер, що обчислює тривалість запиту й логирует через `console` при завершенні відповіді (в development використовується у `src/index.ts`).
  - **[src/middleware/errorHandler.ts](src/middleware/errorHandler.ts)**
    - `errorHandler(err, req, res, next)` — логування помилок через `logger.error` і повернення 500 з обмеженою інформацією в production.
    - `notFoundHandler(req, res)` — повертає 404 JSON.

    Повний вміст `src/middleware/index.ts`:

    ```typescript
    export * from './errorHandler.js';
    export * from './security.js';
    ```

    Повний вміст `src/middleware/security.ts`:

    ```typescript
    import { Request, Response, NextFunction } from 'express';

    export function securityHeaders(
      _req: Request,
      res: Response,
      next: NextFunction
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
      next: NextFunction
    ): void {
      const start = Date.now();
      
      _res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`${req.method} ${req.path} - ${_res.statusCode} - ${duration}ms`);
      });

      next();
    }
    ```

    Повний вміст `src/middleware/errorHandler.ts`:

    ```typescript
    import { Request, Response, NextFunction } from 'express';
    import { logger } from '../utils/index.js';

    export function errorHandler(
      err: Error,
      _req: Request,
      res: Response,
      _next: NextFunction
    ): void {
      logger.error('Express error handler', {
        error: err.message,
        stack: err.stack,
      });

      res.status(500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined,
      });
    }

    export function notFoundHandler(_req: Request, res: Response): void {
      res.status(404).json({
        error: 'Not Found',
        message: 'The requested resource was not found',
      });
    }
    ```

- **Utils** (src/utils)
  - **[src/utils/index.ts](src/utils/index.ts)** — ре-експорт утиліт: `errors`, `logger`, `validation`, `http`.
  - **[src/utils/logger.ts](src/utils/logger.ts)**
    - Клас `Logger` з методами `info`, `warn`, `error`, `debug`.
    - `debug` логування робиться лише в `development`.
    - Експортується `logger` — інстанс.
  - **[src/utils/errors.ts](src/utils/errors.ts)**
    - Утворює кастомні Error класи (наприклад `TMDBApiError`) з метаданими (status, originalError). Використовується для відокремлення помилок HTTP/TMDB від внутрішніх помилок.
  - **[src/utils/http.ts](src/utils/http.ts)**
    - `HttpClient` — невеликий wrapper над `fetch` з таймаутом (AbortController), `buildSearchParams`, `get`/`post` методами, логуванням через `logger` та киданням `TMDBApiError` при помилках.
    - `createTMDBClient(baseURL)` — фабрика для створення `HttpClient` з коректним Accept header.
  - **[src/utils/validation.ts](src/utils/validation.ts)**
    - Функції для валідації вхідних параметрів (наприклад `validateMovieFilter`, `validateMovieIds`) — застосовуються у резолверах для перевірки аргументів.

    Повні вмісти файлів в `src/utils`:

    - `src/utils/index.ts`:

    ```typescript
    export * from './errors.js';
    export * from './logger.js';
    export * from './validation.js';
    export * from './http.js';
    ```

    - `src/utils/errors.ts`:

    ```typescript
    export class TMDBApiError extends Error {
      constructor(
        message: string,
        public statusCode?: number,
        public originalError?: unknown
      ) {
        super(message);
        this.name = 'TMDBApiError';
        Object.setPrototypeOf(this, TMDBApiError.prototype);
      }
    }

    export class ConfigurationError extends Error {
      constructor(message: string) {
        super(message);
        this.name = 'ConfigurationError';
        Object.setPrototypeOf(this, ConfigurationError.prototype);
      }
    }
    ```

    - `src/utils/logger.ts`:

    ```typescript
    type LogLevel = "info" | "warn" | "error" | "debug";

    class Logger {
      private log(level: LogLevel, message: string, meta?: unknown): void {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;

        if (meta) {
          console[level](logMessage, meta);
        } else {
          console[level](logMessage);
        }
      }

      info(message: string, meta?: unknown): void {
        this.log("info", message, meta);
      }

      warn(message: string, meta?: unknown): void {
        this.log("warn", message, meta);
      }

      error(message: string, meta?: unknown): void {
        this.log("error", message, meta);
      }

      debug(message: string, meta?: unknown): void {
        if (process.env.NODE_ENV === "development") {
          this.log("debug", message, meta);
        }
      }
    }

    export const logger = new Logger();
    ```

    - `src/utils/http.ts`:

    ```typescript
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
    ```

    - `src/utils/validation.ts`:

    ```typescript
    import { GraphQLError } from 'graphql';
    import { MovieFilterInput } from '../types/index.js';

    export class ValidationError extends GraphQLError {
      constructor(message: string, field?: string) {
        super(message, {
          extensions: {
            code: 'BAD_USER_INPUT',
            field,
          },
        });
      }
    }

    export function validateMovieFilter(filter?: MovieFilterInput): void {
      if (!filter) return;

      const { page, year, primaryReleaseYear, sortBy, sortDirection } = filter as any;

      // Validate page
      if (page !== undefined) {
        if (!Number.isInteger(page) || page < 1) {
          throw new ValidationError('Page must be a positive integer', 'page');
        }
        if (page > 500) {
          throw new ValidationError('Page cannot exceed 500', 'page');
        }
      }

      // Validate year
      if (year !== undefined) {
        const currentYear = new Date().getFullYear();
        if (!Number.isInteger(year) || year < 1900 || year > currentYear + 5) {
          throw new ValidationError(
            `Year must be between 1900 and ${currentYear + 5}`,
            'year'
          );
        }
      }

      // Validate primaryReleaseYear
      if (primaryReleaseYear !== undefined) {
        const currentYear = new Date().getFullYear();
        if (
          !Number.isInteger(primaryReleaseYear) ||
          primaryReleaseYear < 1900 ||
          primaryReleaseYear > currentYear + 5
        ) {
          throw new ValidationError(
            `Primary release year must be between 1900 and ${currentYear + 5}`,
            'primaryReleaseYear'
          );
        }
      }

      // Validate sortBy
      const validSortBy = [
        'popularity',
        'release_date',
        'revenue',
        'primary_release_date',
        'original_title',
        'vote_average',
        'vote_count',
      ];
      if (sortBy && !validSortBy.includes(sortBy)) {
        throw new ValidationError(
          `sortBy must be one of: ${validSortBy.join(', ')}`,
          'sortBy'
        );
      }

      // Validate sortDirection
      if (sortDirection && !['asc', 'desc'].includes(sortDirection)) {
        throw new ValidationError(
          'sortDirection must be either "asc" or "desc"',
          'sortDirection'
        );
      }
    }

    export function validateMovieIds(ids: number[]): void {
      if (!Array.isArray(ids)) {
        throw new ValidationError('ids must be an array', 'ids');
      }

      if (ids.length === 0) {
        throw new ValidationError('ids array cannot be empty', 'ids');
      }

      if (ids.length > 50) {
        throw new ValidationError('Cannot request more than 50 movies at once', 'ids');
      }

      for (const id of ids) {
        if (!Number.isInteger(id) || id < 1) {
          throw new ValidationError(
            `All movie IDs must be positive integers, got: ${id}`,
            'ids'
          );
        }
      }
    }
    ```

- **Modules (domain logic)** — `src/modules/*`
  - **[src/modules/genres/index.ts](src/modules/genres/index.ts)**
    - `getList(language)` — виконує HTTP запит до `/genre/movie/list` і повертає масив доменних об'єктів `Genre`.
    - Обробляє помилки, логування, маппінг у `Genre` entity.

    Повний вміст `src/modules/genres/index.ts`:

    ```typescript
    import { Genre } from '../movies/entities/index.js';
    import { config } from '../../config/index.js';
    import { logger } from '../../utils/index.js';
    import { TMDBApiError } from '../../utils/index.js';
    import { createTMDBClient } from '../../utils/index.js';
    import { TMDBGenresResponse } from '../../types/index.js';

    /**
     * Get list of movie genres from TMDB
     * @param language - Language code (e.g., 'en-US', 'uk-UA')
     * @returns Array of Genre objects
     */
    export async function getList(language: string = 'en-US'): Promise<Genre[]> {
      try {
        const tmdbClient = createTMDBClient(config.tmdb.apiBaseUrl);
        const response = await tmdbClient.get<TMDBGenresResponse>('/genre/movie/list', {
          params: {
            api_key: config.tmdb.apiKey,
            language,
          },
        });

        logger.debug('Fetched genres list', {
          language,
          count: response.data.genres.length,
        });

        return response.data.genres.map((genre) => new Genre(genre));
      } catch (error) {
        logger.error('Error fetching genres list', {
          language,
          error: error instanceof Error ? error.message : 'Unknown error',
        });

        if (error instanceof TMDBApiError) {
          throw error;
        }

        throw new TMDBApiError('Failed to fetch genres list', undefined, error);
      }
    }
    ```
  - **[src/modules/movies/index.ts](src/modules/movies/index.ts)**
    - `getPopular(page, language)` — `/movie/popular` → повертає `Movies` (домений агрегат з пагінацією).
    - `getDetails(id, language)` — `/movie/:id` → повертає `Movie` entity.
    - `discoverMovie(filter, language)` — `/discover/movie` з параметрами фільтру → повертає `Movies`.
    - Кожна функція використовує `createTMDBClient(config.tmdb.apiBaseUrl)` і кидання `TMDBApiError` при помилках.

    Повний вміст `src/modules/movies/index.ts`:

    ```typescript
    import { Movies } from './entities/index.js';
    import { Movie } from './entities/index.js';
    import { config } from '../../config/index.js';
    import { logger } from '../../utils/index.js';
    import { TMDBApiError } from '../../utils/index.js';
    import { createTMDBClient } from '../../utils/index.js';
    import {
      TMDBMoviesResponse,
      TMDBMovie,
      MovieFilterInput,
    } from '../../types/index.js';

    /**
     * Get popular movies from TMDB
     * @param page - Page number for pagination
     * @param language - Language code (e.g., 'en-US', 'uk-UA')
     * @returns Movies object with pagination data
     */
    export async function getPopular(
      page: number = 1,
      language: string = 'en-US'
    ): Promise<Movies> {
      try {
        const tmdbClient = createTMDBClient(config.tmdb.apiBaseUrl);
        const response = await tmdbClient.get<TMDBMoviesResponse>('/movie/popular', {
          params: {
            api_key: config.tmdb.apiKey,
            language,
            page,
          },
        });

        logger.debug('Fetched popular movies', {
          page,
          language,
          totalResults: response.data.total_results,
        });

        return new Movies(response.data);
      } catch (error) {
        logger.error('Error fetching popular movies', {
          page,
          language,
          error: error instanceof Error ? error.message : 'Unknown error',
        });

        if (error instanceof TMDBApiError) {
          throw error;
        }

        throw new TMDBApiError('Failed to fetch popular movies', undefined, error);
      }
    }

    /**
     * Get movie details by ID from TMDB
     * @param id - Movie ID
     * @param language - Language code (e.g., 'en-US', 'uk-UA')
     * @returns Movie details
     */
    export async function getDetails(
      id: number,
      language: string = 'en-US'
    ): Promise<Movie> {
      try {
        const tmdbClient = createTMDBClient(config.tmdb.apiBaseUrl);
        const response = await tmdbClient.get<TMDBMovie>(`/movie/${id}`, {
          params: {
            api_key: config.tmdb.apiKey,
            language,
          },
        });

        logger.debug('Fetched movie details', { id, language });

        return new Movie(response.data);
      } catch (error) {
        logger.error('Error fetching movie details', {
          id,
          language,
          error: error instanceof Error ? error.message : 'Unknown error',
        });

        if (error instanceof TMDBApiError) {
          throw error;
        }

        throw new TMDBApiError(
          `Failed to fetch movie details for ID ${id}`,
          undefined,
          error
        );
      }
    }

    /**
     * Discover movies with filters
     * @param filter - Filter options (page, sortBy, year, genre, etc.)
     * @param language - Language code (e.g., 'en-US', 'uk-UA')
     * @returns Movies object with pagination data
     */
    export async function discoverMovie(
      filter: MovieFilterInput = {},
      language: string = 'en-US'
    ): Promise<Movies> {
      try {
        const {
          page = 1,
          sortBy = 'popularity',
          sortDirection = 'desc',
          includeAdult = false,
          year,
          primaryReleaseYear,
          genre,
        } = filter;

        const tmdbClient = createTMDBClient(config.tmdb.apiBaseUrl);
        const response = await tmdbClient.get<TMDBMoviesResponse>('/discover/movie', {
          params: {
            api_key: config.tmdb.apiKey,
            language,
            page,
            sort_by: `${sortBy}.${sortDirection}`,
            include_adult: includeAdult,
            year,
            primary_release_year: primaryReleaseYear,
            with_genres: genre,
          },
        });

        logger.debug('Discovered movies', {
          filter,
          language,
          totalResults: response.data.total_results,
        });

        return new Movies(response.data);
      } catch (error) {
        logger.error('Error discovering movies', {
          filter,
          language,
          error: error instanceof Error ? error.message : 'Unknown error',
        });

        if (error instanceof TMDBApiError) {
          throw error;
        }

        throw new TMDBApiError('Failed to discover movies', undefined, error);
      }
    }
    ```

- **Entities (src/modules/movies/entities)**
  - **[Genre.ts](src/modules/movies/entities/Genre.ts)** — клас `Genre` з полями `id`, `name` і методом `toJSON()`.
  - **[Movie.ts](src/modules/movies/entities/Movie.ts)**
    - Клас `Movie` — інкапсулює TMDBMovie: мапить поля (id, title, originalTitle, posterPath (заповнюється через `config.tmdb.imageBasePath`), backdropPath, adult, overview, originalLanguage, popularity, voteCount, video, voteAverage, genres).
    - Зберігає сире `rawReleaseDate` і надає метод `releaseDate({ format })` який повертає форматовану дату через `date-fns` або сирий рядок, а також `toJSON()` для GraphQL-виводу.
  - **[Movies.ts](src/modules/movies/entities/Movies.ts)**
    - Агрегат `Movies` з `page`, `totalResults`, `totalPages`, `results: Movie[]` та `toJSON()`.

    Повні вмісти файлів в `src/modules/movies/entities`:

    - `src/modules/movies/entities/index.ts`:

    ```typescript
    export { Genre } from './Genre.js';
    export { Movie } from './Movie.js';
    export { Movies } from './Movies.js';
    ```

    - `src/modules/movies/entities/Genre.ts`:

    ```typescript
    import { TMDBGenre } from '../../../types/index.js';

    export class Genre {
      public readonly id: number;
      public readonly name: string;

      constructor(genre: TMDBGenre) {
        this.id = genre.id;
        this.name = genre.name;
      }

      toJSON(): { id: number; name: string } {
        return {
          id: this.id,
          name: this.name,
        };
      }
    }
    ```

    - `src/modules/movies/entities/Movie.ts`:

    ```typescript
    import { format, parseISO } from 'date-fns';
    import { TMDBMovie } from '../../../types/index.js';
    import { config } from '../../../config/index.js';
    import { logger } from '../../../utils/index.js';
    import { Genre } from './Genre.js';

    interface ReleaseDateParams {
      format?: string;
    }

    export class Movie {
      public readonly id: number;
      public readonly title: string;
      public readonly originalTitle: string;
      public readonly posterPath: string;
      public readonly adult: boolean;
      public readonly overview: string;
      public readonly originalLanguage: string;
      public readonly backdropPath: string;
      public readonly popularity: number;
      public readonly voteCount: number;
      public readonly video: boolean;
      public readonly voteAverage: number;
      public readonly genres?: Genre[];

      private readonly rawReleaseDate: string;

      constructor(movie: TMDBMovie) {
        this.id = movie.id;
        this.title = movie.title;
        this.originalTitle = movie.original_title;
        this.adult = movie.adult;
        this.overview = movie.overview;
        this.originalLanguage = movie.original_language;
        this.popularity = movie.popularity;
        this.voteCount = movie.vote_count;
        this.video = movie.video;
        this.voteAverage = movie.vote_average;
        this.rawReleaseDate = movie.release_date;

        this.posterPath = movie.poster_path
          ? `${config.tmdb.imageBasePath}${movie.poster_path}`
          : '';

        this.backdropPath = movie.backdrop_path
          ? `${config.tmdb.imageBasePath}${movie.backdrop_path}`
          : '';

        if (movie.genres && movie.genres.length > 0) {
          this.genres = movie.genres.map((g) => new Genre(g));
        }
      }

      releaseDate(params?: ReleaseDateParams): string {
        if (!this.rawReleaseDate) {
          return '';
        }

        try {
          if (params?.format) {
            const date = parseISO(this.rawReleaseDate);
            return format(date, params.format);
          }
          return this.rawReleaseDate;
        } catch (error) {
          logger.error('Error formatting release date', {
            movieId: this.id,
            rawDate: this.rawReleaseDate,
            error,
          });
          return this.rawReleaseDate;
        }
      }

      toJSON() {
        return {
          id: this.id,
          title: this.title,
          originalTitle: this.originalTitle,
          releaseDate: this.rawReleaseDate,
          posterPath: this.posterPath,
          adult: this.adult,
          overview: this.overview,
          originalLanguage: this.originalLanguage,
          backdropPath: this.backdropPath,
          popularity: this.popularity,
          voteCount: this.voteCount,
          video: this.video,
          voteAverage: this.voteAverage,
          genres: this.genres?.map((g) => g.toJSON()),
        };
      }
    }
    ```

    - `src/modules/movies/entities/Movies.ts`:

    ```typescript
    import { TMDBMoviesResponse } from '../../../types/index.js';
    import { Movie } from './Movie.js';

    export class Movies {
      public readonly page: number;
      public readonly totalResults: number;
      public readonly totalPages: number;
      public readonly results: Movie[];

      constructor(moviesResponse: TMDBMoviesResponse) {
        this.page = moviesResponse.page;
        this.totalResults = moviesResponse.total_results;
        this.totalPages = moviesResponse.total_pages;
        this.results = moviesResponse.results.map((movie) => new Movie(movie));
      }

      toJSON() {
        return {
          page: this.page,
          totalResults: this.totalResults,
          totalPages: this.totalPages,
          results: this.results.map((movie) => movie.toJSON()),
        };
      }
    }
    ```

- **Resolvers** (src/resolvers)
  - **[src/resolvers/index.ts](src/resolvers/index.ts)** — збирає і експортує об'єкт `resolvers: Resolvers`.
  - **[src/resolvers/Query.ts](src/resolvers/Query.ts)**
    - `movies`, `moviesByIds`, `genres` резолвери, які викликають відповідні методи з `modules/movies` і `modules/genres`.
    - Виконується валідація вхідних аргументів (`validateMovieFilter`, `validateMovieIds`) та логування (`logger.debug`, `logger.error`).
  - **[src/resolvers/Movie.ts](src/resolvers/Movie.ts)**
    - Поле резолвер `releaseDate(parent, args)` — делегує на `parent.releaseDate(args)` (тобто використовує метод класу `Movie`).

    Повні вмісти файлів в `src/resolvers`:

    - `src/resolvers/index.ts`:

    ```typescript
    import { Resolvers } from '../types/index.js';
    import Query from './Query.js';
    import Movie from './Movie.js';

    const resolvers: Resolvers = {
      Query,
      Movie,
    };

    export default resolvers;
    ```

    - `src/resolvers/Query.ts`:

    ```typescript
    import {
      getDetails,
      discoverMovie,
    } from '../modules/movies/index.js';
    import { getList } from '../modules/genres/index.js';
    import { QueryResolvers } from '../types/index.js';
    import { logger } from '../utils/index.js';
    import { validateMovieFilter, validateMovieIds } from '../utils/index.js';

    const queryResolvers: QueryResolvers = {
      async movies(_parent, args, context) {
        try {
          // Validate input
          validateMovieFilter(args.filter);

          logger.debug('Query: movies', { filter: args.filter, locale: context.locale });
          const data = await discoverMovie(args.filter, context.locale);
          return data;
        } catch (error) {
          logger.error('Error in movies resolver', { error, filter: args.filter });
          throw error;
        }
      },

      async moviesByIds(_parent, { ids }, context) {
        try {
          // Validate input
          validateMovieIds(ids);

          logger.debug('Query: moviesByIds', { ids, locale: context.locale });
          const requests = ids.map((id) => getDetails(id, context.locale));
          const movies = await Promise.all(requests);
          return movies;
        } catch (error) {
          logger.error('Error in moviesByIds resolver', { error, ids });
          throw error;
        }
      },

      async genres(_parent, _args, context) {
        try {
          logger.debug('Query: genres', { locale: context.locale });
          return await getList(context.locale);
        } catch (error) {
          logger.error('Error in genres resolver', { error });
          throw error;
        }
      },
    };

    export default queryResolvers;
    ```

    - `src/resolvers/Movie.ts`:

    ```typescript
    import { MovieFieldResolvers } from '../types/index.js';

    const movieResolvers: MovieFieldResolvers = {
      releaseDate(parent, args) {
        return parent.releaseDate(args);
      },
    };

    export default movieResolvers;
    ```

- **Types** (src/types)
  - **[src/types/tmdb.types.ts](src/types/tmdb.types.ts)** — TypeScript інтерфейси для TMDB відповіді: `TMDBGenre`, `TMDBMovie`, `TMDBMoviesResponse`, `TMDBGenresResponse`, `MovieFilterInput`.
  - **[src/types/graphql.types.ts](src/types/graphql.types.ts)** — визначає `GraphQLContext` (locale, req, res) і аргументи для запитів (MoviesFilterArgs, MoviesByIdsArgs).
  - **[src/types/resolvers.types.ts](src/types/resolvers.types.ts)** — типи резолверів: `QueryResolvers`, `MovieFieldResolvers`, а також експортує `MovieParent`, `MoviesParent`.
  - **[src/types/index.ts](src/types/index.ts)** — ре-експортує `tmdb.types`, `graphql.types`, `resolvers.types`.

    Повні вмісти файлів в `src/types`:

    - `src/types/index.ts`:

    ```typescript
    export * from './tmdb.types.js';
    export * from './graphql.types.js';
    export * from './resolvers.types.js';
    ```

    - `src/types/tmdb.types.ts`:

    ```typescript
    export interface TMDBGenre {
      id: number;
      name: string;
    }

    export interface TMDBMovie {
      id: number;
      title: string;
      original_title: string;
      release_date: string;
      poster_path: string | null;
      backdrop_path: string | null;
      adult: boolean;
      overview: string;
      original_language: string;
      popularity: number;
      vote_count: number;
      video: boolean;
      vote_average: number;
      genre_ids?: number[];
      genres?: TMDBGenre[];
    }

    export interface TMDBMoviesResponse {
      page: number;
      total_results: number;
      total_pages: number;
      results: TMDBMovie[];
    }

    export interface TMDBGenresResponse {
      genres: TMDBGenre[];
    }

    export interface MovieFilterInput {
      page?: number;
      sortBy?: string;
      sortDirection?: 'desc' | 'asc';
      includeAdult?: boolean;
      year?: number;
      primaryReleaseYear?: number;
      genre?: number;
    }
    ```

    - `src/types/graphql.types.ts`:

    ```typescript
    import { Request, Response } from 'express';

    export interface GraphQLContext {
      locale: string;
      req: Request;
      res: Response;
    }

    export interface MoviesFilterArgs {
      filter?: {
        page?: number;
        sortBy?: string;
        sortDirection?: 'desc' | 'asc';
        includeAdult?: boolean;
        year?: number;
        primaryReleaseYear?: number;
        genre?: number;
      };
    }

    export interface MoviesByIdsArgs {
      ids: number[];
    }
    ```

    - `src/types/resolvers.types.ts`:

    ```typescript
    import { GraphQLContext } from './graphql.types.js';
    import { Movie, Movies } from '../modules/movies/entities/index.js';

    export type Maybe<T> = T | null | undefined;

    export interface MovieParent extends Movie {}

    export interface MoviesParent extends Movies {}

    export interface QueryResolvers {
      movies: (
        parent: unknown,
        args: { filter?: any },
        context: GraphQLContext,
      ) => Promise<Movies>;
      moviesByIds: (
        parent: unknown,
        args: { ids: number[] },
        context: GraphQLContext,
      ) => Promise<Movie[]>;
      genres: (
        parent: unknown,
        args: unknown,
        context: GraphQLContext,
      ) => Promise<any[]>;
    }

    export interface MovieFieldResolvers {
      releaseDate: (parent: MovieParent, args: { format?: string }) => string;
    }
    ```

---

## Потенційні точки уваги / рекомендації
- Помилки: `TMDBApiError` централізовано обробляється в `utils/errors.ts` і переброшуються в резолвери; `src/index.ts` також має `formatError` для Apollo Server — перевірити, щоб внутрішні помилки не протікали в production.
- Безпека: `securityHeaders` встановлює базові заголовки — можна додати `Content-Security-Policy` та інші політики для більш суворої захищеності.
- Кешування: наразі немає кешу відповідей TMDB — для зменшення API викликів рекомендую додати кеш на рівні `HttpClient` або через Redis.
- Тестування: у репозиторії є `hooks/useMovies/index.spec.js` для frontend; для бекенду варто додати unit/integration тести для `modules/*` і `utils/http.ts`.