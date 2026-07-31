import { createQuote } from '../../support/client/executions/rfqClient';
import { ACK_TYPES, ACCOUNT_ID, INVALID_USERNAME_REF_SPECIAL_CHARACTERS, VALID_USER_REFERENCES, INVALID_TICKERS, INVALID_DELIVER_QUANTITIES, INVALID_USER_REFERENCE } from '../../support/data/rfqConstants';
import createQuoteAckSchema from '../../support/schemas/createQuoteAck.schema.json';


describe('Test Suite: RFQ CREATE QUOTE Tests', () => {

    //----------VALID ARGUMENT TEST CASES----------------
    it('TC 01: createQuote API returns a valid response with deliverQuantity specified', () => {
        createQuote({ ticker: 'ETH-USD', tradeSide: 'buy', deliverQuantity: '1', accountId: ACCOUNT_ID }, { allowedToFail: true }).then((res) => {
            expect(res.status).to.eq(200);
            expect(res.duration).to.be.below(3000);

            expect(res.body.type).to.eq(ACK_TYPES.createQuote);
            expect(res.body).to.be.jsonSchema(createQuoteAckSchema);

            const payload = res.body.data;
            expect(payload.quoteId).to.exist;
            expect(payload.symbol).to.eq('ETH-USD');
            expect(payload.side).to.eq('buy');

            expect(payload.receiveCurrency).to.eq('ETH');
            expect(payload.deliverCurrency).to.eq('USD');
            expect(payload.quoteTime).to.be.closeTo(Date.now(), 3000) // allow for some time drift at most 1 second,
            expect(payload.expireTime).to.be.greaterThan(payload.quoteTime);
            expect(payload.expireTime - payload.quoteTime).to.eq(8000);
        });
    });

    it('TC 02: createQuote API returns a valid response with receiveQuantity specified', () => {
        createQuote({ ticker: 'BTC-USD', tradeSide: 'buy', receiveQuantity: '1', accountId: ACCOUNT_ID }).then((res) => {
            expect(res.status).to.eq(200);
            expect(res.duration).to.be.below(3000);

            expect(res.body.type).to.eq(ACK_TYPES.createQuote);
            expect(res.body).to.be.jsonSchema(createQuoteAckSchema);

            const payload = res.body.data;
            expect(payload.symbol).to.eq('BTC-USD');
            expect(payload.side).to.eq('buy');
            expect(payload.quoteId).to.exist;


            expect(payload.receiveCurrency).to.eq('BTC');
            expect(payload.deliverCurrency).to.eq('USD');
            expect(payload.quoteTime).to.be.closeTo(Date.now(), 3000) // allow for some time drift at most 1 second,
            expect(payload.expireTime).to.be.greaterThan(payload.quoteTime);
            expect(payload.expireTime - payload.quoteTime).to.eq(8000);
        });
    });

    it('TC 03: createQuote rejects both receiveQuantity and deliverQuantity specified', () => {
        createQuote(
            { ticker: 'BTC-USD', tradeSide: 'buy', receiveQuantity: '10', deliverQuantity: '10', accountId: ACCOUNT_ID },
            { allowedToFail: true }
        ).then((res) => {
            expect(res.status).to.eq(400);

            expect(res.body.errors[0].id).to.exist
            expect(res.body.errors[0].message).to.eq(
                'Exactly one of deliverQuantity or receiveQuantity must be specified'
            );
        });
    });


    it('TC 04: createQuote rejects when the requested quantity exceeds the maximum allowed', () => {
        createQuote(
            { ticker: 'ETH-CAD', tradeSide: 'buy', receiveQuantity: '10000000', accountId: ACCOUNT_ID },
            { allowedToFail: true }
        ).then((res) => {
            expect(res.status).to.eq(400);
            expect(res.body.errors[0].id).to.exist
            expect(res.body.errors[0].message).to.match(
                /Quantity 10000000 exceeds data limits. Please use a smaller amount./
            );
        });
    });


    it('TC 05: createQuote rejects when the account has insufficient funds', () => {
        createQuote(
            { ticker: 'XRP-CAD', tradeSide: 'buy', deliverQuantity: '100000', accountId: ACCOUNT_ID },
            { allowedToFail: true }
        ).then((res) => {
            expect(res.status).to.eq(400);
            expect(res.body.errors[0].id).to.exist
            expect(res.body.errors[0].message).to.eq(
                'Insufficient balance'
            );
        });

    });


    // ------------- usernamref testcases
    it('TC 06: createQuote API rejects usernameref with characters larger than 64', () => {
        createQuote(
            { ticker: 'BTC-USD', tradeSide: 'buy', deliverQuantity: '1', accountId: ACCOUNT_ID, usernameRef: INVALID_USER_REFERENCE },
            { allowedToFail: true }
        ).then((res) => {
            cy.log(JSON.stringify(res.body));
            expect(res.status).to.eq(400);

            expect(res.body.errors[0].id).to.exist
            expect(res.body.errors[0].message).to.eq(`data/usernameRef must NOT have more than 64 characters`);
        });
    });


    VALID_USER_REFERENCES.forEach(({ usernameRef, description }) => {
        it(`TC 07: createQuote API accepts usernameRef with ${description}`, () => {
            createQuote(
                { ticker: 'ETH-USD', tradeSide: 'buy', deliverQuantity: '1', accountId: ACCOUNT_ID, usernameRef },
                { allowedToFail: true }
            ).then((res) => {
                expect(res.duration).to.be.below(3000);

                expect(res.body.type).to.eq(ACK_TYPES.createQuote);
                expect(res.body).to.be.jsonSchema(createQuoteAckSchema);

                const payload = res.body.data;
                expect(payload.symbol).to.eq('ETH-USD');
                expect(payload.side).to.eq('buy');
                expect(payload.quoteId).to.exist


                expect(payload.receiveCurrency).to.eq('ETH');
                expect(payload.deliverCurrency).to.eq('USD');

                expect(payload.quoteTime).to.be.closeTo(Date.now(), 3000) // allow for some time drift at most 1 second,
                expect(payload.expireTime).to.be.greaterThan(payload.quoteTime);
                expect(payload.expireTime - payload.quoteTime).to.eq(8000);
            });
        });
    });


    it('TC 08: createQuote API returns a valid quote with usernameRef specified', () => {
        createQuote(
            { ticker: 'ETH-USD', tradeSide: 'buy', deliverQuantity: '1', accountId: ACCOUNT_ID, usernameRef: "testrefrence" },
            { allowedToFail: true }
        ).then((res) => {
            expect(res.status).to.eq(200);
            expect(res.duration).to.be.below(3000);

            expect(res.body.type).to.eq(ACK_TYPES.createQuote);
            expect(res.body).to.be.jsonSchema(createQuoteAckSchema);

            const payload = res.body.data;
            expect(payload.symbol).to.eq('ETH-USD');
            expect(payload.side).to.eq('buy');

            expect(payload.receiveCurrency).to.eq('ETH');
            expect(payload.deliverCurrency).to.eq('USD');
            expect(payload.quoteId).to.exist;

            expect(payload.quoteTime).to.be.closeTo(Date.now(), 3000) // allow for some time drift at most 1 second,
            expect(payload.expireTime).to.be.greaterThan(payload.quoteTime);
            expect(payload.expireTime - payload.quoteTime).to.eq(8000);
        });
    });


    INVALID_USERNAME_REF_SPECIAL_CHARACTERS.forEach(({ usernameRef }) => {
        it(`TC 09: createQuote API rejects usernameRef containing invalid characters (${JSON.stringify(usernameRef)})`, () => {
            createQuote(
                {
                    ticker: 'BTC-USD',
                    tradeSide: 'buy',
                    deliverQuantity: '1',
                    accountId: ACCOUNT_ID,
                    usernameRef
                },
            { allowedToFail: true }
            ).then((res) => {
                cy.log(JSON.stringify(res.body));

                expect(res.status).to.eq(400);
                expect(res.body.errors[0].id).to.exist;
                expect(res.body.errors[0].message).to.eq("usernameRef must not contain special characters");
            });
        });
    });


    it('TC 10: createQuote API rejects usernameref with characters larger than 64', () => {
        createQuote(
            { ticker: 'BTC-USD', tradeSide: 'buy', deliverQuantity: '1', accountId: ACCOUNT_ID, usernameRef: INVALID_USER_REFERENCE },
            { allowedToFail: true }
        ).then((res) => {
            cy.log(JSON.stringify(res.body));
            expect(res.status).to.eq(400);

            expect(res.body.errors[0].id).to.exist
            expect(res.body.errors[0].message).to.eq(`data/usernameRef must NOT have more than 64 characters`);
        });
    });


    // ----Missing field testcases
    it('TC 11: createQuote API rejects when accountId is not specified or is invalid', () => {
        createQuote(
            { ticker: 'BTC-USD', tradeSide: 'buy', deliverQuantity: '1' },
            { allowedToFail: true }
        ).then((res) => {
            expect(res.status).to.eq(400);

            expect(res.body.errors[0].id).to.exist
            expect(res.body.errors[0].message).to.eq(`data must have required property 'accountId'`);
        });
    });


    it('TC 12: createQuote API rejects when ticker is not specified', () => {
        createQuote(
            { tradeSide: 'buy', deliverQuantity: '1', accountId: ACCOUNT_ID },
            { allowedToFail: true }
        ).then((res) => {
            expect(res.status).to.eq(400);

            expect(res.body.errors[0].id).to.exist
            expect(res.body.errors[0].message).to.eq(`data must have required property 'ticker'`);
        });
    });


    it('TC 13: createQuote API rejects when tradeSide is not specified or is invalid', () => {
        createQuote(
            { ticker: 'BTC-USD', deliverQuantity: '1', accountId: ACCOUNT_ID },
            { allowedToFail: true }
        ).then((res) => {
            expect(res.status).to.eq(400);

            expect(res.body.errors[0].id).to.exist
            expect(res.body.errors[0].message).to.eq(`data must have required property 'tradeSide'`);
        });
    });


    it('TC 14: createQuote API rejects when receiveQuantity and deliverQuantity are not specified or are invalid', () => {
        createQuote(
            { ticker: 'BTC-USD', tradeSide: 'buy', accountId: ACCOUNT_ID },
            { allowedToFail: true }
        ).then((res) => {
            expect(res.status).to.eq(400);

            expect(res.body.errors[0].id).to.exist
            expect(res.body.errors[0].message).to.eq(
                'Exactly one of deliverQuantity or receiveQuantity must be specified'
            );
        });
    });


    //-------INVALID DATA TEST CASES
    it('TC 15: createQuote API rejects when accountId is has invalid data', () => {
        createQuote(
            { ticker: 'BTC-USD', tradeSide: 'buy', deliverQuantity: '1', accountId: 'invalid_account_id' },
            { allowedToFail: true }
        ).then((res) => {
            expect(res.status).to.eq(400);

            expect(res.body.errors[0].id).to.exist
            expect(res.body.errors[0].message).to.match(/accountId invalid_account_id not found/);
        });
    });


    INVALID_TICKERS.forEach(({ ticker }) => {
        it(`TC 16: createQuote API rejects invalid ticker ${ticker}`, () => {
            createQuote(
                { ticker, tradeSide: 'buy', deliverQuantity: '1', accountId: ACCOUNT_ID },
                { allowedToFail: true }
            ).then((res) => {
                expect(res.status).to.eq(400);

                expect(res.body.errors[0].id).to.exist
                expect(res.body.errors[0].message).to.eq(`Invalid ticker: ${ticker}`);
            });
        });
    });


    it('TC 17: createQuote API rejects when tradeSide is invalid', () => {
        createQuote(
            { ticker: 'BTC-USD', deliverQuantity: '1', tradeSide: 'invalid', accountId: ACCOUNT_ID },
            { allowedToFail: true }
        ).then((res) => {
            expect(res.status).to.eq(400);

            expect(res.body.errors[0].id).to.exist
            expect(res.body.errors[0].message).to.eq(`tradeSide must be one of buy,sell,BUY,SELL,Buy,Sell`);
        });
    });

    INVALID_DELIVER_QUANTITIES.forEach(({ deliverQuantity, expectedMessage }) => {
        it(`TC 18: createQuote API rejects invalid deliverQuantity ${deliverQuantity}`, () => {
            createQuote(
                { ticker: 'BTC-USD', tradeSide: 'buy', deliverQuantity: String(deliverQuantity), accountId: ACCOUNT_ID },
                { allowedToFail: true }
            ).then((res) => {
                expect(res.status).to.eq(400);

                expect(res.body.errors[0].id).to.exist
                expect(res.body.errors[0].message).to.eq(expectedMessage);
            });
        });
    });
});
