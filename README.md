# React + GraphQL Full-Stack Application

Full-featured movie browsing application with React frontend, GraphQL/REST backend, and real-time collaborative canvas.

## 🎯 Features

### Frontend (React + Vite)
- ⚛️ React 19 with TypeScript
- 🎨 Material-UI (MUI) components
- 🌐 Apollo Client for GraphQL
- 🗺️ React Router v7
- 🔄 Redux Toolkit for state management
- 🌍 i18next for internationalization (EN/UK)
- 🎨 Real-time collaborative canvas with WebSocket
- 📱 Responsive design

### Backend (Node.js + GraphQL)
- 🚀 Apollo Server 5
- 💾 PostgreSQL + Prisma ORM
- 🔐 JWT Authentication
- 📧 Email activation (Gmail OAuth2)
- 🔌 WebSocket for real-time features
- ⚡ Express 5 + REST API
- 🛡️ Rate limiting and security headers
- 📊 TMDB API integration

## 🏗️ Architecture

```
React-GraphQl/
├── client/                 # React frontend
│   ├── src/
│   │   ├── app/           # App setup, providers, routing
│   │   ├── pages/         # Page components
│   │   ├── widgets/       # Complex features
│   │   ├── features/      # Feature modules
│   │   ├── entities/      # Business entities
│   │   ├── shared/        # Shared utilities
│   │   └── gql/           # Generated GraphQL types
│   └── public/
│
├── server/                # Node.js backend
│   ├── src/
│   │   ├── modules/       # Business logic (auth, movies, users, drawing)
│   │   ├── resolvers/     # GraphQL resolvers
│   │   ├── middleware/    # Express middleware
│   │   ├── rest/          # REST endpoints
│   │   └── schema.graphql # GraphQL schema
│   └── prisma/
│
├── nginx/                 # Nginx configurations
│   ├── nginx.conf.dev     # Development proxy
│   └── nginx.conf.prod    # Production with rate limiting
│
├── docker-compose.yml     # Development setup
├── docker-compose.prod.yml # Production setup
└── PRODUCTION.md          # Production deployment guide
```

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- TMDB API Key ([get it here](https://www.themoviedb.org/settings/api))

### Development

1. **Clone the repository**
```bash
git clone https://github.com/Anton-Mosquito/React-GraphQl.git
cd React-GraphQl
```

2. **Create .env file**
```bash
cp .env.example .env
# Edit .env with your keys
```

3. **Run with Docker**
```bash
docker-compose up
```

Application will be available at:
- **Frontend**: http://localhost (via nginx)
- **Backend GraphQL**: http://localhost/graphql
- **Backend REST API**: http://localhost/api

### Local Development (without Docker)

#### Backend
```bash
cd server
npm install
npm run prisma:generate
npm run prisma:push
npm run dev
```

#### Frontend
```bash
cd client
npm install
npm run dev
```

## 🔧 Environment Variables

### Common (root `.env`)
```env
# TMDB API
TMDB_API_KEY=your_tmdb_api_key
TMDB_API_BASE_URL=https://api.themoviedb.org/3
TMDB_IMAGE_BASE_PATH=https://image.tmdb.org/t/p

# Server
API_URL=http://localhost:5001/api

# JWT Secrets (minimum 32 characters!)
JWT_ACCESS_SECRET=your_access_secret_min_32_chars
JWT_REFRESH_SECRET=your_refresh_secret_min_32_chars

# Email (Gmail OAuth2)
MAIL_USER=your@gmail.com
OAUTH_CLIENT_ID=your_oauth_client_id
OAUTH_CLIENT_SECRET=your_oauth_client_secret
OAUTH_REFRESH_TOKEN=your_oauth_refresh_token

# WebSocket
VITE_WEBSOCKET_URL=ws://localhost/api/ws
```

See example in [.env.example](.env.example)

## 📦 Production Deployment

### Preparation

1. **Build client**
```bash
cd client
npm ci
npm run build
cd ..
```

2. **Setup production env**
```bash
cp .env.prod.example .env.prod
# Edit with production values
```

3. **Deploy with Docker**
```bash
docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d
```

Detailed guide: [PRODUCTION.md](PRODUCTION.md)

### Production features
- ✅ Multi-stage Docker builds
- ✅ Nginx з rate limiting
- ✅ SSL/TLS ready (Let's Encrypt)
- ✅ Health checks
- ✅ Database migrations
- ✅ Non-root containers
- ✅ Gzip compression
- ✅ Static asset caching

## 🛠️ Технології

### Frontend
| Категорія | Технології |
|-----------|------------|
| Framework | React 19, TypeScript 5 |
| Build Tool | Vite 6 |
| UI Library | Material-UI (MUI) v7 |
| Routing | React Router v7 |
| State | Redux Toolkit, RTK Query |
| GraphQL | Apollo Client |
| i18n | i18next, react-i18next |
| Forms | React Hook Form |
| WebSocket | native WebSocket API |

### Backend
| Категорія | Технології |
|-----------|------------|
| Runtime | Node.js 20+ |
| Language | TypeScript 5 |
| GraphQL | Apollo Server 5 |
| HTTP | Express 5 |
| Database | PostgreSQL 15 |
| ORM | Prisma 7 |
| Auth | JWT, bcrypt |
| Validation | Zod |
| Email | Nodemailer (OAuth2) |
| WebSocket | express-ws, ws |

### DevOps
- Docker & Docker Compose
- Nginx (reverse proxy)
- GitHub Actions (CI/CD ready)

## 📚 Documentation

### For Developers
- [Server Documentation](server/README.md) - Backend API and structure
- [Production Guide](PRODUCTION.md) - Deployment instructions
- [Server Checklist](server/CHECKLIST.md) - Post-refactoring checks

### API Documentation
- GraphQL Playground: http://localhost:5001/graphql (dev)
- GraphQL Schema: [server/src/schema.graphql](server/src/schema.graphql)

## 🎨 Main Features

### Authentication
- Registration with email activation
- Login/Logout
- JWT Access + Refresh tokens
- Password hashing (bcrypt)

### Movies
- Browse movie list (TMDB API)
- Filter by genres
- Search functionality
- Detailed movie information
- Personalized recommendations

### Real-time Canvas
- Collaborative drawing
- WebSocket synchronization
- Multiple users in rooms
- Color picker, brush size
- Real-time cursors

### Internationalization
- English (EN)
- Ukrainian (UK)
- Dynamic language switching

## 🔒 Security

- ✅ Rate limiting on all endpoints
- ✅ CORS properly configured
- ✅ Security headers (helmet)
- ✅ JWT token rotation
- ✅ Input validation (Zod)
- ✅ SQL injection protection (Prisma)
- ✅ XSS protection
- ✅ CSRF protection

## 🧪 Testing & Quality

### Server
```bash
cd server
npm run type-check    # TypeScript checking
npm run lint          # ESLint
npm run format:check  # Prettier
npm run validate      # All together
```

### Client
```bash
cd client
npm run build         # Production build test
```

## 📊 Monitoring

### Health Checks
- **Server**: http://localhost/health
- **WebSocket Stats**: http://localhost/ws-stats

### Database Management
```bash
cd server
npm run prisma:studio  # Database GUI
```

## 🐛 Troubleshooting

### Docker issues
```bash
# Rebuild containers
docker-compose down -v
docker-compose build --no-cache
docker-compose up
```

### Database issues
```bash
cd server
npm run prisma:push          # Sync schema
npm run prisma:generate      # Regenerate client
```

### Canvas rendering issues (macOS)
```bash
brew install pkg-config cairo pango libpng jpeg giflib librsvg pixman
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

ISC License - see LICENSE file

## 👤 Author

**Anton Komarnytskiy**
- GitHub: [@Anton-Mosquito](https://github.com/Anton-Mosquito)

## 🙏 Acknowledgments

- [TMDB](https://www.themoviedb.org/) - Movie data API
- [Material-UI](https://mui.com/) - React components
- [Apollo GraphQL](https://www.apollographql.com/) - GraphQL implementation
- [Prisma](https://www.prisma.io/) - Database ORM
