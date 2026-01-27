import { useState, useCallback } from 'react';

import { SORT_DIRECTION } from '../../../../const';

export type Filters = {
  page: number;
  sortBy: string;
  sortDirection: string;
  includeAdult: boolean;
  year?: number;
  primaryReleaseYear?: number;
};

export const useFilters = () => {
  const [filter, setFilterFields] = useState<Filters>({
    page: 1,
    sortBy: 'popularity',
    sortDirection: SORT_DIRECTION.DESC,
    includeAdult: true,
  });

  const setPage = useCallback(
    (page: number) => {
      setFilterFields({
        ...filter,
        page,
      });
    },
    [filter],
  );

  const setFilter = useCallback(
    (
      filterFields: Partial<
        Filters & { year?: string | number; primaryReleaseYear?: string | number }
      >,
    ) => {
      setFilterFields({
        ...filter,
        ...filterFields,
        year: filterFields.year !== undefined ? +filterFields.year : filter.year,
        primaryReleaseYear:
          filterFields.primaryReleaseYear !== undefined
            ? +filterFields.primaryReleaseYear
            : filter.primaryReleaseYear,
      });
    },
    [filter],
  );

  return {
    filter,
    setPage,
    setFilter,
  };
};
