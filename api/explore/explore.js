const express = require('express');
const asyncHandler = require('express-async-handler');
const crypto = require('crypto');
const moment = require('moment');
const get = require('lodash/get');

const holiday = require('./next_holiday_calc');
const recs = require('../recommend.js');
const search = require('../search.js');
const MonthJson = require('./ingredients_of_the_month.json');
const BoxesJson = require('./random_boxes.json');
const events = require('../resources/events.json');

const auth = require('../auth');
const User = require('../users/userModel');

const router = express.Router();

function randomChoice(arr) {
  const ind = Math.floor(arr.length * Math.random());
  const retval = arr[ind];
  return retval;
}

async function innerSearch(searchString, amount, request) {
  const bool = {
    must: [{
      simple_query_string: {
        query: searchString.replace(' |_', '+'),
        fields: ['title', 'ingredients', 'tags'],
      },
    }],
  };

  try {
    const user = await auth.checkJwt(request);
    if (user) {
      await User.findById(user.sub, 'excludeTerms diet', (err, prefs) => {
        if (err) throw (err);
        if (prefs.excludeTerms.length > 0) {
          bool.must_not = prefs.excludeTerms.map((term) => ({ match: { ingredients: { query: term, fuzziness: 'AUTO:0,4' } } }));
        }
        if (prefs.diet.length > 0) {
          const dietQueryPart = {
            bool: {
              must: [],
            },
          };
          prefs.diet.forEach((item) => {
            if (!get(item, 'tags', null)) {
              dietQueryPart.bool.must.push(
                {
                  bool: {
                    must: [
                      { match: { tags: item } },
                    ],
                  },
                },
              );
            } else {
              dietQueryPart.bool.must.push(
                {
                  bool: {
                    should: item.tags.map((tag) => ({ match: { tags: tag } })),
                    minimum_should_match: 1,
                  },
                },
              );
            }
          });
          bool.must.push(dietQueryPart);
        }
      });
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('failed to check jwt', e);
  }

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
    greet = 'Good morning! here are some breakfast recipes';
  } else if (time.isBetween(moment('10:00:00', format), moment('11:59:59', format), null, '[]')) {
    nextMeal = 'Brunch';
    greet = 'Good morning! here are some brunch recipes';
  } else if (time.isBetween(moment('12:00:00', format), moment('16:59:59', format), null, '[]')) {
    nextMeal = 'Lunch';
    greet = 'Good afternoon! here are some lunch recipes';
  } else if (time.isBetween(moment('17:00:00', format), moment('20:59:59', format), null, '[]')) {
    nextMeal = 'Dinner';
    greet = 'Good evening! here are some dinner recipes';
  } else if (time.isBetween(moment('21:00:00', format), moment('23:59:59', format), null, '[]')) {
    nextMeal = 'Night Snack';
    greet = 'Good night! here are some night snack recipes';
  } else if (time.isBetween(moment('00:00:00', format), moment('04:59:59', format), null, '[]')) {
    nextMeal = 'Night Snack';
    greet = 'Good night! here are some night snack recipes';
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

async function GetBoxes(size, dateString, request, amount) {
  const monthIngs = MonthJson[new Date().toLocaleDateString('en-GB', { month: 'long' })];
  const keys = Object.keys(BoxesJson);
  let n = size;
  keys.push('ingredient');
  const retval = {};
  const nextHoliday = holiday(dateString);
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

  const retval = await GetBoxes(size, dateString, request, amount);

  const nextMeal = mealByTime(new Date(dateString).toTimeString().substr(0, 8));
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

  try {
    const recommendation = await recs.recExplore(userHash, amount);
    if (recommendation.personal.recipes.length !== 0) {
      let temp = recommendation.personal.recipes.recomms.map((j) => j.id);
      temp = await search.searchIdFunc(temp);
      retval.personal = temp;
    }
    if (recommendation.popular.recipes.length !== 0) {
      let temp = recommendation.popular.recipes.recomms.map((j) => j.id);
      temp = await search.searchIdFunc(temp);
      retval.popular = temp;
    }

    response.send(retval);
  } catch (err) {
    next(err);
  }
}));

module.exports.router = router;
