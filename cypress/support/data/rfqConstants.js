// this file will be housing constants for the Request-for-quote (RFQ) API endpoints.

export const ACCOUNT_ID = 'CA1001657C';


// This is for checking against the acknowledgement types for each RFQ API endpoint.
export const ACK_TYPES = {
    getQuote: 'rfqGetQuoteAck',
    createQuote: 'rfqCreateQuoteAck',
    executeQuote: 'rfqExecuteQuoteAck',
    expireQuote: 'rfqExpireQuoteAck',
};


// This for checking against ticker specific behaviours for extreme quantities.
export const EXTREME_QUANTITIES = [
    { ticker: 'BTC-USD', tradeSide: 'sell', deliverQuantity: 1000 },   // 1000 BTC this amount is quite large, rare for a single quote
    { ticker: 'ETH-USD', tradeSide: 'sell', deliverQuantity: 100000 }, // 100,000 ETH 

    { ticker: 'BTC-USD', tradeSide: 'buy', deliverQuantity: 100000000 }, // 100,000,000 USD - sticking with one pair since the quote pair is what is being validated 
];


// This for checking against ticker specific behaviours for low quantities.
export const LOW_QUANTITIES = [
    { ticker: 'BTC-USD', tradeSide: 'sell', minSize: 0.00007, deliverQuantity: 0.000009 },   // 1000 BTC this amount is quite large, rare for a single quote
    { ticker: 'ETH-USD', tradeSide: 'sell', minSize: 0.001, deliverQuantity: 0.0006 }, // 100,000 ETH 
    { ticker: 'XRP-USD', tradeSide: 'sell', minSize: 0.4, deliverQuantity: 0.005 }, // 
    { ticker: 'USDT-USD', tradeSide: 'sell', minSize: 0.05, deliverQuantity: 0.005 }, // 100,000,000 USD - sticking with one pair since the quote pair is what is being validated 

    { ticker: 'BTC-USD', tradeSide: 'buy', minSize: 1, deliverQuantity: 0.01 },
    { ticker: 'ETH-USD', tradeSide: 'buy', minSize: 1, deliverQuantity: 0.01 }, // 100,000,000 USD - sticking with one pair since the quote pair is what is being validated 
    { ticker: 'XRP-USD', tradeSide: 'buy', minSize: 1, deliverQuantity: 0.01 }, // 100,000,000 USD 
    { ticker: 'USDT-USD', tradeSide: 'buy', minSize: 1, deliverQuantity: 0.05 }, // 100,000,000 USD 
];


//data for testing invalid tickers
export const INVALID_TICKERS = [
    { ticker: 'PEPE', tradeSide: 'buy', deliverQuantity: 1 },
    { ticker: 'BTC-IND', tradeSide: 'buy', deliverQuantity: 1 },
];


//data for testing invalid deliver quantities
export const INVALID_DELIVER_QUANTITIES = [
    {
        deliverQuantity: -1,
        expectedMessage: 'deliverQuantity must be a positive number' 
    },
    {
        deliverQuantity: 'abc',
        expectedMessage: 'deliverQuantity must be a positive number' // added the expectedMessage incase the argurment changes later on
    }
];


//data for testing invalid precision quantities
export const INVALID_PRECISION_QUANTITIES = [
      {
        ticker: 'BTC-USD',
        tradeSide: 'buy',
        deliverQuantity: 1.123,
        expectedMessage: 'The requested delivered quantity precision is finer than the expected precision 2' // one testcase for the quote currency usd since my test rvolvoe around usd
    },
    {
        ticker: 'BTC-USD',
        tradeSide: 'sell',
        deliverQuantity: 1.123456789,
        expectedMessage: 'The requested delivered quantity precision is finer than the expected precision 8'
    },
    {
        ticker: 'ETH-USD',
        tradeSide: 'sell',
        deliverQuantity: 1.12345,
        expectedMessage: 'The requested delivered quantity precision is finer than the expected precision 4'
    },
    {
        ticker: 'XRP-USD',
        tradeSide: 'sell',
        deliverQuantity: 1.1234567,
        expectedMessage: 'The requested delivered quantity precision is finer than the expected precision 6'
    },
    {
        ticker: 'USDT-USD',
        tradeSide: 'sell',
        deliverQuantity: 1.1234567,
        expectedMessage: 'The requested delivered quantity precision is finer than the expected precision 6'
    }
];


//data for testing valid user references
export const VALID_USER_REFERENCES = [
    {
        userReference: 'user_ref_less_than_64_chars',
        description: 'less than 64 characters'
    },
    {
        userReference: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        description: 'exactly 64 characters'
    }
];


//data for testing invalid user references
export const INVALID_USERNAME_REF_SPECIAL_CHARACTERS = [
    { usernameRef: '!' },
    { usernameRef: '$&' },
    { usernameRef: '!$&' },
];


export const QUOTE_ID = 'ab673d3a-1676-4896-8129-bc5d9c89b32d';
export const INVALID_USER_REFERENCE = 'aaaaaaaaaaaaaabbaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaab';