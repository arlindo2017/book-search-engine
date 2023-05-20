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
    createUser: async (_, { username, email, password }) => {
      const user = await User.create({ username, email, password });

      if (!user) {
        throw new Error("Something went wrong while creating the user");
      }

      const token = signToken(user);
      return { token, user };
    },
    login: async (_, { usernameOrEmail, password }) => {
      const user = await User.findOne({
        $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
      });

      if (!user) {
        throw new Error("Can't find this user");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new Error("Wrong password!");
      }

      const token = signToken(user);
      return { token, user };
    },
    saveBook: async (_, { book }, { user }) => {
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
    deleteBook: async (_, { bookId }, { user }) => {
      const updatedUser = await User.findOneAndUpdate(
        { _id: user._id },
        { $pull: { savedBooks: { bookId: bookId } } },
        { new: true }
      );

      if (!updatedUser) {
        throw new Error("Couldn't find user with this id");
      }

      return updatedUser;
    },
  },
};

module.exports = resolvers;
