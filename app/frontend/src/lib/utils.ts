import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { keccak256, toBytes, concat } from 'viem'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generatePropertyId(country: string, region: string, locality: string, parcel: string): `0x${string}` {
  // Replicate the contract's generatePropertyId function:
  // keccak256(abi.encodePacked(country, "-", region, "-", locality, "-", parcel))
  const encoded = concat([
    toBytes(country),
    toBytes('-'),
    toBytes(region),
    toBytes('-'),
    toBytes(locality),
    toBytes('-'),
    toBytes(parcel)
  ])
  return keccak256(encoded)
}

export function formatAddress(address: string): string {
  if (!address) return ''
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}
