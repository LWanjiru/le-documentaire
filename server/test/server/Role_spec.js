/* global describe it beforeEach*/
const app = require('./../../../app');
const request = require('supertest');

describe('POST /api/roles ', () => {
  beforeEach((done) => {
    request(app).delete('/api/roles').end(done);
  });

  it('responds with a 201 the created role on success', (done) => {
    request(app)
      .post('/api/roles')
      .send({ title: 'author', description: 'They write' })
      .set('Accept', 'application/json')
      .expect(201)
      .expect('Content-Type', /json/)
      .expect(/"title":\s*"author"/)
      .expect(/"description":\s*"They write"/, done);
  });
});
describe('POST /api/roles ', () => {
  beforeEach((done) => {
    request(app).post('/api/roles').end(done);
  });
  it('responds with a 400 the role not created for duplicate', (done) => {
    request(app)
  .post('/api/roles')
  .send({ title: 'author', description: 'They write' })
  .set('Accept', 'application/json')
  .expect(400)
  .expect('Content-Type', /json/, done);
  });
});
it('GET /roles responds with a 200 on success', (done) => {
  request(app)
  .get('/api/roles')
  .set('Accept', 'application/json')
  .expect(200)
  .expect('Content-Type', /json/, done);
});
