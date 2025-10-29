import { network } from "hardhat";
import { getContract } from '../utils/index.js';
import { encodeFunctionData, parseUnits, createWalletClient, http } from "viem";
import { sepolia } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import dotenv from "dotenv";
dotenv.config();

async function main() {
  const { viem } = await network.connect({network: "sepolia"});
  const publicClient = await viem.getPublicClient();
  const signers = await viem.getWalletClients();

  const walletClient = createWalletClient({
    account: privateKeyToAccount(process.env.TEST_PRIVATE_KEY! as `0x${string}`),
    chain: sepolia,
    transport: http(process.env.SEPOLIA_RPC!)
  })

  const eip7702Multicall = await getContract("MulticallModule", "EIP7702Multicall", viem);
  const erc20 = await getContract("MulticallModule", "MockERC20Mintable", viem);

  const gay = "0xe2dC357BcECFFeb321a8ACc09b6ffcfCbBC335C2";

  console.log("my balance before: ", await erc20.read.balanceOf([signers[0].account.address]));
  console.log("gay balance before:", await erc20.read.balanceOf([gay]));

  const mintData = {
    to: erc20.address,
    value: 0,
    data: encodeFunctionData({abi: erc20.abi, functionName: 'mint', args: [signers[0].account.address, parseUnits('5', 18)]})
  }
  const transferData = {
    to: erc20.address,
    value: 0,
    data: encodeFunctionData({abi: erc20.abi, functionName: 'transfer', args: [gay, parseUnits('4', 18)]})
  }

  const multicallData = encodeFunctionData({abi: eip7702Multicall.abi, functionName: 'write', args: [[mintData, transferData]]});

  const authorization = await walletClient.signAuthorization({
    contractAddress: eip7702Multicall.address,
    executor: 'self'
  })

  const txHash = await walletClient.sendTransaction({
    to: walletClient.account.address,
    data: multicallData,
    authorizationList: [authorization]
  });
  console.log("tx hash:", txHash);

  await publicClient.waitForTransactionReceipt({hash: txHash});

  console.log("my balance after:  ", await erc20.read.balanceOf([signers[0].account.address]));
  console.log("gay balance after: ", await erc20.read.balanceOf([gay]));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });