const express = require('express');
const asyncHandler = require('express-async-handler');
const crypto = require('crypto');
const holiday = require('./next_holiday_calc');
const MonthJson = require('./ingredients_of_the_month.json');
const BoxesJson = require('./random_boxes.json');
const recs = require('../recommend.js');
const search = require('../search.js');


const router = express.Router();

function randomChoice(arr) {
  const ind = Math.floor(arr.length * Math.random());
  const retval = arr[ind];
  return retval;
}

function innerSearch(searchString, amount, request) {
  const bool = {
    must: {
      simple_query_string: {
        query: searchString,
        fields: ['title', 'ingredients', 'tags'],
      },
    },
  };

  const values = search.searchFunc(bool, 0, amount, request)
  return values.items;
}

async function GetBoxes(size, dateString, request, amount) {
  const monthIngs = MonthJson[new Date().toLocaleDateString('default', { month: 'long' })];
  const keys = Object.keys(BoxesJson);
  let n = size;
  keys.push('ingredient');
  const retval = {};
  const nextHoliday = holiday(dateString);
  const boxes = [];
  retval.explore = [];

  if (nextHoliday) {
    const holidayRecipes = innerSearch(nextHoliday, amount, request);
    retval.explore.push({ name: nextHoliday, recipes: holidayRecipes });
    n -= 1;
  }

  // Get the n random boxes
  while (n > 0) {
    const key = randomChoice(keys);
    let box;

    if (key === 'ingredient') {
      box = randomChoice(monthIngs);
    } else {
      box = randomChoice(BoxesJson[key]);
    }

    // To avoid repetitions
    if (!boxes.includes(box)) {
      boxes.push(box);
      n -= 1;
    }
  }

  // Fill the boxes
  boxes.forEach((box) => (
    retval.explore.push({ name: box, recipes: innerSearch(box, amount, request) })));

  return retval;
}

router.post('/', asyncHandler(async (request, response, next) => {
  const {
    size = 10,
    dateString,
  } = request.body;

  if (!search.isString(dateString)) {
    response.sendStatus(400);
    return;
  }

  let retval;

  GetBoxes(size, dateString, request)
    .then((boxes) => {
      retval = boxes;
    })
    .catch((err) => {
      throw (err);
    });

  let userHash;

  if (request.openid) {
    userHash = crypto.createHash('sha256').update(request.openid.user.sub).digest('hex');
  } else {
    userHash = crypto.createHash('sha256').update('anonymous').digest('hex');
  }

  recs.recExplore(userHash, size)
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
