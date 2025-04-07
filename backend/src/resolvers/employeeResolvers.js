const { AuthenticationError, UserInputError } = require('apollo-server-express');
const Employee = require('../models/Employee');
const { requireAuth } = require('../utils/auth');

const employeeResolvers = {
  Query: {
    employees: async (_, __, { user }) => {
      requireAuth(user);
      return await Employee.find({}).sort({ createdAt: -1 });
    },
    
    employee: async (_, { id }, { user }) => {
      requireAuth(user);
      
      const employee = await Employee.findById(id);
      if (!employee) {
        throw new Error('Employee not found');
      }
      
      return employee;
    },
    
    searchEmployees: async (_, { department, position }, { user }) => {
      requireAuth(user);
      
      const query = {};
      if (department) query.department = department;
      if (position) query.position = position;
      
      return await Employee.find(query).sort({ createdAt: -1 });
    }
  },
  
  Mutation: {
    addEmployee: async (_, args, { user }) => {
      requireAuth(user);
      
      // Check if email already exists
      const existingEmployee = await Employee.findOne({ email: args.email });
      if (existingEmployee) {
        throw new UserInputError('Email already in use');
      }
      
      // Create new employee
      const newEmployee = new Employee(args);
      await newEmployee.save();
      
      return newEmployee;
    },
    
    updateEmployee: async (_, { id, ...updates }, { user }) => {
      requireAuth(user);
      
      // Check if employee exists
      const employee = await Employee.findById(id);
      if (!employee) {
        throw new Error('Employee not found');
      }
      
      // Check if email is being changed and if it's already in use
      if (updates.email && updates.email !== employee.email) {
        const existingEmployee = await Employee.findOne({ email: updates.email });
        if (existingEmployee) {
          throw new UserInputError('Email already in use');
        }
      }
      
      // Update employee
      const updatedEmployee = await Employee.findByIdAndUpdate(
        id,
        { ...updates },
        { new: true, runValidators: true }
      );
      
      return updatedEmployee;
    },
    
    deleteEmployee: async (_, { id }, { user }) => {
      requireAuth(user);
      
      // Check if employee exists
      const employee = await Employee.findById(id);
      if (!employee) {
        throw new Error('Employee not found');
      }
      
      // Delete employee
      await Employee.findByIdAndDelete(id);
      
      return employee;
    }
  }
};

module.exports = employeeResolvers;