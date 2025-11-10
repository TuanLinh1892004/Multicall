// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import { Test } from 'forge-std/Test.sol';
import { Multicall } from '../src/Multicall.sol';
import { MockERC20Mintable } from '../src/mocks/MockERC20Mintable.sol';
import { MockVault } from '../src/mocks/MockVault.sol';

contract MulticallTest is Test {

  address public constant ALICE = 0x1234567890123456789012345678901234567890;
  address public constant GAYBOB = 0x1234567890123456789012345678901234567891;

  Multicall multicall;
  MockERC20Mintable usdc;
  MockVault vault;

  function setUp() public {
    vm.startPrank(ALICE);

    multicall = new Multicall(ALICE);
    usdc = new MockERC20Mintable("USD Coin", "USDC", 6);
    vault = new MockVault();

    vm.deal(ALICE, 10 ether);

    vm.stopPrank();
  }

  function test_write() public {
    vm.startPrank(ALICE);

    Multicall.Call[] memory calls = new Multicall.Call[](3);

    calls[0] = Multicall.Call({
      to: address(usdc),
      value: 0,
      data: abi.encodeWithSelector(usdc.mint.selector, address(multicall), 10*1e6)
    });

    calls[1] = Multicall.Call({
      to: address(usdc),
      value: 0,
      data: abi.encodeWithSelector(usdc.approve.selector, address(vault), 2*1e6)
    });

    calls[2] = Multicall.Call({
      to: address(vault),
      value: 1 ether,
      data: abi.encodeWithSelector(vault.deposit.selector, address(usdc), 2*1e6)
    });

    (bool success, ) = address(multicall).call{value: 2 ether}(abi.encodeWithSelector(multicall.write.selector, calls));
    require(success, "failed");

    vm.stopPrank();

    assertEq(usdc.balanceOf(address(multicall)), 8*1e6, "multicall balance should be correct");
    assertEq(usdc.balanceOf(address(vault)), 2*1e6, "vault balance should be correct");
    assertEq(address(vault).balance, 1 ether, "vault native should be correct");
  }

  function test_write_shouldRevert() public {
    vm.startPrank(ALICE);

    Multicall.Call[] memory calls = new Multicall.Call[](3);

    calls[0] = Multicall.Call({
      to: address(usdc),
      value: 0,
      data: abi.encodeWithSelector(usdc.mint.selector, address(multicall), 10*1e6)
    });

    calls[1] = Multicall.Call({
      to: address(usdc),
      value: 0,
      data: abi.encodeWithSelector(usdc.approve.selector, ALICE, 2*1e6)
    });

    calls[2] = Multicall.Call({
      to: address(vault),
      value: 0,
      data: abi.encodeWithSelector(vault.deposit.selector, address(usdc), 2*1e6)
    });

    vm.expectRevert("failed at tx 2");
    multicall.write(calls);

    vm.stopPrank();
  }

  function test_read() public {
    vm.startPrank(ALICE);

    usdc.mint(ALICE, 5*1e6);
    usdc.transfer(GAYBOB, 1*1e6);

    Multicall.Call[] memory calls = new Multicall.Call[](2);

    calls[0] = Multicall.Call({
      to: address(usdc),
      value: 0,
      data: abi.encodeWithSelector(usdc.balanceOf.selector, address(ALICE))
    });

    calls[1] = Multicall.Call({
      to: address(usdc),
      value: 0,
      data: abi.encodeWithSelector(usdc.balanceOf.selector, address(GAYBOB))
    });

    bytes[] memory datas = multicall.read(calls);

    vm.stopPrank();

    assertEq(abi.decode(datas[0], (uint256)), 4e6, "alice balance should be correct");
    assertEq(abi.decode(datas[1], (uint256)), 1e6, "gay bob balance should be correct");
  }
}