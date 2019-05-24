const Request = require('supertest');
const chai = require('chai');
const app = require('../../server/App');

const expect = chai.expect;

describe('User (regular)', () => {
  let token;

  Request(app)
    .post('/users/login')
    .set('Accept', 'application/x-www-form-urlencoded')
    .send({
      username: 'musketeer',
      password: 'soledad123',
    })
  .end((err, res) => {
    token = res.body.token;
  });

  it('POST /users responds with 201 on user create success', (done) => {
    Request(app)
      .post('/users/')
      .send({
        username: 'maryJ',
        firstName: 'Maria',
        lastName: 'poussey',
        email: 'poussey@example.com',
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
        email: 'poussey@example.com',
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
      expect(res.statusCode).to.equal(400);
      expect(res.body.message).to.equal('Wrong username/password.');
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
      expect(res.body.message).to.equal('username/password fields cannot be empty.');
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
      expect(res.body.message).to.equal('This user does not exist.');
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

  it('GET /search/users responds with 200 if user found', (done) => {
    Request(app)
      .get('/search/users/?q=musketeer')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        done();
      });
  });

  it('GET /search/users responds with 404 if user NOT found', (done) => {
    Request(app)
      .get('/search/users/?q=buttercup3')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.statusCode).to.equal(404);
        expect(res.body.message).to.equal('User not found!');
        done();
      });
  });

  it('PUT /users/:id responds with 403 if user DOES NOT exist', (done) => {
    Request(app)
      .put('/users/1')
      .set('x-access-token', token)
      .send({
        username: 'mercy',
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(403);
        expect(res.body.message).to.equal('That action is not allowed. You can only edit your own password.');
        done();
      });
  });

  it('PUT /users/:id responds with message if password field is empty', (done) => {
    Request(app)
      .put('/users/2')
      .set('x-access-token', token)
      .send({
        password: '',
      })
      .end((err, res) => {
        // expect(res.statusCode).to.equal(403);
        expect(res.body.message).to.equal('Please enter your new password!');
        done();
      });
  });
  it('PUT /users/:id responds with 200 and message on field update success', (done) => {
    Request(app)
      .put('/users/2')
      .set('x-access-token', token)
      .send({
        password: 'soledad123',
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.message).to.equal('Your profile has been updated!');
        done();
      });
  });

  it('PUT /users/:id responds with 404 on user id not found', (done) => {
    Request(app)
      .put('/users/39')
      .set('x-access-token', token)
      .send({
        password: 'soledad123',
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(404);
        expect(res.body.message).to.equal('User doesn\'t exist!');
        done();
      });
  });
  it('DELETE /users responds with 403 if user not admin and ENV NOT test', (done) => {
    process.env.NODE_ENV = 'development';
    Request(app)
      .delete('/users')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.statusCode).to.equal(403);
        expect(res.body.message).to.equal('You do not have the required permissions.');
        done();
      });
  });

  it('POST /users/logout responds with 205 on success', () => {
    Request(app)
    .post('/users/logout')
    .set('x-access-token', token)
    .end((err, res) => {
      expect(res.statusCode).to.equal(205);
    });
  });

  it('PUT /users/:id responds with 403 on user TOKEN NOT present', (done) => {
    Request(app)
      .get('/users/1')
      // Disabled token
      // .set('x-access-token', token)
      .send({
        password: 'soledad123',
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(403);
        expect(res.body.message).to.equal('You must be logged in to view the page you requested');
        done();
      });
  });

  it('PUT /users/:id responds with 401 on user TOKEN FAILED to authenticate', (done) => {
    Request(app)
      .get('/users/1')
      .set('x-access-token', token)
      .send({
        password: 'soledad123',
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(401);
        expect(res.body.message).to.equal('Failed to authenticate token. Please login in to verify account');
        done();
      });
  });
});

describe('User (admin)', () => {
  let token;

  beforeEach((done) => {
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

  it('DELETE /users responds with 401 if user admin and ENV NOT test', (done) => {
    Request(app)
      .delete('/users')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.statusCode).to.equal(401);
        expect(res.body.message).to.equal('You do not have the required permissions.');
        done();
      });
  });

  it('DELETE /users/:id responds with 404 if user DOES NOT exist', (done) => {
    process.env.NODE_ENV = 'test';
    Request(app)
      .delete('/users/78')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.statusCode).to.equal(404);
        expect(res.body.message).to.equal('User doesn\'t exist');
        done();
      });
  });

  it('DELETE /users/:id responds with 403 if user is admin', (done) => {
    process.env.NODE_ENV = 'test';
    Request(app)
      .delete('/users/1')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.statusCode).to.equal(403);
        expect(res.body.message).to.equal('Permission denied!');
        done();
      });
  });

  it('DELETE /users/:id responds with 403 if ENV production', (done) => {
    process.env.NODE_ENV = 'production';
    Request(app)
      .delete('/users/3')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.statusCode).to.equal(403);
        expect(res.body.message).to.equal('That action is not allowed!');
        done();
      });
  });
});

describe('User (Deletion)', () => {
  let token;

  beforeEach((done) => {
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

  it('DELETE /users/:id responds with message if deleted successfully', (done) => {
    process.env.NODE_ENV = 'test';
    Request(app)
      .delete('/users/3')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.body.message).to.equal('User deleted!');
        done();
      });
  });
});
