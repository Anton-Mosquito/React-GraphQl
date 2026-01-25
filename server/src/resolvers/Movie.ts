import { MovieFieldResolvers } from '#types/index.js';

const movieResolvers: MovieFieldResolvers = {
  releaseDate(parent, args) {
    return parent.releaseDate(args);
  },
};

export default movieResolvers;
