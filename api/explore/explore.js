const express = require('express');
const asyncHandler = require('express-async-handler');
const crypto = require('crypto');
const moment = require('moment');
const holiday = require('./next_holiday_calc');
const recs = require('../recommend.js');
const search = require('../search.js');
const MonthJson = require('./ingredients_of_the_month.json');
const BoxesJson = require('./random_boxes.json');
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

async function GetBoxes(size, Country, request, amount) {
  const monthIngs = MonthJson[new Date().toLocaleDateString('en-GB', { month: 'long' })];
  const keys = Object.keys(BoxesJson);
  let n = size;
  keys.push('ingredient');
  const retval = {};
  const nextHoliday = holiday(Country);
  const boxes = [];
  retval.explore = [];
  const min = Math.min(10, amount);

  if (nextHoliday) {
    const holidayRecipes = await innerSearch(nextHoliday, amount, request);
    if (holidayRecipes.length < min) {
      events.tags.forEach((e) => {
        if (nextHoliday.search(e.key) >= 0) {
          e.tags.forEach(async (t) => {
            const tempAmount = min - holidayRecipes.length;
            holidayRecipes.concat(await innerSearch(t, tempAmount, request));
          });
        }
      });
    }
    if (holidayRecipes.length !== 0) {
      retval.explore.push({ type: 'Next Holiday', name: nextHoliday, recipes: holidayRecipes });
      n -= 1;
    }
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

router.post('/', asyncHandler(async (request, response) => {
  const {
    size = 10,
    Country = '',
    timeString = '',
    amount = 15,
  } = request.body;

  if (!search.isString(Country) || !search.isString(timeString)) {
    response.sendStatus(400);
    return;
  }

  const retval = await GetBoxes(size, Country, request, amount);

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

  const recommendation = await recs.recExplore(userHash, amount);
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

  response.send(retval);
}));

module.exports.router = router;
