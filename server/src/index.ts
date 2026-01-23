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

  // attach express-ws for websocket routes
  const wsInstance = expressWs(app);
  const wsApp = wsInstance.app as unknown as express.Application;
  const wss = wsInstance.getWss();
  const wsController = new WebSocketController(wss);

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
        if (formattedError.extensions?.code === 'INTERNAL_SERVER_ERROR') {
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
        ? process.env.ALLOWED_ORIGINS?.split(',') || []
        : '*',
    credentials: true,
  };

  // Standard middleware
  app.use(cookieParser());
  app.use(cors<cors.CorsRequest>(corsOptions));
  app.use(express.json({ limit: '10mb' }));

  // REST routes
  app.use('/api', restRouter);

  // GraphQL endpoint with auth-aware context
  app.use(
    '/graphql',
    express.json({ limit: '10mb' }),
    expressMiddleware(server, {
      context: async ({ req, res }: ContextParams): Promise<GraphQLContext> => {
        const locale = (req.headers.locale as string) || 'en-US';
        const user = getUserFromAuthHeader(req.headers as Record<string, any>);

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
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: env.NODE_ENV,
    });
  });

  // Simple REST test endpoint
  app.get('/rest', (_req, res) => {
    res.json({ data: 'rest works' });
  });

  // Wire WebSocket route (express-ws)
  (wsApp as any).ws('/', (ws: WebSocket) => {
    wsController.handleConnection(ws as any);
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
