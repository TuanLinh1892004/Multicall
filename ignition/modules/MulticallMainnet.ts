import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

export default buildModule('MulticallMainnetModule', m => {
  const multicall = m.contract('Multicall', [m.getAccount(0)]);

  return { multicall };
});
