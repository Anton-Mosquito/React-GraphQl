export const CONFIRM_TIMEOUT = 3000;

export const SORT_DIRECTION = {
  ASC: 'asc',
  DESC: 'desc',
} as const;

export const SORT_OPTIONS = [
  { label: 'Title', value: 'title' },
  { label: 'Release Year', value: 'releaseYear' },
];

export const SOCIAL_BUTTON_SIZE = 32;

export const LOCALES = {
  ENGLISH: 'en-US',
  UKRANIAN: 'uk-UA',
} as const;