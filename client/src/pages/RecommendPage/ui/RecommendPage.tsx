import { useQuery } from '@apollo/client/react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import React from 'react';
import { useSearchParams } from 'react-router-dom';

import { MovieCard } from '@/entities/movie';
import type { MoviesByIdsQuery } from '@/gql/graphql';

import { MOVIES_BY_IDS_QUERY } from '../queries';

const Recommend = () => {
  const [searchParams] = useSearchParams();

  const idsParam = searchParams.get('ids') || '';
  const ids = idsParam ? idsParam.split(',').map((id) => +id) : [];

  const { loading, error, data } = useQuery<MoviesByIdsQuery>(MOVIES_BY_IDS_QUERY, {
    variables: { ids },
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error. Try again!</div>;
  }

  return (
    <>
      <Typography variant="h1" component="h1" gutterBottom>
        {searchParams.get('title')}
      </Typography>
      {data?.moviesByIds && (
        <Grid container spacing={2}>
          {data.moviesByIds
            .filter((movie) => movie !== null)
            .map((movie) => (
              <Grid
                key={movie.id}
                size={{
                  xs: 12,
                  sm: 6,
                  md: 4,
                  lg: 3,
                }}
              >
                <MovieCard movie={movie} isPreviewMode />
              </Grid>
            ))}
        </Grid>
      )}
    </>
  );
};

export default Recommend;
