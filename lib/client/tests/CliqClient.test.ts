import 'dotenv/config';
import { CliqCredentials } from "../src/beans";
import { Cliq } from '../src/client/Cliq';
import { CreateLink, CreatePromoter, CreatePurchase, CreateSignUp, RegisterForProgram } from '../src/client/methods';
import { Link, Promoter, Purchase, SignUp } from '@org-quicko/cliq-core';

let promoterId: string;
let refVal: string;

// dev
const baseUrl = "https://dev-cliq.quicko.com/api";
const programId = 'a3cef210-7b2c-4554-92ca-b7e02e64ccb8';

const apiKey = process.env.CLIQ_API_KEY || '';
const apiSecret = process.env.CLIQ_API_SECRET || '';

describe('Cliq Client tests.', () => {
    
    it('should create promoter.', async () => {
        const credentials = new CliqCredentials(apiKey, apiSecret);

        const cliqClient = new Cliq(credentials, baseUrl);

        const body = new Promoter();
		
		body.setName(`Silver Test User`);
		body.setLogoUrl('https://quicko.com/logo.png');

        const response = await cliqClient.PROMOTERS.createPromoter(programId, body);
        promoterId = response.getPromoterId()!;
    });

    it('should register promoter.', async () => {

        const credentials = new CliqCredentials(apiKey, apiSecret);

        const cliqClient = new Cliq(credentials, baseUrl);

        const body = new Promoter();
		body.setAcceptedTermsAndConditions(true);
		const circleId = 'b49177ce-58dd-4ae1-a029-aad9c15f9bd7';

		if (!promoterId) {
            throw new Error(`Promoter ID wasn't set`);
        }
        await cliqClient.PROMOTERS.registerPromoter(programId, promoterId, body, circleId);
    });

    it('should get promoter.', async () => {

        const credentials = new CliqCredentials(apiKey, apiSecret);

        const cliqClient = new Cliq(credentials, baseUrl);

        if (!promoterId) {
            throw new Error(`Promoter ID wasn't set`);
        }

        await cliqClient.PROMOTERS.getPromoter(programId, promoterId);
    });

    it('should create link.', async () => {

        const credentials = new CliqCredentials(apiKey, apiSecret);

        const cliqClient = new Cliq(credentials, baseUrl);

        const random4AlphaNumChars = Math.random().toString(36).substring(2, 6).toLowerCase();

        if (!promoterId) {
            throw new Error(`Promoter ID wasn't set`);
        }

        const body = new Link();
	
		body.setName(`Client Test User's Link`);
		body.setRefVal(`testrefval-${  random4AlphaNumChars}`);
        
		refVal = body.refVal!;

        await cliqClient.LINK.createLink(programId, promoterId, body);
    });

    it('should get link analytics.', async () => {

        const credentials = new CliqCredentials(apiKey, apiSecret);

        const cliqClient = new Cliq(credentials, baseUrl);

        if (!promoterId) {
            throw new Error(`Promoter ID wasn't set`);
        }

        await cliqClient.LINK.getLinkAnalytics(programId, promoterId);
    });

    it('should get create signup.', async () => {

        const credentials = new CliqCredentials(apiKey, apiSecret);

        const cliqClient = new Cliq(credentials, baseUrl);

        if (!promoterId) {
            throw new Error(`Promoter ID wasn't set`);
        }

        const body = new SignUp();
        const random4AlphaNumChars = Math.random().toString(36).substring(2, 6).toLowerCase();
        
		body.setEmail(`testmail${random4AlphaNumChars}@mail.com`);
        body.setPhone(`123456789808`);
        body.setRefVal(refVal);

        await cliqClient.SIGNUP.createSignUp(body);
    });

    it('should get create purchase.', async () => {

        const credentials = new CliqCredentials(apiKey, apiSecret);

        const cliqClient = new Cliq(credentials, baseUrl);

        if (!promoterId) {
            throw new Error(`Promoter ID wasn't set`);
        }

        const body = new Purchase();
        const random4AlphaNumChars = Math.random().toString(36).substring(2, 6).toLowerCase();
        

		body.setEmail(`testmail${random4AlphaNumChars}@mail.com`);
        body.setPhone(`1234567891`);
        body.setRefVal(refVal);
        body.setAmount(101);
        body.setItemId('item123');

        await cliqClient.PURCHASE.createPurchase(body);
    });
});
