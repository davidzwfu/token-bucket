# Simple rate limiter

## Technical explanation

### classes/TokenBucket.js
Token count is updated when a request comes in. The number of tokens to add is calculated based on the amount of time elapsed since the last refill. The fill rate is measured by the number of milliseconds it takes to refill 1 token (for example a sustained rate of 6 tokens per minute would have a fill rate of 10,000 ms). This way we can determine how many tokens exist in the bucket before attempting to consume.

## Compromises

- State is kept in memory only, so it will be reset if the service crashes or is restarted.
- No cache/database to support the possibility of scaling to multiple instances.

## Gaps

- Unit tests assume config.json is unchanged, otherwise the tests will fail.
- No mechanism for more specific rate limiting (API, tenant type, subscription level) which would be needed at Auth0.
- Assumes that only 1 token is consumed at a time. In real-world applications some endpoints/tasks may be more expensive than others.

## Possible follow-ups

- Improve unit tests to be more dynamic — calculate expected output instead of using static variables.
- Consider options to improve scalability - optimize for consistency or availability?
