import { gql } from '@apollo/client';
// Query to render all books for the person logged in
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
// Query to render all users, used to test frontend
export const QUERY_USERS = gql`
  query allUsers {
    users {
      _id
      username
      email
    }
  }
`;
