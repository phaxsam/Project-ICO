const ICO = artifacts.require("ICO.sol");

module.exports = function (deployer) {
  deployer.deploy(ICO, "Farmbit Collateral Protocol", "FCP", 18, web3.utils.toWei("1000"));
};