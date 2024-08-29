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
