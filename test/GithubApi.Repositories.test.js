const axios = require('axios');
const { expect } = require('chai');
const { StatusCodes } = require('http-status-codes');
const md5 = require('md5');

const chai = require('chai');
const chaiSubset = require('chai-subset');

chai.use(chaiSubset);

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

let jasmineReportRepository;
let md5downloaded;
let readmeData;
let md5downloadedReadme;

let serviceHypermedia;
let repositories;
let downloadedRepo;
let repositoryContent;
let downloadedReadme;

describe('GET methods', () => {
  before(async () => {
    serviceHypermedia = await axios.get(`${path}`);
  });

  it('User verification', async () => {
    expect(serviceHypermedia.status).to.equal(StatusCodes.OK);
    expect(serviceHypermedia.data.name).to.equal(user.name);
    expect(serviceHypermedia.data.company).to.equal(user.company);
    expect(serviceHypermedia.data.location).to.equal(user.location);
  });

  describe('GET methods', () => {
    before(async () => {
      repositories = await axios.get(`${path}/repos`);
      const repositoriesData = repositories.data;
      jasmineReportRepository = repositoriesData.find(({ name }) => name === 'jasmine-json-report');
    });

    it('Repository Content Verification', async () => {
      expect(repositories.status).to.equal(StatusCodes.OK);
      expect(jasmineReportRepository.full_name).to.equal(jasmineRepository.full_name);
      expect(jasmineReportRepository.private).to.equal(jasmineRepository.private);
      expect(jasmineReportRepository.description).to.equal(jasmineRepository.description);
    });

    describe('Service archive_url', () => {
      before(async () => {
        const jasmineRepo = jasmineReportRepository.archive_url;
        const result = jasmineRepo.replace('{archive_format}{/ref}', 'zipball');
        downloadedRepo = await axios.get(`${result}`);
        md5downloaded = md5(downloadedRepo.data);
      });

      it('Verify repository download', async () => {
        expect(downloadedRepo.status).to.equal(StatusCodes.OK);
        expect(md5downloaded).to.equal('408fe7c00b0f184a0c2bd5bdf4cff55e');
      });
    });

    describe('Service url', () => {
      before(async () => {
        repositoryContent = await axios.get(`${jasmineReportRepository.url}/contents/`);
        readmeData = repositoryContent.data.find(({ name }) => name === 'README.md');
      });
      it('Verify the content of the README.md', async () => {
        expect(repositoryContent.status).to.equal(StatusCodes.OK);
        expect(readmeData).to.containSubset({
          name: readme.name,
          path: readme.path,
          sha: readme.sha
        });
      });

      describe('download_url', () => {
        before(async () => {
          downloadedReadme = await axios.get(`${readmeData.download_url}`);
          md5downloadedReadme = md5(downloadedReadme.data);
        });

        it('Verify readme download', async () => {
          expect(downloadedReadme.status).to.equal(StatusCodes.OK);
          expect(md5downloadedReadme).to.equal('497eb689648cbbda472b16baaee45731');
        });
      });
    });
  });
});
