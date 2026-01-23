import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import { Box, Card, CardContent, CardMedia, Typography, MenuItem } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import CardMenu from './components/CardMenu';
import type { Movie as HookMovie } from '../../hooks/useMovies';

const CardInfo = styled(CardContent)(({ theme }) => ({
  '&:last-child': {
    paddingBottom: theme.spacing(2),
  },
}));

const PlusIcon = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  width: '100%',
  height: '100%',
  opacity: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'rgba(255, 255, 255, .6)',
  cursor: 'pointer',
  '&:hover': {
    opacity: 1,
  },
}));

interface MovieCardProps {
  movie: HookMovie & { image?: string; title?: string; releaseDate?: string };
  onCardSelect?: (movie: HookMovie) => void;
  isPreviewMode?: boolean;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onCardSelect, isPreviewMode = false }) => {
  return (
    <Card sx={{ maxWidth: 250, position: 'relative' }}>
      {!isPreviewMode && (
        <CardMenu>
          <MenuItem onClick={() => onCardSelect?.(movie)}>
            <FormattedMessage id="select" />
          </MenuItem>
        </CardMenu>
      )}

      <Box sx={{ position: 'relative' }}>
        <CardMedia component="img" height="250" image={movie.image} alt={movie.title} />
        {!isPreviewMode && (
          <PlusIcon onClick={() => onCardSelect?.(movie)}>
            <AddBoxOutlinedIcon sx={{ fontSize: 80 }} />
          </PlusIcon>
        )}
      </Box>
      <CardInfo>
        <Typography variant="h5" color="text.secondary" component="div">
          {movie.title}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" component="div">
          {movie.releaseDate}
        </Typography>
      </CardInfo>
    </Card>
  );
};

export default MovieCard;
