import { erc20Abi } from 'viem'

// TODO: Replace with actual ROOT token contract address
export const ROOT_TOKEN_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3'
export const ROOT_TOKEN_ABI = erc20Abi

// TODO: Replace with actual Poplar contract address
export const POPLAR_CONTRACT_ADDRESS = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'
export const POPLAR_CONTRACT_ABI = [
  {
    inputs: [{ internalType: 'string', name: 'ipfsHash', type: 'string' }],
    name: 'submitProperty',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const
