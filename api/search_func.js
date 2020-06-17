const elasticsearch = require('elasticsearch');

const auth = require('./auth');
const User = require('./users/userModel');

const esClient = new elasticsearch.Client({
  host: process.env.ELASTIC_SEARCH_HOST,
  log: 'trace',
  apiVersion: '7.2', // use the same version of your Elasticsearch instance
});

// eslint-disable-next-line no-unused-vars
async function searchFunc(bool, from, size) {
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

  return (query.hits);
}

module.exports = searchFunc;
