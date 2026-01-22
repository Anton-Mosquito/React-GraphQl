# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2024-01-22

### Added
- Full TypeScript migration with strict mode
- Apollo Server 5 support
- Express 5 integration
- Native Fetch API (removed axios dependency)
- Input validation for all GraphQL queries
- Security headers middleware
- Structured logging system
- Custom error types (TMDBApiError, ValidationError)
- Health check endpoint
- Graceful shutdown handling
- Production-ready CORS configuration
- Request timeout support (30s default)
- Comprehensive documentation

### Changed
- Migrated from JavaScript to TypeScript
- Updated from Apollo Server 4 to 5
- Updated from Express 4 to 5
- Replaced axios with native Fetch API
- Moved configuration from hardcoded values to environment variables
- GraphQL endpoint changed from `/` to `/graphql`
- Improved error handling and logging

### Removed
- axios dependency
- Hardcoded API keys and configuration
- Legacy CommonJS imports

### Breaking Changes
- GraphQL endpoint moved to `/graphql` (was `/` before)
- Requires Node.js 18+ for native Fetch API
- Environment variables now required (see .env.example)
