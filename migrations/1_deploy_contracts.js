var NFTCollectionFactory = artifacts.require("./NFTCollectionFactory.sol")

module.exports = function (deployer) {
  deployer.deploy(NFTCollectionFactory)
}
