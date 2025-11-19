import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

export default buildModule('MulticallTestnetModule', m => {
  const multicall = m.contract('Multicall', [m.getAccount(0)]);

  const erc20 = m.contract('MockERC20Mintable', ["Troll Olo", "TROLL", 18], {after: [multicall]});

  const eip7702Multicall = m.contract('EIP7702Multicall', [], {after: [erc20]});

  return { multicall, erc20, eip7702Multicall };
});
