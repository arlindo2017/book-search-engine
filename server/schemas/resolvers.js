const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    // This is to test Front end, not needed for this challenge
    users: async () => {
      return User.find();
    },
    //Finds user from the context
    me: async (parent, args, context) => {
      if (context.user) {
        console.log('me query ran');
        return User.findOne({ _id: context.user._id });
      }
      throw new AuthenticationError('You need to be logged in!');
    },
  },

  Mutation: {
    // Add user functionality
    addUser: async (parent, { username, email, password }) => {
      try {
        const user = await User.create({ username, email, password });
        const token = signToken(user);
        return { token, user };
      } catch (err) {
        console.error(err);
        throw new Error('Error while adding the user');
      }
    },
    // Login functionality, and checks password
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('No user with this email found!');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect password!');
      }

      const token = signToken(user);
      return { token };
    },
    // Save Book functionality
    saveBook: async (
      parent,
      { authors, description, title, bookId, image, link },
      context
    ) => {
      if (context.user) {
        try {
          const book = {
            authors,
            description,
            title,
            bookId,
            image,
            link,
          };

          const updatedUser = await User.findOneAndUpdate(
            { _id: context.user._id },
            { $addToSet: { savedBooks: book } },
            { new: true }
          );

          return updatedUser;
        } catch (err) {
          console.error(err);
          throw new Error('Error while saving the book');
        }
      }

      throw new AuthenticationError('Login required');
    },
    // Remove book functionality
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
          throw new Error('Error while deleting the book');
        }
      }
      throw new AuthenticationError('Login required');
    },
  },
};

module.exports = resolvers;
