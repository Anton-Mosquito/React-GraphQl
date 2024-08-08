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
    return params.format
      ? format(new Date(this.movie.release_date), params.format)
      : this.movie.release_date;
  }
}
