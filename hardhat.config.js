require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");
require("@nomicfoundation/hardhat-ethers");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const NON_NOTARY = process.env.NON_NOTARY;

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    taiko: {
      url: "https://rpc.jolnir.taiko.xyz",
      accounts: [PRIVATE_KEY, NON_NOTARY],
      gasPrice: "auto",
      blockConfirmations: 5,
    },
  },
  solidity: "0.8.21",
  etherscan: {
    apiKey: {
      taiko: "42069",
    },
    customChains: [
      {
        network: "taiko",
        chainId: 167007,
        urls: {
          apiURL: "https://blockscoutapi.jolnir.taiko.xyz/api",
          browserURL: "https://explorer.jolnir.taiko.xyz",
        },
      },
    ],
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
    outputFile: "gas-report.txt",
    noColors: true,
  },
  namedAccounts: {
    deployer: {
      default: 0, // here this will by default take the first account as deployer
      1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
    },
  },
  mocha: {
    timeout: 500000,
  },
};
