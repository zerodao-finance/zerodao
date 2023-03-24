// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "erc721a/contracts/ERC721A.sol";
import "@openzeppelin/contracts-new/access/Ownable.sol";
import "@openzeppelin/contracts-new/utils/Address.sol";
import "@openzeppelin/contracts-new/utils/cryptography/MerkleProof.sol";

error PrivateMintNotStarted();
error WhitelistMintNotStarted();
error PublicMintNotStarted();
error InsufficientPayment();
error NotInWhitelist();
error NotInPrivatelist();
error ExceedSupply();
error ExceedMaxPerWallet();
error MerkleRootNotInitialized();

contract ZeroHeroNFT is ERC721A, Ownable {
  using MerkleProof for bytes32[];

  // ===== Variables =====
  uint16 constant devSupply = 10;
  uint16 constant collectionSupply = 3000; 

  bool private privateMintStarted;
  bool private whitelistMintStarted;
  bool private publicMintStarted;

  uint8 private maxItemsPerWallet = 10; 

  uint256 private mintPrice = 0.3 ether; 

  string private baseTokenURI;
  string public baseExtension = ".json";

  bytes32 public privateMerkleRoot;
  bytes32 public whitelistMerkleRoot;

  // ===== Constructor =====
  constructor() ERC721A("Zero Hero", "ZHERO") {}

  // ===== Modifiers =====
  modifier whenPrivateMint() {
    if (!privateMintStarted) revert PrivateMintNotStarted();
    _;
  }

  modifier whenWhitelistMint() {
    if (!whitelistMintStarted) revert WhitelistMintNotStarted();
    _;
  }

  modifier whenPublicMint() {
    if (!publicMintStarted) revert PublicMintNotStarted();
    _;
  }

  // ===== Minters =====
  function devMint(uint8 quantity) external onlyOwner {
    if (totalSupply() + quantity > devSupply) revert ExceedSupply();

    _mint(msg.sender, quantity);
  }

  function privateMint(
    uint256 _index,
    address _account,
    uint256 _amount,
    bytes32[] memory proof,
    uint256 quantity
  ) external payable whenPrivateMint {
    if (msg.value < mintPrice * quantity) revert InsufficientPayment();
    if (totalSupply() + quantity > collectionSupply) revert ExceedSupply();
    if (_numberMinted(msg.sender) + quantity > maxItemsPerWallet) revert ExceedMaxPerWallet();
    if (!isAddressPrivatelisted(proof, _index, _account, _amount)) revert NotInPrivatelist();

    _mint(_account, quantity);
  }

  function whitelistMint(
    uint256 _index,
    address _account,
    uint256 _amount,
    bytes32[] memory proof,
    uint256 quantity
  ) external payable whenWhitelistMint {
    if (msg.value < mintPrice * quantity) revert InsufficientPayment();
    if (totalSupply() + quantity > collectionSupply) revert ExceedSupply();
    if (_numberMinted(msg.sender) + quantity > maxItemsPerWallet) revert ExceedMaxPerWallet();
    if (!isAddressWhitelisted(proof, _index, _account, _amount)) revert NotInWhitelist();

    _mint(_account, quantity);
  }

  function mint(uint256 quantity) external payable whenPublicMint {
    if (msg.value < mintPrice * quantity) revert InsufficientPayment();
    if (totalSupply() + quantity > collectionSupply) revert ExceedSupply();

    _mint(msg.sender, quantity);
  }

  // ===== Withdraw =====
  function withdraw() external onlyOwner {
    Address.sendValue(payable(owner()), address(this).balance);
  }

  // ===== Token URI =====
  function _baseURI() internal view override(ERC721A) returns (string memory) {
    return baseTokenURI;
  }

  function tokenURI(uint256 tokenId)
    public
    view
    virtual
    override
    returns (string memory)
  {
    require(
      _exists(tokenId),
      "ERC721Metadata: URI query for nonexistent token"
    );

    string memory currentBaseURI = _baseURI();
    return bytes(currentBaseURI).length > 0
        ? string(abi.encodePacked(currentBaseURI, uint2str(tokenId), baseExtension))
        : "";
  }

  // ===== Checks =====
  function isPrivateActive() external view returns (bool) {
    return privateMintStarted;
  }

  function isWhitelistActive() external view returns (bool) {
    return whitelistMintStarted;
  }

  function isAddressWhitelisted(
    bytes32[] memory proof,
    uint256 _index,
    address _account,
    uint256 _amount
  ) internal view returns (bool) {
    return proof.verify(whitelistMerkleRoot, keccak256(abi.encodePacked(_index, _account, _amount)));
  }

  function isAddressPrivatelisted(
    bytes32[] memory proof,
    uint256 _index,
    address _account,
    uint256 _amount
  ) internal view returns (bool) {
    return proof.verify(privateMerkleRoot, keccak256(abi.encodePacked(_index, _account, _amount)));
  }

  // ===== Starters =====
  function startPrivateMint() external onlyOwner {
    if(privateMerkleRoot == bytes32(0)) revert MerkleRootNotInitialized();
    privateMintStarted = true;
  }

  function startWhitelistMint() external onlyOwner {
    if(whitelistMerkleRoot == bytes32(0)) revert MerkleRootNotInitialized();
    whitelistMintStarted = true;
  }

  function startPublicMint() external onlyOwner {
    publicMintStarted = true;
  }

  // ===== Setters =====
  function setMaxItemsPerWallet(uint8 value) external onlyOwner {
    maxItemsPerWallet = value;
  }

  function setMintPrice(uint256 value) external onlyOwner {
    mintPrice = value;
  }

  function setPrivateMerkleRoot(bytes32 value) external onlyOwner {
    privateMerkleRoot = value;
  }

  function setWhitelistMerkleRoot(bytes32 value) external onlyOwner {
    whitelistMerkleRoot = value;
  }

  function setBaseTokenURI(string memory value) external onlyOwner {
    baseTokenURI = value;
  }

  function setBaseExtension(string memory _newBaseExtension) public onlyOwner {
    baseExtension = _newBaseExtension;
  }

  // ===== Utils =====
  function uint2str(uint _i) internal pure returns (string memory _uintAsString) {
    if (_i == 0) {
      return "0";
    }
    uint j = _i;
    uint len;
    while (j != 0) {
      len++;
      j /= 10;
    }
    bytes memory bstr = new bytes(len);
    uint k = len;
    while (_i != 0) {
      k = k-1;
      uint8 temp = (48 + uint8(_i - _i / 10 * 10));
      bytes1 b1 = bytes1(temp);
      bstr[k] = b1;
      _i /= 10;
    }
    return string(bstr);
  }
}
