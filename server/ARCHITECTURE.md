# Архітектура серверу

Цей документ описує архітектуру серверної частини проєкту, перелік і призначення всіх файлів у папці `server/`, а також містить повний вміст кожного файлу для аналізу.

Коротко:
- Сервер: `Express` + `Apollo GraphQL` (сервер запускається на порту 4000).
- API-джерело: The Movie Database (TMDB) через REST-запити (`axios`).
- Структура: модулі `movies` та `genres`, які інкапсулюють логіку запитів до TMDB та сутності-домени (entities).
- Конфігурація (ключ API, базовий URL, шлях до зображень) у `src/config/index.js`.

Головні файли (швидкий огляд):
- [server/src/index.js](server/src/index.js) — точка входу, налаштування Express + Apollo Server.
- [server/src/schema.graphql](server/src/schema.graphql) — GraphQL-схема (typeDefs).
- [server/src/resolvers/Query.js](server/src/resolvers/Query.js) — реалізація запитів GraphQL.
- [server/src/config/index.js](server/src/config/index.js) — конфіг-змінні (API key, base URLs).
- [server/src/modules/movies/index.js](server/src/modules/movies/index.js) — зовнішні запити до TMDB (popular, details, discover).
- [server/src/modules/movies/entities/*.js](server/src/modules/movies/entities/) — об'єкти-домени: `Movie`, `Movies`, `Genre`.
- [server/src/modules/genres/index.js](server/src/modules/genres/index.js) — запит списку жанрів.
- [server/package.json](server/package.json) — залежності та скрипти.

Детальний опис файлів та їх вміст

## server/src/index.js
Опис: Точка запуску сервера. Зчитує `schema.graphql`, створює ApolloServer з плагінами, підключає Express static для клієнта та дефолтні маршрути.

Вміст:
```javascript
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

```

---

## server/src/schema.graphql
Опис: GraphQL-схема з типами `Movies`, `Movie`, `Genre` та запитами `movies`, `moviesByIds`, `genres`.

Вміст:
```graphql
type Query {
  movies(filter: MoviesFilterInput): Movies
  moviesByIds(ids: [Int]): [Movie]
  genres: [Genre]
}

input MoviesFilterInput {
  page: Int
  sortBy: String
  sortDirection: SORT_DIRECTION
  includeAdult: Boolean
  year: Int
  primaryReleaseYear: Int
  genre: Int
}

enum SORT_DIRECTION {
  desc
  asc
}

type Movies {
  page: Int!
  totalResults: Int!
  totalPages: Int!
  results: [Movie!]!
}

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

type Genre {
  id: Int!
  name: String
}

```

---

## server/src/config/index.js
Опис: Конфігураційні константи для доступу до TMDB та шляхи до зображень.

Вміст:
```javascript
const API_KEY = "5a07a3dde2cf6e5158ca70e799d3cc41";
const IMAGE_BASE_PATH = "https://image.tmdb.org/t/p/w300";
const API_BASE_URL = 'https://api.themoviedb.org/3/';

export { API_KEY, IMAGE_BASE_PATH, API_BASE_URL };

```

---

## server/src/resolvers/Query.js
Опис: Resolver-методи GraphQL, що делегують роботу до модулів `movies` та `genres`.

Вміст:
```javascript
import {
  getPopular,
  getDetails,
  discoverMovie,
} from "../modules/movies/index.js";
import { getList } from "../modules/genres/index.js";
import { Movie } from "../modules/movies/entities/Movie.js";

async function movies(parent, args, { locale }) {
  const data = await discoverMovie(args.filter, locale);
  return data;
}

async function moviesByIds(parent, { ids }, { locale }) {
  const requests = ids.map((id) => getDetails(id, locale));
  const data = await Promise.all(requests);
  const movies = data.map(({ data }) => new Movie(data));

  return movies;
}

async function genres(_, {}, { locale }) {
  return await getList(locale);
}

export default {
  movies,
  moviesByIds,
  genres,
};

```

---

## server/src/modules/movies/index.js
Опис: Модуль для роботи з кіномоделями TMDB. Використовує `axios` для викликів API і обгортає відповіді в сутності `Movies`.

Вміст:
```javascript
import axios from "axios";
import { Movies } from "./entities/Movies.js";
import { API_KEY, API_BASE_URL } from "../../config/index.js";

const getPopular = async (page, language) => {
  const result = await axios.get(
    `${API_BASE_URL}movie/popular?api_key=${API_KEY}&language=${language}&page=${page}`
  );

  return new Movies(result.data);
};

const getDetails = (id, language) => {
  return axios.get(
    `${API_BASE_URL}movie/${id}?api_key=${API_KEY}&language=${language}`
  );
};

const discoverMovie = async (filter, language) => {
  const result = await axios.get(
    `${API_BASE_URL}discover/movie?api_key=${API_KEY}&language=${language}&page=${filter.page}&year=${filter.year}&sort_by=${filter.sortBy}.${filter.sortDirection}&include_adult=${filter.includeAdult}&primary_release_year=${filter.primaryReleaseYear}&with_genres=${filter.genre}`
  );

  return new Movies(result.data);
};

export { getPopular, getDetails, discoverMovie };

```

---

## server/src/modules/movies/entities/Movie.js
Опис: Клас `Movie` — доменна сутність, яка форматує і надає зручні поля (шляхи до зображень, формат дати тощо).

Вміст:
```javascript
import { format } from "date-fns";
import { IMAGE_BASE_PATH } from "../../../config/index.js";

export class Movie {
  constructor(movie) {
    this.movie = movie;
    this.id = movie.id;
    this.title = movie.title;
    this.posterPath = `${IMAGE_BASE_PATH}${movie.poster_path}`;
    this.adult = movie.adult;
    this.overview = movie.overview;
    this.originalLanguage = movie.original_language;
    this.backdropPath = `${IMAGE_BASE_PATH}${movie.backdrop_path}`;
    this.popularity = movie.popularity;
    this.voteCount = movie.vote_count;
    this.video = movie.video;
    this.voteAverage = movie.vote_average;
  }

  releaseDate(params) {
    try {
      const date = params.format
        ? format(new Date(this.movie.release_date), params.format)
        : this.movie.release_date;

      return date;
    } catch (e) {
      console.error(e);
      return this.movie.release_date;
    }
  }
}

```

---

## server/src/modules/movies/entities/Movies.js
Опис: Обгортка `Movies` для відповіді TMDB (пагінація + масив `Movie`).

Вміст:
```javascript
import { Movie } from "./Movie.js";

export class Movies {
  constructor(movies) {
    this.page = movies.page;
    this.totalResults = movies.total_results;
    this.totalPages = movies.total_pages;
    this.results = movies.results.map((movie) => new Movie(movie));
  }
}
```

---

## server/src/modules/movies/entities/Genre.js
Опис: Сутність `Genre` (id, name).

Вміст:
```javascript
import { format } from "date-fns";
import { IMAGE_BASE_PATH } from "../../../config/index.js";

class Genre {
  constructor(genre) {
    this.id = genre.id;
    this.name = genre.name;
  }
}

module.exports = {
  Genre,
};

```

---

## server/src/modules/genres/index.js
Опис: Модуль отримання списку жанрів з TMDB. Картується у `Genre` сутності.

Вміст:
```javascript
import axios from "axios";
import { Genre } from "../movies/entities/Genre.js";
import { API_KEY, API_BASE_URL } from "../../config/index.js";

const getList = async (language) => {
  const result = await axios.get(
    `${API_BASE_URL}genre/movie/list?api_key=${API_KEY}&language=${language}`
  );

  return result.data.genres.map((genre) => new Genre(genre));
};

module.exports = {
  getList,
};

```

---

## server/package.json
Опис: Опис пакету і залежностей.

Вміст:
```json
{
  "name": "server",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "type": "module",
  "scripts": {
    "start": "node src/index.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "@apollo/server": "^4.10.5",
    "axios": "^1.7.3",
    "date-fns": "^3.6.0",
    "graphql": "^16.9.0"
  }
}
```

---

## server/package-lock.json
Опис: Автоматично згенерований lock-файл для npm — повний список версій залежностей.

Вміст (скорочено показано фрагментом; повний файл міститься в репозиторії):
```json
(повний `package-lock.json` знаходиться поруч у корені `server/`)
```

---

## server/.gitignore
Опис: Файли та папки, які ігноруються Git.

Вміст:
```gitignore
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# production
/build

# misc
.DS_Store
.env.local
.env.development.local
.env.test.local
.env.production.local

npm-debug.log*
yarn-debug.log*
yarn-error.log*
```

---

## Нотатки щодо безпеки та налаштування
- `API_KEY` зберігається в `src/config/index.js` у відкритому вигляді — для продакшену рекомендується використовувати змінні середовища (env) або секретне сховище.
- Сервер читає локаль з заголовку `locale` для локалізації запитів до TMDB.