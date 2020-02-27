var Election = artifacts.require("./Election.sol");
var KaiCoin = artifacts.require("./KaiCoin.sol");

module.exports = function(deployer) {
  deployer.deploy(KaiCoin, 1000000).then(function() {
    return deployer.deploy(Election, KaiCoin.address);
  });
};