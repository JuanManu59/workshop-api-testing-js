const axios = require('axios');
const { expect } = require('chai');
const { StatusCodes } = require('http-status-codes');

const chai = require('chai');
const chaiSubset = require('chai-subset');

chai.use(chaiSubset);

const path = 'https://api.github.com';
const token = process.env.ACCESS_TOKEN;

const myGist = {
  description: 'Example of a gist',
  public: true,
  files: {
    'README.md': {
      content: 'Hello World'
    }
  }
};

const instance = axios.create({
  baseURL: path,
  headers: { Authorization: `token ${token}` }
});

let response;
let gistsPath;
let resultgistsPath;

describe('Gist', () => {
  before(async () => {
    response = await instance.post(`${path}/gists`, myGist);
  });

  it('Verify the creation of a gist', () => {
    expect(response.status).to.equal(StatusCodes.CREATED);
    expect(response.data).to.containSubset({
      description: myGist.description,
      private: myGist.private,
      body: myGist.body
    });
  });

  describe.only('Method to find a gist', () => {
    before(async () => {
      gistsPath = response.data.owner.gists_url;
      resultgistsPath = gistsPath.replace('{/gist_id}', `/${response.data.id}`);
      gistsList = await instance.get(resultgistsPath);
    });

    it('Verify that the created gist exists', () => {
      expect(gistsList.status).to.equal(StatusCodes.OK);
    });

    describe.only('Method to delete a gist', () => {
        before(async () => {
          gistsList = await instance.delete(resultgistsPath);
        });
    
        it('Verify that the gist is removed', () => {
          expect(gistsList.status).to.equal(StatusCodes.OK);
        });
      });

      describe.only('Method to delete a gist', () => {
        before(async () => {
            gistsList = await instance.get(resultgistsPath);
          });
      
          it('Verify that the created gist exists', () => {
            expect(gistsList.status).to.equal(StatusCodes.OK);
          });
      });
  });
});
