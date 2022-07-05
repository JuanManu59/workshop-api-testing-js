const axios = require('axios');

const chai = require('chai');
//  importan chai-json-schema  npm install --save-dev chai-json-schema
const { expect } = chai;
const chaiJson = require('chai-json-schema');
const { listPublicEventsSchema } = require('../schema/ListPublicEvents.schema');

chai.use(chaiJson);

const urlBase = 'https://api.github.com';

describe('Given event Github API resources', () => {
  describe('When wanna verify the List public events', () => {
    let response;

    before(async () => {
      response = await axios.get(`${urlBase}/events`, {
        headers: {
          Authorization: `token ${process.env.ACCESS_TOKEN}`
        }
      });
    });

    it('then the body should have a schema', () => expect(response).to.be.jsonSchema(listPublicEventsSchema));
  });
});
