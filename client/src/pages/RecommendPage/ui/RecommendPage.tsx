import { useQuery } from '@apollo/client/react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import React from 'react';
import { useSearchParams } from 'react-router-dom';

import { MOVIES_BY_IDS_QUERY } from '../queries';
import { MovieCard } from '../../../components';

const Recommend: React.FC = () => {
  const [searchParams] = useSearchParams();

  const idsParam = searchParams.get('ids') || '';
  const ids = idsParam ? idsParam.split(',').map((id) => +id) : [];

  const { loading, error, data } = useQuery(MOVIES_BY_IDS_QUERY as any, {
    variables: { ids },
  });
  const moviesData: any = data;

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
      {moviesData?.moviesByIds && (
        <Grid container spacing={2}>
          {moviesData.moviesByIds.map((movie: any) => (
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
