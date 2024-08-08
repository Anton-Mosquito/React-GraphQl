import axios from "axios";
import { Movies } from "./entities/Movies.js";
import { API_KEY } from "../../config/index.js";

const getPopular = async () => {
  const result = await axios.get(
    `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1`
  );

  return new Movies(result.data);
};

export { getPopular };
