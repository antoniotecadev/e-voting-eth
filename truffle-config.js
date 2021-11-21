const path = require("path");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const mnemonic = "elite disease reward mom sunny question potato crisp strategy any discover essay";

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    develop: {
      port: 9545
    },
    ganachecli: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*" // Match any network id
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/v3/9867ca24f45742a596ca5b4afddf148a")
      },
      network_id: 3
    }
    
  }
};
