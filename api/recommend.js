const express = require('express');
const asyncHandler = require('express-async-handler');
const crypto = require('crypto');
const recs = require('./recommend_func.js');


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

  await recs(userHash, count, 'personal', false)
    .then((recommendation) => {
      response.send({ recipes: recommendation });
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
  let isAnonymous;

  if (request.openid) {
    userHash = crypto.createHash('sha256').update(request.openid.user.sub).digest('hex');
    isAnonymous = false;
  } else {
    userHash = crypto.createHash('sha256').update('anonymous').digest('hex');
    isAnonymous = true;
  }

  await recs(userHash, count, 'popular', isAnonymous)
    .then((recommendation) => {
      response.send({ recipes: recommendation });
    })
    .catch((err) => {
      if (err) next(err);
    });
}));

module.exports.router = router;
