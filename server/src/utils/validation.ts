import { GraphQLError } from 'graphql';
import { MovieFilterInput } from '../types/index.js';

export class ValidationError extends GraphQLError {
  constructor(message: string, field?: string) {
    super(message, {
      extensions: {
        code: 'BAD_USER_INPUT',
        field,
      },
    });
  }
}

export function validateMovieFilter(filter?: MovieFilterInput): void {
  if (!filter) return;

  const { page, year, primaryReleaseYear, sortBy, sortDirection } = filter as any;

  // Validate page
  if (page !== undefined) {
    if (!Number.isInteger(page) || page < 1) {
      throw new ValidationError('Page must be a positive integer', 'page');
    }
    if (page > 500) {
      throw new ValidationError('Page cannot exceed 500', 'page');
    }
  }

  // Validate year
  if (year !== undefined) {
    const currentYear = new Date().getFullYear();
    if (!Number.isInteger(year) || year < 1900 || year > currentYear + 5) {
      throw new ValidationError(
        `Year must be between 1900 and ${currentYear + 5}`,
        'year'
      );
    }
  }

  // Validate primaryReleaseYear
  if (primaryReleaseYear !== undefined) {
    const currentYear = new Date().getFullYear();
    if (
      !Number.isInteger(primaryReleaseYear) ||
      primaryReleaseYear < 1900 ||
      primaryReleaseYear > currentYear + 5
    ) {
      throw new ValidationError(
        `Primary release year must be between 1900 and ${currentYear + 5}`,
        'primaryReleaseYear'
      );
    }
  }

  // Validate sortBy
  const validSortBy = [
    'popularity',
    'release_date',
    'revenue',
    'primary_release_date',
    'original_title',
    'vote_average',
    'vote_count',
  ];
  if (sortBy && !validSortBy.includes(sortBy)) {
    throw new ValidationError(
      `sortBy must be one of: ${validSortBy.join(', ')}`,
      'sortBy'
    );
  }

  // Validate sortDirection
  if (sortDirection && !['asc', 'desc'].includes(sortDirection)) {
    throw new ValidationError(
      'sortDirection must be either "asc" or "desc"',
      'sortDirection'
    );
  }
}

export function validateMovieIds(ids: number[]): void {
  if (!Array.isArray(ids)) {
    throw new ValidationError('ids must be an array', 'ids');
  }

  if (ids.length === 0) {
    throw new ValidationError('ids array cannot be empty', 'ids');
  }

  if (ids.length > 50) {
    throw new ValidationError('Cannot request more than 50 movies at once', 'ids');
  }

  for (const id of ids) {
    if (!Number.isInteger(id) || id < 1) {
      throw new ValidationError(
        `All movie IDs must be positive integers, got: ${id}`,
        'ids'
      );
    }
  }
}
