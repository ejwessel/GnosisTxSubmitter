require("dotenv").config();

require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-truffle5");
require("@nomiclabs/hardhat-etherscan");

module.exports = {
  networks: {
    // forking is always enabled
    hardhat: {
      forking: {
        url: "https://mainnet.infura.io/v3/" + process.env.INFURA_API_KEY,
      },
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      timeout: 1000000,
    },
    mainnet: {
      url: "https://mainnet.infura.io/v3/" + process.env.INFURA_API_KEY,
      accounts: [process.env.PRIVATE_KEY],
      // accounts: {
      //   mnemonic: process.env.MNEMONIC
      // },
      // gasPrice: 139e9,
      timeout: 1000000,
    },
  },
  // This is a sample solc configuration that specifies which version of solc to use
  solidity: {
    version: "0.7.6",
    optimizer: {
      enabled: true,
      runs: 999999,
    },
  },
  mocha: {
    timeout: 1000000,
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};
