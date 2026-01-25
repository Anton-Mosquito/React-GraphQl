import fs from 'fs';
import path from 'path';
import express from 'express';
import http from 'http';
import expressWs from 'express-ws';
import cookieParser from 'cookie-parser';
import { WebSocket } from 'ws';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import cors from 'cors';
import { fileURLToPath } from 'url';
import resolvers from './resolvers/index.js';
import { env } from './config/env.js';
import { logger } from './utils/index.js';
import { GraphQLContext } from './types/index.js';
import {
  errorHandler,
  securityHeaders,
  requestLogger,
} from './middleware/index.js';
import restRouter from './rest/routes.js';
import getUserFromAuthHeader from './utils/auth.context.js';
import WebSocketController from './modules/drawing/websocket.controller.js';
import type { ExtendedWebSocket } from './modules/drawing/websocket.types.js';
import mailService from './modules/auth/mail.service.js';
import {
  apiLimiter,
  authLimiter,
  graphqlLimiter,
  activationLimiter,
} from './middleware/rate-limit.js';

// ES modules compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load GraphQL schema
const typeDefs = fs.readFileSync(
  path.join(__dirname, 'schema.graphql'),
  'utf8',
);

interface ContextParams {
  req: express.Request;
  res: express.Response;
}

async function startApolloServer() {
  const app = express();
  const httpServer = http.createServer(app);

  // attach express-ws for websocket routes (bind to the same http server)
  const wsInstance = expressWs(app, httpServer);
  const wsApp = wsInstance.app as express.Application;
  const wss = wsInstance.getWss();
  const wsController = new WebSocketController(wss);

  // WebSocket statistics endpoint (optional, for monitoring)
  app.get('/ws-stats', (_req, res) => {
    const stats = wsController.getStats();

    res.json({
      websocket: {
        totalConnections: stats.totalConnections,
        initializedConnections: stats.initializedConnections,
        rooms: Array.from(stats.rooms.entries()).map(([id, count]) => ({
          roomId: id,
          users: count,
        })),
      },
      timestamp: new Date().toISOString(),
    });
  });

  // Periodic ping to keep connections alive (every 30 seconds)
  setInterval(() => {
    wsController.pingAll();
  }, 30_000);

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
      logger.error('GraphQL Error', {
        message: formattedError.message,
        path: formattedError.path,
        extensions: formattedError.extensions,
      });
      // Don't expose internal errors in production
      if (env.NODE_ENV === 'production') {
        if (formattedError.extensions?.['code'] === 'INTERNAL_SERVER_ERROR') {
          return {
            message: 'An internal error occurred',
            extensions: {
              code: 'INTERNAL_SERVER_ERROR',
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
  if (env.NODE_ENV === 'development') {
    app.use(requestLogger);
  }

  // CORS configuration
  const corsOptions = {
    origin:
      env.NODE_ENV === 'production'
        ? process.env['ALLOWED_ORIGINS']?.split(',') || []
        : '*',
    credentials: true,
  };

  // Standard middleware
  app.use(cookieParser());
  app.use(cors<cors.CorsRequest>(corsOptions));
  app.use(express.json({ limit: '10mb' }));

  // Apply rate limiting (production only)
  if (env.NODE_ENV === 'production') {
    // Protect sensitive auth endpoints explicitly
    app.use('/api/registration', authLimiter);
    app.use('/api/login', authLimiter);
    app.use('/api/activate/:link', activationLimiter);

    // General API + GraphQL limits
    app.use('/api', apiLimiter);
    app.use('/graphql', graphqlLimiter);

    logger.info('Rate limiting enabled for production');
  } else {
    logger.info('Rate limiting disabled in development mode');
  }

  // REST routes
  app.use('/api', restRouter);

  // GraphQL endpoint with auth-aware context
  app.use(
    '/graphql',
    express.json({ limit: '10mb' }),
    expressMiddleware(server, {
      context: async ({ req, res }: ContextParams): Promise<GraphQLContext> => {
        const locale = (req.headers['locale'] as string | undefined) || 'en-US';
        const user = getUserFromAuthHeader(
          req.headers as Record<string, string | string[] | undefined>,
        );

        return {
          locale,
          req,
          res,
          user,
        };
      },
    }),
  );

  // Static files for client
  app.use(express.static(path.join(__dirname, '../../client/build')));
  app.use(express.static('public'));

  // Health check endpoint
  app.get('/health', (_req, res) => {
    const mailConfigured = mailService.isConfigured();

    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: env.NODE_ENV,
      services: {
        mail: mailConfigured ? 'configured' : 'not_configured',
      },
    });
  });

  // Simple REST test endpoint
  app.get('/rest', (_req, res) => {
    res.json({ data: 'rest works' });
  });

  // Wire WebSocket route (express-ws)
  wsApp.ws?.('/', (ws: WebSocket) => {
    wsController.handleConnection(ws as ExtendedWebSocket);
  });

  // Serve client for all other routes
  app.get(/.*/, (_req, res) => {
    res.sendFile(path.join(__dirname, '../../client/build/index.html'));
  });

  // Error handling middleware (must be last)
  app.use(errorHandler);

  // Start server
  await new Promise<void>((resolve) =>
    httpServer.listen({ port: env.PORT }, resolve),
  );

  logger.info(`🚀 Server ready at http://localhost:${env.PORT}/graphql`);
  logger.info(`📊 GraphQL Playground: http://localhost:${env.PORT}/graphql`);
  logger.info(`🏥 Health check: http://localhost:${env.PORT}/health`);
  logger.info(`🌍 Environment: ${env.NODE_ENV}`);
}

// Start server and handle errors
startApolloServer().catch((error) => {
  logger.error('Failed to start server', { error });
  process.exit(1);
});
