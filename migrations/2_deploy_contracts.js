var Verification = artifacts.require("./Verification.sol");
var File = artifacts.require("./File.sol")
module.exports = function(deployer) {
				deployer.deploy(Verification, "0xf17f52151ebef6c7334fad080c5704d77216b732");
				deployer.deploy(File, "0xf17f52151ebef6c7334fad080c5704d77216b732", "0xf17f52151ebef6c7334fad080c5704d77216b732");
};
