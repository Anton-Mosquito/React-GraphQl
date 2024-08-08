import { getPopular } from '../modules/movies/index.js';

async function movies(parent, args) {

  const data = await getPopular();

  return data;
}

export default {
  movies,
};
