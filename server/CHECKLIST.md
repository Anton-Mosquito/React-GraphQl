# Future Improvements Checklist

## High Priority

- [x] Add ESLint with TypeScript rules
- [x] Add Prettier for code formatting
- [ ] Implement unit tests (Jest + ts-jest)
- [ ] Add integration tests for GraphQL queries
- [ ] Implement caching layer (Redis or in-memory)
- [ ] Add rate limiting middleware
- [ ] Implement DataLoader for batching TMDB requests

## Medium Priority

- [ ] Add Sentry or similar error tracking
- [ ] Implement request tracing (OpenTelemetry)
- [ ] Add GraphQL complexity analysis
- [ ] Implement pagination helpers
- [ ] Add more comprehensive logging (Winston/Pino)
- [ ] Create Docker Compose for local development
- [ ] Add CI/CD pipeline (GitHub Actions)

## Low Priority

- [ ] Add GraphQL subscriptions (if needed)
- [ ] Implement custom directives
- [ ] Add GraphQL Code Generator for client types
- [ ] Create Postman/Insomnia collection
- [ ] Add performance monitoring
- [ ] Implement feature flags

## Documentation

- [ ] Add JSDoc comments to all public APIs
- [ ] Create architecture diagrams
- [ ] Document deployment process
- [ ] Add contributing guidelines
- [ ] Create API versioning strategy

## Security

- [ ] Add helmet.js for additional security headers
- [ ] Implement API key authentication (if needed)
- [ ] Add request signing validation
- [ ] Implement query depth limiting
- [ ] Add query complexity limits
- [ ] Regular security audits (`npm audit`)
