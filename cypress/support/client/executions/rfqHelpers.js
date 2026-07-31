// this will be housing helper functions for the Request-for-quote (RFQ) API endpoints.

import {ACCOUNT_ID} from '../../data/rfqConstants';
import {createQuote} from '../../client/executions/rfqClient';

// for creating a fresh quote on the fly.
export function freshQuote(overrides = {}) {
  const body = {
    ticker: 'BTC-USD',
    tradeSide: 'buy',
    deliverQuantity: "1",
    accountId: ACCOUNT_ID,
    ...overrides,
  };
  return createQuote(body).then((res) => res.body.data.quoteId);
}