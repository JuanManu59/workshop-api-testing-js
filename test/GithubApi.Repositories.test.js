const axios = require('axios');
const { expect } = require('chai');
const { StatusCodes } = require('http-status-codes');
const md5 = require('md5');

const path = 'https://api.github.com/users/aperdomob';
const path2 = 'https://api.github.com/repos/aperdomob';

const query1 = {
  name: 'Alejandro Perdomo',
  company: 'Perficient Latam',
  location: 'Colombia'
};

const query2 = {
  full_name: 'aperdomob/jasmine-json-report',
  private: false,
  description: 'A Simple Jasmine JSON Report'
};

const query3 = {
  name: 'README.md',
  path: 'README.md',
  sha: '360eee6c223cee31e2a59632a2bb9e710a52cdc0'
};

let result = null;

describe('Metodos GET', () => {
  it('Verficacion del usuario', async () => {
    const response = await axios.get(`${path}`);

    expect(response.status).to.equal(StatusCodes.OK);
    expect(response.data.name).to.equal(query1.name);
    expect(response.data.company).to.equal(query1.company);
    expect(response.data.location).to.equal(query1.location);
  });

  it('Verficacion del contenido del repositorio', async () => {
    const response = await axios.get(`${path}/repos`);
    const repos = response.data;
    result = repos.find(({ name }) => name === 'jasmine-json-report');

    expect(response.status).to.equal(StatusCodes.OK);
    expect(result.full_name).to.equal(query2.full_name);
    expect(result.private).to.equal(query2.private);
    expect(result.description).to.equal(query2.description);
  });

  it('Verfica que descargue correctamente el repositorio', async () => {
    const descargaJasmine = await axios.get(`${result.html_url}/archive/refs/heads/${result.default_branch}/.zip`);
    const md5Descarga = md5(descargaJasmine.data);

    expect(descargaJasmine.status).to.equal(StatusCodes.OK);
    expect(md5Descarga).to.equal('3876dfb1a98166adfcd5829cc4b3d156');
  });

  it('Verifica el contenido del README.md', async () => {
    const contenidoRepo = await axios.get(`${path2}/jasmine-json-report/contents/`);
    const readme = contenidoRepo.data.find(({ name }) => name === 'README.md');

    expect(readme.name).to.equal(query3.name);
    expect(readme.path).to.equal(query3.path);
    expect(readme.sha).to.equal(query3.sha);
  });
});
