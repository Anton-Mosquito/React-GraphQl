import { MovieCardSelected } from '../components'
import { movies } from './stub';

export default {
  title: 'Card/Movie card selected',
  component: MovieCardSelected,
};

export const Primary = {
  args: {
    movie: movies[0]
  },
};
