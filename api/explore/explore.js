const express = require('express');
const asyncHandler = require('express-async-handler');
const crypto = require('crypto');
const holiday = require('./next_holiday_calc');
const MonthJson = require('./ingredients_of_the_month.json');
const BoxesJson = require('./random_boxes.json');
const recs = require('../recommend_func.js');


const router = express.Router();

function randomChoice(arr, del) {
  const ind = Math.floor(arr.length * Math.random());
  const retval = arr[ind];
  if (del) {
    // To avoid repetitions, the arrays will get smaller as we go.
    arr.splice(ind, 1);
  }
  return retval;
}

function GetBoxes(size, dateString) {
  const monthIngs = MonthJson[new Date(dateString).toLocaleDateString('default', { month: 'long' })];
  const keys = Object.keys(BoxesJson);
  let n = size;
  keys.push('ingredient');
  const retval = {};

  if (holiday(dateString)) {
    retval['next holiday'] = holiday(dateString);
    n -= 1;
  }

  while (n > 0) {
    const key = randomChoice(keys, false);
    if (key === 'ingredient') {
      retval.ingredient.push(randomChoice(monthIngs, true));
    } else {
      retval[key].push(randomChoice(BoxesJson[key], true));
    }
    n -= 1;
  }

  return retval;
}

router.post('/explore', asyncHandler(async (request, response, next) => {
  const {
    count = 10,
    dateString,
  } = request.body;

  // eslint-disable-next-line no-restricted-globals
  if (isNaN(new Date(dateString)) || Number.isInteger(count)) {
    response.sendStatus(400);
    return;
  }

  const retval = GetBoxes(count, dateString);

  let userHash;
  let isAnonymous;

  if (request.openid) {
    userHash = crypto.createHash('sha256').update(request.openid.user.sub).digest('hex');
    isAnonymous = false;
  } else {
    userHash = crypto.createHash('sha256').update('anonymous').digest('hex');
    isAnonymous = true;
  }

  await recs(userHash, count, 'explore', isAnonymous)
    .then((recommendation) => {
      retval.personal = recommendation.personal;
      retval.popular = recommendation.popular;
    })
    .catch((err) => {
      if (err) next(err);
    });


  response.send(retval);
}));

module.exports.router = router;
