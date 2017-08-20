const chai = require('chai');
const globals = require('protractor');

const browser = globals.browser;

const expect = chai.expect;

describe('Protractor Demo App', () => {
  beforeEach((done) => {
    browser.get('http://localhost:8000/documents/public');
    done();
  });
  xit('should have a title', (done) => {
    expect(browser.getTitle()).to.equal('Document');
    done();
  });
});
