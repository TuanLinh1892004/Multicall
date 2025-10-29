// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import {ERC20} from '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract MockERC20Mintable is ERC20 {
  uint8 private _decimals;

  constructor(string memory name_, string memory symbol_, uint8 decimals_) ERC20(name_, symbol_) {
    _decimals = decimals_;
  }

  function decimals() public view virtual override returns (uint8) {
    return _decimals;
  }

  function mint(address account, uint256 value) external {
    _mint(account, value);
  }

  function burn(address account, uint256 value) external {
    _burn(account, value);
  }
}