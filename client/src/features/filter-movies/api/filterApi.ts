import { graphql } from '../../../gql';

export const GENRES_QUERY = graphql(`
  query Genres {
    genres {
      id
      name
    }
  }
`);
