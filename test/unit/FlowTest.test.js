const { deployments, ethers, getNamedAccounts } = require("hardhat");
const { assert, expect } = require("chai");

describe("Notary", async function () {
  let proofer;
  let deployer;
  let notNotarizer;
  // get another account

  beforeEach(async function () {
    // deploy Proofers
    // using hardhat-deploy
    // get accounts from ethers
    console.log("Testing deploy of notary script");
    const accounts = await ethers.getSigners();
    const deployer = accounts[0];
    //deployer = (await getNamedAccounts()).deployer;
    await deployments.fixture(["all"]);
    proofer = await ethers.getContractAt("Notary", deployer);
  });
  describe("constructor", function () {
    it("sets the owner addresses correctly", async () => {
      console.log("Response: " + (await proofer.i_owner()));
      const response = await proofer.i_owner();

      assert.equal(response, await deployer.getAddress());
    });
  });
  // now for addProof
  describe("addProof", async function () {
    notNotarizer = (await ethers.getSigners())[1];
    it("Fails if you are not a notarizer", async function () {
      // use expect for reverted txn
      await expect(
        proofer.connect(notNotarizer).addProof("0x123", "0x456")
      ).to.be.revertedWith("Not authorized notarizer");
    });
  });
});
