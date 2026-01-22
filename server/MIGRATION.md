# Migration from Apollo Server 4 to Apollo Server 5

## What was changed

### 1. Dependencies
- **Apollo Server**: 4.10.5 → 5.0.0
- **Express**: Updated to 4.22.1
- **Added TypeScript**: Full TypeScript migration with strict mode

### 2. Code Changes

#### Server Initialization
**Before (Apollo Server 4):**
```javascript
server.applyMiddleware({ app });
```

**After (Apollo Server 5):**
```typescript
app.use(
  '/graphql',
  expressMiddleware(server, {
    context: async ({ req, res }) => ({ locale, req, res })
  })
);
```

#### Context
**Before:**
```javascript
const context = ({ req, res }) => ({
  locale: req?.headers?.locale || "en-US",
});
```

**After:**
```typescript
interface GraphQLContext {
  locale: string;
  req: Request;
  res: Response;
}

context: async ({ req, res }): Promise<GraphQLContext> => ({
  locale: (req.headers.locale as string) || 'en-US',
  req,
  res,
})
```

#### Configuration
**Before:** Hardcoded in `src/config/index.js`
```javascript
const API_KEY = "5a07a3dde2cf6e5158ca70e799d3cc41";
```

**After:** Environment variables with validation
```typescript
export const config = validateConfig();
```

### 3. New Features Added

- ✅ Full TypeScript with strict mode
- ✅ Input validation for all queries
- ✅ Security headers middleware
- ✅ Structured logging
- ✅ Custom error types (TMDBApiError, ValidationError)
- ✅ Health check endpoint
- ✅ Graceful shutdown handling
- ✅ Production-ready CORS configuration
- ✅ Request logging in development
- ✅ Error sanitization in production

### 4. Breaking Changes

⚠️ **GraphQL endpoint changed**: `/` → `/graphql`

Update your client:
```typescript
// Before
const client = new ApolloClient({
  uri: 'http://localhost:4000',
});

// After
const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
});
```

### 5. File Structure Changes
Old Structure              New Structure
─────────────────          ─────────────────
src/
config/
index.js         →     index.ts (typed)
modules/
movies/
entities/
Genre.js     →     Genre.ts
Movie.js     →     Movie.ts
Movies.js    →     Movies.ts
index.js       →     index.ts
genres/
index.js       →     index.ts
resolvers/
Query.js         →     Query.ts
Movie.ts (new)
index.ts (new)
index.js           →     index.ts
+     types/ (new)
+     middleware/ (new)
+     utils/ (new)

### 6. Validation Rules

New validation ensures data integrity:

- **Page**: 1-500
- **Year**: 1900 to current year + 5
- **Movie IDs**: Max 50 per request, positive integers
- **Sort fields**: Limited to valid TMDB fields

### 7. Environment Variables

New required variables:
```env
NODE_ENV=development
PORT=4000
TMDB_API_KEY=your_key
TMDB_API_BASE_URL=https://api.themoviedb.org/3/
TMDB_IMAGE_BASE_PATH=https://image.tmdb.org/t/p/w300
```

### 8. Migration Checklist

- [x] Update Apollo Server to v5
- [x] Migrate all files to TypeScript
- [x] Add input validation
- [x] Implement error handling
- [x] Add security middleware
- [x] Configure environment variables
- [x] Update GraphQL endpoint in client
- [x] Add health check endpoint
- [x] Document all changes
- [x] Test all queries

## Testing After Migration

1. Start server: `npm run dev`
2. Open GraphQL Playground: http://localhost:4000/graphql
3. Run test queries (see README.md)
4. Verify validation works with invalid inputs
5. Check health endpoint: http://localhost:4000/health
