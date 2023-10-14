// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

contract Notary {
    // proof object
    struct Proof {
        // Timestamp proof was added to the blockchain
        uint256 timestamp;
        // IPFS of Proof Committing into the smart contract
        string ipfs_link;
    }

    address public immutable i_owner;
    mapping(address => bool) public notarizers;
    // domain URL to IPFS Proof
    mapping(string => Proof) public proofs;

    // Saving gas so only showing status change true/false
    event NotarizerStatusChanged(address indexed _notarizer, bool status);
    // Emit event when a new proof is added
    event ProofAdded(
        string indexed _documentURL,
        string _ipfsLinkOfProof,
        uint256 timestamp
    );

    constructor() {
        i_owner = msg.sender;
    }

    // Typical onlyOwner function to ensure only owner can call
    modifier onlyOwner() {
        require(msg.sender == i_owner, "Not contract owner");
        _;
    }
    // Only notarizers can add proofs to the contract, having an array can have multiple people within an organization to add instead of a single wallet
    modifier onlyNotarizer() {
        require(notarizers[msg.sender], "Not authorized notarizer");
        _;
    }

    // Allows the owner to add a notarizer
    function addNotarizer(address _notarizer) public onlyOwner {
        notarizers[_notarizer] = true;
        emit NotarizerStatusChanged(_notarizer, true);
    }

    // removes notarizer function
    function removeNotarizer(address _notarizer) public onlyOwner {
        notarizers[_notarizer] = false;
        emit NotarizerStatusChanged(_notarizer, false);
    }

    // adds proof as a notarizer
    // @param _documentURL URL of the domain
    // @param _ipfsLinkOfProof IPFS Link to the proof.json file
    function addProof(
        string memory _documentURL,
        string memory _ipfsLinkOfProof
    ) public onlyNotarizer {
        require(proofs[_documentURL].timestamp == 0, "Proof already exists!");
        proofs[_documentURL] = Proof(block.timestamp, _ipfsLinkOfProof);
        emit ProofAdded(_documentURL, _ipfsLinkOfProof, block.timestamp);
    }

    // Validates a proof if it exists
    // @param _documentURL URL of the domain
    // Function to retrieve the IPFS link by document URL
    function verifyProof(
        string memory _documentURL
    ) public view returns (string memory) {
        return proofs[_documentURL].ipfs_link;
    }

    // Get owner of contract
    function getOwner() public view returns (address) {
        return i_owner;
    }

    // check if notarizer of contract
    function checkNotarizer(address _notary) public view returns (bool) {
        return notarizers[_notary];
    }
}
