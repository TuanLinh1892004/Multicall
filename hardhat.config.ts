import type { HardhatUserConfig } from 'hardhat/config';
import { configVariable } from 'hardhat/config';

import hardhatToolboxViemPlugin from '@nomicfoundation/hardhat-toolbox-viem';
import hardhatVerify from "@nomicfoundation/hardhat-verify";

const etherscan = (url: string) => ({
  name: "",
  blockExplorers: { etherscan: { url, apiUrl: "https://api.etherscan.io/v2/api" } },
});

const config: HardhatUserConfig = {
  plugins: [
    hardhatToolboxViemPlugin, 
    hardhatVerify
  ],
  solidity: {
    profiles: {
      default: {
        version: '0.8.28',
      },
      production: {
        version: '0.8.28',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
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
      url: "https://ethereum-sepolia-public.nodies.app",
      accounts: [configVariable('PRIVATE_KEY')],
    },
    bscTestnet: {
      type: "http",
      chainId: 97,
      url: "https://bsc-testnet-rpc.publicnode.com",
      accounts: [configVariable('PRIVATE_KEY')],
    },
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
    97: etherscan("https://testnet.bscscan.com")
  }
};

export default config;
