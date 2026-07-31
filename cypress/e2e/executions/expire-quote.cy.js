import { expireQuote, executeQuote } from '../../support/client/executions/rfqClient';
import { ACK_TYPES, ACCOUNT_ID } from '../../support/data/rfqConstants';
import expireQuoteAckSchema from '../../support/schemas/expireQuoteAck.schema.json';
import { freshQuote } from '../../support/client/executions/rfqHelpers';

describe('Test Suite: RFQ EXPIRE QUOTE Tests', () => {

    // ---------VALID EXPIRE QUOTE TEST CASES----------------
    it('TC 01: expireQuote API expires a valid quote', () => {
        freshQuote().then((quoteId) => {
            expireQuote(quoteId).then((res) => {
                expect(res.status).to.eq(200);
                expect(res.duration).to.be.below(3000);

                expect(res.body).to.be.jsonSchema(expireQuoteAckSchema);
                expect(res.body.type).to.eq(ACK_TYPES.expireQuote);

                const data = res.body.data;

                expect(data.quoteId).to.eq(quoteId);
                expect(data.quoteId).to.match(
                    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
                );
            });
        });
    });


    // ---------INVALID EXPIRE QUOTE TEST CASES----------------
    it('TC 02: expireQuote API rejects expiring a quote that has already  been expired', () => {
        freshQuote().then((quoteId) => {
            expireQuote(quoteId).then((first) => {
                expect(first.status).to.eq(200);
                return expireQuote(quoteId, { allowedToFail: true });
            }).then((second) => {

                expect(second.status).to.eq(400);
                expect(second.body.errors[0].id).to.exist
                expect(second.body.errors[0].message).to.eq(`quoteId: ${quoteId} has already been processed`);

            });
        });
    });


    it('TC 03: expireQuote API rejects expiring a quote that has been executed', () => {
        freshQuote().then((quoteId) => {
            executeQuote(quoteId).then(() => {
                expireQuote(quoteId, { allowedToFail: true }).then((res) => {
                    expect(res.status).to.eq(400);

                    expect(res.body.errors[0].message).to.exist;
                    expect(res.body.errors[0].message).to.eq(`quoteId: ${quoteId} has already been processed`);

                });
            });
        });
    });



    it('TC 04: expireQuote API rejects when quoteId is not a string', () => {
        expireQuote({}, { allowedToFail: true }).then((res) => {
            expect(res.status).to.eq(400);
            expect(res.body.errors[0].message).to.exist;
            expect(res.body.errors[0].message).to.eq('data/quoteId must be string');
        });
    });;

});