const axios = require('axios');
const { expect } = require('chai');
const { StatusCodes } = require('http-status-codes');

const path = 'https://api.github.com';

let response;

describe('Github user list', () => {
  describe('Service to find 10 users', () => {
    before(async () => {
      response = await axios.get(`${path}/users`, { params: { per_page: 10 } });
    });

    it('the size of the list of users is 10', () => {
      expect(response.status).to.equal(StatusCodes.OK);
      expect(response.data.length).to.equal(10);
    });
  });

  describe('Service to find 100 users', () => {
    before(async () => {
      response = await axios.get(`${path}/users`, { params: { per_page: 100 } });
    });

    it('the size of the list of users is 100', () => {
      expect(response.status).to.equal(StatusCodes.OK);
      expect(response.data.length).to.equal(100);
    });
  });
});
