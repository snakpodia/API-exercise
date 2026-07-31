import { executeQuote } from '../../support/client/executions/rfqClient';
import { ACK_TYPES, ACCOUNT_ID } from '../../support/data/rfqConstants';
import executeQuoteAckSchema from '../../support/schemas/executeQuoteAck.schema.json';
import { freshQuote } from '../../support/client/executions/rfqHelpers';

describe('Test Suite: RFQ EXECUTE QUOTE Tests', () => {

    //----------VALID EXECUTE QUOTE TEST CASES----------------
    it('TC 01: executeQuote API returns a valid response with unexpired quote', () => {
        freshQuote().then((quoteId) => {
            cy.wait(2000);

            executeQuote(quoteId).then((res) => {
                expect(res.status).to.eq(200);
                expect(res.duration).to.be.below(3000);

                expect(res.body.type).to.eq(ACK_TYPES.executeQuote);
                expect(res.body).to.be.jsonSchema(executeQuoteAckSchema);


                const data = res.body.data;

                expect(data.quoteId).to.eq(quoteId);
                expect(data.quoteId).to.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);

                expect(data.accountId).to.eq(ACCOUNT_ID);

                const tradeDate = new Date(data.tradeDate);
                const valueDate = new Date(data.valueDate);

                expect(valueDate).to.be.greaterThan(tradeDate);
            });
        });
    });


    it('TC 02: executeQuote API returns a invalid response when quote is expired', () => {
        freshQuote().then((quoteId) => {
            cy.wait(9000); //hard wait IS specially used here to ensure the quote expires before execution. 8s is the TTL for a quote.

            executeQuote(quoteId, { allowedToFail: true }).then((res) => {
                expect(res.status).to.eq(400);

                const data = res.body;
                expect(data.errors[0].id).to.exist
                expect(data.errors[0].message).to.eq(`quoteId: ${quoteId} has expired`);
            });
        });
    });


    it('TC 03: executeQuote API returns a invalid response when quote has already been executed', () => {
        freshQuote().then((quoteId) => {
            executeQuote(quoteId).then((first) => {
                expect(first.status).to.eq(200); // first execute succeeds

                return executeQuote(quoteId, { allowedToFail: true }); // second, same quoteId
            }).then((second) => {
                expect(second.status).to.eq(400);

                expect(second.body.errors[0].id).to.exist
                expect(second.body.errors[0].message).to.eq(`quoteId: ${quoteId} has already been processed`);
            });
        });
    });


    it('TC 04: executeQuote API returns a invalid response when quote never existed', () => {
        const nonExistentQuoteId = '00000000-0000-4000-8000-000000000000';
        executeQuote(nonExistentQuoteId, { allowedToFail: true }).then((res) => {
            expect(res.status).to.eq(404);

            expect(res.body.errors[0].id).to.exist
            expect(res.body.errors[0].message).to.eq(`quoteId: ${nonExistentQuoteId} does not exist`);
        });
    });


    it('TC 05: executeQuote API returns a invalid response when quote is empty', () => {
        const emptyQuoteId = '';
        executeQuote(emptyQuoteId, { allowedToFail: true }).then((res) => {
            expect(res.status).to.eq(400);

            expect(res.body.errors[0].id).to.exist
            expect(res.body.errors[0].message).to.eq(`quoteId cannot be empty`);
        });
    });


    it('TC 06: executeQuote API rejects a invalid or missing quoteID key', () => {
        executeQuote({}, { allowedToFail: true }).then((res) => {
            expect(res.status).to.eq(400);

            expect(res.body.errors[0].id).to.exist
            expect(res.body.errors[0].message).to.eq(`data/quoteId must be string`);
        });
    });
});
