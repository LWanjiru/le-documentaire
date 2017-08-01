const app = require('./../../../App');
const request = require('supertest');
const chai = require('chai');

const expect = chai.expect;

const db = require('./../../models');

const User = db.User;
const Role = db.Role;

describe('POST /users/', () => {
  after((done) => {
    request(app)
    .delete('/users')
    .end(done);
  });

  it('POST /users/ responds with 201 on user create success', (done) => {
    request(app)
      .post('/users/')
      .send({
        username: 'maryJ',
        firstName: 'Mary',
        lastName: 'Jones',
        email: 'mary@example.com',
        password: '11112222',
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(201);
        expect(res.body.newUser).to.have.property('id');
        expect(res.body.newUser).to.have.property('username');
        expect(res.body.newUser).to.have.property('firstName');
        expect(res.body.newUser).to.have.property('lastName');
        expect(res.body.newUser).to.have.property('email');
        expect(res.body.newUser).to.have.property('password');
        done();
      });
  });
});
