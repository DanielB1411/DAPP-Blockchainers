// 2_initial_item_market.js
const Marketplace = artifacts.require("Marketplace");

module.exports = function (deployer) {
    deployer.deploy(Marketplace);
};