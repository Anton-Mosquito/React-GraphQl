import { TMDBMoviesResponse, TMDBMovie } from '#schema/index.js';
import { Movie } from '#modules/index.js';

export class Movies {
  public readonly page: number;
  public readonly totalResults: number;
  public readonly totalPages: number;
  public readonly results: Movie[];

  constructor(moviesResponse: TMDBMoviesResponse) {
    this.page = moviesResponse.page;
    this.totalResults = moviesResponse.total_results;
    this.totalPages = moviesResponse.total_pages;
    this.results = moviesResponse.results.map(
      (movie: TMDBMovie) => new Movie(movie),
    );
  }

  toJSON() {
    return {
      page: this.page,
      totalResults: this.totalResults,
      totalPages: this.totalPages,
      results: this.results.map((movie) => movie.toJSON()),
    };
  }
}
