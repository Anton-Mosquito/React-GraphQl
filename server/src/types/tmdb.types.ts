export interface TMDBGenre {
  id: number;
  name: string;
}

export interface TMDBMovie {
  id: number;
  title: string;
  original_title: string;
  release_date: string;
  poster_path: string | null;
  backdrop_path: string | null;
  adult: boolean;
  overview: string;
  original_language: string;
  popularity: number;
  vote_count: number;
  video: boolean;
  vote_average: number;
  genre_ids?: number[];
  genres?: TMDBGenre[];
}

export interface TMDBMoviesResponse {
  page: number;
  total_results: number;
  total_pages: number;
  results: TMDBMovie[];
}

export interface TMDBGenresResponse {
  genres: TMDBGenre[];
}

export interface MovieFilterInput {
  page?: number;
  sortBy?: string;
  sortDirection?: 'desc' | 'asc';
  includeAdult?: boolean;
  year?: number;
  primaryReleaseYear?: number;
  genre?: number;
}
