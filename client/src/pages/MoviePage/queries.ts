import { graphql } from '../../gql';

export const MOVIES_QUERY = graphql(`
  query Movies($filter: MoviesFilterInput) {
    movies(filter: $filter) {
      page
      totalResults
      totalPages
      results {
        id
        title
        image: posterPath
        releaseDate(format: "dd.MM.yyyy")
      }
    }
  }
`);
