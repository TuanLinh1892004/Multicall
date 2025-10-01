import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deployments, getNamedAccounts } = hre;
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    console.log("\n================================= deploy multicall =================================\n");

    const path = "contracts/evm/";

    // Multicall
    const registryDeploy = await deploy("Multicall", {
        contract: path + "Multicall.sol:Multicall",
        from: deployer,
        args: [],
        log: false,
        autoMine: true,
    });
    console.log("✅ Multicall", registryDeploy.address);
    console.log('\n');
};
func.tags = ["multicall"];
export default func;

// npx hardhat deploy --network hardhat --tags multicall