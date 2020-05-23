const Request = require('supertest');
const chai = require('chai');
const app = require('../../server/App');

const expect = chai.expect;

describe('Document', () => {
  let token;

  before((done) => {
    Request(app)
      .post('/users/login')
      .set('Accept', 'application/x-www-form-urlencoded')
      .send({
        username: 'musketeer',
        password: 'soledad123',
      })
      .then((res) => {
        token = res.body.token;
        console.log(token)
        Request(app)
          .post('/documents')
          .set('Accept', 'application/x-www-form-urlencoded')
          .set('x-access-token', token)
          .send({
            title: 'The fiery',
            content: 'I wrote something here too',
          })
          .end(() => {
            done();
          });
      });
  });

  it('POST /documents responds with 201 on user create success', (done) => {
    Request(app)
      .post('/documents')
      .set('x-access-token', token)
      .send({
        title: 'The fiery post',
        content: 'I wrote something short here',
        access: 'public',
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(201);
        expect(res.body.access).to.equal('public');
        expect(res.body.owner).to.equal('musketeer');
        expect(res.body.userRole).to.equal('regular');
        done();
      });
  });

  it('POST /documents responds with message when title is EMPTY', (done) => {
    Request(app)
      .post('/documents')
      .set('x-access-token', token)
      .send({
        title: '',
        content: 'I wrote something short here',
        access: 'public',
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(400);
        expect(res.body.message).to.equal('Please enter a title for your document.');
        done();
      });
  });

  it('POST /documents responds with message when title is EMPTY', (done) => {
    Request(app)
      .post('/documents')
      .set('x-access-token', token)
      .send({
        title: 'This is something else I wrote',
        content: '',
        access: 'public',
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(400);
        expect(res.body.message).to.equal('Document body cannot be empty.');
        done();
      });
  });

  it('GET /search/documents/ should return 200 response on document found', (done) => {
    Request(app)
      .get('/search/documents/?q=The')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        done();
      });
  });

  it('GET / should return a 200 response on success getting public documents', (done) => {
    Request(app)
      .get('/')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        done();
      });
  });

  it('GET /users/:id/documents should return a 200 response on success getting user documents', (done) => {
    Request(app)
      .get('/users/2/documents')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        done();
      });
  });

  it('GET /documents/:id should return a 404 response on document NOT found', (done) => {
    Request(app)
      .get('/documents/67')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.statusCode).to.equal(404);
        expect(res.body.message).of.equal('Document not found!');
        done();
      });
  });

  it('GET /documents/:id should return a 404 response on document NOT found', (done) => {
    Request(app)
      .get('/documents/3')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.statusCode).to.equal(404);
        expect(res.body.message).of.equal('Document not found!');
        done();
      });
  });

  it('GET /documents/:id should return a 200 response on document found', (done) => {
    Request(app)
      .get('/documents/2')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        done();
      });
  });

  it('PUT /documents/:id should return a 200 response on document update successful', (done) => {
    Request(app)
      .put('/documents/1')
      .set('x-access-token', token)
      .send({
        title: 'This is something else I wrote',
        content: 'I am writing over and over, becuase I write.',
        access: 'public',
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.message).to.equal('Your document was successfully updated!');
        done();
      });
  });


  it('PUT /documents/:id should return a message response on EMPTY fields', (done) => {
    Request(app)
      .put('/documents/1')
      .set('x-access-token', token)
      .send({
        title: '',
        content: 'I am writing over and over, becuase I write.',
        access: 'public',
      })
      .end((err, res) => {
        expect(res.body.message).to.equal('Both fields are required');
        done();
      });
  });

  it('PUT /documents/:id should return a message response on document NOT found', (done) => {
    Request(app)
      .put('/documents/199')
      .set('x-access-token', token)
      .send({
        title: 'mayowe',
        content: 'I am writing over and over, becuase I write.',
        access: 'public',
      })
      .end((err, res) => {
        expect(res.body.message).to.equal('Document could not be found!');
        done();
      });
  });

  it('PUT /documents/:id should return a message response on document NOT found', (done) => {
    Request(app)
      .put('/documents/3')
      .set('x-access-token', token)
      .send({
        title: 'mayowe',
        content: 'I am writing over and over, becuase I write.',
        access: 'public',
      })
      .end((err, res) => {
        expect(res.body.message).to.equal('Document could not be found!');
        done();
      });
  });


  it('GET /documents/users/role should return a 200 response on document found', (done) => {
    Request(app)
      .get('/documents/users/regular')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.message).to.equal('There are no documents from other users in this role yet.');
        done();
      });
  });

  it('DELETE /documents/:id should return a 200 response on document found', (done) => {
    Request(app)
      .delete('/documents/2')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.body.message).to.equal('Document deleted!');
        done();
      });
  });

  it('DELETE /documents/:id should return a 404 response on document NOT found', (done) => {
    Request(app)
      .delete('/documents/898')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.statusCode).to.equal(404);
        expect(res.body.message).to.equal('Document not found!');
        done();
      });
  });

  it('GET /documents should return a 200 for  empty list documents, paginated success', (done) => {
    Request(app)
      .get('/documents')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.message).to.equal('There are no documents here yet. Create one.');
        done();
      });
  });

  it('DELETE /documents/:id should return a 404 response on document NOT found', (done) => {
    Request(app)
      .delete('/documents/3')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.statusCode).to.equal(404);
        expect(res.body.message).to.equal('Document not found!');
        done();
      });
  });

  it('GET /search/documents/ should return 404 response on document NOT found', (done) => {
    Request(app)
      .get('/search/documents/?q=hogwarts')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.statusCode).to.equal(404);
        expect(res.body.message).to.equal('Document not found!');
        done();
      });
  });
});


