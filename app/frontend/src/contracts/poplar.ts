import { POPLAR_CONTRACT_ADDRESS } from '@/contracts';
import { useReadContract, useWatchContractEvent } from 'wagmi';

export const POPLAR_ADDRESS = POPLAR_CONTRACT_ADDRESS; // Replace with actual contract address

export const POPLAR_ABI = [
  // Read functions
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
      type: 'tuple[]'
    }],
    stateMutability: 'view',
    type: 'function'
  },
  // Events
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'propertyId', type: 'bytes32' },
      { indexed: true, name: 'submitter', type: 'address' },
      { indexed: false, name: 'country', type: 'string' },
      { indexed: false, name: 'region', type: 'string' },
      { indexed: false, name: 'locality', type: 'string' },
      { indexed: false, name: 'parcel', type: 'string' },
      { indexed: false, name: 'ipfsHash', type: 'string' },
      { indexed: false, name: 'stakedAmount', type: 'uint256' }
    ],
    name: 'PropertySubmitted',
    type: 'event'
  }
] as const;

interface PropertyData {
  id: `0x${string}`;
  submitter: `0x${string}`;
  country: string;
  region: string;
  locality: string;
  parcel: string;
  ipfsHash: string;
  stakedAmount: bigint;
  lastUpdateTime: bigint;
  validated: boolean;
  validationStatus: number;
}

// Hook to get all properties needing validation
export function usePropertiesNeedingValidation() {
  const { data: properties, isLoading, error } = useReadContract({
    address: POPLAR_ADDRESS,
    abi: POPLAR_ABI,
    functionName: 'getPropertiesNeedingValidation',
  });

  if (isLoading || !properties) {
    return { properties: [], isLoading, error };
  }

  // Transform contract data to our frontend format
  const transformedProperties = properties.map((property) => ({
    id: property.id,
    parcelNumber: property.parcel,
    address: {
      street: '',  // This would come from IPFS data
      city: property.locality,
      state: property.region,
      zip: ''      // This would come from IPFS data
    },
    submissionDate: new Date(Number(property.lastUpdateTime) * 1000).toISOString(),
    submitterAddress: property.submitter,
    validationStatus: property.validationStatus === 0 ? 'pending' :
                     property.validationStatus === 1 ? 'pending' :
                     property.validationStatus === 2 ? 'validated' :
                     'rejected',
    stake: {
      amount: property.stakedAmount.toString(),
      status: 'locked',
      lockPeriodEnd: new Date(
        (Number(property.lastUpdateTime) + 172800) * 1000 // VALIDATION_PERIOD = 2 days
      ).toISOString()
    },
    ipfsHash: property.ipfsHash,
    transactionHash: '' // This would need to come from event logs
  }));

  return {
    properties: transformedProperties,
    isLoading,
    error
  };
}

// Hook to listen for new property submissions
export function usePropertySubmittedEvents(onPropertySubmitted: (property: PropertySubmittedEvent) => void) {
  useWatchContractEvent({
    address: POPLAR_ADDRESS,
    abi: POPLAR_ABI,
    eventName: 'PropertySubmitted',
    onLogs: (logs) => {
      logs.forEach((log) => {
        if (
          log.args.propertyId &&
          log.args.submitter &&
          log.args.country &&
          log.args.region &&
          log.args.locality &&
          log.args.parcel &&
          log.args.ipfsHash &&
          log.args.stakedAmount
        ) {
          onPropertySubmitted({
            id: log.args.propertyId,
            submitter: log.args.submitter,
            country: log.args.country,
            region: log.args.region,
            locality: log.args.locality,
            parcel: log.args.parcel,
            ipfsHash: log.args.ipfsHash,
            stakedAmount: log.args.stakedAmount.toString()
          });
        }
      });
    }
  });
}

export interface PropertySubmittedEvent {
  id: `0x${string}`;
  submitter: `0x${string}`;
  country: string;
  region: string;
  locality: string;
  parcel: string;
  ipfsHash: string;
  stakedAmount: string;
}
