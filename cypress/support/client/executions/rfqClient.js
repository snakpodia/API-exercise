// this will be housing client functions for the Request-for-quote (RFQ) API endpoints.

const endpoints = {
    getQuote: '/trades/v2/getQuote',
    createQuote: '/trades/v2/createQuote',
    executeQuote: '/trades/v2/executeQuote',
    expireQuote: '/trades/v2/expireQuote',
};

// Builds and sends one signed request.
function signedRequest(httpMethod, path, body, options) {
    const opts = options || {};
    const query = opts.query ? '?' + new URLSearchParams(opts.query).toString() : '';
    const urlPath = path + query;
    const allowedToFail = opts.allowedToFail ? true : false;
    const nonce = Date.now().toString();

    return cy.task('rfqSign', { httpMethod, path, nonce }).then(function (signature) {
        return cy.request({
            method: httpMethod,
            url: urlPath,
            failOnStatusCode: !allowedToFail,
            retryOnStatusCodeFailure: !allowedToFail,
            headers: {
                'x-api-key': Cypress.env('API_KEY'),
                'x-signature': signature,
                'x-nonce': nonce,
                'Content-Type': 'application/json',
            },
            body: body || undefined,
        });
    });
}


// Functions of Request-for-quotes
function getQuote(params, options) {
    return signedRequest('GET', endpoints.getQuote, null, { ...options, query: params });
}

function createQuote(body, options) {
    return signedRequest('POST', endpoints.createQuote, body, options);
}

function executeQuote(quoteId, options) {
    return signedRequest('POST', endpoints.executeQuote, { quoteId }, options);
}

function expireQuote(quoteId, options) {
    return signedRequest('PUT', endpoints.expireQuote, { quoteId }, options);
}


export { getQuote, createQuote, executeQuote, expireQuote, endpoints };