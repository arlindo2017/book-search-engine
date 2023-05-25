import { gql } from '@apollo/client';

export const GET_ME = gql`
  query me {
    me {
      _id
      username
      email
      savedBooks {
        title
        link
        image
        description
        bookId
        authors
      }
    }
  }
`;
export const QUERY_USERS = gql`
  query allUsers {
    users {
      _id
      username
      email
    }
  }
`;
