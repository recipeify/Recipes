const express = require('express');
const elasticsearch = require('elasticsearch');
const asyncHandler = require('express-async-handler');

const router = express.Router();

const esClient = new elasticsearch.Client({
  host: process.env.ELASTIC_SEARCH_HOST,
  log: 'trace',
  apiVersion: '7.2', // use the same version of your Elasticsearch instance
});

function isString(value) {
  return typeof value === 'string' || value instanceof String;
}

// eslint-disable-next-line no-unused-vars
router.post('/recipes', asyncHandler(async (request, response, _next) => {
  const {
    freeText = '',
    includeTerms = [],
    excludeTerms = [],
    fromCookTime = 0,
    toCookTime = 600,
    tags = [],
    diet = [],
    from = 0,
    size = 10,
  } = request.body;

  if (!Array.isArray(includeTerms) || !Array.isArray(excludeTerms)
        || !isString(freeText) || !Array.isArray(tags) || !Array.isArray(diet)) {
    response.sendStatus(400);
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
    body.query.bool.must.push({
      simple_query_string: {
        query: freeText,
        fields: ['title', 'ingredients', 'tags', 'diet'],
      },
    });
  }

  body.query.bool.filter = [
    {
      bool: {
        should: [
          {
            range: {
              total_time: {
                gte: fromCookTime,
                lte: toCookTime,
              },
            },
          },
          {
            bool: {
              must_not: {
                exists: {
                  field: 'total_time',
                },
              },
            },
          },
        ],
      },
    },
  ];

  if (excludeTerms.length > 0) {
    body.query.bool.must_not = excludeTerms.map((term) => ({ match: { ingredients: term } }));
  }

  if (diet.length > 0) {
    body.query.bool.must = diet.map((term) => ({ match: { diet: term } }));
  }

  if (tags.length > 0) {
    body.query.bool.must = tags.map((term) => ({ match: { tags: term } }));
  }

  const query = await esClient.search({
    index: process.env.ELASTIC_SEARCH_INDEX,
    body,
  });

  response.send({
    total: query.hits.total,
    // eslint-disable-next-line no-underscore-dangle
    items: query.hits.hits.map((e) => e._source),
  });
}));

// eslint-disable-next-line no-unused-vars
router.post('/ids', asyncHandler(async (request, response, _next) => {
  const {
    ids,
  } = request.body;

  if (!Array.isArray(ids)) {
    response.sendStatus(400);
    return;
  }

  const body = {
    ids,
  };

  const query = await esClient.mget({
    index: process.env.ELASTIC_SEARCH_INDEX,
    body,
  });

  response.send({
    // eslint-disable-next-line no-underscore-dangle
    items: query.docs.map((e) => e._source),
  });
}));

module.exports.router = router;
