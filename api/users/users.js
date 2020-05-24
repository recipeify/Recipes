const express = require('express');
const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const recombee = require('recombee-api-client');
const crypto = require('crypto');
const User = require('./userModel');

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


router.get('/prefrences', asyncHandler(async (request, response, next) => {
  await User.findById(request.openid.user.sub, 'excludeTerms diet', (err, user) => {
    if (err) next(err);
    if (!user) { response.sendStatus(404); } else { response.send(user); }
  });
}));

router.post('/prefrences', asyncHandler(async (request, response, next) => {
  const {
    excludeTerms,
    diet,
  } = request.body;

  if (!Array.isArray(excludeTerms) || !Array.isArray(diet)) {
    response.sendStatus(400);
    return;
  }

  await User.findByIdAndUpdate(request.openid.user.sub,
    { excludeTerms, diet },
    { upsert: true },
    (err, user) => {
      if (err) next(err);

      response.send(user);
    });
}));

router.get('/get_recipes', asyncHandler(async (request, response, next) => {
  await User.findById(request.openid.user.sub, 'recipes', (err, recipes) => {
    if (err) next(err);
    response.send({ recipes: recipes || [] });
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

  let user = await User.findById(request.openid.user.sub, (err, _) => {
    if (err) next(err);
  });
  if (user) {
    /* remove duplicates */
    user.recipes = Array.from(new Set(user.recipes.push(recipes)));
  } else {
    user = await User.create({
      _id: request.openid.user.sub, excludeTerms: [], diet: [], recipes,
    });
  }

  user = await user.save();
  response.sendStatus(200);

  /* can perform after response, send events to recommendation engine */
  const userHash = crypto.createHash('sha256').update(request.openid.user.sub).digest('hex');
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

  let user = await User.findById(request.openid.user.sub, (err, doc) => {
    if (err) next(err);

    if (!doc) {
      response.sendStatus(404);
    }
  });

  /* remove recipes from list */
  user.recipes = user.recipes.filter((e) => recipes.includes(e));

  user = await user.save();
  response.sendStatus(200);

  /* can perform after response, send events to recommendation engine */
  const userHash = crypto.createHash('sha256').update(request.openid.user.sub).digest('hex');
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

  if (!Array.isArray(recipes)) {
    response.sendStatus(400);
    return;
  }

  response.sendStatus(200);

  /* can perform after response, send events to recommendation engine */
  const userHash = crypto.createHash('sha256').update(request.openid.user.sub).digest('hex');
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

  const userHash = crypto.createHash('sha256').update(request.openid.user.sub).digest('hex');
  await recombeeClient.send(
    new rqs.RecommendItemsToUser(userHash, count, { scenario: 'recently_viewed' }),
  )
    .then((recommendation) => {
      response.send({ recipes: recommendation.recomms.map((e) => e.id) || [] });
    })
    .catch(() => response.send({ recipes: [] }))
    .catch((err) => {
      if (err) next(err);
    });
}));

module.exports.router = router;
