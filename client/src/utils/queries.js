import { gql } from "@apollo/client";

export const GET_ME = gql`
  query me {
    getSingleUser {
      _id
      username
      email
      savedBooks {
        authors
        description
        bookId
        image
        link
        title
      }
    }
  }
`;

export const GET_USER = gql`
  query GetUser($id: ID!) {
    getSingleUser(id: $id) {
      _id
      username
      email
      savedBooks {
        authors
        description
        bookId
        image
        link
        title
      }
    }
  }
`;
