import axios from "axios";
import { Movies } from "./entities/Movies.js";
import { API_KEY, API_BASE_URL } from "../../config/index.js";

const getPopular = async (page) => {
  const result = await axios.get(
    `${API_BASE_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=${page}`
  );

  return new Movies(result.data);
};

export { getPopular };
