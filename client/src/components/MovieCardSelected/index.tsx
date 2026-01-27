import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { Movie as HookMovie } from '../../shared/lib/hooks/useMovies';
import CardMenu from '../MovieCard/components/CardMenu';

interface MovieCardSelectedProps {
  movie: HookMovie & {
    image?: string;
    title?: string;
    releaseDate?: string;
    genres?: { id?: number; name?: string }[];
    runtime?: number;
  };
  onCardDelete?: (movie: HookMovie) => void;
}

const MovieCardSelected = ({ movie, onCardDelete }: MovieCardSelectedProps) => {
  const { t } = useTranslation();
  return (
    <Card sx={{ display: 'flex', minHeight: '164px' }}>
      <CardMedia component="img" sx={{ width: 100 }} image={movie.image} alt={movie.title} />
      <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', position: 'relative' }}>
        <CardContent sx={{ flex: '1 0 auto' }}>
          <Typography component="div" variant="h5">
            {movie.title}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" component="div">
            {movie.releaseDate}
          </Typography>
        </CardContent>
        <Box sx={{ p: 2, pt: 0 }}>
          {movie.genres?.length ? (
            <Typography variant="subtitle1" color="text.secondary" component="div">
              {movie.genres[0].name}
            </Typography>
          ) : null}
          <Typography variant="subtitle1" color="text.secondary" component="div">
            Length: {movie.runtime}
          </Typography>
        </Box>
        <CardMenu>
          <MenuItem onClick={() => onCardDelete?.(movie)}>
            {t('delete')}
          </MenuItem>
        </CardMenu>
      </Box>
    </Card>
  );
};

export default MovieCardSelected;
