exports.config = {
  framework: 'mocha',
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['./Protractor.Spec'],
  // multiCapabilities: [{
  //   browserName: 'firefox',
  // }, {
  //   browserName: 'chrome',
  // }]
};
