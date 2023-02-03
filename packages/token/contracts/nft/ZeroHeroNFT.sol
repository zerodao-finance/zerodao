// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "erc721a/contracts/ERC721A.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "hardhat/console.sol";

error PrivateMintNotStarted();
error PublicMintNotStarted();
error InsufficientPayment();
error NotInWhitelist();
error ExceedSupply();
error ExceedMaxPerWallet();

contract ZeroHeroNFT is ERC721A, Ownable, ReentrancyGuard {
    using MerkleProof for bytes32[];

    // ===== Variables =====
    uint16 constant devSupply = 5;
    uint16 constant presaleSupply = 2000;
    uint16 constant collectionSupply = 0;

    bool private privateMintStarted;
    bool private publicMintStarted;

    uint8 private presaleMaxItemsPerWallet = 3;

    uint256 private presalePrice = 0.3 ether;
    uint256 private mintPrice = 0.3 ether;

    string private baseTokenURI;

    bytes32 public presaleMerkleRoot;

    // ===== Constructor =====
    constructor() ERC721A("ZeroHeroNFT", "ZHERO") {}

    // ===== Modifiers =====
    modifier whenPrivateMint() {
        if (!privateMintStarted || publicMintStarted) revert PrivateMintNotStarted();
        _;
    }

    modifier whenPublicMint() {
        if (!publicMintStarted) revert PublicMintNotStarted();
        _;
    }

    // ===== Dev mint =====
    function devMint(uint8 quantity) external onlyOwner {
        if(totalSupply() + quantity > devSupply) revert ExceedSupply();

        _mint(msg.sender, quantity);        
    }

    // ===== Private mint =====
    function privateMint(uint256 _index, address _account, uint256 _amount, bytes32[] memory proof, uint256 quantity) external payable nonReentrant whenPrivateMint {
        if(msg.value < presalePrice * quantity) revert InsufficientPayment();
        if(totalSupply() + quantity > presaleSupply) revert ExceedSupply();
        if(_numberMinted(msg.sender) + quantity > presaleMaxItemsPerWallet) revert ExceedMaxPerWallet();
        if(!isAddressWhitelisted(proof, _index, _account, _amount)) revert NotInWhitelist();

        _mint(_account, quantity);        
    }

    // ===== Public mint =====
    function mint(uint256 quantity) external payable nonReentrant whenPublicMint {
        if(msg.value < mintPrice * quantity) revert InsufficientPayment();
        if(totalSupply() + quantity > collectionSupply) revert ExceedSupply();

        _mint(msg.sender, quantity);        
    }

    // ===== Whitelisting =====
    function isAddressWhitelisted(bytes32[] memory proof, uint256 _index, address _account, uint256 _amount) internal view returns (bool) {
        return proof.verify(presaleMerkleRoot, keccak256(abi.encodePacked(_index, _account, _amount)));
    }

    // ===== Withdraw =====
    function withdraw() external onlyOwner nonReentrant {
        Address.sendValue(payable(owner()), address(this).balance);
    }

    // ===== Metadata URI =====
    function _baseURI() internal view override(ERC721A) returns (string memory) {
        return baseTokenURI;
    }

    function setBaseTokenURI(string memory value) external onlyOwner {
        baseTokenURI = value;
    }

    // ===== Setters =====
    function startPrivateMint() external onlyOwner {
        privateMintStarted = true;
    }

    function startPublicMint() external onlyOwner {
        publicMintStarted = true;
    }

    function setPresaleMaxItemsPerWallet(uint8 value) external onlyOwner {
        presaleMaxItemsPerWallet = value;
    }

    function setPresalePrice(uint256 value) external onlyOwner {
        presalePrice = value;
    }

    function setMintPrice(uint256 value) external onlyOwner {
        mintPrice = value;
    }

    function setPresaleMerkleRoot(bytes32 value) external onlyOwner {
        presaleMerkleRoot = value;
    }
}