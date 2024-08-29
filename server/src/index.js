import fs from "fs";
import path from "path";
import express from "express";
import http from "http";
import { ApolloServer } from "@apollo/server";
import Query from "./resolvers/Query.js";
import { fileURLToPath } from "url";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";

// Helper function to get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const resolvers = {
  Query,
};

const typeDefs = fs.readFileSync(
  path.join(__dirname, "schema.graphql"),
  "utf8"
);

const context = ({ req, res }) => ({
  locale: req?.headers?.locale || "en-US",
});

async function startApolloServer(typeDefs, resolvers) {
  const app = express();
  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context,
    csrfPrevention: true,
    cache: "bounded",
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],
  });
  await server.start();
  server.applyMiddleware({ app });

  app.use(express.static(path.join(__dirname, "../../client", "build")));
  app.use(express.static("public"));

  // app.use(
  //   "/",
  //   cors(),
  //   express.json(),
  //   expressMiddleware(server, {
  //     context: async ({ req }) => ({ token: req.headers.token }),
  //   })
  // );

  app.get("/rest", function (req, res) {
    res.json({ data: "rest works" });
  });

  app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "../../client", "build", "index.html"));
  });

  await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
  console.log(`🚀 Server ready at http://localhost:${4000}${server.graphqlPath}`);
}

startApolloServer(typeDefs, resolvers);
