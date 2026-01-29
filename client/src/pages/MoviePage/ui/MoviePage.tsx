import { useQuery } from '@apollo/client/react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Pagination from '@mui/material/Pagination';
import Paper from '@mui/material/Paper';
import type { ChangeEvent } from 'react';

import { MovieCard } from '@/entities/movie';
import { Filters } from '@/features/filter-movies';
import type { FilterFormValues } from '@/features/filter-movies';
import type { MoviesQuery } from '@/gql/graphql';
import { useFilters } from '@/shared/lib/hooks/useFilters';

import { MOVIES_QUERY } from '../queries';

const Movie = () => {
  const { filter, setPage, setFilter } = useFilters();
  const { loading, error, data } = useQuery<MoviesQuery>(MOVIES_QUERY, { variables: { filter } });

  const paginationHandler = (_event: ChangeEvent<unknown>, page: number) => {
    setPage(page);
  };

  if (error) {
    return <>Error</>;
  }

  const onSubmit = (values: FilterFormValues) => {
    setFilter(values);
  };

  const pagesCount =
    data?.movies?.totalPages && data.movies.totalPages <= 500 ? data.movies.totalPages : 500;

  return (
    <Box sx={{ flexGrow: 1, marginTop: 2 }}>
      <Grid container spacing={2}>
        <Grid size={12}>
          <Paper sx={{ padding: '16px' }}>
            <Filters onSubmit={onSubmit} initialValues={filter} />
          </Paper>
        </Grid>
        <Grid size={12}>
          <Paper>
            <Box sx={{ flexGrow: 1, padding: 1 }}>
              {loading && 'Loading...'}
              {data?.movies && (
                <Grid container spacing={2}>
                  {data.movies.results.map((movie) => (
                    <Grid
                      key={movie.id}
                      size={{
                        xs: 12,
                        sm: 6,
                        md: 4,
                        lg: 3,
                      }}
                    >
                      <MovieCard movie={movie} />
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
            <Box mt={2} pb={2} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Pagination count={pagesCount} page={filter.page} onChange={paginationHandler} />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Movie;
