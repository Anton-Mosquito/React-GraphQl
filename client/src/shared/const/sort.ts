export const SORT_DIRECTION = {
  ASC: 'asc',
  DESC: 'desc',
} as const;

export interface SortOption {
  label: string;
  value: string;
}

export const SORT_OPTIONS: readonly SortOption[] = [
  { label: 'Title', value: 'original_title' },
  { label: 'Release Year', value: 'release_date' },
  { label: 'Popularity', value: 'popularity' },
] as const;
