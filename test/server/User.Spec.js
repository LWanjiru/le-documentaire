const app = require('../../server/App');
const Request = require('supertest');
const chai = require('chai');

const expect = chai.expect;

describe('User', () => {
  let token;

  before((done) => {
    Request(app)
    .post('/users/login')
    .set('Accept', 'application/x-www-form-urlencoded')
    .send({
      username: 'musketeer',
      password: 'soledad123',
    })
    .end((err, res) => {
      token = res.body.token;
      // console.log(token);
      done();
    });
  });

  it('POST /users responds with 201 on user create success', (done) => {
    Request(app)
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
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal('User created successfully!');
        done();
      });
  });

  it('POST /users responds with 409 on user create DUPLICATE exists', (done) => {
    Request(app)
      .post('/users/')
      .send({
        username: 'maryJ',
        firstName: 'Mary',
        lastName: 'Jones',
        email: 'jones2@example.com',
        password: '11112222',
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(409);
        expect(res.body.message).to.equal('This username is already in use! Please create a unique one.');
        done();
      });
  });

  it('POST /users responds with 400 on user create with EMPTY fields', (done) => {
    Request(app)
      .post('/users/')
      .send({
        username: '',
        firstName: 'Mary',
        lastName: '',
        email: 'jones2@example.com',
        password: '11112222',
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(400);
        expect(res.body.message).to.equal('All fields are required!');
        done();
      });
  });

  it('POST /users responds with 409 on user create if EMAIL is registered to EXISTING user', (done) => {
    Request(app)
      .post('/users/')
      .send({
        username: 'billy',
        firstName: 'billz',
        lastName: 'Blazer',
        email: 'mary@example.com',
        password: 'cartwheels2',
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(409);
        expect(res.body.message).to.equal('Email is registered to a different username.');
        done();
      });
  });

  it('POST /users responds with 422 on user create if Password is LESS that 6 characters long', (done) => {
    Request(app)
      .post('/users/')
      .send({
        username: 'billy',
        firstName: 'billz',
        lastName: 'Blazer',
        email: 'blazing@example.com',
        password: 'car2',
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(422);
        expect(res.body.message).to.equal('Password must be between 6 and 20 characters');
        done();
      });
  });

  it('POST /users responds with 422 on user create if Email DOES NOT follow valid format', (done) => {
    Request(app)
      .post('/users/')
      .send({
        username: 'billy',
        firstName: 'billz',
        lastName: 'Blazer',
        email: 'blazing@example',
        password: 'cartwheels2',
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(422);
        expect(res.body.message).to.equal('Enter email using a valid format ie.[myemail@example.com]');
        done();
      });
  });

  it('POST /users/login should return message if password doesn\'t match user', (done) => {
    Request(app)
    .post('/users/login')
    .set('Accept', 'application/x-www-form-urlencoded')
    .send({
      username: 'maryJ',
      password: '5554445',
    })
    .end((err, res) => {
      expect(res.body.message).to.equal('password does not match the username');
      done();
    });
  });

  it('POST /users/login should return message if username or password fields are empty', (done) => {
    Request(app)
    .post('/users/login')
    .set('Accept', 'application/x-www-form-urlencoded')
    .send({
      username: '',
      password: '11112222',
    })
    .end((err, res) => {
      expect(res.body.message).to.equal('username/password fields cannot be empty');
      done();
    });
  });

  it('POST /users/login should return message if user doesn\'t exist', (done) => {
    Request(app)
    .post('/users/login')
    .set('Accept', 'application/x-www-form-urlencoded')
    .send({
      username: 'boris',
      password: '5554445',
    })
    .end((err, res) => {
      expect(res.body.message).to.equal('This user account does not exist. Create one');
      done();
    });
  });

  it('GET /users should return a 200 response on success getting users success', (done) => {
    Request(app)
    .get('/users/all')
    .set('x-access-token', token)
    .end((err, res) => {
      expect(res.statusCode).to.equal(200);
      done();
    });
  });

  it('GET /users responds with 200 and count on success users with PAGINATION', (done) => {
    Request(app)
      .get('/users/?limit=2&offset=0')
      .set('x-access-token', token)
      .end((err, res) => {
        // console.log(res.body.count);
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.have.property('count');
        done();
      });
  });

  it('GET /users responds with 400 error on fail users with PAGINATION', (done) => {
    Request(app)
      .get('/users/?limit=d&offset=g')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.statusCode).to.equal(400);
        done();
      });
  });

  it('GET /users/:id responds with 200 if user exists', (done) => {
    Request(app)
      .get('/users/1')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.username).to.equal('admin');
        done();
      });
  });

  it('GET /users/:id responds with 404 if user DOES NOT exist', (done) => {
    Request(app)
      .get('/users/35')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.statusCode).to.equal(404);
        expect(res.body.message).to.equal('User not found!');
        done();
      });
  });
});
