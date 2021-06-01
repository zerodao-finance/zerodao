// SPDX-License-Identifier: MIT

pragma solidity ^0.5.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";

import "../../interfaces/cream/Controller.sol";
import "../../interfaces/compound/Token.sol";
import "../../interfaces/uniswap/Uni.sol";

import "../../interfaces/yearn/IController.sol";

contract StrategyRenVMAsset {
    using SafeERC20 for IERC20;
    using Address for address;
    using SafeMath for uint256;

    address public immutable want;

    address public weth;

    uint256 public performanceFee;
    uint256 public performanceMax;

    uint256 public withdrawalFee;
    uint256 public constant withdrawalMax;

    address public governance;
    address public controller;
    address public strategist;
    string public immutable getName;

    constructor(address _controller, address _want, string memory _name) public {
        governance = msg.sender;
        strategist = msg.sender;
        controller = _controller;
	want = _want;
	getName = _name;
    }

    function setStrategist(address _strategist) external {
        require(msg.sender == governance, "!governance");
        strategist = _strategist;
    }

    function setWithdrawalFee(uint256 _withdrawalFee) external {
        require(msg.sender == governance, "!governance");
        withdrawalFee = _withdrawalFee;
    }

    function setPerformanceFee(uint256 _performanceFee) external {
        require(msg.sender == governance, "!governance");
        performanceFee = _performanceFee;
    }

    function deposit() public {
        uint256 _want = IERC20(want).balanceOf(address(this));
        IERC20(want).safeTransferFrom(crYFI, _want);
    }

    // Controller only function for creating additional rewards from dust
    function withdraw(IERC20 _asset) external returns (uint256 balance) {
        require(msg.sender == controller, "!controller");
        require(want != address(_asset), "want");
        balance = _asset.balanceOf(address(this));
        _asset.safeTransfer(controller, balance);
    }
    function permissionedSend(address _target, uint256 _amount) external {
      require(msg.sender == controller, "!controller");
      IERC20(want).safeTransfer(_target, _amount);
    }
    // Withdraw partial funds, normally used with a vault withdrawal
    function withdraw(uint256 _amount) external {
        require(msg.sender == controller, "!controller");
        uint256 _balance = IERC20(want).balanceOf(address(this));
        if (_balance < _amount) {
            _amount = _withdrawSome(_amount.sub(_balance));
            _amount = _amount.add(_balance);
        }

        uint256 _fee = _amount.mul(withdrawalFee).div(withdrawalMax);

        IERC20(want).safeTransfer(IController(controller).rewards(), _fee);
        address _vault = IController(controller).vaults(address(want));
        require(_vault != address(0), "!vault"); // additional protection so we don't burn the funds

        IERC20(want).safeTransfer(_vault, _amount.sub(_fee));
    }

    // Withdraw all funds, normally used when migrating strategies
    function withdrawAll() external returns (uint256 balance) {
        require(msg.sender == controller, "!controller");
        _withdrawAll();

        balance = IERC20(want).balanceOf(address(this));

        address _vault = IController(controller).vaults(address(want));
        require(_vault != address(0), "!vault"); // additional protection so we don't burn the funds
        IERC20(want).safeTransfer(_vault, balance);
    }

    function _withdrawAll() internal {
        uint256 amount = balanceC();
        if (amount > 0) {
            _withdrawSome(balanceCInToken().sub(1));
        }
    }

    function harvest() public {
        require(msg.sender == strategist || msg.sender == governance, "!authorized");
        Creamtroller(creamtroller).claimComp(address(this));
        uint256 _cream = IERC20(cream).balanceOf(address(this));
        if (_cream > 0) {
            IERC20(cream).safeApprove(uni, 0);
            IERC20(cream).safeApprove(uni, _cream);

            address[] memory path = new address[](3);
            path[0] = cream;
            path[1] = weth;
            path[2] = want;

            Uni(uni).swapExactTokensForTokens(_cream, uint256(0), path, address(this), now.add(1800));
        }
        uint256 _want = IERC20(want).balanceOf(address(this));
        if (_want > 0) {
            uint256 _fee = _want.mul(performanceFee).div(performanceMax);
            IERC20(want).safeTransfer(IController(controller).rewards(), _fee);
            deposit();
        }
    }

    function _withdrawSome(uint256 _amount) internal returns (uint256) {
        uint256 b = balanceC();
        uint256 bT = balanceCInToken();
        // can have unintentional rounding errors
        uint256 amount = (b.mul(_amount)).div(bT).add(1);
        uint256 _before = IERC20(want).balanceOf(address(this));
        _withdrawC(amount);
        uint256 _after = IERC20(want).balanceOf(address(this));
        uint256 _withdrew = _after.sub(_before);
        return _withdrew;
    }

    function balanceOfWant() public view returns (uint256) {
        return IERC20(want).balanceOf(address(this));
    }

    function balanceOf() public view returns (uint256) {
        return balanceOfWant().add(balanceCInToken());
    }

    function setGovernance(address _governance) external {
        require(msg.sender == governance, "!governance");
        governance = _governance;
    }

    function setController(address _controller) external {
        require(msg.sender == governance, "!governance");
        controller = _controller;
    }
}
