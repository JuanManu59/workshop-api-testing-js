const axios = require('axios');
const { expect } = require('chai');
const { StatusCodes } = require('http-status-codes');

const path = 'https://api.github.com/user';
const token = process.env.ACCESS_TOKEN;

let response;
let reposCount = false;
let repositories;
let myRepo;
let issue;
let pathIssue;

const myIssue = {
  title: 'Found a bug'
};

const bodyIssue = {
  body: 'Im having a problem with this.'
};

const instance = axios.create({
  baseURL: path,
  headers: { Authorization: `token ${token}` }
});

describe('Post and patch methods', () => {
  before(async () => {
    response = await instance.get(`${path}`);
    if (response.data.public_repos > 0) {
      reposCount = true;
    }
  });

  it('Verify the service', () => {
    expect(response.status).to.equal(StatusCodes.OK);
    expect(reposCount).to.equal(true);
  });

  describe('Verify the list of repositories', () => {
    before(async () => {
      repositories = await instance.get(`${response.data.repos_url}`);
      myRepo = repositories.data.find(({ name }) => name === 'workshop-api-testing-js');
    });

    it('Repository Content Verification', () => {
      expect(repositories.status).to.equal(StatusCodes.OK);
      expect(myRepo).not.to.equal(null);
    });

    describe('Verify the service to create an issue', () => {
      before(async () => {
        pathIssue = `https://api.github.com/repos/${myRepo.owner.login}/${myRepo.name}/issues`;
        issue = await instance.post(pathIssue, myIssue);
      });

      it('Consume the service to create an issue', () => {
        expect(issue.status).to.equal(StatusCodes.CREATED);
        expect(issue.data.title).to.equal(myIssue.title);
        expect(issue.data.body).to.equal(null);
      });

      describe('Verify that the issue is modified', () => {
        before(async () => {
          issue = await instance.patch(`${pathIssue}/${issue.data.number}`, bodyIssue);
        });

        it('Consume the service to modify the issue', () => {
          expect(issue.status).to.equal(StatusCodes.OK);
          expect(issue.data.title).to.equal(myIssue.title);
          expect(issue.data.body).to.equal(bodyIssue.body);
        });
      });
    });
  });
});
