const express = require('express');
const { TokenBucket } = require('./classes/TokenBucket');
const { rateLimitsPerEndpoint } = require('./configs/config.json');

const app = express();
app.use(express.json());

const tokenBuckets = initTokenBuckets();

function initTokenBuckets() {
  const tokenBuckets = {};
  for (const route of rateLimitsPerEndpoint) {
    tokenBuckets[route.endpoint] = new TokenBucket(route.burst, route.sustained);
  }
  return tokenBuckets;
}

app.post('/take/', (req, res) => {
  const routeBucket = tokenBuckets[req.body.endpoint];
  if (!routeBucket) {
    return res.status(400).send({
      errorMessage: 'Invalid endpoint.',
    });
  }
  
  const accepted = routeBucket.consumeToken();
  res.send({
    accepted,
    remainingTokens: routeBucket.tokens,
  });
});

module.exports = app;