const axios = require('axios');
const { expect } = require('chai');
const { StatusCodes } = require('http-status-codes');
const md5 = require('md5');

const path = 'https://api.github.com/users/aperdomob';

const user = {
  name: 'Alejandro Perdomo',
  company: 'Perficient Latam',
  location: 'Colombia'
};

const jasmineRepository = {
  full_name: 'aperdomob/jasmine-json-report',
  private: false,
  description: 'A Simple Jasmine JSON Report'
};

const readme = {
  name: 'README.md',
  path: 'README.md',
  sha: '360eee6c223cee31e2a59632a2bb9e710a52cdc0'
};

let jasmineReportRepository = null;

describe('GET methods', () => {
  it('User verification', async () => {
    const serviceHypermedia = await axios.get(`${path}`);

    expect(serviceHypermedia.status).to.equal(StatusCodes.OK);
    expect(serviceHypermedia.data.name).to.equal(user.name);
    expect(serviceHypermedia.data.company).to.equal(user.company);
    expect(serviceHypermedia.data.location).to.equal(user.location);
  });

  it('Repository Content Verification', async () => {
    const repositories = await axios.get(`${path}/repos`);
    const repositoriesData = repositories.data;
    jasmineReportRepository = repositoriesData.find(({ name }) => name === 'jasmine-json-report');

    expect(repositories.status).to.equal(StatusCodes.OK);
    expect(jasmineReportRepository.full_name).to.equal(jasmineRepository.full_name);
    expect(jasmineReportRepository.private).to.equal(jasmineRepository.private);
    expect(jasmineReportRepository.description).to.equal(jasmineRepository.description);
  });

  it('Verify repository download', async () => {
    const downloadedRepo = await axios.get(`${jasmineReportRepository.html_url}/archive/refs/heads/${jasmineReportRepository.default_branch}/.zip`);
    const md5downloaded = md5(downloadedRepo.data);

    expect(downloadedRepo.status).to.equal(StatusCodes.OK);
    expect(md5downloaded).to.equal('3876dfb1a98166adfcd5829cc4b3d156');
  });

  it('Verify the content of the README.md', async () => {
    const repositoryContent = await axios.get(`${jasmineReportRepository.url}/contents/`);
    const readmeData = repositoryContent.data.find(({ name }) => name === 'README.md');

    expect(readmeData.name).to.equal(readme.name);
    expect(readmeData.path).to.equal(readme.path);
    expect(readmeData.sha).to.equal(readme.sha);
  });
});
