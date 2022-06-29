const axios = require('axios');
const { expect } = require('chai');
const { StatusCodes } = require('http-status-codes');

const path = 'https://api.github.com/user/following';
const token = process.env.ACCESS_TOKEN;

let response;
let followingList;
let userFind;

const instance = axios.create({
  baseURL: path,
  headers: { Authorization: `token ${token}` }
});

describe('PUT methods', () => {
  before(async () => {
    response = await instance.put(`${path}/aperdomob`);
  });

  it('Follow a user service', () => {
    expect(response.status).to.equal(StatusCodes.NO_CONTENT);
    expect(response.data).to.equal('');
  });

  describe('Verify following List', () => {
    before(async () => {
      followingList = await instance.get(`${path}`);
      userFind = followingList.data.find(({ login }) => login === 'aperdomob');
    });

    it('Method to get list of followed', () => {
      expect(followingList.status).to.equal(StatusCodes.OK);
      expect(userFind.login).to.equal('aperdomob');
    });
  });

  describe('Verify the idempotence of the method', () => {
    before(async () => {
      response = await instance.put(`${path}/aperdomob`);
    });

    it('follow a user a second time', () => {
      expect(response.status).to.equal(StatusCodes.NO_CONTENT);
      expect(response.data).to.equal('');
    });

    describe('Verify that continued to follow the user', () => {
      before(async () => {
        followingList = await instance.get(`${path}`);
        userFind = followingList.data.find(({ login }) => login === 'aperdomob');
      });

      it('Verify that follow the indicated user', () => {
        expect(followingList.status).to.equal(StatusCodes.OK);
        expect(userFind.login).to.equal('aperdomob');
      });
    });
  });
});
