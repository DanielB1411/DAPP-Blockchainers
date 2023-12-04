// 1_initial_item.js
const Marketplace = artifacts.require("Marketplace");

module.exports = function (deployer) {
   
    deployer.deploy(Marketplace);
};
