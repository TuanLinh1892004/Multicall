// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import {Ownable} from '@openzeppelin/contracts/access/Ownable.sol';
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

contract Multicall is Ownable {
  struct Call {
    address to;
    uint256 value;
    bytes data;
  }

  mapping(address => bool) public isAdmin;

  constructor(address _owner) Ownable(_owner) {}

  modifier onlyAdmin() {
    require(msg.sender == owner() || isAdmin[msg.sender], "not admin");
    _;
  }

  function setAdmin(address admin, bool setAsAdmin) external onlyOwner {
    isAdmin[admin] = setAsAdmin;
  }

  function write(Call[] calldata calls) external payable onlyAdmin {
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
    if (address(this).balance > 0) {
      (bool success,) = payable(msg.sender).call{value: address(this).balance}("");
      require(success, "refund failed");
    }
  }

  function read(Call[] calldata calls) external view returns (bytes[] memory) {
    bytes[] memory returnData = new bytes[](calls.length);
    for (uint256 i = 0; i < calls.length; i++) {
      (bool success, bytes memory data) = calls[i].to.staticcall(calls[i].data);
      require(success, string(abi.encodePacked("failed at call ", Strings.toString(i))));
      returnData[i] = data;
    }

    return returnData;
  }

  receive() external payable {}
  fallback() external payable {}
}