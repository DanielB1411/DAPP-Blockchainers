// 1_initial_item.js
const Item = artifacts.require("Item");

module.exports = function (deployer) {
    // Update the parameters based on your contract's constructor
    itemName = "car";
    cost = 10
    deployer.deploy(Item, itemName, cost);
};
