const express = require('express');
const asyncHandler = require('express-async-handler');

const router = express.Router();

// eslint-disable-next-line no-unused-vars
router.get('/getUser', asyncHandler(async (request, response, _next) => {
  response.send(`hello ${request.openid.user.name} id: ${JSON.stringify(request.openid.user)}`);
}));

module.exports.router = router;
