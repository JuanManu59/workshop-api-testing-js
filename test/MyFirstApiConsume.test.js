const axios = require('axios');
const { expect } = require('chai');
const { StatusCodes } = require('http-status-codes');

const path = 'https://httpbin.org';

const query = {
    name: 'Carlo',
    age: '19',
    city: 'New York'
};

describe('First Api Tests', () => {
    it('Consume GET Service', async () => {
        const response = await axios.get(`${path}/ip`);

        expect(response.status).to.equal(StatusCodes.OK);
        expect(response.data).to.have.property('origin');
    });

    it('Consume GET Service with query parameters', async () => {
        const response = await axios.get(`${path}/get`, { query });

        expect(response.status).to.equal(StatusCodes.OK);
        expect(response.config.query).to.eql(query);
    });

    it('Consume HEADER Service', async () => {
        const response = await axios.head(`${path}/headers`);
    
        expect(response.status).to.equal(StatusCodes.OK);
        expect(response.headers).to.have.property('content-type');
        expect(response.headers).to.have.property('content-length');
        expect(response.data).to.eql('');
    });

    it('Consume PATCH Service', async () => {
        const response = await axios.patch(`${path}/patch`, query );
    
        expect(response.status).to.equal(StatusCodes.OK);   
        expect(response.data.json).to.eql(query);
    });

    it('Consume PUT Service', async () => {
        const response = await axios.put(`${path}/put`,  query );
    
        expect(response.status).to.equal(StatusCodes.OK);
        expect(response.data.data).to.equal(JSON.stringify(query));
    });

    it('Consume DELETE Service', async () => {
        const response = await axios.delete(`${path}/delete`);
    
        expect(response.status).to.equal(StatusCodes.OK);
        expect(response.data.data).to.eql('');
    });
});
