const axios = require('axios');
const { expect } = require('chai');
const { StatusCodes } = require('http-status-codes');

const path = 'https://api.github.com/user/following/aperdomob';
const token = '';

let response;
let followingList;

const instance = axios.create({
  baseURL: path,
  headers: { Authorization: `token ${token}` }
});

describe('PUT methods', () => {
  before(async () => {
    response = await instance.put(`${path}`);
  });

  it('Follow a user service', () => {
    expect(response.status).to.equal(StatusCodes.NO_CONTENT);
    expect(response.data).to.equal('');
  });

  describe('Verify following List', () => {
    before(async () => {
      const result = path.replace('/aperdomob', '');
      followingList = await instance.get(`${result}`);
    });

    it('Method to get list of followed', () => {
      expect(followingList.status).to.equal(StatusCodes.OK);
      expect(followingList.data[0].login).to.equal('aperdomob');
    });
  });

  describe('Verify the idempotence of the method', () => {
    before(async () => {
      response = await instance.put(`${path}`);
    });

    it('follow a user a second time', () => {
      expect(response.status).to.equal(StatusCodes.NO_CONTENT);
      expect(response.data).to.equal('');
    });
  });
});
