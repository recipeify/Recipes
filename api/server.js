/* eslint-disable no-underscore-dangle */
// disabling this because we send requests to the _search endpoint of the ES client
const express = require('express');
const bodyParser = require('body-parser');
const elasticsearch = require('elasticsearch');
const fs = require('fs');
const path = require('path');
const { auth } = require('express-openid-connect');
const asyncHandler = require('express-async-handler')

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

/* setup auth0 middleware with required authentication for all /user/ routes */
app.use(auth({
  required: req => req.originalUrl.startsWith('/api/user/'),
  redirectUriPath: '/'
}));

app.use(express.static(path.join(__dirname, 'build')));

const rawData = fs.readFileSync('ingredients.json');
const ingredients = JSON.parse(rawData);

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

app.get('/api/resources/ingredients', asyncHandler(async (request, resoponse, next) => {
  response.send({
    items: ingredients.ingredients,
  });
}));

function isString (value) {
  return typeof value === 'string' || value instanceof String;
}

app.post('/api/search/recipes', asyncHandler(async (request, resoponse, next) => {
  const {
    freeText,
    includeTerms,
    excludeTerms,
    fromCookTime = 0,
    toCookTime = 600,
    tags,
    diet,
    from = 0,
    size = 10,
  } = request.body;

  if (!Array.isArray(includeTerms) || !Array.isArray(excludeTerms) ||
      !isString(freeText) || !Array.isArray(tags) || !Array.isArray(diet)) {
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

 if (freeText) {
    body.query.bool.must.push({'simple_query_string' : {
      query: freeText,
      fields: ['title','ingredients'],
    }})
  };

  body.query.bool.filter = {
    range : {
      total_time : {
        gte: fromCookTime,
        lte: toCookTime,
      },
    },
  };

  if (excludeTerms.length > 0) {
    body.query.bool.must_not = excludeTerms.map((term) => ({ match: { ingredients: term } }));
  }

  if (diet.length > 0) {
    body.query.bool.must = diet.map((term) => ({ match: { diet: term } }));
  }

  if (tags.length > 0) {
    body.query.bool.must = excludeTerms.map((term) => ({ match: { tags: term } }));
  }

  const response = await esClient.search({
    index: 'test-index',
    body,
  });

  resoponse.send({
    total: response.hits.total,
    items: response.hits.hits.map((e) => e._source),
  });
}));

/* test user */
app.get('/api/user/check', async (request, response) => {
  response.send(`hello ${request.openid.user.name}`);
});

app.listen(port, () => console.log(`Listening on port ${port}`));
