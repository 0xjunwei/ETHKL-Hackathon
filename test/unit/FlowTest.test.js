const { deployments, ethers, getNamedAccounts } = require("hardhat");
const { assert, expect } = require("chai");

describe("Notary", async function () {
  let proofer;
  let deployer;
  let notNotarizer;
  let deployerAddress;

  beforeEach(async function () {
    // deploy Proofers
    // using hardhat-deploy
    // get accounts from ethers
    console.log("Testing deploy of notary script");
    //const accounts = await ethers.getSigners();
    //deployer = accounts[0];
    deployer = await getNamedAccounts();
    deployerAddress = deployer.deployer;
    await deployments.fixture(["all"]);
    proofer = await ethers.deployContract("Notary", [], {});
  });

  describe("constructor", function () {
    it("sets the owner addresses correctly", async () => {
      const response = await proofer.getOwner();
      console.log("Response contract owner address: " + response);
      assert.equal(response, deployerAddress);
    });
  });
  // now for addProof
  describe("addProof as NOT notarizer", async function () {
    it("Fails if you are not a notarizer", async function () {
      notNotarizer = (await ethers.getSigners())[1];
      const padToBytes32 = (n) => n + "0".repeat(64 - n.length);
      const paddedValue1 = "0x" + padToBytes32("123");
      const paddedValue2 = "0x" + padToBytes32("456");

      // use expect for reverted txn
      await expect(
        proofer.connect(notNotarizer).addProof(paddedValue1, paddedValue2)
      ).to.be.revertedWith("Not authorized notarizer");
    });
  });
  // Now adding address to notarizer and testing again
  describe("addNotarizer", async function () {
    it("Should be set to true as notarizer", async function () {
      // using deployer to add the notNotarizer to be one
      const receipt = await proofer.addNotarizer(
        await notNotarizer.getAddress()
      );
      await receipt.wait();
      const response = await proofer.checkNotarizer(
        await notNotarizer.getAddress()
      );

      assert.equal(response, true, "The address should be set as a notarizer");
    });
  });
  // Positive flow as notarizer tries to add a proof should succeed now
  // now for addProof
  describe("addProof as notarizer", async function () {
    it("Succeed as notarizer", async function () {
      notNotarizer = (await ethers.getSigners())[1];
      const padToBytes32 = (n) => n + "0".repeat(64 - n.length);
      const paddedValue1 = "0x" + padToBytes32("123");
      const paddedValue2 = "0x" + padToBytes32("456");

      // use expect for reverted txn
      await expect(
        proofer.connect(notNotarizer).addProof(paddedValue1, paddedValue2)
      );
    });
  });
  // Now to remove notarizer
  // Now adding address to notarizer and testing again
  describe("removeNotarizer", async function () {
    it("Should be set to false for notarizer", async function () {
      // using deployer to add the notNotarizer to be one
      const receipt = await proofer.removeNotarizer(
        await notNotarizer.getAddress()
      );
      await receipt.wait();
      const response = await proofer.checkNotarizer(
        await notNotarizer.getAddress()
      );

      assert.equal(
        response,
        false,
        "The address should be removed as a notarizer"
      );
    });
  });
  // Address should no longer be able to add proofs
  describe("addProof as NOT NOTARIZER", async function () {
    it("Fails if you are not a notarizer after removing as notarizer", async function () {
      notNotarizer = (await ethers.getSigners())[1];
      const padToBytes32 = (n) => n + "0".repeat(64 - n.length);
      const paddedValue1 = "0x" + padToBytes32("123");
      const paddedValue2 = "0x" + padToBytes32("456");

      // use expect for reverted txn
      await expect(
        proofer.connect(notNotarizer).addProof(paddedValue1, paddedValue2)
      ).to.be.revertedWith("Not authorized notarizer");
    });
  });
});
