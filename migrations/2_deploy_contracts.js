const ICO = artifacts.require("ICO.sol");

module.exports = function (deployer) {
  deployer.deploy(
    ICO,
    "FINLESS WAREHOUSE DEFI PROTOCOL",
    "FLES",
    18,
    web3.utils.toWei("1000")
  );
};
