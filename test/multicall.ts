import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'node:test';
import { encodeFunctionData, parseUnits } from 'viem'
import { network } from 'hardhat';

describe('Multicall', async function () {
  const { viem } = await network.connect();
  const publicClient = await viem.getPublicClient();
  const [deployer, signer1] = await viem.getWalletClients();
  let multicall: any;
  let usdc: any;
  let vault: any;

  beforeEach(async function () {
    multicall = await viem.deployContract('Multicall', [deployer.account.address]);
    usdc = await viem.deployContract('MockERC20Mintable', ["USD Coin", "USDC", 6]);
    vault = await viem.deployContract('MockVault');
  });

  it("Should multi write", async function () {
    const calls = [
      {
        to: usdc.address,
        value: 0,
        data: encodeFunctionData({abi: usdc.abi, functionName: 'mint', args: [multicall.address, 10_000_000n]})
      },
      {
        to: usdc.address,
        value: 0,
        data: encodeFunctionData({abi: usdc.abi, functionName: 'approve', args: [vault.address, 2_000_000n]})
      },
      {
        to: vault.address,
        value: parseUnits('1', 18),
        data: encodeFunctionData({abi: vault.abi, functionName: 'deposit', args: [usdc.address, 2_000_000n]})
      }
    ];

    const multicallHash = await multicall.write.write([calls], {value: parseUnits('2', 18)});
    await publicClient.waitForTransactionReceipt({hash: multicallHash});

    const multicallBalance = await usdc.read.balanceOf([multicall.address]);
    const vaultBalance = await usdc.read.balanceOf([vault.address]);
    
    assert.equal(multicallBalance, 8_000_000n, "multicall balance should be correct");
    assert.equal(vaultBalance, 2_000_000n, "vault balance should be correct");
    assert.equal(await publicClient.getBalance(vault), parseUnits('1', 18), "vault native should be correct");
  });
  it("Should revert", async function () {
    const calls = [
      {
        to: deployer.account.address,
        value: 0,
        data: encodeFunctionData({abi: usdc.abi, functionName: 'mint', args: [multicall.address, 10_000_000n]})
      },
      {
        to: usdc.address,
        value: 0,
        data: encodeFunctionData({abi: usdc.abi, functionName: 'approve', args: [vault.address, 2_000_000n]})
      },
      {
        to: vault.address,
        value: 0,
        data: encodeFunctionData({abi: vault.abi, functionName: 'deposit', args: [usdc.address, 2_000_000n]})
      }
    ];

    await viem.assertions.revert(multicall.write.write([calls]));
  });
  it("Should multi read", async function () {
    const mintTx = await usdc.write.mint([deployer.account.address, 5_000_000n]);
    await publicClient.waitForTransactionReceipt({hash: mintTx});

    const transferTx = await usdc.write.transfer([signer1.account.address, 1_000_000n]);
    await publicClient.waitForTransactionReceipt({hash: transferTx});

    const calls = [
      {
        to: usdc.address,
        value: 0,
        data: encodeFunctionData({abi: usdc.abi, functionName: 'balanceOf', args: [deployer.account.address]})
      },
      {
        to: usdc.address,
        value: 0,
        data: encodeFunctionData({abi: usdc.abi, functionName: 'balanceOf', args: [signer1.account.address]})
      }
    ];

    const datas = await multicall.read.read([calls]);

    assert.equal(Number(datas[0]), 4_000_000, "deployer balance should be correct");
    assert.equal(Number(datas[1]), 1_000_000, "signer1 balance should be correct");
  });
});
