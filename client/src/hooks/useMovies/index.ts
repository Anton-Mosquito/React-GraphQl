import { useState, useCallback } from 'react';

export type Movie = {
  id: number | string;
  [key: string]: any;
};

const MAX_SELECTED_MOVIES = 20;

export const useMovies = () => {
  const [selectedMovies, setSelectedMovies] = useState<Movie[]>([]);

  const selectMovie = useCallback(
    (movie: Movie) => {
      const length = selectedMovies.length;
      const isNewMovie = !selectedMovies.find(({ id }) => id === movie.id);

      if (isNewMovie && length < MAX_SELECTED_MOVIES) {
        setSelectedMovies([movie, ...selectedMovies]);
      }
    },
    [selectedMovies]
  );

  const deleteMovie = useCallback(
    (movie: Movie) => {
      setSelectedMovies(selectedMovies.filter(({ id }) => id !== movie.id));
    },
    [selectedMovies]
  );

  return {
    selectedMovies,
    selectMovie,
    deleteMovie,
  };
};
