const { network } = require("hardhat");
const {
  networkConfig,
  developmentChains,
} = require("../helper-hardhat-config");
require("dotenv").config();
const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;
  let notarizer_account;
  notarizer_account = (await ethers.getSigners())[1];

  // when going for localhost or hardhat network we want to use a mock
  const proofer = await deploy("Notary", {
    from: deployer,
    args: [],
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });

  if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API) {
    console.log("Verifying...");
    //verify
    await verify(proofer.address, []);
  } else {
    console.log("Hardhat testnet detected, not verifying");
  }

  console.log("Contract deployed to address: " + proofer.address);

  // Interact with the contract
  const contractInstance = await ethers.getContractAt(
    "Notary",
    proofer.address
  );
  const response = await contractInstance.getOwner();
  console.log("Response contract owner address: " + response.toString());
  console.log(
    "Adding " + (await notarizer_account.getAddress()) + " as notarizer"
  );

  // adding the notarizer
  const receipt = await contractInstance.addNotarizer(
    await notarizer_account.getAddress()
  );
  await receipt.wait();
  const checkNotaryStatus = await contractInstance.checkNotarizer(
    await notarizer_account.getAddress()
  );
  console.log(
    "Notarizer status for " +
      (await notarizer_account.getAddress()) +
      " is " +
      checkNotaryStatus
  );
};

module.exports.tags = ["all", "proofers"];
