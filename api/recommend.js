const express = require('express');
const asyncHandler = require('express-async-handler');
const crypto = require('crypto');
const recombee = require('recombee-api-client');

const rqs = recombee.requests;
const recombeeClient = new recombee.ApiClient(process.env.RECOMBEE_DATABASE_ID,
  process.env.RECOMBEE_PRIVATE_TOKEN);

async function recPersonal(userHash, count) {
  let result;
  await recombeeClient.send(
    new rqs.RecommendItemsToUser(userHash, count, { scenario: 'personal_view' }),
  )
    .then((recommendation) => {
      result = { recipes: recommendation.recomms || [] };
    })
    .catch(() => {
      recombeeClient.send(
        new recombee.RecommendItemsToUser(userHash, count, { scenario: 'homepage_view' }),
      );
    })
    .then((recommendation) => {
      result = { recipes: recommendation.recomms || [] };
    })
    .catch((err) => {
      throw (err);
    });
  return result;
}

async function recPopular(userHash, count) {
  let result;
  await recombeeClient.send(
    new rqs.RecommendItemsToUser(userHash, count, { scenario: 'popular_view' }),
  )
    .then((recommendation) => {
      result = { recipes: recommendation.recomms || [] };
    })
    .catch(() => { result = { recipes: [] }; })
    .catch((err) => {
      throw (err);
    });
  return result;
}


async function recExplore(userHash, count) {
  const result = { personal: [], popular: [] };

  await recPersonal(userHash, count)
    .then((res) => { result.personal = res; })
    .catch((err) => {
      throw (err);
    });

  await recPopular(userHash, count)
    .then((res) => { result.popular = res; })
    .catch((err) => {
      throw (err);
    });
  return result;
}


const router = express.Router();

router.post('/personal', asyncHandler(async (request, response, next) => {
  const {
    count = 10,
  } = request.body;

  if (!request.openid) {
    response.sendStatus(403);
    return;
  }

  const userHash = crypto.createHash('sha256').update(request.openid.user.sub).digest('hex');

  await recPersonal(userHash, count)
    .then((recommendation) => {
      response.send({ recipes: recommendation.map((e) => e.id) });
    })
    .catch((err) => {
      if (err) next(err);
    });
}));

router.post('/popular', asyncHandler(async (request, response, next) => {
  const {
    count = 10,
  } = request.body;

  let userHash;

  if (request.openid) {
    userHash = crypto.createHash('sha256').update(request.openid.user.sub).digest('hex');
  } else {
    userHash = crypto.createHash('sha256').update('anonymous').digest('hex');
  }

  await recPopular(userHash, count)
    .then((recommendation) => {
      response.send({ recipes: recommendation.map((e) => e.id) });
    })
    .catch((err) => {
      if (err) next(err);
    });
}));

module.exports = { recPersonal, recPopular, recExplore };
module.exports.router = router;
