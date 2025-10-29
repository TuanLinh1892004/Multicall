import { network } from "hardhat";
import { getContract } from '../utils/index.js';
import {  encodeFunctionData, parseUnits } from 'viem';

async function main() {
  const { viem } = await network.connect({network: "sepolia"});
  const publicClient = await viem.getPublicClient();
  const signers = await viem.getWalletClients();

  const multicall = await getContract("MulticallModule", "Multicall", viem);
  const erc20 = await getContract("MulticallModule", "MockERC20Mintable", viem);

  console.log("balance before:", await erc20.read.balanceOf([signers[0].account.address]));

  const mintData = {
    to: erc20.address,
    value: 0,
    data: encodeFunctionData({abi: erc20.abi, functionName: 'mint', args: [signers[0].account.address, parseUnits('36', 18)]})
  }

  const multicallTx = await multicall.write.write([[mintData]]);
  await publicClient.waitForTransactionReceipt({hash: multicallTx});

  console.log("balance after: ", await erc20.read.balanceOf([signers[0].account.address]));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });