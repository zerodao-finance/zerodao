// SPDX-License-Identifier: MIT

pragma solidity >=0.8.7 <0.9.0;

import "../../bip340-solidity/contracts/Bip340Ecrec.sol";
import "hardhat/console.sol";

contract Control {
    Bip340Ecrec public bip340Ecrec;
    bytes public schnorrPublicKey;
    mapping(uint256 => bool) public nonceSpent;
    
    constructor(bytes memory initialPublicKey) {
        schnorrPublicKey = initialPublicKey;
        bip340Ecrec = new Bip340Ecrec();
    }

    function execute(
        address payable to, 
        uint256 nonce, 
        uint256 value, 
        bytes memory data, 
        bytes memory schnorrSignature
    ) 
    public {
     bytes32 pHash = bytesToBytes32(schnorrPublicKey, 0);
     bytes32 rx = bytesToBytes32(schnorrSignature, 0);
     bytes32 s = bytesToBytes32(schnorrSignature, 32);
     bytes32 m = keccak256(abi.encodePacked("/zero/0.1.0", to, nonce, value, data));
    require(bip340Ecrec.verify(uint256(pHash), uint256(rx), uint256(s), m), "Invalid signature");
        require(!nonceSpent[nonce], "Nonce already spent");
        nonceSpent[nonce] = true;
        console.log(to);
        (bool success, bytes memory returnData) = to.call{ value: value }(data);
        assembly {
            if iszero(success) {
                revert(add(0x20, returnData), mload(returnData))
            }
            return(add(0x20, returnData), mload(returnData))
        }
    } 

    function changePublicKey(bytes memory newPublicKey) public {
        require(msg.sender == address(this), "!self");
        schnorrPublicKey = newPublicKey;
    }

    // A helper function to convert bytes (b) to bytes32
function bytesToBytes32(bytes memory b, uint offset) private pure returns (bytes32) {
  bytes32 out;

  for (uint i = 0; i < 32; i++) {
    out |= bytes32(b[offset + i] & 0xFF) >> (i * 8);
  }
  return out;
}
}