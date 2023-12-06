marketAdress = '0x9FCf00AC037a8907658C98a258b60178B85c77bF'
// 1_initial_item.js
const ClubBlockchainers = artifacts.require("ClubBlockchainers");

module.exports = function (deployer) {
    deployer.deploy(ClubBlockchainers,marketAdress);
};
