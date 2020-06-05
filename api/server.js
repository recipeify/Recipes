/* eslint-disable no-console */
/* eslint no-unused-vars: ["error", { "argsIgnorePattern": "^_" }] */
// disabling this because we send requests to the _search endpoint of the ES client
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { auth } = require('express-openid-connect');
const compression = require('compression');
// eslint-disable-next-line no-unused-vars
const helmet = require('helmet');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

/* compress all routes */
app.use(compression());

/* vulnerability protection */
// app.use(helmet());

/* setup auth0 middleware with required authentication for all /api/users routes */
app.use(auth({
  required: (req) => req.originalUrl.startsWith('/api/users'),
  redirectUriPath: '/',
}));

/* static routes */
app.use(express.static(path.join(__dirname, 'build')));


if (!process.env.ELASTIC_SEARCH_HOST) {
  console.error('missing ELASTIC_SEARCH_HOST');
  process.exit(-1);
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/* users routes */
app.use('/api/users', require('./users/users').router);

/* search routes */
app.use('/api/search', require('./search').router);

/* resources routes */
app.use('/api/resources', require('./resources').router);

/* recommendation routes */
app.use('/api/recommend', require('./recommend').router);

app.listen(port, () => console.log(`Listening on port ${port}`));
