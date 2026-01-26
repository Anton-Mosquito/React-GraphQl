export interface MovieFilterInput {
  page?: number;
  sortBy?: string;
  sortDirection?: 'desc' | 'asc';
  includeAdult?: boolean;
  year?: number;
  primaryReleaseYear?: number;
  genre?: number;
}

export interface ReleaseDateParams {
  format?: string;
}

export interface MovieDTO {
  id: number;
  title: string;
  originalTitle: string;
  releaseDate: string;
  posterPath: string;
  adult: boolean;
  overview: string;
  originalLanguage: string;
  backdropPath: string;
  popularity: number;
  voteCount: number;
  video: boolean;
  voteAverage: number;
  genres?: { id: number; name: string }[];
}
