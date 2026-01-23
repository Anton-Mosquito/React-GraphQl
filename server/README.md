# Movie Database GraphQL Server

TypeScript-based GraphQL server for The Movie Database (TMDB) API with Apollo Server 5.

## 🚀 Features

- **Apollo Server 5** with Express integration
- **TypeScript** with strict type checking
- **GraphQL API** with schema-first approach
- **TMDB Integration** for movie data
- **Input validation** for all queries
- **Security headers** and CORS protection
- **Structured logging** with context
- **Error handling** with custom error types
- **Health check** endpoint for monitoring
- **Native Fetch API** (no external HTTP dependencies)
- **Zero external HTTP dependencies** (uses Node.js built-in fetch)

## 📋 Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher
- TMDB API key (get one at https://www.themoviedb.org/settings/api)

Note: Node.js 18+ is required for native Fetch API support.

## 🔧 Installation

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Add your TMDB API key to .env
# TMDB_API_KEY=your_actual_api_key_here
```

## 🏃 Running the Server

### Development mode (with hot reload)

```bash
npm run dev
```

### Production mode

```bash
# Build TypeScript to JavaScript
npm run build

# Start production server
npm start
```

### Type checking only

```bash
npm run type-check
```

## 🌐 Endpoints

- **GraphQL Playground**: http://localhost:4000/graphql
- **Health Check**: http://localhost:4000/health
- **REST Test**: http://localhost:4000/rest

## 📝 GraphQL Schema

### Queries

#### `movies`

Get movies with filtering and pagination

```graphql
query {
  movies(
    filter: {
      page: 1
      sortBy: "popularity"
      sortDirection: desc
      year: 2024
      genre: 28 # Action
    }
  ) {
    page
    totalResults
    totalPages
    results {
      id
      title
      releaseDate(format: "yyyy-MM-dd")
      posterPath
      voteAverage
    }
  }
}
```

**Filter options:**

- `page` (Int): Page number (1-500)
- `sortBy` (String): Sort field (popularity, release_date, vote_average, etc.)
- `sortDirection` (SORT_DIRECTION): asc or desc
- `year` (Int): Release year (1900-current+5)
- `primaryReleaseYear` (Int): Primary release year
- `genre` (Int): Genre ID
- `includeAdult` (Boolean): Include adult content

#### `moviesByIds`

Get multiple movies by their IDs

```graphql
query {
  moviesByIds(ids: [550, 551, 552]) {
    id
    title
    overview
    genres {
      id
      name
    }
  }
}
```

**Validation:**

- Maximum 50 IDs per request
- All IDs must be positive integers

#### `genres`

Get list of all movie genres

```graphql
query {
  genres {
    id
    name
  }
}
```

### Types

#### Movie

```graphql
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
```

#### Movies (Paginated Response)

```graphql
type Movies {
  page: Int!
  totalResults: Int!
  totalPages: Int!
  results: [Movie!]!
}
```

#### Genre

```graphql
type Genre {
  id: Int!
  name: String
}
```

## 🔐 Environment Variables

```env
NODE_ENV=development|production
PORT=4000
TMDB_API_KEY=your_tmdb_api_key
TMDB_API_BASE_URL=https://api.themoviedb.org/3/
TMDB_IMAGE_BASE_PATH=https://image.tmdb.org/t/p/w300

# Production only
ALLOWED_ORIGINS=https://yourdomain.com
```

## 🏗️ Project Structure

server/
├── src/
│ ├── config/ # Configuration and env variables
│ ├── middleware/ # Express middleware
│ ├── modules/ # Business logic modules
│ │ ├── movies/ # Movie-related logic
│ │ │ └── entities/ # Domain models
│ │ └── genres/ # Genre-related logic
│ ├── resolvers/ # GraphQL resolvers
│ ├── types/ # TypeScript type definitions
│ ├── utils/ # Utilities (logger, errors, validation)
│ ├── schema.graphql # GraphQL schema definition
│ └── index.ts # Application entry point
├── dist/ # Compiled JavaScript (generated)
├── .env # Environment variables (not in git)
├── .env.example # Environment template
├── tsconfig.json # TypeScript configuration
└── package.json # Dependencies and scripts

## 🧪 Testing Examples

### Valid request

```bash
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -H "locale: en-US" \
  -d '{"query":"{ genres { id name } }"}'
```

### Invalid request (triggers validation)

```bash
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ movies(filter: { page: -1 }) { page } }"}'
```

Expected error:

```json
{
  "errors": [
    {
      "message": "Page must be a positive integer",
      "extensions": {
        "code": "BAD_USER_INPUT",
        "field": "page"
      }
    }
  ]
}
```

## 🔒 Security Features

- **Input validation** on all queries
- **Security headers** (X-Content-Type-Options, X-Frame-Options, X-XSS-Protection)
- **CORS protection** with configurable origins
- **Request size limits** (10MB JSON body limit)
- **Error sanitization** in production (no stack traces)
- **Removed X-Powered-By** header

## 📊 Monitoring

### Health Check

```bash
curl http://localhost:4000/health
```

Response:

```json
{
  "status": "ok",
  "timestamp": "2024-01-22T10:30:00.000Z",
  "environment": "development",
  "version": "1.0.0"
}
```

## 🚀 Deployment

### Docker (recommended)

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 4000

CMD ["npm", "start"]
```

Build and run:

```bash
docker build -t movie-graphql-server .
docker run -p 4000:4000 --env-file .env movie-graphql-server
```

### Manual Deployment

1. Build the application:

```bash
   npm run build
```

2. Set production environment variables

3. Start the server:

```bash
   NODE_ENV=production npm start
```

## 🐛 Troubleshooting

### Server won't start

- Check `.env` file exists and has valid `TMDB_API_KEY`
- Ensure port 4000 is not in use
- Run `npm run type-check` for TypeScript errors

### GraphQL errors

- Check browser console for detailed error messages
- Verify request payload format
- Check logs for validation errors

### TMDB API errors

- Verify API key is valid
- Check TMDB API status (https://status.themoviedb.org/)
- Review rate limits (TMDB has 40 requests per 10 seconds limit)

## 📚 Additional Resources

- [Apollo Server Docs](https://www.apollographql.com/docs/apollo-server/)
- [TMDB API Docs](https://developers.themoviedb.org/3)
- [GraphQL Docs](https://graphql.org/learn/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 📄 License

ISC

## 👥 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
