# Aquanow Exercise: RFQ API Test Suite

API tests I've written for the RFQ (request-for-quote) trade flow take home assignment at Aquanow. Cypress + JavaScript, hitting the v2 staging API. It walks the whole quote lifecycle end to end: getQuote, createQuote, executeQuote, expireQuote.

## INSTALLATION AND SET UP
Clone it and install:

```bash
git clone <repo-url>
cd aquanow-exercise
npm ci
```


For the `.env`. values, it will be provided via the Google Drive link I share.
```
BASE_URL=https://api-staging.aquanow.io
API_KEY=<api-key>
API_SECRET=<api-secret>
```


## Running it

```bash
npm test    # headless, runs the whole suite
```

The terminal already tells you exactly what passed and failed, so you don't need a report to trust the run.

To generate the HTML report, run these in order after `npm test`:

```bash
npm run report:merge      # merges the per-spec Mochawesome JSON into output.json
npm run report:generate   # builds the HTML report
```

The report lands here:

```
mochawesome-report/output.html
```

## Folder Structure

```
cypress/
  e2e/executions/
    get-quote.cy.js
    create-quote.cy.js
    execute-quote.cy.js
    expire-quote.cy.js
  support/
    auth/sign.js                    - HMAC-SHA384 signer (Node task)
    client/executions/
      rfqClient.js                  - one signed-request function per endpoint
      rfqHelpers.js                 - helpers for routine setup (e.g. freshQuote)
    data/rfqConstants.js            - ack types, account id, and test data tables
    schemas/*.schema.json           - response contracts for successful API responses
cypress.config.js
README.md
EXERCISE_NOTES.md              - assumptions, caveats, challenges, and findings
TEST_PLAN_COVERAGE.md          - test case matrix
```

## Dependencies

- **cypress** — the test framework used
- **cypress-plugin-api** — simplifies API request assertions and debugging inside Cypress
- **chai-json-schema** — validates responses against the JSON schemas
- **dotenv** — loads `.env` for local runs
- **mochawesome**, **mochawesome-merge**, **mochawesome-report-generator**, **cypress-multi-reporters** — reporting 

## See Also

- `EXERCISE_NOTES.md` — All notes written: assumptions, challenges, caveats I documented etc
- `TEST_PLAN_COVERAGE.md` — All test case 
