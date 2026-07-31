# Challenges, Caveats & Assumptions

Notes on the decisions, trade-offs, and contract oddities I ran into while building this suite. Organized per endpoint, plus a general section at the end.

## getQuote

**Assumptions**
- I'm using one of 4 highly traded pairs (from experience) so I can exercise their different precision rules and error messages.
- I allow for a small time drift — at most within a 5 second. 

**Caveats**
- For an invalid currency the API returns a `403`. Per the OpenAPI spec, `403` is for auth or RBAC-based client errors where the server understands who and what they do, but will not grant the request, this could be a `400`. I didn't want to blindly assert the `403` as correct, so I've implemented it as wrong but left that assertion commented out so it doesn't fail the suite.
- I only added one test case for the final scenario of getQuote. The quote currency is USD and my since my tests revolve around USD, there's no need to test other pairs quote currency precision — since its always in 2 decimal places for fiats mostly.


## createQuote

**Caveats**
- I omit `usernameRef` since it's an optional field, except in the specific test cases that are actually about it.
- The docs say `receive` and `deliver` can both be in one output, but the v2 API only allows one.
-  `usernameRef` allows `-` as a special character that doenst get blocked.

## executeQuote

**Caveats**
- Hard waits are normally an anti-pattern, but I use one here specifically to verify the 8-second TTL.
- I assume `valueDate` is always greater than `tradeDate`. I haven't confirmed exactly what this field represents as i dont see its definitions in the docs, but based on the examples and my Postman testing, that relationship holds consistently.
- extra validation for quoteID pattern is valdiated as well

## General

- I don't validate response time — that's really a performance concern, not a contract one. I do include it in the first few test cases as a basic sanity check.
- During testing I found real differences between the v1 and v2 API contracts: response structure, required fields, validation messages, and precision rules all differ. This suite targets v2 behavior specifically. If backward compatibility ever needs to be guaranteed, I'd keep separate versioned suites and share utilities only where the behavior is genuinely identical.
- Reporting is plain Mochawesome, nothing fancy,  gets the job done.
- `failOnStatusCode: false` — by default Cypress kills the test the moment a request comes back with an error status. I set this to `false` so it doesn't fail early, and I can actually capture the 4xx/5xx response and assert on it myself.
- Ive grouped each endpoint testcases to valids and invalids with appropriate commenting
- in get Quote for invalid tradeside gives the error message `tradeSide must be one of buy, sell, BUY, SELL, Buy, Sell` but in create-quote endpoints its actually without spaces.