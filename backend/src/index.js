require('dotenv').config();
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const cors = require('cors');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const { getUser } = require('./utils/auth');
const MONGODB_URI = process.env.MONGODB_URI;

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

async function startServer() {
  // Initialize Express
  const app = express();
  
  // Apply middleware
  app.use(cors());
  app.use(express.json({ limit: '50mb' }));
  
  // Create Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
      // Get user from token
      const user = await getUser(req);
      return { user };
    }
  });
  
  await server.start();
  
  // Apply Apollo middleware
  server.applyMiddleware({ app });
  
  // Start server
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startServer();