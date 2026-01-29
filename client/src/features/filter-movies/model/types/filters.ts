import type { GenresQuery } from '@/gql/graphql';
import type { Filters as FiltersType } from '@/shared/lib/hooks/useFilters';

export type FilterFormValues = Partial<
  Omit<FiltersType, 'year' | 'primaryReleaseYear' | 'genre'> & {
    year?: string | number;
    primaryReleaseYear?: string | number;
    genre?: string | number;
  }
>;

export interface FiltersProps {
  onSubmit: (values: FilterFormValues) => void;
  initialValues?: Partial<FiltersType>;
}

export interface GenreFieldProps {
  data?: GenresQuery;
}
