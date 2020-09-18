const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const config = require('./config/env');

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

const port = config.port || 4002;

app.listen({ port }, () => {
  console.log(`Server running on port ${port}`);
});
