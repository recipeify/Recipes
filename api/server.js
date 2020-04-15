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

app.get('/api/search/ingredient', async (req, res) => {

  const { q, from = 0, size = 10 } = req.query;

  if (!q) {
    res.sendStatus(400);
    return;
  }

  const response = await esClient.search({
    index: 'test-index',
    type: 'recipe',
    body: {
      query: {
        match: {
          ingredients: q
        }
      },
      from,
      size
    }
  })
   
  // for (const hit of response.hits.hits) {
  //   console.log('hit:', hit);
  // }

  res.send(response.hits);
});

app.listen(port, () => console.log(`Listening on port ${port}`));