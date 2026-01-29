import type { Movie as GraphQLMovie } from '@/gql/graphql';

export type Movie = Pick<GraphQLMovie, 'id' | 'title' | 'releaseDate' | 'genres'> & {
  image?: string | null;
  runtime?: number;
};

export interface MovieCardProps {
  movie: Movie;
  onCardSelect?: (movie: Movie) => void;
  isPreviewMode?: boolean;
}

export interface MovieCardSelectedProps {
  movie: Movie;
  onCardDelete?: (movie: Movie) => void;
}
