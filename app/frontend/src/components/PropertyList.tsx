import { useReadContract } from 'wagmi'
import { useNavigate } from 'react-router-dom'
import { formatEther } from 'viem'
import { Button } from "@/components/ui/button"
import { POPLAR_CONTRACT_ADDRESS, POPLAR_CONTRACT_ABI } from '@/contracts'
import { formatAddress } from '@/lib/utils'

export interface Property {
  id: `0x${string}`
  submitter: `0x${string}`
  country: string
  region: string
  locality: string
  parcel: string
  ipfsHash: string
  stakedAmount: bigint
  lastUpdateTime: bigint
  validated: boolean
  validationStatus: number
}

export function PropertyList() {
  const navigate = useNavigate()

  const { data: properties = [], isLoading } = useReadContract({
    address: POPLAR_CONTRACT_ADDRESS,
    abi: POPLAR_CONTRACT_ABI,
    functionName: 'getPropertiesNeedingValidation',
    query: {
      enabled: true,
      refetchInterval: 2000,
    },
  })

  const handleViewValidation = (propertyId: `0x${string}`) => {
    navigate(`/validation/${propertyId}`)
  }

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Properties Pending Validation</h1>
        <p className="text-gray-600">Review and participate in property validations</p>
      </div>

      <div className="grid gap-6">
        {properties.map((property: Property) => (
          <div
            key={property.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold mb-2">
                    {property.country}, {property.region}
                  </h2>
                  <p className="text-gray-600">
                    {property.locality} • Parcel {property.parcel}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    Submitted by {formatAddress(property.submitter)}
                  </p>
                  <p className="text-sm font-medium mt-1">
                    {Number(formatEther(property.stakedAmount)).toLocaleString(undefined, {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 4,
                    })} ROOT staked
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Pending Validation
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(Number(property.lastUpdateTime) * 1000).toLocaleDateString()}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewValidation(property.id)}
                >
                  View Details
                </Button>
              </div>
            </div>
          </div>
        ))}

        {properties.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No properties currently need validation</p>
          </div>
        )}
      </div>
    </div>
  )
}
