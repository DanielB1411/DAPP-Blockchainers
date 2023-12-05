// 1_initial_item.js
const ClubBlockchainers = artifacts.require("ClubBlockchainers");

module.exports = function (deployer) {
   
    deployer.deploy(ClubBlockchainers,"0x9d6bAd04445BABB19D72CE7308Df07B4439b0d4B");
};
