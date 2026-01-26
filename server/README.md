# Movie GraphQL Server

Modern GraphQL + REST API server built with TypeScript, Apollo Server, Express, and Prisma.

## 🚀 Features

- **GraphQL API** - Apollo Server with type-safe resolvers
- **REST API** - Express endpoints for authentication
- **Database** - PostgreSQL with Prisma ORM
- **Authentication** - JWT-based auth with refresh tokens
- **Email** - Account activation via Gmail OAuth2 or SMTP
- **WebSocket** - Real-time collaborative drawing
- **Type Safety** - Strict TypeScript with Zod runtime validation
- **Rate Limiting** - Protection against API abuse
- **TMDB Integration** - Movie data from The Movie Database API

## 📋 Prerequisites

- Node.js >= 18.0.0
- PostgreSQL database
- TMDB API key
- (Optional) Gmail OAuth2 credentials for email

## 🛠️ Installation
```bash
# Install dependencies
npm install

# Generate Prisma client
npm run prisma:generate

# Push database schema
npm run prisma:push
```

## ⚙️ Configuration

Create `.env` file in project root:
```bash
# Server
PORT=5001
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/moviedb

# URLs
CLIENT_URL=http://localhost:3000
API_URL=http://localhost:5001

# TMDB API
TMDB_API_KEY=your_tmdb_api_key
TMDB_API_BASE_URL=https://api.themoviedb.org/3
TMDB_IMAGE_BASE_PATH=https://image.tmdb.org/t/p/w500

# Email (Gmail OAuth2 - Recommended)
MAIL_USER=your-email@gmail.com
OAUTH_CLIENT_ID=your_oauth_client_id
OAUTH_CLIENT_SECRET=your_oauth_client_secret
OAUTH_REFRESH_TOKEN=your_oauth_refresh_token

# Email (Alternative: Generic SMTP)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password

# JWT (MUST be 32+ characters)
JWT_ACCESS_SECRET=your_32_char_minimum_access_secret_here
JWT_REFRESH_SECRET=your_32_char_minimum_refresh_secret_here
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=30d

# SMTP Service (required)
SMTP_SERVICE=gmail
GOOGLE_CLIENT=your_google_client
GOOGLE_CLIENT_ID=same_as_OAUTH_CLIENT_ID
GOOGLE_CLIENT_SECRET=same_as_OAUTH_CLIENT_SECRET
GOOGLE_REFRESH_TOKEN=same_as_OAUTH_REFRESH_TOKEN
```

## 🏃 Running
```bash
# Development mode with hot reload
npm run dev

# Production build
npm run build
npm start

# Database management
npm run prisma:studio    # Open Prisma Studio
npm run prisma:migrate   # Create migration
```

## 🧪 Code Quality
```bash
# Type checking
npm run type-check

# Linting
npm run lint
npm run lint:fix

# Formatting
npm run format
npm run format:check

# Run all checks
npm run validate
```

## 📡 API Endpoints

### GraphQL
- **Endpoint**: `http://localhost:5001/graphql`
- **Playground**: Available in development mode

### REST
- `POST /api/registration` - Register new user
- `POST /api/login` - Login user
- `POST /api/logout` - Logout user
- `GET /api/activate/:link` - Activate account
- `GET /api/refresh` - Refresh access token
- `GET /api/users` - Get all users (protected)

### System
- `GET /health` - Health check
- `GET /ws-stats` - WebSocket statistics

### WebSocket
- `ws://localhost:5001/` - Real-time drawing

## 🔒 Security Features

- **Rate Limiting**:
  - Auth endpoints: 5 req/15min
  - API endpoints: 100 req/15min
  - GraphQL: 200 req/15min
  - Activation: 10 req/hour

- **JWT Authentication**: Secure access & refresh tokens
- **Password Hashing**: bcrypt with cost factor 12
- **Input Validation**: Zod schemas for runtime validation
- **CORS**: Configurable origin whitelist
- **Security Headers**: X-Frame-Options, XSS Protection, etc.

## 📚 Documentation

- [WebSocket API](./docs/WEBSOCKET_API.md)
- [Mail Configuration](./docs/MAIL_CONFIGURATION.md)
- [Architecture](../ARCHITECTURE.md)

## 🏗️ Architecture
```
server/
├── src/
│   ├── config/          # Environment configuration
│   ├── lib/             # Database client
│   ├── middleware/      # Express middleware
│   ├── modules/         # Feature modules
│   │   ├── auth/        # Authentication
│   │   ├── users/       # User management
│   │   ├── movies/      # Movie services
│   │   ├── genres/      # Genre services
│   │   └── drawing/     # WebSocket drawing
│   ├── resolvers/       # GraphQL resolvers
│   ├── rest/            # REST routes
│   ├── types/           # TypeScript types & Zod schemas
│   ├── utils/           # Utilities
│   ├── schema.graphql   # GraphQL schema
│   └── index.ts         # Server entry point
├── prisma/
│   └── schema.prisma    # Database schema
└── docs/                # Documentation
```

## 🧩 Tech Stack

- **Runtime**: Node.js with ES Modules
- **Language**: TypeScript (strict mode)
- **Server**: Express + Apollo Server
- **Database**: PostgreSQL + Prisma
- **Validation**: Zod
- **Authentication**: JWT + bcrypt
- **Email**: Nodemailer
- **WebSocket**: ws + express-ws
- **External API**: TMDB (The Movie Database)

## 📝 Scripts Reference

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Run production server
- `npm run type-check` - Check TypeScript types
- `npm run lint` - Lint code
- `npm run format` - Format code
- `npm run validate` - Run all checks
- `npm run clean` - Clean build artifacts

## 🤝 Contributing

1. Follow TypeScript strict mode
2. Use Zod for runtime validation
3. Add JSDoc comments to public methods
4. Run `npm run validate` before committing
5. Follow existing code structure

## 📄 License

ISC
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
