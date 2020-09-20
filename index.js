const express = require('express');
const { ApolloServer, AuthenticationError } = require('apollo-server-express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const config = require('./config/env');
const jwt = require('jsonwebtoken');

// Apollo server Schema
const typeDefs = require('./db/schema');
const resolvers = require('./db/resolvers');

// routes
const authRoutes = require('./routes/auth');

// DB connection
const connectionDB = require('./config/db');

// Initializing connection to DB
connectionDB();

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(
  cors({
    origin: ['http://localhost:3000'],
    credentials: true
  })
);
app.use(cookieParser());

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.cookies.token || '';
    // Dev
    if (token) {
      const { sub: id, name, email } = jwt.verify(token, config.jwtSecret);
      if (!id || !name || !email) {
        throw new AuthenticationError(
          'Authentication token is invalid, please sign in'
        );
      }
      return { user: { id, name, email } };
    }
    // Prod
    // try {
    //   return ({ id, email, name } = jwt.verify(token, config.jwtSecret));
    // } catch (e) {
    //   throw new AuthenticationError(
    //     'Authentication token is invalid, please log in'
    //   );
    // }
  }
});

server.applyMiddleware({ app });

// Auth routes
app.use('/auth', authRoutes);

const port = config.port || 4000;

app.listen({ port }, () => {
  console.log(
    `Server running on port http://localhost:${port}${server.graphqlPath}`
  );
});
