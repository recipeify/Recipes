/* eslint-disable no-underscore-dangle */
// disabling this because we send requests to the _search endpoint of the ES client
const express = require('express');
const bodyParser = require('body-parser');
const elasticsearch = require('elasticsearch');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

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

app.listen(port, () => console.log(`Listening on port ${port}`));
