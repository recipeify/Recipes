const recombee = require('recombee-api-client');

const rqs = recombee.requests;
const recombeeClient = new recombee.ApiClient(process.env.RECOMBEE_DATABASE_ID,
  process.env.RECOMBEE_PRIVATE_TOKEN);

async function recPersonal(userHash, count) {
  let result;
  await recombeeClient.send(
    new rqs.RecommendItemsToUser(userHash, count, { scenario: 'personal_view' }),
  )
    .then((recommendation) => {
      result = { recipes: recommendation.recomms.map((e) => e.id) || [] };
    })
    .catch(() => {
      recombeeClient.send(
        new recombee.RecommendItemsToUser(userHash, count, { scenario: 'homepage_view' }),
      );
    })
    .then((recommendation) => {
      result = { recipes: recommendation.recomms.map((e) => e.id) || [] };
    })
    .catch((err) => {
      throw (err);
    });
  return result;
}

async function recPopular(userHash, count) {
  let result;
  await recombeeClient.send(
    new rqs.RecommendItemsToUser(userHash, count, { scenario: 'popular_view' }),
  )
    .then((recommendation) => {
      result = { recipes: recommendation.recomms.map((e) => e.id) || [] };
    })
    .catch(() => { result = { recipes: [] }; })
    .catch((err) => {
      throw (err);
    });
  return result;
}


async function recommendFunc(userHash, count, type, isAnonymous) {
  const result = { personal: [], popular: [] };
  if (type.localeCompare('personal') === 0) {
    await recPersonal(userHash, count)
      .then((res) => res)
      .catch((err) => {
        throw (err);
      });
  } else if (type.localeCompare('popular')) {
    await recPopular(userHash, count)
      .then((res) => res)
      .catch((err) => {
        throw (err);
      });
  } else if (type.localeCompare('explore')) {
    if (!isAnonymous) {
      await recPersonal(userHash, count)
        .then((res) => { result.personal = res; })
        .catch((err) => {
          throw (err);
        });
    }
    await recPopular(userHash, count)
      .then((res) => { result.popular = res; })
      .catch((err) => {
        throw (err);
      });
    return result;
  } else {
    throw TypeError;
  }
  return result;
}

module.exports = recommendFunc;
