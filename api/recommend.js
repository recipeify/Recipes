const express = require('express');
const asyncHandler = require('express-async-handler');
const recombee = require('recombee-api-client');
const crypto = require('crypto');

const rqs = recombee.requests;
const recombeeClient = new recombee.ApiClient(process.env.RECOMBEE_DATABASE_ID,
  process.env.RECOMBEE_PRIVATE_TOKEN);


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
  await recombeeClient.send(
    new rqs.RecommendItemsToUser(userHash, count, { scenario: 'personal_view' }),
  )
    .then((recommendation) => {
      response.send({ recipes: recommendation.recomms.map((e) => e.id) || [] });
    })
    .catch(() => {
      recombeeClient.send(
        new recombee.RecommendItemsToUser(userHash, count, { scenario: 'homepage_view' }),
      );
    })
    .then((recommendation) => {
      response.send({ recipes: recommendation.recomms.map((e) => e.id) || [] });
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

  await recombeeClient.send(
    new rqs.RecommendItemsToUser(userHash, count, { scenario: 'popular_view' }),
  )
    .then((recommendation) => {
      response.send({ recipes: recommendation.recomms.map((e) => e.id) || [] });
    })
    .catch(() => response.send({ recipes: [] }))
    .catch((err) => {
      if (err) next(err);
    });
}));

module.exports.router = router;
