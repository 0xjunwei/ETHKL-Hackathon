require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */

const PRIVATE_KEY = process.env.PRIVATE_KEY;

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    taiko: {
      url: "https://rpc.jolnir.taiko.xyz",
      accounts: [PRIVATE_KEY],
      gasPrice: "auto",
      chainId: 167005,
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
    outputFile: "gas-report.txt",
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
    noColors: true,
  },
};
