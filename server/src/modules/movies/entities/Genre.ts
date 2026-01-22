import { TMDBGenre } from '../../../types/index.js';

export class Genre {
  public readonly id: number;
  public readonly name: string;

  constructor(genre: TMDBGenre) {
    this.id = genre.id;
    this.name = genre.name;
  }

  toJSON(): { id: number; name: string } {
    return {
      id: this.id,
      name: this.name,
    };
  }
}
