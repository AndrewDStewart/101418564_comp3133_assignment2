const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    createdAt: String!
  }

  type Employee {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    position: String!
    department: String!
    profilePicture: String
    createdAt: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    # User queries
    me: User
    
    # Employee queries
    employees: [Employee!]!
    employee(id: ID!): Employee
    searchEmployees(department: String, position: String): [Employee!]!
  }

  type Mutation {
    # User mutations
    signup(username: String!, email: String!, password: String!): AuthPayload!
    login(username: String!, password: String!): AuthPayload!
    
    # Employee mutations
    addEmployee(
      firstName: String!
      lastName: String!
      email: String!
      position: String!
      department: String!
      profilePicture: String
    ): Employee!
    
    updateEmployee(
      id: ID!
      firstName: String!
      lastName: String!
      email: String!
      position: String!
      department: String!
      profilePicture: String
    ): Employee!
    
    deleteEmployee(id: ID!): Employee!
  }
`;

module.exports = typeDefs;