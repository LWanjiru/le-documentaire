/* global describe it beforeEach*/
const chai = require('chai');
const app = require('./../../../App');
const request = require('supertest');

const expect = chai.expect;

describe('/api/roles ', () => {
  beforeEach((done) => {
    request(app).delete('/api/roles').end(done);
  });

  it('GET /api/roles responds with a 200 when no roles exist on table', (done) => {
    request(app)
    .get('/api/roles')
    .set('Accept', 'application/json')
    .end((err, res) => {
      expect(res.statusCode).to.equal(200);
      expect(res.body.message).to.equal('Nothing to show.');
      done();
    });
  });

  it('GET /api/roles/:title responds with a 404 if a role doesn\'t exist', (done) => {
    request(app)
    .get('/api/roles/author')
    .set('Accept', 'application/json')
    .end((err, res) => {
      console.log(res.body.title);
      expect(res.statusCode).to.equal(404);
      expect(res.body.message).to.equal('Role not found!');
      done();
    });
  });

  it('POST /api/roles/add should respond with a 201 the created role on success', (done) => {
    request(app)
      .post('/api/roles/add')
      .set('Accept', 'application/x-www-form-urlencoded')
      .send({ title: 'author', description: 'They write' })
      .end((err, res) => {
        expect(res.statusCode).to.equal(201);
        expect(res.body.newRole.title).to.equal('author');
        expect(res.body.newRole.description).to.equal('They write');
        done();
      });
  });
});

it('POST /roles responds with 400 if field is empty', (done) => {
  request(app)
  .post('/api/roles/add')
  .send({ title: '', description: 'they dance' })
  .send({ title: 'something', description: '' })
  .end((err, res) => {
    expect(res.statusCode).to.equal(400);
    expect(res.body).to.include({ message: 'All fields are required!' });
    done();
  });
});

describe('GET /api/roles ', () => {
  beforeEach((done) => {
    request(app).post('/api/roles/add').end(done);
  });

  it('GET /api/roles responds with a 200 on success', (done) => {
    request(app)
    .get('/api/roles')
    .set('Accept', 'application/json')
    .end((err, res) => {
      expect(res.statusCode).to.equal(200);
      expect(res.body).to.be.an('array');
      expect(res.body[0]).to.have.property('title');
      expect(res.body[0]).to.have.property('description');
      done();
    });
  });

  it('POST /api/roles/add responds with a 409 the role not created for duplicate', (done) => {
    request(app)
    .post('/api/roles/add')
    .send({ title: 'author', description: 'They write' })
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .end((err, res) => {
      expect(res.statusCode).to.equal(409);
      expect(res.body).to.include({ message: 'Role already exists!' });
      done();
    });
  });

  it('GET /api/roles/:title responds with a 200 on success', (done) => {
    request(app)
    .get('/api/roles/author')
    .set('Accept', 'application/json')
    .end((err, res) => {
      console.log(res.body.title);
      expect(res.statusCode).to.equal(200);
      expect(res.body).to.be.an('object');
      expect(res.body.title).to.equal('author');
      expect(res.body.description).to.equal('They write');
      done();
    });
  });
});

it('PUT /roles responds with 400 if field is empty', (done) => {
  request(app)
  .put('/api/roles')
  .send({ title: '', description: 'they dance' })
  .send({ title: 'something', description: '' })
  .end((err, res) => {
    expect(res.statusCode).to.equal(400);
    expect(res.body).to.include({ message: 'All fields are required!' });
    done();
  });
});