describe('Documents (admin', () => {
  let token;

  before((done) => {
    Request(app)
      .post('/users/login')
      .set('Accept', 'application/x-www-form-urlencoded')
      .send({
        username: 'admin',
        password: 'administrator',
      })
      .then((res) => {
        token = res.body.token;
        console.log(token)
        Request(app)
          .post('/documents')
          .set('Accept', 'application/x-www-form-urlencoded')
          .set('x-access-token', token)
          .send({
            title: 'The mumbo jambo',
            content: 'I wrote something here too',
            access: 'public',
          })
          .end(() => {
            done();
          });
      });
  });

  it('GET /documents/all should return a 200 response on success if admin is logged in', (done) => {
    Request(app)
      .get('/documents/all')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        done();
      });
  });

  it('GET /users/:id/documents should return a 200 response on success getting user\'s document success', (done) => {
    Request(app)
      .get('/users/2/documents')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        done();
      });
  });

  it('GET /documents/:id should return a 200 response on document NOT found', (done) => {
    Request(app)
      .get('/documents/3')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        done();
      });
  });

  it('GET /documents should return a 200 for list all user documents, paginated success', (done) => {
    Request(app)
      .get('/documents')
      .set('x-access-token', token)
      .end((err, res) => {
      // console.log(res.body);
        expect(res.statusCode).to.equal(200);
        done();
      });
  });

  it('PUT /documents/:id should return a message on document UPDATE success by owner', (done) => {
    Request(app)
      .put('/documents/3')
      .set('x-access-token', token)
      .send({
        title: 'mayowe',
        content: 'I am writing over and over, becuase I write.',
        access: 'public',
      })
      .end((err, res) => {
        expect(res.body.message).to.equal('Your document was successfully updated!');
        done();
      });
  });

  it('PUT /documents/:id should return a message on document update FAIL by person who is NOT owner', (done) => {
    Request(app)
      .put('/documents/1')
      .set('x-access-token', token)
      .send({
        title: 'mayowe',
        content: 'I am writing over and over, becuase I write.',
        access: 'public',
      })
      .end((err, res) => {
        expect(res.body.message).to.equal('You can only update documents you own!');
        done();
      });
  });

  it('GET /documents/role/user route that doesnt exist should respond with 404', (done) => {
    Request(app)
      .get('/documents/role/user')
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res.statusCode).to.not.equal(200);
        expect(res.body.message).to.equal('Oops! Nothing to see here.');
        done();
      });
  });
});
