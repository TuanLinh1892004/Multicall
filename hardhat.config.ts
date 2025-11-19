import type { HardhatUserConfig } from 'hardhat/config';
import { configVariable } from 'hardhat/config';

import hardhatToolboxViemPlugin from '@nomicfoundation/hardhat-toolbox-viem';
import hardhatVerify from "@nomicfoundation/hardhat-verify";

const etherscan = (url: string) => ({
  name: "",
  blockExplorers: { etherscan: { url, apiUrl: "https://api.etherscan.io/v2/api" } },
});

const accounts = [configVariable('PRIVATE_KEY')];

const config: HardhatUserConfig = {
  plugins: [
    hardhatToolboxViemPlugin, 
    hardhatVerify
  ],
  solidity: {
    version: '0.8.28',
    settings: {
      optimizer: {
        enabled: true,
        runs: 20000,
      },
      viaIR: true
    },
  },
  networks: {
    hardhatMainnet: {
      type: 'edr-simulated',
      chainType: 'l1',
    },
    hardhatOp: {
      type: 'edr-simulated',
      chainType: 'op',
    },
    sepolia: {
      type: 'http',
      chainId: 11155111,
      url: "https://ethereum-sepolia-rpc.publicnode.com",
      accounts: accounts,
    },
    bscTestnet: {
      type: "http",
      chainId: 97,
      url: "https://bsc-testnet-rpc.publicnode.com",
      accounts: accounts,
    },
    base: {
      type: "http",
      chainId: 8453,
      url: "https://base.llamarpc.com",
      accounts: accounts,
    },
    arbitrum: {
      type: "http",
      chainId: 42161,
      url: "https://arb-mainnet.g.alchemy.com/v2/YcbD-pexZ9JBkkhqXueR-5s2pRQ6uTM0",
      accounts: accounts,
    },
    bsc: {
      type: "http",
      chainId: 56,
      url: "https://binance.llamarpc.com",
      accounts: accounts,
    }
  },
  verify: {
    etherscan: {
      apiKey: configVariable('ETHERSCAN_API_KEY'),
    },
    blockscout: {
      enabled: false,
    },
  },
  chainDescriptors: {
    11155111: etherscan("https://sepolia.etherscan.io"),
    97: etherscan("https://testnet.bscscan.com"),
    8453: etherscan("https://basescan.org"),
    56: etherscan("https://bscscan.com"),
    42161: etherscan("https://arbiscan.io")
  }
};

export default config;
