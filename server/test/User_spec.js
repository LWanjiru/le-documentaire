/* global describe it */
const app = require('./../../app');
const request = require('supertest');

describe('POST /users', () => {
  it('responds with a 201 the created user on success', () => {
    request(app)
    .post('/users')
    .send({
      username: 'maryJ',
      firstName: 'Mary',
      lastName: 'Jones',
      password: '11112222',
      email: 'mary@example.com',
    })
    .set('Accept', 'application/json')
    .expect(201)
    .expect('Content-Type', /json/)
    .expect(/"username":\s*"maryJ"/)
    .expect(/"firstName":\s*"Mary"/)
    .expect(/"lastName":\s*"Jones"/)
    .expect(/"password":\s*"11112222"/)
    .expect(/"email":\s*"mary@example.com"/);
  });
  it('GET /users responds with a 200 on success', () => {
    request(app)
      .get('/users')
      .set('Accept', 'application/json')
      .expect(200)
      .expect('Content-Type', /json/);
  });
});
