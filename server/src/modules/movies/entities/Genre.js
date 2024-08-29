import { format } from "date-fns";
import { IMAGE_BASE_PATH } from "../../../config/index.js";

class Genre {
  constructor(genre) {
    this.id = genre.id;
    this.name = genre.name;
  }
}

module.exports = {
  Genre,
};
