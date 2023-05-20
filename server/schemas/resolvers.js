const { AuthenticationError } = require("apollo-server-express");
const { User } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    getSingleUser: async (parent, { id, username }) => {
      let query;

      if (id) {
        query = { _id: id };
      } else if (username) {
        query = { username: username };
      } else {
        throw new Error("Please provide either an ID or a username");
      }

      const foundUser = await User.findOne(query);

      if (!foundUser) {
        throw new Error("Cannot find a user with this id or username");
      }

      return foundUser;
    },
  },

  Mutation: {
    createUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });

      if (!user) {
        throw new Error("Something went wrong while creating the user");
      }

      const token = signToken(user);
      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("No user with this email found!");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect password!");
      }

      const token = signToken(user);
      return { token, user };
    },
    saveBook: async (parent, { book }, { user }) => {
      // if (!user) {
      //   throw new Error("Authentication required to save a book");
      // }

      try {
        const updatedUser = await User.findOneAndUpdate(
          { _id: user._id },
          { $addToSet: { savedBooks: book } },
          { new: true, runValidators: true }
        );
        return updatedUser;
      } catch (err) {
        console.error(err);
        throw new Error("Error while saving the book");
      }
    },
    deleteBook: async (parent, { bookId }, { user }) => {
      // Check if user is authenticated
      // if (!user) {
      //   throw new Error("Authentication required to delete a book");
      // }

      try {
        // Find the user and remove the book with the specified bookId
        const updatedUser = await User.findOneAndUpdate(
          { _id: user._id },
          { $pull: { savedBooks: { bookId: bookId } } },
          { new: true }
        );

        if (!updatedUser) {
          throw new Error("Couldn't find user with this id");
        }

        return updatedUser;
      } catch (err) {
        console.error(err);
        throw new Error("Error while deleting the book");
      }
    },
  },
};

module.exports = resolvers;
