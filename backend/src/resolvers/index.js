const userResolvers = require('./userResolvers');
const employeeResolvers = require('./employeeResolvers');

const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...employeeResolvers.Query
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...employeeResolvers.Mutation
  }
};

module.exports = resolvers;