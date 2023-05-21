const { AuthenticationError } = require("apollo-server-express");
const { User } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const user = await User.findOne({ _id: context.user._id });
        return user;
      }
      throw new AuthenticationError("Not logged in");
    },
  },

  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      try {
        const user = await User.create({ username, email, password });
        const token = signToken(user);
        return { token, user };
      } catch (err) {
        console.error(err);
        throw new Error("Error while adding the user");
      }
    },
    login: async (parent, { email, password }) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          throw new AuthenticationError("No user with this email found");
        }
        const correctPassword = await user.isCorrectPassword(password);
        if (!correctPassword) {
          throw new AuthenticationError("Incorrect password");
        }
        const token = signToken(user);
        return { token, user };
      } catch (err) {
        console.error(err);
        throw new Error("Error while logging in");
      }
    },
    saveBook: async (parent, { book }, context) => {
      if (context.user) {
        try {
          const updatedUser = await User.findOneAndUpdate(
            { _id: context.user._id },
            { $addToSet: { savedBooks: book } },
            { new: true }
          );
          return updatedUser;
        } catch (err) {
          console.error(err);
          throw new Error("Error while saving the book");
        }
      }
      throw new AuthenticationError("Login required");
    },
    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        try {
          const updatedUser = await User.findOneAndUpdate(
            { _id: context.user._id },
            { $pull: { savedBooks: { bookId: bookId } } },
            { new: true }
          );
          return updatedUser;
        } catch (err) {
          console.error(err);
          throw new Error("Error while deleting the book");
        }
      }
      throw new AuthenticationError("Login required");
    },
  },
};

module.exports = resolvers;
