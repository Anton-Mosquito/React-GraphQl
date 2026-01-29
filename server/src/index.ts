import { env } from '#config/env.js';
import {
  apiLimiter,
  errorHandler,
  graphqlLimiter,
  requestLogger,
  securityHeaders,
} from '#middleware/index.js';
import { MailService, websocketController } from '#modules/index.js';
import { ExtendedWebSocket, GraphQLContext } from '#types/index.js';
import { getUserFromAuthHeader, logger } from '#utils/index.js';
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { expressMiddleware } from '@as-integrations/express5';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import expressWs from 'express-ws';
import fs from 'fs';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { WebSocket } from 'ws';
import resolvers from './resolvers/index.js';
import restRouter from './rest/routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

  // Trust proxy for rate limiting (nginx)
  app.set('trust proxy', 1);

  const wsInstance = expressWs(app, httpServer);
  const wsApp = wsInstance.app as express.Application;
  const wss = wsInstance.getWss();
  const wsController = new websocketController(wss);

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
        ? env.ALLOWED_ORIGINS?.split(',') || []
        : '*',
    credentials: true,
  };

  // Standard middleware
  app.use(cookieParser());
  app.use(cors<cors.CorsRequest>(corsOptions));
  app.use(express.json({ limit: '10mb' }));

  // REST routes (rate-limited)
  app.use('/api', apiLimiter, restRouter);

  // GraphQL endpoint with auth-aware context
  app.use(
    '/graphql',
    express.json({ limit: '10mb' }),
    graphqlLimiter,
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
    const mailConfigured = MailService.isConfigured();

    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: env.NODE_ENV,
      services: {
        mail: mailConfigured ? 'configured' : 'not_configured',
      },
    });
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
