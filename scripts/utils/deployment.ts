import fs from "fs";
import path from "path";
import { network } from 'hardhat';
import type { Address, Abi } from "viem";
import type { HardhatViemHelpers } from "@nomicfoundation/hardhat-viem/types";

export async function getDeployment(moduleName: string, contractName: string, viem?: HardhatViemHelpers) {
  if (!viem) viem = (await network.connect()).viem;

  const publicClient = await viem.getPublicClient();
  const deploymentPath = path.join("ignition", "deployments", `chain-${publicClient.chain.id}`);

  if (!fs.existsSync(deploymentPath)) {
    throw new Error(`Error: Deployment not found: ${deploymentPath}`);
  }

  const addressPath = path.join(deploymentPath, 'deployed_addresses.json');
  const address: Address = (JSON.parse(fs.readFileSync(addressPath, "utf8")))[`${moduleName}#${contractName}`];

  const abiPath = path.join(deploymentPath, 'artifacts', `${moduleName}#${contractName}.json`);
  const abi: Abi = (JSON.parse(fs.readFileSync(abiPath, "utf8"))).abi;

  return { address, abi };
}

export async function getContract(moduleName: string, contractName: string, viem?: HardhatViemHelpers) {
  if (!viem) viem = (await network.connect()).viem;
  return (await viem.getContractAt(contractName, (await getDeployment(moduleName, contractName, viem)).address));
}