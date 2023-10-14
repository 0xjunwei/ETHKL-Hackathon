// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

contract Notary {
    struct Proof {
        // Timestamp proof was added to the blockchain
        uint256 timestamp;
        // Bytes of Proof Committing into the smart contract
        string hash;
    }

    address public immutable i_owner;
    mapping(address => bool) public notarizers;
    mapping(string => Proof) public proofs; // document identifier to Proof

    // Saving gas so only showing status change true/false
    event NotarizerStatusChanged(address indexed _notarizer, bool status);
    // Emit event when a new proof is added
    event ProofAdded(
        string indexed _docHash,
        string _tslHash,
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
    // @param _docHash hash of document
    // @param _tslHash the TLSnotary hash of document with timestamp this was placed
    function addProof(
        string memory _docHash,
        string memory _tslHash
    ) public onlyNotarizer {
        require(proofs[_docHash].timestamp == 0, "Proof already exists!");
        proofs[_docHash] = Proof(block.timestamp, _tslHash);
        emit ProofAdded(_docHash, _tslHash, block.timestamp);
    }

    // Validates a proof if it exists
    // @param _docHash hash of the document
    // @param _tslHash the TLSnotary hash of document to check if it matches the stored proof
    function verifyProof(
        string calldata _docHash,
        string calldata _tslHash
    ) public view returns (bool) {
        bytes32 b_docHash = keccak256(abi.encodePacked(proofs[_docHash].hash));
        bytes32 b_tslHash = keccak256(abi.encodePacked(_tslHash));
        return b_docHash == b_tslHash;
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
