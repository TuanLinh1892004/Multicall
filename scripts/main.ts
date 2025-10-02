import { ethers } from "hardhat";
import { Call, multicallEVM, multicallArtifact } from "./multicall/evm/multicall";
import { encode } from "./utils/helper";
import { BigNumber } from 'ethers';

const UINT256_MAX = BigNumber.from("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");

async function main() {
    const WETH_GATEWAY_ADDRESS = "0xa0d9C1E9E48Ca30c8d8C3B5D69FF5dc1f6DFfC24";
    const WETH_GATEWAY_ABI = [
        "function depositETH(address, address onBehalfOf, uint16 referralCode) external payable",
        "function withdrawETH(address, uint256 amount, address to) external"
    ];

    const A_WETH_ADDRESS = "0xD4a0e0b9149BCee3C920d2E00b5dE09138fd8bb7";

    const accounts = await ethers.getSigners();
    const signerAddress = await accounts[0].getAddress();

    const gateway = await ethers.getContractAt(WETH_GATEWAY_ABI, WETH_GATEWAY_ADDRESS);

    let calls: Call[] = [];
    const depositData = encode("depositETH(address,address,uint16)", [signerAddress, multicallArtifact.address, 0]);
    const approveData = encode("approve(address,uint256)", [gateway.address, ethers.utils.parseEther("1")]);
    const withdrawData = encode("withdrawETH(address,uint256,address)", [signerAddress, UINT256_MAX, signerAddress]);

    calls.push({receiver: gateway.address, value: ethers.utils.parseEther("1"), data: depositData});
    calls.push({receiver: A_WETH_ADDRESS, value: ethers.utils.parseEther("0"), data: approveData});
    calls.push({receiver: gateway.address, value: ethers.utils.parseEther("0"), data: withdrawData});

    await multicallEVM(calls);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

// npx hardhat run scripts/main.ts --network base
