const chai = require('chai');
const globals = require('protractor');

const browser = globals.browser;

const expect = chai.expect;

describe('Protractor Demo App', () => {
  xit('should have a title', () => {
    browser.get('http://localhost:8000/documents/public');

    expect(browser.getTitle()).to.equal('Document');
  });
});
