const isomorphic = require('isomorphic-fetch');
const { expect } = require('chai');
const { StatusCodes } = require('http-status-codes');

const chai = require('chai');
const chaiSubset = require('chai-subset');

chai.use(chaiSubset);

const path = 'https://api.github.com';
const token = process.env.ACCESS_TOKEN;

const myPromise = 'new Promise((resolve) => {resolve(response);})';

const myGist = {
  description: 'Example of a gist',
  public: true,
  files: {
    'prueba.js': {
      content: myPromise
    }
  }
};

let response;
let myJsonGist;
let gistsCreated;
let gistsDeleted;
let gistNotFound;

describe('Gist isomorphic-fetch', () => {
  before(async () => {
    response = await isomorphic(`${path}/gists`, {
      method: 'POST',
      body: JSON.stringify(myGist),
      headers: { Authorization: `token ${token}` }
    });
    myJsonGist = await response.json();
  });

  it('Verify the creation of a gist', () => {
    expect(response.status).to.equal(StatusCodes.CREATED);
    expect(myJsonGist).to.containSubset(myGist);
  });

  describe('Method to find a gist', () => {
    before(async () => {
      gistsCreated = await isomorphic(myJsonGist.url, {
        method: 'GET',
        headers: { Authorization: `token ${token}` }
      });
    });

    it('Verify that the created gist exists', () => {
      expect(gistsCreated.status).to.equal(StatusCodes.OK);
    });

    describe('Method to delete a gist', () => {
      before(async () => {
        gistsDeleted = await isomorphic(myJsonGist.url, {
          method: 'DELETE',
          headers: { Authorization: `token ${token}` }
        });
      });

      it('Verify that the gist is removed', () => {
        expect(gistsDeleted.status).to.equal(StatusCodes.NO_CONTENT);
      });
    });

    describe('Method to find my gist', () => {
      before(async () => {
        gistNotFound = await isomorphic(myJsonGist.url, {
          method: 'GET',
          headers: { Authorization: `token ${token}` }
        });
      });

      it('Verify that the created gist no exists', () => {
        expect(gistNotFound.status).to.equal(StatusCodes.NOT_FOUND);
      });
    });
  });
});
