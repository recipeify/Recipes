const expressJwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const jwt = require('jsonwebtoken');

// Set up Auth0 configuration
const authConfig = {
  domain: process.env.ISSUER_BASE_URL,
  audience: process.env.AUTH0_API_AUDIENCE,
};

const jwksConfig = {
  cache: true,
  rateLimit: true,
  jwksRequestsPerMinute: 5,
  jwksUri: `${authConfig.domain}/.well-known/jwks.json`,
};

const jwtVerifyOpts = {
  audience: authConfig.audience,
  issuer: `${authConfig.domain}/`,
  algorithms: ['RS256'],
};

const jwksClient = jwksRsa(jwksConfig);

const verifyJwksJwt = (token, options, cb) => {
  function getKey(header, callback) {
    jwksClient.getSigningKey(header.kid, (err, key) => {
      if (err) {
        callback(err);
        return;
      }
      const signingKey = key.publicKey || key.rsaPublicKey;
      callback(null, signingKey);
    });
  }

  jwt.verify(token, getKey, options, cb);
};

// Define middleware that validates incoming bearer tokens
const enforceJwt = expressJwt({
  secret: jwksRsa.expressJwtSecret(jwksConfig),
  ...jwtVerifyOpts,
});

const checkJwt = async (req) => new Promise((resolve, reject) => {
  const header = req.headers['x-access-token'] || req.headers.authorization;
  if (!header) {
    resolve(undefined);
  }

  // Express headers are auto converted to lowercase
  if (!header.startsWith('Bearer ')) {
    resolve(undefined);
  }

  // Remove Bearer from string
  const token = header.slice(7, header.length).trimLeft();
  if (!token) {
    resolve(undefined);
  }

  verifyJwksJwt(token, jwtVerifyOpts, (err, decoded) => {
    if (err) {
      reject(err);
      return;
    }

    resolve(decoded);
  });
});

module.exports = { enforceJwt, checkJwt };
