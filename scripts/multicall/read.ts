import { network } from "hardhat";
import { getContract } from '../utils/index.js';
import { encodeFunctionData } from 'viem';

async function main() {
  const { viem } = await network.connect({network: "sepolia"});

  const multicall = await getContract("MulticallModule", "Multicall", viem);
  const erc20 = await getContract("MulticallModule", "MockERC20Mintable", viem);

  const address0 = '0xbe7d5b7db24fa7fcae1abf18d50f410c4adfe460'
  const balance0Data = {
    to: erc20.address,
    value: 0,
    data: encodeFunctionData({abi: erc20.abi, functionName: 'balanceOf', args: [address0]})
  }

  const address1 = '0x86a36a5baaa5c60036e758caa1a4dad32e6a5af4'
  const balance1Data = {
    to: erc20.address,
    value: 0,
    data: encodeFunctionData({abi: erc20.abi, functionName: 'balanceOf', args: [address1]})
  }

  const datas: any = await multicall.read.read([[balance0Data, balance1Data]]);

  console.log('balance0:', Number(datas[0]));
  console.log('balance0:', Number(datas[1]));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });