import fs from 'fs';
import path from 'path';
import express from 'express';
import http from 'http';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import cors from 'cors';
import { fileURLToPath } from 'url';
import resolvers from './resolvers/index.js';
import { config } from './config/index.js';
import { logger } from './utils/index.js';
import { GraphQLContext } from './types/index.js';

// ES modules compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load GraphQL schema
const typeDefs = fs.readFileSync(
  path.join(__dirname, 'schema.graphql'),
  'utf8'
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
        includeCookies: true 
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
      if (config.nodeEnv === 'production') {
        return {
          message: formattedError.message,
          extensions: {
            code: formattedError.extensions?.code,
          },
        };
      }

      return formattedError;
    },
  });

  // Start Apollo Server
  await server.start();

  // Middleware
  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req, res }: ContextParams): Promise<GraphQLContext> => {
        const locale = (req.headers.locale as string) || 'en-US';
        
        return {
          locale,
          req,
          res,
        };
      },
    })
  );

  // Static files for client
  app.use(express.static(path.join(__dirname, '../../client/build')));
  app.use(express.static('public'));

  // Health check endpoint
  app.get('/health', (_req, res) => {
    res.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      environment: config.nodeEnv,
    });
  });

  // REST test endpoint (optional, can be removed)
  app.get('/rest', (_req, res) => {
    res.json({ data: 'rest works' });
  });

  // Serve client for all other routes
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, '../../client/build/index.html'));
  });

  // Start server
  await new Promise<void>((resolve) => 
    httpServer.listen({ port: config.port }, resolve)
  );

  logger.info(`🚀 Server ready at http://localhost:${config.port}/graphql`);
  logger.info(`📊 GraphQL Playground: http://localhost:${config.port}/graphql`);
  logger.info(`🏥 Health check: http://localhost:${config.port}/health`);
  logger.info(`🌍 Environment: ${config.nodeEnv}`);
}

// Start server and handle errors
startApolloServer().catch((error) => {
  logger.error('Failed to start server', { error });
  process.exit(1);
});
