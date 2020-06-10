/* eslint-disable no-console */
/* eslint no-unused-vars: ["error", { "argsIgnorePattern": "^_" }] */
// disabling this because we send requests to the _search endpoint of the ES client
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const compression = require('compression');
// eslint-disable-next-line no-unused-vars
const helmet = require('helmet');
const asyncHandler = require('express-async-handler');

// call this before importing modules that depend on env
require('dotenv').config();

const auth = require('./auth');

const app = express();
const port = process.env.PORT || 5000;

/* compress all routes */
app.use(compression());

/* vulnerability protection */
// app.use(helmet());

/* static routes */
app.use(express.static(path.join(__dirname, 'build')));


if (!process.env.ELASTIC_SEARCH_HOST) {
  console.error('missing ELASTIC_SEARCH_HOST');
  process.exit(-1);
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/login', asyncHandler(async (_request, response, _next) => {
  response.redirect(`${process.env.ISSUER_BASE_URL}/authorize`);
}));

/* users routes */
app.use('/api/users', auth.enforceJwt, require('./users/users').router);

/* search routes */
app.use('/api/search', require('./search').router);

/* resources routes */
app.use('/api/resources', require('./resources').router);

/* recommendation routes */
app.use('/api/recommend', require('./recommend').router);

/* explore routes */
app.use('/api/explore', require('./explore/explore').router);

app.listen(port, () => console.log(`Listening on port ${port}`));
