// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import {ERC20} from '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract MockVault {
  function deposit(address asset, uint256 value) external payable {
    if (asset == 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE) return;
    ERC20(asset).transferFrom(msg.sender, address(this), value);
  }

  function withdraw(address asset, uint256 value) external {
    if (asset == 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE) {
      (bool success,) = msg.sender.call{value: value}("");
      require(success, "withdraw failed");

      return;
    }
    ERC20(asset).transfer(msg.sender, value);
  }

  receive() external payable {}
  fallback() external payable {}
}