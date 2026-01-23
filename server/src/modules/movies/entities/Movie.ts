import { format, parseISO } from 'date-fns';
import { TMDBMovie } from '../../../types/index.js';
import { env } from '../../../config/env.js';
import { logger } from '../../../utils/index.js';
import { Genre } from './Genre.js';

interface ReleaseDateParams {
  format?: string;
}

export class Movie {
  public readonly id: number;
  public readonly title: string;
  public readonly originalTitle: string;
  public readonly posterPath: string;
  public readonly adult: boolean;
  public readonly overview: string;
  public readonly originalLanguage: string;
  public readonly backdropPath: string;
  public readonly popularity: number;
  public readonly voteCount: number;
  public readonly video: boolean;
  public readonly voteAverage: number;
  public readonly genres?: Genre[];

  private readonly rawReleaseDate: string;

  constructor(movie: TMDBMovie) {
    this.id = movie.id;
    this.title = movie.title;
    this.originalTitle = movie.original_title;
    this.adult = movie.adult;
    this.overview = movie.overview;
    this.originalLanguage = movie.original_language;
    this.popularity = movie.popularity;
    this.voteCount = movie.vote_count;
    this.video = movie.video;
    this.voteAverage = movie.vote_average;
    this.rawReleaseDate = movie.release_date;

    this.posterPath = movie.poster_path
      ? `${env.TMDB_IMAGE_BASE_PATH}${movie.poster_path}`
      : '';

    this.backdropPath = movie.backdrop_path
      ? `${env.TMDB_IMAGE_BASE_PATH}${movie.backdrop_path}`
      : '';

    if (movie.genres && movie.genres.length > 0) {
      this.genres = movie.genres.map((g) => new Genre(g));
    }
  }

  releaseDate(params?: ReleaseDateParams): string {
    if (!this.rawReleaseDate) {
      return '';
    }

    try {
      if (params?.format) {
        const date = parseISO(this.rawReleaseDate);
        return format(date, params.format);
      }
      return this.rawReleaseDate;
    } catch (error) {
      logger.error('Error formatting release date', {
        movieId: this.id,
        rawDate: this.rawReleaseDate,
        error,
      });
      return this.rawReleaseDate;
    }
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      originalTitle: this.originalTitle,
      releaseDate: this.rawReleaseDate,
      posterPath: this.posterPath,
      adult: this.adult,
      overview: this.overview,
      originalLanguage: this.originalLanguage,
      backdropPath: this.backdropPath,
      popularity: this.popularity,
      voteCount: this.voteCount,
      video: this.video,
      voteAverage: this.voteAverage,
      genres: this.genres?.map((g) => g.toJSON()),
    };
  }
}
