import axios from "axios";
import { Movies } from "./entities/Movies.js";
import { API_KEY, API_BASE_URL } from "../../config/index.js";

const getPopular = async (page, language) => {
  const result = await axios.get(
    `${API_BASE_URL}movie/popular?api_key=${API_KEY}&language=${language}&page=${page}`
  );

  return new Movies(result.data);
};

const getDetails = (id, language) => {
  return axios.get(
    `${API_BASE_URL}movie/${id}?api_key=${API_KEY}&language=${language}`
  );
};

export { getPopular, getDetails };
