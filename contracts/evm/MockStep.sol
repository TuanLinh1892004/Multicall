// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

contract Step {
    mapping(uint256 => uint256) public step;

    function addStep(uint256 id, uint256 amount) public {
        step[id] += amount;
    }

    function removeStep(uint256 id, uint256 amount) public {
        step[id] -= amount; // careful for underflow
    }
}