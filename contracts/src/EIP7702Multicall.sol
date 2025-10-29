// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

contract EIP7702Multicall {
  struct Call {
    address to;
    uint256 value;
    bytes data;
  }

  function write(Call[] calldata calls) external payable {
    for (uint256 i = 0; i < calls.length; i++) {
      if (calls[i].to == address(0)) continue;

      bool success;
      if (calls[i].value > 0) {
        (success,) = calls[i].to.call{value: calls[i].value}(calls[i].data);
      } else {
        (success,) = calls[i].to.call(calls[i].data);
      }

      require(success, string(abi.encodePacked("failed at tx ", Strings.toString(i))));
    }
  }

  receive() external payable {}
  fallback() external payable {}
}