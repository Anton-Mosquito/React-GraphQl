import { useQuery } from '@apollo/client/react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Pagination from '@mui/material/Pagination';
import Paper from '@mui/material/Paper';
import React from 'react';

import { MOVIES_QUERY } from './queries';
import { MovieCard, SelectedMoviesSection } from '../../components';
import { Filters } from '../../components/Filters';
import { useFilters } from '../../hooks/useFilters';
import { useMovies } from '../../hooks/useMovies';

const Home: React.FC = () => {
  const { filter, setPage, setFilter } = useFilters();
  const { loading, error, data } = useQuery(MOVIES_QUERY as any, { variables: { filter } });
  const moviesData: any = data;
  const { selectedMovies, selectMovie, deleteMovie } = useMovies();

  const paginationHandler = (_event: any, page: number) => {
    setPage(page);
  };

  if (error) {
    return <>Error</>;
  }

  const onSubmit = (values: any) => {
    setFilter(values);
  };

  const pagesCount = moviesData?.movies?.totalPages <= 500 ? moviesData?.movies?.totalPages : 500;

  return (
    <Box sx={{ flexGrow: 1, marginTop: 2 }}>
      <Grid container spacing={2}>
        <Grid size={12}>
          <Paper sx={{ padding: '16px' }}>
            <Filters onSubmit={onSubmit} initialValues={filter} />
          </Paper>
        </Grid>
        <Grid
          size={{
            xs: 12,
            md: 8,
          }}
        >
          <Paper>
            <Box sx={{ flexGrow: 1, padding: 1 }}>
              {loading && 'Loading...'}
              {moviesData && (
                <Grid container spacing={2}>
                  {moviesData.movies.results.map((movie: any) => (
                    <Grid
                      key={movie.id}
                      size={{
                        xs: 12,
                        sm: 6,
                        md: 4,
                        lg: 3,
                      }}
                    >
                      <MovieCard movie={movie} onCardSelect={selectMovie} />
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
        <Grid
          size={{
            xs: 12,
            md: 4,
          }}
        >
          <SelectedMoviesSection selectedMovies={selectedMovies} deleteMovie={deleteMovie} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;
