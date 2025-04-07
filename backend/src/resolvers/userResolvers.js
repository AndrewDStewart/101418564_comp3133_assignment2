const { AuthenticationError, UserInputError } = require('apollo-server-express');
const User = require('../models/User');
const { generateToken } = require('../utils/auth');

const userResolvers = {
  Query: {
    me: async (_, __, { user }) => {
      if (!user) {
        throw new AuthenticationError('Not authenticated');
      }
      
      return await User.findById(user.id);
    }
  },
  
  Mutation: {
    signup: async (_, { username, email, password }) => {
      // Check if username or email already exists
      const existingUser = await User.findOne({ $or: [{ username }, { email }] });
      if (existingUser) {
        throw new UserInputError('Username or email already taken');
      }
      
      // Create new user
      const newUser = new User({ username, email, password });
      await newUser.save();
      
      // Generate JWT token
      const token = generateToken(newUser);
      
      return {
        token,
        user: newUser
      };
    },
    
    login: async (_, { username, password }) => {
      // Find user by username
      const user = await User.findOne({ username });
      if (!user) {
        throw new UserInputError('Invalid username or password');
      }
      
      // Check password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        throw new UserInputError('Invalid username or password');
      }
      
      // Generate JWT token
      const token = generateToken(user);
      
      return {
        token,
        user
      };
    }
  }
};

module.exports = userResolvers;