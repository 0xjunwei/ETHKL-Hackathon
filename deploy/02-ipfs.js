const { network } = require("hardhat");
const {
  networkConfig,
  developmentChains,
} = require("../helper-hardhat-config");
require("dotenv").config();
const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");

let authToken;
let secretKey = process.env.INFURA_API_KEY;
let secretKeyAPI = process.env.INFURA_KEY_SECRET;
authToken = secretKey + ":" + secretKeyAPI;

async function uploadFile() {
  const stream = fs.createReadStream("./proof.json");
  const formData = new FormData();
  formData.append("file", stream, {
    filename: "proof.json",
    contentType: "application/json",
  });

  try {
    const response = await axios.post(
      "https://ipfs.infura.io:5001/api/v0/add",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          Authorization: "Basic " + Buffer.from(authToken).toString("base64"),
        },
      }
    );
    const added = response.data;
    console.log(added);
    let ipfs_link = "https://ethkl2023.infura-ipfs.io/ipfs/" + added.Hash;
    console.log("IPFS Link: " + ipfs_link);
    return ipfs_link;
  } catch (error) {
    console.error("Error uploading file:", error);
  }
}

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deployer } = await getNamedAccounts();
  const notaryDeployment = await deployments.get("Notary");
  let notarizer_account = (await ethers.getSigners())[1];
  // Interact with the contract
  const contractInstance = await ethers.getContractAt(
    "Notary",
    notaryDeployment.address,
    notarizer_account
  );

  // Adding proofs
  const proofDomain = "https://0xjunwei.github.io/ethkl/results.html";
  // File too big going to try IPFS
  let ipfs_link = uploadFile();
  console.log("Adding proof to the contract...");
  try {
    const tx = await contractInstance.addProof(proofDomain, ipfs_link);
    await tx.wait();
    console.log("Proof added successfully.");
  } catch (error) {
    console.error("Error adding proof:", error);
  }
};

module.exports.tags = ["all", "ipfs"];
