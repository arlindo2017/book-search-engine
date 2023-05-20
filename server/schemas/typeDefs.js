const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    email: String!
    savedBooks: [Book!]!
  }

  type Book {
    authors: [String!]
    description: String!
    bookId: String!
    image: String
    link: String
    title: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    getSingleUser(id: ID, username: String): User
  }

  type Mutation {
    createUser(
      username: String!
      email: String!
      password: String!
    ): AuthPayload
    login(usernameOrEmail: String!, password: String!): AuthPayload
    saveBook(book: BookInput!): User
    deleteBook(bookId: String!): User
  }

  input BookInput {
    authors: [String!]
    description: String!
    bookId: String!
    image: String
    link: String
    title: String!
  }
`;

module.exports = typeDefs;
