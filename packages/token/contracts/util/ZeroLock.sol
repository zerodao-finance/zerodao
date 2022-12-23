// SPDX-License-Identifier: MIT

pragma solidity >=0.8.7 <0.9.0;
import { OwnableUpgradeable } from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import { Initializable } from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { IERC20Permit } from "@openzeppelin/contracts/token/ERC20/extensions/draft-IERC20Permit.sol";

contract ZeroLock is Initializable, OwnableUpgradeable {
  address asset;

  function initialize(address _asset) public initializer {
    __Ownable_init_unchained();
    asset = _asset;
  }

  function splitSignature(bytes memory sig)
    internal
    pure
    returns (
      uint8 v,
      bytes32 r,
      bytes32 s
    )
  {
    require(sig.length == 65);
    assembly {
      r := mload(add(sig, 32))
      s := mload(add(sig, 64))
      v := byte(0, mload(add(sig, 96)))
    }
    return (v, r, s);
  }

  function deposit(uint256 amount, bytes memory signature) public {
    (uint8 v, bytes32 r, bytes32 s) = splitSignature(signature);
    IERC20Permit(asset).permit(
      msg.sender,
      address(this),
      amount,
      uint256(keccak256(abi.encodePacked(msg.sender, address(this), amount, IERC20Permit(asset).nonces(msg.sender)))),
      v,
      r,
      s
    );
    IERC20(asset).transferFrom(msg.sender, address(this), amount);
  }
}
