import { getQuote } from '../../support/client/executions/rfqClient';
import { ACK_TYPES, EXTREME_QUANTITIES, LOW_QUANTITIES, INVALID_TICKERS, ACCOUNT_ID, INVALID_DELIVER_QUANTITIES, INVALID_PRECISION_QUANTITIES } from '../../support/data/rfqConstants';
import getQuoteAckSchema from '../../support/schemas/getQuoteAck.schema.json';

describe('Test Suite: RFQ API Tests', () => {

    //----------VALID ARGUMENT TEST CASES----------------
    it('TC 01: getQuote API returns a valid buy quote with deliverQuantity specified', () => {
        getQuote({ ticker: 'BTC-USD', tradeSide: 'buy', deliverQuantity: 10, accountId: ACCOUNT_ID }).then((res) => {
            expect(res.status).to.eq(200);
            expect(res.duration).to.be.below(3000);

            expect(res.body.type).to.eq(ACK_TYPES.getQuote);
            expect(res.body).to.be.jsonSchema(getQuoteAckSchema);

            const payload = res.body.data;
            expect(payload.symbol).to.eq('BTC-USD');
            expect(payload.side).to.eq('buy');

            expect(payload.receiveCurrency).to.eq('BTC');
            expect(payload.deliverCurrency).to.eq('USD');

            expect(payload.quoteTime).to.be.closeTo(Date.now(), 5000) // allow for some time drift at most 5 seconds,
            expect(payload.expireTime).to.be.greaterThan(payload.quoteTime);
            expect(payload.expireTime - payload.quoteTime).to.eq(8000);
        });

    });

    it('TC 02: getQuote API returns a valid sell quote with deliverQuantity specified', () => {
        getQuote({ ticker: 'BTC-USD', tradeSide: 'sell', deliverQuantity: 10, accountId: ACCOUNT_ID }).then((res) => {
            expect(res.status).to.eq(200);
            expect(res.body.type).to.eq(ACK_TYPES.getQuote);
            expect(res.body).to.be.jsonSchema(getQuoteAckSchema);

            const payload = res.body.data;
            expect(payload.symbol).to.eq('BTC-USD');
            expect(payload.side).to.eq('sell');

            expect(payload.receiveCurrency).to.eq('USD');
            expect(payload.deliverCurrency).to.eq('BTC');
            expect(payload.expireTime - payload.quoteTime).to.eq(8000);
        });

    });

    it('TC 03: getQuote API returns a valid sell quote with receiveQuantity specified', () => {
        getQuote({ ticker: 'BTC-USD', tradeSide: 'sell', receiveQuantity: 10, accountId: ACCOUNT_ID }).then((res) => {
            expect(res.status).to.eq(200);
            expect(res.body.type).to.eq(ACK_TYPES.getQuote);
            expect(res.body).to.be.jsonSchema(getQuoteAckSchema);

            const payload = res.body.data;
            expect(payload.symbol).to.eq('BTC-USD');
            expect(payload.side).to.eq('sell');

            expect(payload.receiveCurrency).to.eq('USD');
            expect(payload.deliverCurrency).to.eq('BTC');
            expect(payload.expireTime - payload.quoteTime).to.eq(8000);
        });

    });


    it('TC 04: getQuote API returns a valid buy quote with receiveQuantity specified', () => {
        getQuote({ ticker: 'BTC-USD', tradeSide: 'buy', receiveQuantity: 10, accountId: ACCOUNT_ID }).then((res) => {
            expect(res.status).to.eq(200);
            expect(res.body.type).to.eq(ACK_TYPES.getQuote);
            expect(res.body).to.be.jsonSchema(getQuoteAckSchema);

            const payload = res.body.data;
            expect(payload.symbol).to.eq('BTC-USD');
            expect(payload.side).to.eq('buy');

            expect(payload.receiveCurrency).to.eq('BTC');
            expect(payload.deliverCurrency).to.eq('USD');
            expect(payload.expireTime - payload.quoteTime).to.eq(8000);
        });

    });

    it('TC 05: getQuote API returns a valid buy quote with receiveQuantity specified', () => {
        getQuote({ ticker: 'BTC-USD', tradeSide: 'buy', receiveQuantity: 10, accountId: ACCOUNT_ID }).then((res) => {
            expect(res.status).to.eq(200);
            expect(res.body.type).to.eq(ACK_TYPES.getQuote);
            expect(res.body).to.be.jsonSchema(getQuoteAckSchema);

            const payload = res.body.data;
            expect(payload.symbol).to.eq('BTC-USD');
            expect(payload.side).to.eq('buy');

            expect(payload.receiveCurrency).to.eq('BTC');
            expect(payload.deliverCurrency).to.eq('USD');
            expect(payload.expireTime - payload.quoteTime).to.eq(8000);
        });

    });

    EXTREME_QUANTITIES.forEach(({ ticker, tradeSide, deliverQuantity }) => {
        it(`TC 06: getQuote rejects/handles an extreme quantity for ${ticker}`, () => {
            getQuote({ ticker, tradeSide, deliverQuantity, accountId: ACCOUNT_ID }, { allowedToFail: true }).then((res) => {
                cy.log(`status: ${res.status}`);
                cy.log(JSON.stringify(res.body));

                const payload = res.body;
                expect(res.status).to.eq(400);
                expect(payload.errors[0].message).to.eq(`Quantity ${deliverQuantity} exceeds data limits. Please use a smaller amount.`);


            });
        });
    });

    LOW_QUANTITIES.forEach(({ ticker, tradeSide, deliverQuantity, minSize }) => {
        it(`TC 07: getQuote rejects a quantity below minimum size for ${ticker}`, () => {
            getQuote({ ticker, tradeSide, deliverQuantity, accountId: ACCOUNT_ID }, { allowedToFail: true }).then((res) => {
                cy.log(`status: ${res.status}`);
                cy.log(JSON.stringify(res.body));

                const payload = res.body;

                expect(res.status).to.eq(400);
                expect(payload.errors[0].message).to.eq(
                    `The requested quantity is smaller than the minimum order size ${minSize}`
                );
            });
        });
    });

    // no deliverQuantity or receiveQuantity is missing
    it('TC 08: getQuote rejects when no quantity is specified', () => {
        getQuote({ ticker: 'BTC-USD', tradeSide: 'buy', deliverQuantity: '', accountId: ACCOUNT_ID },
            { allowedToFail: true }
        ).then((res) => {
            const payload = res.body;

            expect(res.status).to.eq(400);
            expect(payload.errors[0].message).to.eq(
                'deliverQuantity must be a positive number'
            );
        });
    });

        // ----------MISSING/ ARGUMENT TEST CASES----------------
    it('TC 09: missing ticker returns the correct validation error', () => {
        getQuote(
            { tradeSide: 'sell', deliverQuantity: 1, accountId: ACCOUNT_ID }, // no ticker or ticker is misspelt, covers for both cases
            { allowedToFail: true }
        ).then((res) => {
            const payload = res.body;

            expect(res.status).to.eq(400);
            expect(payload.errors[0].message).to.match(/data must have required property 'ticker'/);
        });
    });

    it('TC 10: missing tradeSide returns the correct validation error', () => {
        getQuote(
            { ticker: 'BTC-USD', deliverQuantity: 1, accountId: ACCOUNT_ID }, // no tradeSide or tradeside is misspelt, covers for both cases
            { allowedToFail: true }
        ).then((res) => {
            const payload = res.body;

            expect(res.status).to.eq(400);
            expect(payload.errors[0].message).to.match(/required property 'tradeSide'/);
        });
    });


    // ----------INVALID ARGUMENT TEST CASES----------------
    INVALID_DELIVER_QUANTITIES.forEach(({ deliverQuantity, expectedMessage }) => {
        it(`TC 11: getQuote rejects a non-positive deliverQuantity (${deliverQuantity})`, () => {
            getQuote({ ticker: 'BTC-USD', tradeSide: 'buy', deliverQuantity, accountId: ACCOUNT_ID }, { allowedToFail: true }).then((res) => {
                const payload = res.body;

                cy.log(`status: ${res.status}`);
                cy.log(JSON.stringify(payload));

                expect(res.status).to.eq(400);
                expect(payload.errors[0].message).to.eq(expectedMessage);
            });
        });
    });

    // INVALID_TICKERS.forEach(({ ticker, tradeSide, deliverQuantity }) => {
    //     it(`TC 12: getQuote rejects an invalid ticker ${ticker}`, () => {
    //         getQuote({ ticker, tradeSide, deliverQuantity, accountId: ACCOUNT_ID }, { allowedToFail: true }).then((res) => {
    //             cy.log(`status: ${res.status}`);
    //             cy.log(JSON.stringify(res.body));

    //             expect(res.status).to.eq(403); //expected behavior: invalid client input should return 400 - currently returns 403.
    //         });
    //     });
    // });

    it('TC 13: getQuote rejects an invalid tradeSide', () => {
        getQuote({ ticker: 'BTC-USD', tradeSide: 'invalid', deliverQuantity: 1, accountId: ACCOUNT_ID }, { allowedToFail: true }).then((res) => {
            const payload = res.body;

            cy.log(`status: ${res.status}`);
            cy.log(JSON.stringify(payload));

            expect(res.status).to.eq(400);
            expect(payload.errors[0].message).to.eq(
                'tradeSide must be one of buy, sell, BUY, SELL, Buy, Sell'
            );
        });
    });
    it('TC 14: getQuote rejects an invalid accountId', () => {
        getQuote({ ticker: 'BTC-USD', tradeSide: 'buy', deliverQuantity: 1, accountId: 'CA1001657Cp' }, { allowedToFail: true }).then((res) => {
            const payload = res.body;

            cy.log(`status: ${res.status}`);
            cy.log(JSON.stringify(payload));

            expect(res.status).to.eq(400);
            expect(payload.errors[0].message).to.match(
                /CA1001657Cp not found/
            );
        });
    });

    it('TC 15: neither deliverQuantity nor receiveQuantity returns the correct validation error', () => {
        getQuote(
            { ticker: 'BTC-USD', tradeSide: 'sell', accountId: ACCOUNT_ID }, // no quantity at all or quantity is misspelt, covers for both cases
            { allowedToFail: true }
        ).then((res) => {
            const payload = res.body;

            expect(res.status).to.eq(400);
            expect(payload.errors[0].message).to.match(
                /Exactly one of deliverQuantity or receiveQuantity must be specified/
            );
        });
    });

    it('TC 16: getQuote rejects when accountId is not specified', () => {
        getQuote({ ticker: 'BTC-USD', tradeSide: 'buy', deliverQuantity: 1 }, { allowedToFail: true }).then((res) => {
            const payload = res.body;

            cy.log(`status: ${res.status}`);
            cy.log(JSON.stringify(payload));

            expect(res.status).to.eq(400);
            expect(payload.errors[0].message).to.eq(
                "data must have required property 'accountId'"
            );
        });
    });

    it('TC 17: getQuote rejects when both deliverQuantity and receiveQuantity are specified', () => {
        getQuote({
            ticker: 'BTC-USD',
            tradeSide: 'buy',
            deliverQuantity: 1,
            receiveQuantity: 100,
            accountId: ACCOUNT_ID
        }, { allowedToFail: true }).then((res) => {
            const payload = res.body;

            cy.log(`status: ${res.status}`);
            cy.log(JSON.stringify(payload));

            expect(res.status).to.eq(400);
            expect(payload.errors[0].message).to.eq(
                'Exactly one of deliverQuantity or receiveQuantity must be specified'
            );
        });
    });

    // checking per ticker precision  
    INVALID_PRECISION_QUANTITIES.forEach(({ ticker, tradeSide, deliverQuantity, expectedMessage }) => {
        it(`TC 18: getQuote rejects quantity with invalid precision for ${ticker}`, () => {
            getQuote({ ticker, tradeSide, deliverQuantity, accountId: ACCOUNT_ID }, { allowedToFail: true }).then((res) => {
                const payload = res.body;

                cy.log(`status: ${res.status}`);
                cy.log(JSON.stringify(payload));

                expect(res.status).to.eq(400);
                expect(payload.errors[0].message).to.eq(expectedMessage);
            });
        });
    });
});

