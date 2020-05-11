/* eslint-disable no-underscore-dangle */
// disabling this because we send requests to the _search endpoint of the ES client
const express = require('express');
const bodyParser = require('body-parser');
const elasticsearch = require('elasticsearch');
const fs = require('fs');
const csv = require('fast-csv');
const path = require('path');
const { auth } = require('express-openid-connect');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

/* setup auth0 middleware with required authentication for all /user/ routes */
app.use(auth({
  required: req => req.originalUrl.startsWith('/api/user/'),
  redirectUriPath: '/'
}));

app.use(express.static(path.join(__dirname, 'build')));

const ingredients = [];
fs.createReadStream('./ingredients.csv')
  .pipe(csv.parse())
  .on('data', (data) => {
    ingredients.push(data[0]);
  });

if (!process.env.ELASTIC_SEARCH_HOST) {
  console.error('missing ELASTIC_SEARCH_HOST');
  process.exit(-1);
}

const esClient = new elasticsearch.Client({
  host: process.env.ELASTIC_SEARCH_HOST,
  log: 'trace',
  apiVersion: '7.2', // use the same version of your Elasticsearch instance
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/resources/ingredients', async (_, response) => {
  response.send({
    items: ingredients,
  });
});


app.post('/api/search/ingredients', async (request, resoponse) => {
  const {
    includeTerms,
    excludeTerms,
    from = 0,
    size = 10,
  } = request.body;

  if (!Array.isArray(includeTerms) || !Array.isArray(excludeTerms)) {
    resoponse.sendStatus(400);
    return;
  }

  const body = {
    query: {
      bool: {
        must: includeTerms.map((term) => ({ match: { ingredients: term } })),
      },
    },
    from,
    size,
  };

  if (excludeTerms.length > 0) {
    body.query.bool.must_not = excludeTerms.map((term) => ({ match: { ingredients: term } }));
  }

  const response = await esClient.search({
    index: 'test-index',
    type: 'recipe',
    body,
  });

  resoponse.send({
    total: response.hits.total,
    items: response.hits.hits.map((e) => e._source),
  });
});

/* test user */
app.get('/api/user/check', async (request, response) => {
  response.send(`hello ${request.openid.user.name}`);
});

app.listen(port, () => console.log(`Listening on port ${port}`));
