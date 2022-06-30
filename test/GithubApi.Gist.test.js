const axios = require('axios');
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

const instance = axios.create({
  baseURL: path,
  headers: { Authorization: `token ${token}` }
});

let response;
let gistsCreated;
let gistsDeleted;
let error;

describe('Gist', () => {
  before(async () => {
    response = await instance.post(`${path}/gists`, myGist);
  });

  it('Verify the creation of a gist', () => {
    expect(response.status).to.equal(StatusCodes.CREATED);
    expect(response.data).to.containSubset(myGist);
  });

  describe('Method to find a gist', () => {
    before(async () => {
      gistsCreated = await instance.get(response.data.url);
    });

    it('Verify that the created gist exists', () => {
      expect(gistsCreated.status).to.equal(StatusCodes.OK);
    });

    describe('Method to delete a gist', () => {
      before(async () => {
        gistsDeleted = await instance.delete(response.data.url);
      });

      it('Verify that the gist is removed', () => {
        expect(gistsDeleted.status).to.equal(StatusCodes.NO_CONTENT);
      });
    });

    describe('Method to find my gist', () => {
      before(async () => {
        try {
          await instance.get(response.data.url);
        } catch (e) {
          error = e;
        }
      });

      it('Verify that the created gist no exists', () => {
        expect(error.response.status).to.equal(StatusCodes.NOT_FOUND);
      });
    });
  });
});
