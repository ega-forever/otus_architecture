const OtusToken = artifacts.require('OtusToken');

module.exports = function (deployer) {
  deployer.deploy(OtusToken, 'OTUS', 'OT', 3, '100');
};
