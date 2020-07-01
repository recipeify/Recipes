const express = require('express');
const asyncHandler = require('express-async-handler');
const crypto = require('crypto');
const holiday = require('./next_holiday_calc');
const MonthJson = require('./ingredients_of_the_month.json');
const BoxesJson = require('./random_boxes.json');
const recs = require('../recommend.js');
const search = require('../search.js');
const events = require('../resources/events.json');


const router = express.Router();

function randomChoice(arr) {
  const ind = Math.floor(arr.length * Math.random());
  const retval = arr[ind];
  return retval;
}

async function innerSearch(searchString, amount, request) {
  const bool = {
    must: {
      simple_query_string: {
        query: searchString.replace(' |_', '+'),
        fields: ['title', 'ingredients', 'tags'],
      },
    },
  };

  const values = await search.searchFunc(bool, 0, amount, request);
  return values.items;
}

function getBox(keys, monthIngs) {
  const key = randomChoice(keys);
  let box;

  if (key === 'ingredient') {
    box = randomChoice(monthIngs);
  } else {
    box = randomChoice(BoxesJson[key]);
  }
  return { type: key, name: box };
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
  const min = 10;

  if (nextHoliday) {
    const holidayRecipes = await innerSearch(nextHoliday, amount, request);
    if (holidayRecipes.length < min) {
      events.tags.forEach((e) => {
        if (nextHoliday.search(e.key) >= 0) {
          e.tags.forEach(async (t) => {
            holidayRecipes.concat(await innerSearch(t, min - holidayRecipes.length, request));
          });
        }
      });
    }
    retval.explore.push({ type: 'Next Holiday', name: nextHoliday, recipes: holidayRecipes });
    n -= 1;
  }

  // Get the n random boxes
  while (n > 0) {
    const box = getBox(keys, monthIngs);
    // To avoid repetitions
    if (!boxes.includes(box)) {
      boxes.push(box);
      n -= 1;
    }
  }

  // Fill the boxes
  boxes.forEach(async (box) => {
    const res = await innerSearch(box.name, amount, request);
    if (res.length >= min) {
      retval.explore.push({ type: box.type, name: box.name, recipes: res });
    } else {
      // Get a different box, hopefully one with more recipes.
      const newBox = getBox(keys, monthIngs);
      // To avoid repetitions
      if (!boxes.includes(box)) {
        boxes.push(newBox);
      }
    }
  });

  return retval;
}

router.post('/', asyncHandler(async (request, response, next) => {
  const {
    size = 10,
    dateString = '',
    amount = 15,
  } = request.body;

  if (!search.isString(dateString)) {
    response.sendStatus(400);
    return;
  }

  let retval;

  await GetBoxes(size, dateString, request, amount)
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

  await recs.recExplore(userHash, amount)
    .then(async (recommendation) => {
      if (recommendation.personal.recipes.length !== 0) {
        let temp = recommendation.personal.recipes.recomms.map((j) => j.id);
        temp = await search.searchIdFunc(temp);
        retval.personal = temp.docs;
      }
      if (recommendation.popular.recipes.length !== 0) {
        let temp = recommendation.popular.recipes.recomms.map((j) => j.id);
        temp = await search.searchIdFunc(temp);
        retval.popular = temp.docs;
      }
    })
    .catch((err) => {
      if (err) next(err);
    });

  response.send(retval);
}));

module.exports.router = router;
