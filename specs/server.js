const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server');

chai.use(chaiHttp);

const { request, expect } = chai;

describe('POST /take/', function() {
  this.timeout(10000);
  
  it('should return an error when passed invalid endpoint', async () => {
    const response = await request(app).post('/take/').send({ endpoint: '' });
    
    expect(response.status).to.equal(400);
    expect(response.body).to.deep.equal({
      errorMessage: 'Invalid endpoint.',
    });
  });
  
  it('should consume a token from endpoint GET /user/:id', async () => {
    const response = await request(app).post('/take/').send({ endpoint: 'GET /user/:id' });

    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal({
      accepted: true,
      remainingTokens: 9,
    });
  });
  
  it('should consume a token from endpoint PATCH /user/:id', async () => {
    const response = await request(app).post('/take/').send({ endpoint: 'PATCH /user/:id' });

    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal({
      accepted: true,
      remainingTokens: 9,
    });
  });
  
  it('should return accepted: false when limit is reached', async () => {
    for (let i = 0; i < 10; i++) {
      await request(app).post('/take/').send({ endpoint: 'GET /user/:id' });
    }
    const response = await request(app).post('/take/').send({ endpoint: 'GET /user/:id' });

    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal({
      accepted: false,
      remainingTokens: 0,
    });
  });
  
  describe('refilling tokens', () => {
    it('should refill tokens after a delay', async () => {
      await request(app).post('/take/').send({ endpoint: 'POST /userinfo' });
      await new Promise(resolve => setTimeout(resolve, 601));
      const response = await request(app).post('/take/').send({ endpoint: 'POST /userinfo' });
      
      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal({
        accepted: true,
        remainingTokens: 299,
      });
    });
    
    it('should not refill past the burst capacity', async () => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const response = await request(app).post('/take/').send({ endpoint: 'POST /userinfo' });
      
      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal({
        accepted: true,
        remainingTokens: 299,
      });
    });
  });
  
});
