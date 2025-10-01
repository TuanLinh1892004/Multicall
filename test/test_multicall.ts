import { expect } from "chai";
import { ethers } from "hardhat";
import { encode } from "../scripts/utils/helpers";

describe("Test tEst teSt tesT", function() {
    let multicall: any;
    let step: any;
    interface Call {
        receiver: string,
        value: number,
        data: string
    }

    beforeEach(async function () {
        const Multicall = await ethers.getContractFactory("Multicall");
        multicall = await Multicall.deploy();
        await multicall.deployed();

        const Step = await ethers.getContractFactory("Step");
        step = await Step.deploy();
        await step.deployed();
    });

    it("Should multicall", async function() {
        const data1 = encode("addStep(uint256, uint256)", [1, 5]);
        const data2 = encode("removeStep(uint256, uint256)", [1, 2]);
        const data3 = encode("addStep(uint256, uint256)", [2, 2]);

        let calls: Call[] = [];
        calls.push({receiver: step.address, value: 0, data: data1});
        calls.push({receiver: step.address, value: 0, data: data2});
        calls.push({receiver: step.address, value: 0, data: data3});

        const tx = await multicall.multicall(calls);
        await tx.wait();

        const num1 = (await step.step(1)).toNumber();
        const num2 = (await step.step(2)).toNumber();

        expect(num1).to.eq(3);
        expect(num2).to.eq(2);
    });

    it("Should revert", async function() {
        const data1 = encode("addStep(uint256, uint256)", [1, 5]);
        const data2 = encode("addStep(uint256, uint256)", [2, 2]);
        const data3 = encode("removeStep(uint256, uint256)", [1, 6]);

        let calls: Call[] = [];
        calls.push({receiver: step.address, value: 0, data: data1});
        calls.push({receiver: step.address, value: 0, data: data2});
        calls.push({receiver: step.address, value: 0, data: data3});


        await expect(multicall.multicall(calls)).to.be.revertedWith("Multicall failed at tx 2");
    });
})