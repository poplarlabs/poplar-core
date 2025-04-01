import { erc20Abi } from 'viem'

// TODO: Replace with actual ROOT token contract address
export const ROOT_TOKEN_ADDRESS = '0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e'
export const ROOT_TOKEN_ABI = erc20Abi

// TODO: Replace with actual Poplar contract address
export const POPLAR_CONTRACT_ADDRESS = '0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0'
export const POPLAR_CONTRACT_ABI = [
  // Location validation
  {
    inputs: [
      { name: 'country', type: 'string' },
      { name: 'region', type: 'string' },
      { name: 'locality', type: 'string' }
    ],
    name: 'isValidLocation',
    outputs: [{ type: 'bool' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ name: 'country', type: 'string' }],
    name: 'isCountryAllowed',
    outputs: [{ type: 'bool' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { name: 'country', type: 'string' },
      { name: 'region', type: 'string' }
    ],
    name: 'isRegionAllowed',
    outputs: [{ type: 'bool' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { name: 'country', type: 'string' },
      { name: 'region', type: 'string' },
      { name: 'locality', type: 'string' }
    ],
    name: 'isLocalityAllowed',
    outputs: [{ type: 'bool' }],
    stateMutability: 'view',
    type: 'function'
  },

  // Property management
  {
    inputs: [
      { name: 'country', type: 'string' },
      { name: 'region', type: 'string' },
      { name: 'locality', type: 'string' },
      { name: 'parcel', type: 'string' },
      { name: 'ipfsHash', type: 'string' }
    ],
    name: 'submitProperty',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ name: 'propertyId', type: 'bytes32' }],
    name: 'isPropertyRegistered',
    outputs: [{ type: 'bool' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { name: 'country', type: 'string' },
      { name: 'region', type: 'string' },
      { name: 'locality', type: 'string' },
      { name: 'parcel', type: 'string' }
    ],
    name: 'generatePropertyId',
    outputs: [{ type: 'bytes32' }],
    stateMutability: 'pure',
    type: 'function'
  },

  // Property and validation data
  {
    inputs: [{ name: 'propertyId', type: 'bytes32' }],
    name: 'properties',
    outputs: [
      { name: 'id', type: 'bytes32' },
      { name: 'submitter', type: 'address' },
      { name: 'country', type: 'string' },
      { name: 'region', type: 'string' },
      { name: 'locality', type: 'string' },
      { name: 'parcel', type: 'string' },
      { name: 'ipfsHash', type: 'string' },
      { name: 'stakedAmount', type: 'uint256' },
      { name: 'lastUpdateTime', type: 'uint256' },
      { name: 'validated', type: 'bool' },
      { name: 'validationStatus', type: 'uint8' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ name: 'propertyId', type: 'bytes32' }],
    name: 'validations',
    outputs: [
      { name: 'propertyId', type: 'bytes32' },
      { name: 'fee', type: 'uint256' },
      { name: 'startTime', type: 'uint256' },
      { name: 'totalStaked', type: 'uint256' },
      { name: 'positiveStake', type: 'uint256' },
      { name: 'concluded', type: 'bool' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { name: 'propertyId', type: 'bytes32' },
      { name: 'voter', type: 'address' }
    ],
    name: 'getValidationStake',
    outputs: [
      { name: 'amount', type: 'uint256' },
      { name: 'support', type: 'bool' },
      { name: 'claimed', type: 'bool' }
    ],
    stateMutability: 'view',
    type: 'function'
  },

  // View functions
  {
    inputs: [],
    name: 'getPropertiesNeedingValidation',
    outputs: [{
      components: [
        { name: 'id', type: 'bytes32' },
        { name: 'submitter', type: 'address' },
        { name: 'country', type: 'string' },
        { name: 'region', type: 'string' },
        { name: 'locality', type: 'string' },
        { name: 'parcel', type: 'string' },
        { name: 'ipfsHash', type: 'string' },
        { name: 'stakedAmount', type: 'uint256' },
        { name: 'lastUpdateTime', type: 'uint256' },
        { name: 'validated', type: 'bool' },
        { name: 'validationStatus', type: 'uint8' }
      ],
      name: '',
      type: 'tuple[]'
    }],
    stateMutability: 'view',
    type: 'function'
  },

  // Validation actions
  {
    inputs: [
      { name: 'propertyId', type: 'bytes32' },
      { name: 'fee', type: 'uint256' }
    ],
    name: 'requestValidation',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { name: 'propertyId', type: 'bytes32' },
      { name: 'stake', type: 'uint256' },
      { name: 'support', type: 'bool' }
    ],
    name: 'castValidationVote',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ name: 'propertyId', type: 'bytes32' }],
    name: 'concludeValidation',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ name: 'propertyId', type: 'bytes32' }],
    name: 'claimRewards',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  }
] as const
