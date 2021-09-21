var Eleicao = artifacts.require("./Eleicao.sol");

module.exports = async function (deployer) {
  await deployer.deploy(Eleicao);
};
