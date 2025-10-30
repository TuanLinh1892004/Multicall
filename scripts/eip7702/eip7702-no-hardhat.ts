import { encodeFunctionData, parseUnits, createWalletClient, http, createPublicClient, getContract } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import type { Address } from "viem";
import dotenv from "dotenv";
dotenv.config();

// contract addresses and abis
const config = {
  eip7702Multicall: {
    address: '0x41d2A806a30c4f358A81ABe9193cd6bDa16C02Ba' as Address,
    abi: [{"stateMutability":"payable","type":"fallback"},{"inputs":[{"components":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"internalType":"struct EIP7702Multicall.Call[]","name":"calls","type":"tuple[]"}],"name":"write","outputs":[],"stateMutability":"payable","type":"function"},{"stateMutability":"payable","type":"receive"}]
  },
  erc20Troll: {
    address: '0xFC49295E08A5f722190E975d12A411F8a714D070' as Address,
    abi: [{"inputs":[{"internalType":"string","name":"name_","type":"string"},{"internalType":"string","name":"symbol_","type":"string"},{"internalType":"uint8","name":"decimals_","type":"uint8"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"allowance","type":"uint256"},{"internalType":"uint256","name":"needed","type":"uint256"}],"name":"ERC20InsufficientAllowance","type":"error"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"uint256","name":"balance","type":"uint256"},{"internalType":"uint256","name":"needed","type":"uint256"}],"name":"ERC20InsufficientBalance","type":"error"},{"inputs":[{"internalType":"address","name":"approver","type":"address"}],"name":"ERC20InvalidApprover","type":"error"},{"inputs":[{"internalType":"address","name":"receiver","type":"address"}],"name":"ERC20InvalidReceiver","type":"error"},{"inputs":[{"internalType":"address","name":"sender","type":"address"}],"name":"ERC20InvalidSender","type":"error"},{"inputs":[{"internalType":"address","name":"spender","type":"address"}],"name":"ERC20InvalidSpender","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"burn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]
  },
  gayBob: '0xbe7d5b7db24fa7fcae1abf18d50f410c4adfe460',
  blackAlice: '0xe2dc357bcecffeb321a8acc09b6ffcfcbbc335c2'
}

async function main() {

  // init network sepolia
  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(process.env.SEPOLIA_RPC!),
  });

  // init wallet
  const walletClient = createWalletClient({
    account: privateKeyToAccount(process.env.TEST_PRIVATE_KEY! as `0x${string}`),
    chain: sepolia,
    transport: http(process.env.SEPOLIA_RPC!)
  });

  // init contracts
  const erc20Troll = getContract({
    abi: config.erc20Troll.abi,
    address: config.erc20Troll.address,
    client: walletClient
  });

  // alice and bob current balances
  console.log('alice balance before: ', await erc20Troll.read.balanceOf([config.blackAlice])); 
  console.log('bob balance before  : ', await erc20Troll.read.balanceOf([config.gayBob])); 

  // get data
  const mintData = { 
    to: erc20Troll.address, 
    value: 0, 
    data: encodeFunctionData({abi: erc20Troll.abi, functionName: 'mint', args: [config.gayBob, parseUnits('36', 18)]})
  };
  const transferData = {
    to: erc20Troll.address, 
    value: 0, 
    data: encodeFunctionData({abi: erc20Troll.abi, functionName: 'transfer', args: [config.blackAlice, parseUnits('18', 18)]})
  }
  const multicallData = encodeFunctionData({abi: config.eip7702Multicall.abi, functionName: 'write', args: [[mintData, transferData]]});

  // authorization for multicall contract
  const authorization = await walletClient.signAuthorization({
    contractAddress: config.eip7702Multicall.address,
    executor: 'self'
  });

  // execute eip7702 transaction
  const txHash = await walletClient.sendTransaction({
    to: walletClient.account.address,
    data: multicallData,
    authorizationList: [authorization]
  });
  console.log("tx hash:", txHash);

  await publicClient.waitForTransactionReceipt({hash: txHash});

  // alice and bob balances after
  console.log('alice balance after : ', await erc20Troll.read.balanceOf([config.blackAlice])); 
  console.log('bob balance after   : ', await erc20Troll.read.balanceOf([config.gayBob])); 
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });