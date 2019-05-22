const chai = require('chai');
const app = require('../../server/App');
const Request = require('supertest');

const expect = chai.expect;

describe('Role', () => {
  describe('/users/', () => {});
  let token;

  before((done) => {
    Request(app)
    .post('/users/login')
    .set('Accept', 'application/x-www-form-urlencoded')
    .send({
      username: 'admin',
      password: 'administrator',
    })
    .end((err, res) => {
      token = res.body.token;
      done();
    });
  });

  it('POST /roles/add should return a 201 on create role success', (done) => {
    Request(app)
    .post('/roles/add')
    .set('x-access-token', token)
    .send({ title: 'TestRole', description: 'They are tested as new creations.' })
    .end((err, res) => {
      expect(res.statusCode).to.equal(201);
      expect(res.body.message).to.equal('Role created successfully!');
      done();
    });
  });

  it('POST /roles/add should return a 409 on create role if it already exists(FAIL)', (done) => {
    Request(app)
    .post('/roles/add')
    .set('x-access-token', token)
    .send({ title: 'TestRole', description: 'They are tested as new creations.' })
    .end((err, res) => {
      expect(res.statusCode).to.equal(409);
      expect(res.body.message).to.equal('Role already exists!');
      done();
    });
  });

  it('DELETE /roles/:title should return message if delete successful', (done) => {
    Request(app)
    .delete('/roles/testrole')
    .set('x-access-token', token)
    .end((err, res) => {
      expect(res.body.message).to.equal('Role deleted successfully!');
      done();
    });
  });

  it('POST /roles/add should return a 400 on create role with empty fields', (done) => {
    Request(app)
    .post('/roles/add')
    .set('x-access-token', token)
    .send({ title: '', description: '' })
    .end((err, res) => {
      expect(res.statusCode).to.equal(400);
      expect(res.body.message).to.equal('All fields are required!');
      done();
    });
  });

  it('GET /roles should return a 200 response on success getting roles', (done) => {
    Request(app)
    .get('/roles')
    .end((err, res) => {
      expect(res.statusCode).to.equal(200);
      done();
    });
  });

  it('GET /roles/:title should return a 200 if matching role title is found', (done) => {
    Request(app)
    .get('/roles/admin', '/roles/regular')
    .set('x-access-token', token)
    .end((err, res) => {
      expect(res.statusCode).to.equal(200);
      expect(res.body.title).to.equal('admin', 'regular');
      done();
    });
  });

  it('GET /roles/:title should return a 404 if role title is NOT found', (done) => {
    Request(app)
    .get('/roles/marketer', '/roles/farmer')
    .set('x-access-token', token)
    .end((err, res) => {
      expect(res.statusCode).to.equal(404);
      expect(res.body.message).to.equal('Role not found!');
      done();
    });
  });

  it('PUT /roles/:title should return a 200 if role description field update is successful', (done) => {
    Request(app)
    .put('/roles/regular')
    .set('x-access-token', token)
    .send({ description: 'They do regular stuff. And can do some cool stuff too.' })
    .end((err, res) => {
      expect(res.statusCode).to.equal(200);
      expect(res.body.message).to.equal('Role updated!');
      done();
    });
  });

  it('PUT /roles/:title should return a 400 if description field is empty', (done) => {
    Request(app)
    .put('/roles/regular')
    .set('x-access-token', token)
    .send({ description: '' })
    .end((err, res) => {
      expect(res.statusCode).to.equal(400);
      expect(res.body.message).to.equal('Please enter a description for the role!');
      done();
    });
  });

  it('PUT /roles/:title should return a 404 if the role title NOT found', (done) => {
    Request(app)
    .put('/roles/researcher')
    .set('x-access-token', token)
    .send({ description: 'This role has not been created.' })
    .end((err, res) => {
      expect(res.statusCode).to.equal(404);
      expect(res.body.message).to.equal('Role doesn\'t exist!');
      done();
    });
  });

  it('DELETE /roles/:title should return a 404 if the role title NOT found', (done) => {
    Request(app)
    .delete('/roles/researcher')
    .set('x-access-token', token)
    .end((err, res) => {
      expect(res.statusCode).to.equal(404);
      expect(res.body.message).to.equal('Role not found!');
      done();
    });
  });

  it('DELETE /roles/:title should return a 403 if the role title found is admin', (done) => {
    Request(app)
    .delete('/roles/admin', '/roles/regular')
    .set('x-access-token', token)
    .end((err, res) => {
      expect(res.statusCode).to.equal(403);
      expect(res.body.message).to.equal('That action is not allowed!');
      done();
    });
  });

  it('DELETE /roles/:title should return a 403 if ENV is production', (done) => {
    process.env.NODE_ENV = 'production';
    Request(app)
    .delete('/roles/random')
    .set('x-access-token', token)
    .end((err, res) => {
      expect(res.statusCode).to.equal(403);
      expect(res.body.message).to.equal('That action is not allowed!');
      done();
    });
  });

  it('DELETE /roles should return a 403 on DELETE fail if ENV is not Test', (done) => {
    process.env.NODE_ENV = 'development';
    Request(app)
    .delete('/roles')
    .set('x-access-token', token)
    .end((err, res) => {
      expect(res.statusCode).to.equal(403);
      expect(res.body.message).to.equal('That action is not allowed!');
      done();
    });
  });

  it('DELETE /roles should return a 204 on DELETE success if ENV is Test', (done) => {
    process.env.NODE_ENV = 'test';
    Request(app)
    .delete('/roles')
    .set('x-access-token', token)
    .end((err, res) => {
      expect(res.statusCode).to.equal(204);
      done();
    });
  });

  it('GET /roles should return a 200 response and message if no roles exist in table', (done) => {
    Request(app)
    .get('/roles')
    .end((err, res) => {
      expect(res.statusCode).to.equal(200);
      expect(res.body.message).to.equal('Nothing to show.');
      done();
    });
  });

  it('POST /users responds with 500 on user create user if role DOES NOT exist', (done) => {
    Request(app)
      .post('/users/')
      .send({
        username: 'purplet',
        firstName: 'Mary',
        lastName: 'Jones',
        email: 'bubbles@example.com',
        password: '11112222',
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(500);
        expect(res.body.message).to.equal('Cannot create user. Please contact Admin');
        done();
      });
  });
});

