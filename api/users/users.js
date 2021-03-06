/* eslint-disable no-console */
/* eslint no-unused-vars: ["error", { "argsIgnorePattern": "^_" }] */
const express = require('express');
const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const recombee = require('recombee-api-client');
const crypto = require('crypto');
const User = require('./userModel');
const search = require('../search.js');

const rqs = recombee.requests;
const recombeeClient = new recombee.ApiClient(process.env.RECOMBEE_DATABASE_ID,
  process.env.RECOMBEE_PRIVATE_TOKEN);

const router = express.Router();

mongoose.connect(process.env.MONGODB_HOST,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err, _) => {
    if (err) {
      console.error(err);
      process.exit(-1);
    }
  });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


router.get('/preferences', asyncHandler(async (request, response, next) => {
  await User.findById(request.user.sub, 'excludeTerms diet', (err, user) => {
    if (!user) { response.send({ excludeTerms: [], diet: [] }); } else {
      response.send(user);
    }
    if (err) next(err);
  });
}));

router.post('/preferences', asyncHandler(async (request, response, next) => {
  const {
    excludeTerms,
    diet,
  } = request.body;

  if (!Array.isArray(excludeTerms) || !Array.isArray(diet)) {
    response.sendStatus(400);
    return;
  }

  await User.findByIdAndUpdate(request.user.sub,
    { excludeTerms, diet },
    { upsert: true },
    (err, user) => {
      if (err) next(err);

      response.send(user);
    });

  /* can perform after response, send user prefs to recommendation engine */
  const userHash = crypto.createHash('sha256').update(request.user.sub).digest('hex');
  const userPreferences = [new rqs.SetUserValues(
    userHash,
    { excludeTerms, diet },
    { cascadeCreate: true },
  )];
  await recombeeClient.send(new rqs.Batch(userPreferences)).catch((err) => {
    if (err) next(err);
  });
}));

router.get('/get_recipes', asyncHandler(async (request, response, next) => {
  await User.findById(request.user.sub, 'recipes').exec()
    .catch((err) => next(err))
    .then((user) => search.searchIdFunc(user ? user.recipes : []))
    .then((query) => {
      response.send({
        // eslint-disable-next-line no-underscore-dangle
        items: query.map((e) => ({ ...e, isSaved: true })),
      });
    });
}));

router.get('/get_recipes_ids', asyncHandler(async (request, response, next) => {
  await User.findById(request.user.sub, 'recipes', (err, recipes) => {
    response.send({ recipes: recipes || [] });
    if (err) next(err);
  });
}));

router.post('/add_recipes', asyncHandler(async (request, response, next) => {
  const {
    recipes,
  } = request.body;

  if (!Array.isArray(recipes)) {
    response.sendStatus(400);
    return;
  }

  let user = await User.findById(request.user.sub, (err, _) => {
    if (err) next(err);
  });
  if (user) {
    /* remove duplicates */
    user.recipes = Array.from(new Set(user.recipes.concat(recipes)));
  } else {
    user = await User.create({
      _id: request.user.sub, excludeTerms: [], diet: [], recipes,
    });
  }

  user = await user.save();
  response.sendStatus(200);

  /* can perform after response, send events to recommendation engine */
  const userHash = crypto.createHash('sha256').update(request.user.sub).digest('hex');
  const additions = [];
  recipes.forEach((recipeId) => {
    additions.push(new rqs.AddPurchase(userHash, recipeId, { cascadeCreate: true }));
  });

  await recombeeClient.send(new rqs.Batch(additions)).catch((err) => {
    if (err) next(err);
  });
}));

router.post('/remove_recipes', asyncHandler(async (request, response, next) => {
  const {
    recipes,
  } = request.body;

  if (!Array.isArray(recipes)) {
    response.sendStatus(400);
    return;
  }

  let user = await User.findById(request.user.sub, (err, doc) => {
    if (err) next(err);

    if (!doc) {
      response.sendStatus(404);
    }
  });

  /* remove recipes from list */
  user.recipes = user.recipes.filter((e) => !recipes.includes(e));

  user = await user.save();
  response.sendStatus(200);

  /* can perform after response, send events to recommendation engine */
  const userHash = crypto.createHash('sha256').update(request.user.sub).digest('hex');
  const removals = [];
  recipes.forEach((recipeId) => {
    removals.push(new rqs.DeletePurchase(userHash, recipeId));
  });

  await recombeeClient.send(new rqs.Batch(removals)).catch((err) => {
    if (err) next(err);
  });
}));

router.post('/recipes_viewed', asyncHandler(async (request, response, next) => {
  const {
    recipes,
  } = request.body;

  if (!Array.isArray(recipes) || recipes.length === 0) {
    response.sendStatus(400);
    return;
  }
  response.sendStatus(200);

  /* can perform after response, send events to recommendation engine */
  const userHash = crypto.createHash('sha256').update(request.user.sub).digest('hex');
  const views = [];
  recipes.forEach((recipeId) => {
    views.push(new rqs.AddDetailView(userHash, recipeId, { cascadeCreate: true }));
  });

  await recombeeClient.send(new rqs.Batch(views)).catch((err) => {
    if (err) next(err);
  });
}));

router.post('/recently_viewed', asyncHandler(async (request, response, next) => {
  const {
    count = 10,
  } = request.body;

  const userHash = crypto.createHash('sha256').update(request.user.sub).digest('hex');
  try {
    const recommendation = await recombeeClient.send(
      new rqs.RecommendItemsToUser(userHash, count, { scenario: 'recently_viewed', cascadeCreate: true }),
    );
    const ids = recommendation.recomms.map((j) => j.id);
    const recipes = await search.searchIdFunc(ids);
    response.send({ recipes });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    try {
      response.send({ recipes: [] });
    } catch (e) {
      next(e);
    }
  }
}));

module.exports.router = router;
