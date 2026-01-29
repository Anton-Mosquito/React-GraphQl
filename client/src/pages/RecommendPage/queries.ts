import { graphql } from '../../gql';

export const MOVIES_BY_IDS_QUERY = graphql(`
  query MoviesByIds($ids: [Int]) {
    moviesByIds(ids: $ids) {
      id
      title
      image: posterPath
      releaseDate(format: "dd.MM.yyyy")
    }
  }
`);
