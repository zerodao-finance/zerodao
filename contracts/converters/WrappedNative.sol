// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0;

import 'oz410/math/SafeMath.sol';
import {IWETH} from '@uniswap/v2-periphery/contracts/interfaces/IWETH.sol';
import {console} from 'hardhat/console.sol';
import {IERC20} from 'oz410/token/ERC20/IERC20.sol';

contract WrapNative {
	address public immutable wrapper;

	constructor(_wrapper) {
		wrapper = _wrapper;
	}

	receive() external {}

	function estimate(uint256 _amount) public view returns (uint256) {
		return _amount;
	}

	function convert(address _module) external payable returns (uint256) {
		IWETH(wrapper).deposit{value: address(this).balance}();
		IERC20(wrapper).transfer(msg.sender, IERC20(wrapper).balanceOf(this));
	}
}

contract UnwrapNative {
	address public immutable wrapper;

	constructor(_wrapper) {
		wrapper = _wrapper;
	}

	receive() external {}

	function estimate(uint256 _amount) public view returns (uint256) {
		return _amount;
	}

	function convert(address _module) external payable returns (uint256) {
		IWETH(wrapper).withdraw{value: IERC20(wrapper).balanceOf(address(this))}();
		msg.sender.send(address(this).balance);
	}
}
