// 1_initial_item.js
const ClubBlockchainers = artifacts.require("ClubBlockchainers");

module.exports = function (deployer) {
    deployer.deploy(ClubBlockchainers,"0xec7368f418Af3E003908b16f12a949ad45D8ab9e");
};
