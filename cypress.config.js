const { defineConfig } = require('cypress');
const { signRequest } = require('./cypress/support/auth/sign');
require('dotenv').config();


module.exports = defineConfig({
    reporter: "mochawesome",
  reporterOptions: {
    reportDir: "cypress/reports",
    overwrite: true,
    html: true,
    json: true
  },
  e2e: {
    baseUrl: process.env.BASE_URL,
    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: 'cypress/support/e2e.js',
    fixturesFolder: 'cypress/fixtures',
    video: false,
    defaultCommandTimeout: 10000,
    requestTimeout: 15000,
    retries: {
      runMode: 2,
      openMode: 0
    },
    setupNodeEvents(on, config) {
      // Sign in Node to avoid API SECRET never enters the browser context.
      on('task', {
        rfqSign({ httpMethod, path, nonce }) {
          return signRequest({
            apiSecret: process.env.API_SECRET,
            httpMethod,
            path,
            nonce,
          });
        },
      });
      // Expose the api KEY (not the secret) to tests.
      config.env.API_KEY = process.env.API_KEY;
      return config;
    },

  }
});