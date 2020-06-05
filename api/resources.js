const express = require('express');
const fs = require('fs');
const asyncHandler = require('express-async-handler');

const router = express.Router();
const rawDataIngredients = fs.readFileSync('./resources/ingredients.json', 'utf8');
const ingredients = JSON.parse(rawDataIngredients.trim());
const rawDataDiets = fs.readFileSync('./resources/diets.json', 'utf8');
const diets = JSON.parse(rawDataDiets.trim());
const rawDataCuisine = fs.readFileSync('./resources/cuisine.json', 'utf8');
const cuisine = JSON.parse(rawDataCuisine.trim());
const rawDataEvents = fs.readFileSync('./resources/events.json', 'utf8');
const events = JSON.parse(rawDataEvents.trim());
const rawDataMealTypes = fs.readFileSync('./resources/mealTypes.json', 'utf8');
const mealTypes = JSON.parse(rawDataMealTypes.trim());
const rawDataMisc = fs.readFileSync('./resources/misc.json', 'utf8');
const misc = JSON.parse(rawDataMisc.trim());

// eslint-disable-next-line no-unused-vars
router.get('/all', asyncHandler(async (_request, response, _next) => {
  response.send({
    items: {
      ingredients: ingredients.ingredients,
      diets: diets.tags,
      cuisine: cuisine.tags,
      events: events.tags,
      mealTypes: mealTypes.tags,
      misc: misc.tags,
    },
  });
}));

module.exports.router = router;
