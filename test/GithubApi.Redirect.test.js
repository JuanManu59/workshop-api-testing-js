const axios = require('axios');
const { expect } = require('chai');
const { StatusCodes } = require('http-status-codes');

const path = 'https://github.com/aperdomob';

let response;

describe('Method head', () => {
  before(async () => {
    response = await axios.head(`${path}/redirect-test`);
  });

  it('Verify that it redirects', () => {
    expect(response.status).to.equal(StatusCodes.OK);
    expect(response.headers).to.have.property('content-type');
    expect(response.data).to.eql('');
    expect(response.request.res.responseUrl).to.equal(`${path}/new-redirect-test`);
  });

  describe('Method to verify redirect', () => {
    before(async () => {
      response = await axios.get(`${path}/redirect-test`);
    });

    it('verify that it redirects correctly', () => {
      expect(response.status).to.equal(StatusCodes.OK);
      expect(response.headers).to.have.property('content-type');
      expect(response.data).to.not.be.eql('');
      expect(response.request.res.responseUrl).to.equal(`${path}/new-redirect-test`);
    });
  });
});
