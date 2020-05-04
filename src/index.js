require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const graphQLHTTP = require('express-graphql');
const cors = require('cors');

const historyRouter = require('./routes/play-history');
const authRouter = require('./routes/authorization');
const Schema = require('./schemas/schema');
// import historyRouter from './routes/play-history';
// import authRouter from './routes/authorization';

mongoose.connect(process.env.DB_URI, {
  auth: { user: process.env.DB_USER, password: process.env.DB_PASS },
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
const app = express();
const port = process.env.PORT || 8888;

app.use(cors());
app.use('/api/auth', authRouter);
// app.use('/api/user', historyRouter);

app.use('/api/graphql', graphQLHTTP({
  schema: Schema,
  graphiql: true,
}));


app.listen(port, () => console.log(`Spoti stats server running on port ${port}`));
