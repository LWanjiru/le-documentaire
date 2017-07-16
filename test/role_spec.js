/* global describe it */
const app = require('../app');
const request = require('supertest');

describe('In the roles controller', () => {
  it('POST /roles responds with a 201 the created role on success', (done) => {
    request(app)
      .post('/api/roles')
      /* The title to be changed with each test
      as the title field doesn't allow for duplicate values
      */
      .send({ title: 'wedd', description: 'They marry' })
      .set('Accept', 'application/json')
      .expect(201)
      .expect('Content-Type', /json/)
      // These expects to be changed with each new test
      .expect(/"title":\s*"wedd"/)
      .expect(/"description":\s*"They marry"/, done);
  });
  it('GET /roles responds with a 200 on success', () => {
    request(app)
      .get('/api/roles')
      .set('Accept', 'application/json')
      .expect(200)
      .expect('Content-Type', /json/);
  });
});
