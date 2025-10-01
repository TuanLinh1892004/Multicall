import { ethers, network } from "hardhat";
import { BigNumber, Contract } from "ethers";
import { encode, readFromJson } from "../../utils/helpers";

export interface Call {
    receiver: string,
    value: BigNumber,
    data: string
}

export async function multicallEVM(calls: Call[]) {
    const artifact = readFromJson(`deployments/${network.name}/Multicall.json`);
    const multicall = (await ethers.getContractAt(artifact.abi, artifact.address)) as Contract;
    let totalValue = BigNumber.from(0);
    for (let i = 0; i < calls.length; i++) totalValue = totalValue.add(calls[i].value);
    const tx = await multicall.multicall(calls, {value: totalValue});
    await tx.wait();
    console.log("multicall hash: ", tx.hash);
}

export const multicallArtifact = readFromJson(`deployments/${network.name}/Multicall.json`);