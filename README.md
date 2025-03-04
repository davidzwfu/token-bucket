# Simple rate limiter

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
