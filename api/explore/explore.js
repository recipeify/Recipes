const express = require('express');
const asyncHandler = require('express-async-handler');
const crypto = require('crypto');
const holiday = require('./next_holiday_calc');
const MonthJson = require('./ingredients_of_the_month.json');
const BoxesJson = require('./random_boxes.json');
const recs = require('../recommend.js');
const search = require('../search.js');


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

async function innerSearch(searchString, amount, request) {
  const bool = {
    must: {
      simple_query_string: {
        query: searchString,
        fields: ['title', 'ingredients', 'tags'],
      },
    },
  };

  await search.searchFunc(bool, 0, amount, request)
    .then((values) => values)
    .catch((err) => {
      throw (err);
    });
}

async function GetBoxes(size, dateString, request, amount) {
  const monthIngs = MonthJson[new Date().toLocaleDateString('default', { month: 'long' })];
  const keys = Object.keys(BoxesJson);
  let n = size;
  keys.push('ingredient');
  const retval = {};
  const nextHoliday = holiday(dateString);

  if (nextHoliday) {
    const holidayRecipes = await innerSearch(holiday(dateString), amount, request);
    retval['next holiday'] = { name: nextHoliday, recipes: holidayRecipes };
    n -= 1;
  }

  while (n > 0) {
    const key = randomChoice(keys, false);
    let box;

    if (key === 'ingredient') {
      box = randomChoice(monthIngs, true);
    } else {
      box = randomChoice(BoxesJson[key], true);
    }

    // eslint-disable-next-line no-await-in-loop
    const values = await innerSearch(box, amount, request);

    if (!retval[key]) {
      retval[key] = [];
    }
    retval[key].push({ name: box, recipes: values });

    n -= 1;
  }

  return retval;
}

router.post('/explore', asyncHandler(async (request, response, next) => {
  const {
    size = 10,
    dateString = '',
  } = request.body;

  // eslint-disable-next-line no-restricted-globals
  if (!search.isString(dateString) || Number.isInteger(size)) {
    response.sendStatus(400);
    return;
  }

  let retval;

  await GetBoxes(size, dateString, request)
    .then((boxes) => {
      retval = boxes;
    })
    .catch((err) => {
      throw (err);
    });

  let userHash;
  let isAnonymous;

  if (request.openid) {
    userHash = crypto.createHash('sha256').update(request.openid.user.sub).digest('hex');
    isAnonymous = false;
  } else {
    userHash = crypto.createHash('sha256').update('anonymous').digest('hex');
    isAnonymous = true;
  }

  await recs.recExplore(userHash, size, isAnonymous)
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
