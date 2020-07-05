const express = require('express');
const asyncHandler = require('express-async-handler');
const crypto = require('crypto');
const moment = require('moment');
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

async function innerSearch(searchString, amount, request) {
  const bool = {
    must: {
      simple_query_string: {
        query: searchString.replace(' ', '+'),
        fields: ['title', 'ingredients', 'tags'],
      },
    },
  };

  const values = await search.searchFunc(bool, 0, amount, request);
  return values.items;
}

function mealByTime(timeString) {
  let nextMeal = '';
  let greet = '';
  const format = 'HH:mm:ss';
  const time = moment(timeString, format);

  if (time.isBetween(moment('05:00:00', format), moment('09:59:59', format), null, '[]')) {
    nextMeal = 'Breakfast';
    greet = 'Good Morning, try breakfast recipes:';
  } else if (time.isBetween(moment('10:00:00', format), moment('11:59:59', format), null, '[]')) {
    nextMeal = 'Brunch';
    greet = 'Good Morning, try brunch recipes:';
  } else if (time.isBetween(moment('12:00:00', format), moment('16:59:59', format), null, '[]')) {
    nextMeal = 'Lunch';
    greet = 'Good Afternoon, try lunch recipes:';
  } else if (time.isBetween(moment('17:00:00', format), moment('20:59:59', format), null, '[]')) {
    nextMeal = 'Dinner';
    greet = 'Good Evening, try dinner recipes:';
  } else if (time.isBetween(moment('21:00:00', format), moment('04:59:59', format), null, '[]')) {
    nextMeal = 'Night Snack';
    greet = 'Good Night, try night snack recipes:';
  }
  return { name: greet, recipes: nextMeal };
}

async function GetBoxes(size, Country, request, amount) {
  const monthIngs = MonthJson[new Date().toLocaleDateString('default', { month: 'long' })];
  const keys = Object.keys(BoxesJson);
  let n = size;
  keys.push('ingredient');
  const retval = {};
  const nextHoliday = holiday(Country);
  const boxes = [];
  retval.explore = [];

  if (nextHoliday) {
    const holidayRecipes = await innerSearch(nextHoliday, amount, request);
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
  boxes.forEach(async (box) => {
    const res = await innerSearch(box, amount, request);
    const title = box.concat(' recipes:');
    retval.explore.push({ name: title, recipes: res });
  });

  return retval;
}

router.post('/', asyncHandler(async (request, response, next) => {
  const {
    size = 10,
    Country = '',
    timeString = '',
    amount = 30,
  } = request.body;

  if (!search.isString(Country) || !search.isString(timeString)) {
    response.sendStatus(400);
    return;
  }

  let retval;

  await GetBoxes(size, Country, request, amount)
    .then((boxes) => {
      retval = boxes;
    })
    .catch((err) => {
      throw (err);
    });

  const nextMeal = mealByTime(timeString);
  nextMeal.recipes = await innerSearch(nextMeal.recipes, amount, request);

  if (nextMeal.recipes.length !== 0) {
    retval.mealByTime = nextMeal;
  }

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
