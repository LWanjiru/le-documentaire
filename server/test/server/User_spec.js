/* global describe it */
const app = require('./../../../App');
const request = require('supertest');
const db = require('./../../models');

const User = db.User;

describe('POST /users/', () => {
  beforeEach((done) => {
    request(app).delete('/api/roles').end(done);
  });

  it('responds with a 201 the created user on success', () => {
    request(app)
    .post('/users/')
    .send({
      username: 'maryJ',
      firstName: 'Mary',
      lastName: 'Jones',
      password: '11112222',
      email: 'mary@example.com',
    })
    .expect(201)
    .expect('Content-Type', /json/)
    .expect(/"username":\s*"maryJ"/)
    .expect(/"firstName":\s*"Mary"/)
    .expect(/"lastName":\s*"Jones"/)
    .expect(/"password":\s*"11112222"/)
    .expect(/"email":\s*"mary@example.com"/)
    .expect(/"title":\s*"regular"/);
  });
  it('GET /users/ responds with a 200 on success', (done) => {
    request(app)
      .get('/users/')
      .set('Accept', 'application/json')
      .expect(200)
      .expect('Content-Type', /json/, done);
  });
});
it('GET /users/ responds with 400 on fail', (done) => {
  request(app)
    .post('/users')
    .send({
      username: 'maryJ',
      firstName: 'Mary',
      lastName: 'Jones',
      password: '11112222',
      email: 'mary@example.com',
    })
    .expect(400)
    .expect('Content-Type', /json/, done);
});
describe('POST /users/', () => {
  beforeEach((done) => {
    request(app).post('/api/roles').end(done);
  });
  it('should load', (done) => {
    User.create({
      username: 'bubbly',
      firstName: 'Marie',
      lastName: 'Agnes',
      password: '11112222',
      email: 'marble@example.com',
    });
    done();
  });
});
