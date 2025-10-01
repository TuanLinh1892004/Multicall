import "@typechain/hardhat";
import "hardhat-contract-sizer";
import "@nomiclabs/hardhat-ethers";
import "@nomicfoundation/hardhat-toolbox";
import "@ethersproject/abstract-provider";
import "@ethersproject/abstract-signer";
import "@ethersproject/transactions";
import "@ethersproject/bytes";
import "hardhat-interface-generator";
import "hardhat-deploy";
import { HardhatUserConfig } from "hardhat/config";
import * as dotenv from "dotenv";
dotenv.config();

const accounts = [process.env.PRIVATE_KEY!];

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: '0.8.28',
        settings: {
          viaIR: true,
          optimizer: {
            enabled: true,
            runs: 0,
          },
        },
      },
    ],
  },
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 31337,
      gasPrice: 1e11,
      gas: 2e7,
      live: false,
    },
    sepolia: {
      url: "https://eth-sepolia.public.blastapi.io",
      chainId: 11155111,
      gasPrice: 1e9,
      gas: 2e7,
      live: false,
      accounts: accounts
    },
    base: {
      url: "https://virtual.base.eu.rpc.tenderly.co/5f1bbee9-515d-4e7c-9a88-821112f7710f",
      chainId: 8453,
      // gasPrice: 1e8,
      gas: 5e6,
      live: false,
      accounts: accounts
    },
  },
  contractSizer: {
    alphaSort: true,
    runOnCompile: false,
    disambiguatePaths: false,
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
};

export default config;
