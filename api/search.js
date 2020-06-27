const express = require('express');
const elasticsearch = require('elasticsearch');
const asyncHandler = require('express-async-handler');
const get = require('lodash/get');

const auth = require('./auth');
const User = require('./users/userModel');

const esClient = new elasticsearch.Client({
  host: process.env.ELASTIC_SEARCH_HOST,
  log: 'trace',
  apiVersion: '7.2', // use the same version of your Elasticsearch instance
});

const router = express.Router();

function isString(value) {
  return typeof value === 'string' || value instanceof String;
}

async function searchFunc(bool, from, size, request) {
  const body = {
    query: {
      boosting: {
        positive: { bool },
        negative: {
          term: {
            image_placeholder_flag: true,
          },
        },
        negative_boost: 0.5,
      },
    },
    from,
    size,
  };

  const query = await esClient.search({
    index: process.env.ELASTIC_SEARCH_INDEX,
    body,
  });

  // eslint-disable-next-line no-underscore-dangle
  let items = query.hits.hits.map((e) => e._source);

  try {
    const user = await auth.checkJwt(request);
    if (user) {
      // TODO: only query relevant items to make this a bit more effcient
      const result = await User.findById(user.sub, 'recipes');
      const savedIds = new Set(result.recipes);
      items = items.map((i) => ({ ...i, isSaved: savedIds.has(i.id) }));
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('failed to check jwt', e);
  }

  return ({
    total: query.hits.total,
    items,
  });
}

async function searchIdFunc(ids) {
  const body = {
    ids,
  };

  const query = await esClient.mget({
    index: process.env.ELASTIC_SEARCH_INDEX,
    body,
  });

  return query;
}

// eslint-disable-next-line no-unused-vars
router.post('/recipes', asyncHandler(async (request, response, _next) => {
  const {
    freeText = '',
    includeTerms = [],
    excludeTerms = [],
    diet = [],
    cuisine = [],
    dishType = [],
    fromCookTime,
    toCookTime,
    from = 0,
    size = 10,
  } = request.body;
  if (!Array.isArray(includeTerms) || !Array.isArray(excludeTerms)
      || !isString(freeText) || !Array.isArray(diet) || !Array.isArray(cuisine)
      || !Array.isArray(dishType)) {
    response.sendStatus(400);
    return;
  }

  const bool = {
    must: includeTerms.map((term) => ({ match: { ingredients: { query: term, fuzziness: 'AUTO:0,4' } } })),
  };

  if (freeText) {
    bool.must.push({
      simple_query_string: {
        query: freeText,
        fields: ['title', 'ingredients', 'tags'],
      },
    });
  }

  if ((fromCookTime != null) && (toCookTime != null)) {
    bool.filter = [
      {
        range: {
          total_time: {
            gte: fromCookTime,
            lte: toCookTime,
          },
        },
      },
    ];
  }

  if (excludeTerms.length > 0) {
    bool.must_not = excludeTerms.map((term) => ({ match: { ingredients: { query: term, fuzziness: 'AUTO:0,4' } } }));
  }

  const dietQueryPart = {
    bool: {
      must: [],
    },
  };
  diet.forEach((item) => {
    if (!get(item, 'tags', null)) {
      dietQueryPart.bool.must.push(
        {
          bool: {
            must: [
              { match: { tags: item.key } },
            ],
          },
        },
      );
    } else {
      dietQueryPart.bool.must.push(
        {
          bool: {
            should: item.tags.map((tag) => ({ match: { tags: tag } })),
            minimum_should_match: 1,
          },
        },
      );
    }
  });
  if (diet.length > 0) {
    bool.must.push(dietQueryPart);
  }

  const dishTypeQueryPart = {
    bool: {
      should: [],
    },
  };
  dishType.forEach((item) => {
    if (!get(item, 'tags', null)) {
      dishTypeQueryPart.bool.should.push(
        {
          bool: {
            must: [
              { match: { tags: item.key } },
            ],
          },
        },
      );
    } else {
      dishTypeQueryPart.bool.should.push(
        {
          bool: {
            should: item.tags.map((tag) => ({ match: { tags: tag } })),
            minimum_should_match: 1,
          },
        },
      );
    }
  });
  if (dishType.length > 0) {
    bool.must.push(dishTypeQueryPart);
  }

  const cuisineQueryPart = {
    bool: {
      should: [],
    },
  };
  cuisine.forEach((item) => {
    if (!get(item, 'tags', null)) {
      cuisineQueryPart.bool.should.push(
        {
          bool: {
            must: [
              { match: { tags: item.key } },
            ],
          },
        },
      );
    } else {
      cuisineQueryPart.bool.should.push(
        {
          bool: {
            should: item.tags.map((tag) => ({ match: { tags: tag } })),
            minimum_should_match: 1,
          },
        },
      );
    }
  });
  if (cuisine.length > 0) {
    bool.must.push(cuisineQueryPart);
  }

  const retval = await searchFunc(bool, from, size, request);

  response.send(retval);
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

  const query = searchIdFunc(ids);

  response.send({
    // eslint-disable-next-line no-underscore-dangle
    items: query.docs.map((e) => e._source),
  });
}));


module.exports = { isString, searchFunc, searchIdFunc };
module.exports.router = router;
