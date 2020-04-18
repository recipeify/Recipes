/* eslint-disable no-underscore-dangle */
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
  const { terms, from = 0, size = 10 } = request.body;

  if (!Array.isArray(terms)) {
    resoponse.sendStatus(400);
    return;
  }

  const response = await esClient.search({
    index: 'test-index',
    type: 'recipe',
    body: {
      query: {
        bool: {
          must: terms.map((term) => ({ match: { ingredients: term } })),
        },
      },
      from,
      size,
    },
  });

  resoponse.send({
    total: response.hits.total,
    items: response.hits.hits.map((e) => e._source),
  });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
