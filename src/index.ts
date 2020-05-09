import * as mongoose from 'mongoose';
import * as cors from 'cors';
import 'reflect-metadata';

import authRouter from './routes/authorization.routes';
import Schema from './schemas/schema';

require('dotenv').config();

import express = require('express');
import graphQLHTTP = require('express-graphql');

mongoose.connect(process.env.DB_URI, {
  auth: { user: process.env.DB_USER, password: process.env.DB_PASS },
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use('/api/auth', authRouter);

app.use(
  '/api/graphql',
  graphQLHTTP({
    schema: Schema,
    graphiql: true,
  }),
);

// eslint-disable-next-line no-console
app.listen(port, () => console.log(`Spoti Stats server running on port ${port}`));
