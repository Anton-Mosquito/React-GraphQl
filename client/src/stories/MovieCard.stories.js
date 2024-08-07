import MovieCard from '../components/MovieCard'
import { movies } from './stub';

export default {
  title: 'Card/MovieCard',
  component: MovieCard,
};

export const Primary = {
  args: {
    movie: movies[0]
  },
};
