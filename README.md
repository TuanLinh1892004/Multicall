# Multicall
Bundle multi transactions in one call

# Deployments
Contract `Multicall` addresses and ABIs are located in [deployments/](./deployments)

# How to use
You need to provide three parameters for each call:  
- **receiver**: the address of the contract you want to interact with  
- **value**: the amount of ETH to send with the call  
- **data**: the encoded function call data  

When executing a multicall, the `value` passed to the `multicall` function must equal the **sum of all values** specified in the calls.  

An example implementation can be found in [`scripts/main.ts`](./scripts/main.ts).