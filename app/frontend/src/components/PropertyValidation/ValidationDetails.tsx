import { useState } from 'react'
import { useAccount, useReadContract, useWriteContract } from 'wagmi'
import { parseEther, formatEther } from 'viem'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { POPLAR_CONTRACT_ADDRESS, POPLAR_CONTRACT_ABI, ROOT_TOKEN_ADDRESS, ROOT_TOKEN_ABI } from '@/contracts'
import { formatAddress } from '@/lib/utils'

interface Property {
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

interface Validation {
  propertyId: `0x${string}`
  fee: bigint
  startTime: bigint
  totalStaked: bigint
  positiveStake: bigint
  concluded: boolean
}

interface UserStake {
  amount: bigint
  support: boolean
  claimed: boolean
}

export function ValidationDetails() {
  const { propertyId } = useParams<{ propertyId: string }>()
  const navigate = useNavigate()
  const { address, isConnected } = useAccount()
  const [stakeAmount, setStakeAmount] = useState('100')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!propertyId) {
    return <div>Invalid property ID</div>
  }

  // Contract interactions
  const { writeContractAsync: approveTokens } = useWriteContract()
  const { writeContractAsync: castVote } = useWriteContract()
  const { writeContractAsync: concludeValidation } = useWriteContract()
  const { writeContractAsync: claimRewards } = useWriteContract()

  // Get property details
  const { data: propertyData, isLoading: isPropertyLoading } = useReadContract({
    address: POPLAR_CONTRACT_ADDRESS,
    abi: POPLAR_CONTRACT_ABI,
    functionName: 'properties',
    args: [propertyId as `0x${string}`],
    query: {
      enabled: true,
      refetchInterval: 2000,
    },
  })

  // Transform tuple to object
  const property = propertyData ? {
    id: propertyData[0],
    submitter: propertyData[1],
    country: propertyData[2],
    region: propertyData[3],
    locality: propertyData[4],
    parcel: propertyData[5],
    ipfsHash: propertyData[6],
    stakedAmount: propertyData[7],
    lastUpdateTime: propertyData[8],
    validated: propertyData[9],
    validationStatus: propertyData[10]
  } as Property : undefined

  // Get validation details
  const { data: validationData, isLoading: isValidationLoading } = useReadContract({
    address: POPLAR_CONTRACT_ADDRESS,
    abi: POPLAR_CONTRACT_ABI,
    functionName: 'validations',
    args: [propertyId as `0x${string}`],
    query: {
      enabled: true,
      refetchInterval: 2000,
    },
  })

  // Transform tuple to object
  const validation = validationData ? {
    propertyId: validationData[0],
    fee: validationData[1],
    startTime: validationData[2],
    totalStaked: validationData[3],
    positiveStake: validationData[4],
    concluded: validationData[5]
  } as Validation : undefined

  // Check if user has already voted
  const { data: userStakeData, isLoading: isUserStakeLoading } = useReadContract({
    address: POPLAR_CONTRACT_ADDRESS,
    abi: POPLAR_CONTRACT_ABI,
    functionName: 'getValidationStake',
    args: [propertyId as `0x${string}`, address!],
    query: {
      enabled: isConnected,
      refetchInterval: 2000,
    },
  })

  // Transform tuple to object
  const userStake = userStakeData ? {
    amount: userStakeData[0],
    support: userStakeData[1],
    claimed: userStakeData[2]
  } as UserStake : undefined

  // Check ROOT token allowance
  const { data: allowance, isLoading: isAllowanceLoading } = useReadContract({
    address: ROOT_TOKEN_ADDRESS,
    abi: ROOT_TOKEN_ABI,
    functionName: 'allowance',
    args: [address!, POPLAR_CONTRACT_ADDRESS],
    query: {
      enabled: isConnected,
      refetchInterval: 2000,
    },
  })

  const handleVote = async (support: boolean) => {
    setError(null)

    if (!isConnected) {
      setError('Please connect your wallet first')
      return
    }

    try {
      setIsSubmitting(true)
      const stake = parseEther(stakeAmount)

      // Check and get ROOT token approval if needed
      if (!allowance || allowance < stake) {
        const approveTx = await approveTokens({
          address: ROOT_TOKEN_ADDRESS,
          abi: ROOT_TOKEN_ABI,
          functionName: 'approve',
          args: [POPLAR_CONTRACT_ADDRESS, stake],
        })
        console.log('Approval transaction:', approveTx)
      }

      // Cast vote
      const voteTx = await castVote({
        address: POPLAR_CONTRACT_ADDRESS,
        abi: POPLAR_CONTRACT_ABI,
        functionName: 'castValidationVote',
        args: [propertyId as `0x${string}`, stake, support],
      })
      console.log('Vote transaction:', voteTx)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while voting')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleConclude = async () => {
    setError(null)
    try {
      setIsSubmitting(true)
      const tx = await concludeValidation({
        address: POPLAR_CONTRACT_ADDRESS,
        abi: POPLAR_CONTRACT_ABI,
        functionName: 'concludeValidation',
        args: [propertyId as `0x${string}`],
      })
      console.log('Conclude transaction:', tx)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while concluding')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClaim = async () => {
    setError(null)
    try {
      setIsSubmitting(true)
      const tx = await claimRewards({
        address: POPLAR_CONTRACT_ADDRESS,
        abi: POPLAR_CONTRACT_ABI,
        functionName: 'claimRewards',
        args: [propertyId as `0x${string}`],
      })
      console.log('Claim transaction:', tx)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while claiming')
    } finally {
      setIsSubmitting(false)
    }
  }

  const canVote = isConnected && !userStake?.amount && validation?.startTime && !validation?.concluded
  const canConclude = isConnected && validation?.startTime && !validation?.concluded
  const canClaim = isConnected && validation?.concluded && !userStake?.claimed

  if (!property) return null

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">Property Validation</h1>
                <p className="text-gray-600">Review and validate property details</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate('/properties')}>
                Back to List
              </Button>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Location Details</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Country</label>
                    <p className="text-gray-900">{property.country}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Region</label>
                    <p className="text-gray-900">{property.region}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Locality</label>
                    <p className="text-gray-900">{property.locality}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Parcel Number</label>
                    <p className="text-gray-900">{property.parcel}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Submission Info</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Submitted By</label>
                    <p className="text-gray-900">{formatAddress(property.submitter)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Staked Amount</label>
                    <p className="text-gray-900">
                      {Number(formatEther(property.stakedAmount)).toLocaleString(undefined, {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 4,
                      })} ROOT
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Submission Date</label>
                    <p className="text-gray-900">
                      {new Date(Number(property.lastUpdateTime) * 1000).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {property.validationStatus === 1 ? 'Pending Validation' :
                       property.validationStatus === 2 ? 'Approved' :
                       property.validationStatus === 3 ? 'Rejected' : 'Unknown'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {validation && (
              <div className="border-t border-gray-200 pt-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold">Validation Progress</h3>
                    <p className="text-sm text-gray-500 mt-1">Current validation status and voting details</p>
                  </div>
                  {(isValidationLoading || isPropertyLoading) && (
                    <span className="text-sm text-gray-500">(Updating...)</span>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Total Staked</label>
                      <p className="text-2xl font-semibold text-gray-900">
                        {Number(formatEther(validation.totalStaked)).toLocaleString(undefined, {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 4,
                        })} ROOT
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Support Stake</label>
                      <p className="text-2xl font-semibold text-gray-900">
                        {Number(formatEther(validation.positiveStake)).toLocaleString(undefined, {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 4,
                        })} ROOT
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Start Time</label>
                      <p className="text-gray-900">
                        {new Date(Number(validation.startTime) * 1000).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Status</label>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        validation.concluded ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {validation.concluded ? 'Concluded' : 'In Progress'}
                      </span>
                    </div>
                  </div>
                </div>

                {canVote && (
                  <div className="bg-gray-50 rounded-lg p-6 mb-6">
                    <h4 className="text-lg font-semibold mb-4">Cast Your Vote</h4>
                    <div className="flex gap-4 items-end">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Stake Amount (ROOT)
                        </label>
                        <Input
                          type="number"
                          min="100"
                          step="1"
                          value={stakeAmount}
                          onChange={(e) => setStakeAmount(e.target.value)}
                          placeholder="Enter stake amount"
                          className="w-full"
                        />
                      </div>
                      <Button
                        onClick={() => handleVote(true)}
                        disabled={isSubmitting}
                        className="flex-1"
                      >
                        Vote Support
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleVote(false)}
                        disabled={isSubmitting}
                        className="flex-1"
                      >
                        Vote Against
                      </Button>
                    </div>
                  </div>
                )}

                {canConclude && (
                  <div className="bg-gray-50 rounded-lg p-6 mb-6">
                    <h4 className="text-lg font-semibold mb-4">Conclude Validation</h4>
                    <Button
                      onClick={handleConclude}
                      disabled={isSubmitting}
                      className="w-full"
                    >
                      Conclude Validation
                    </Button>
                  </div>
                )}

                {canClaim && (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold mb-4">Claim Rewards</h4>
                    <Button
                      onClick={handleClaim}
                      disabled={isSubmitting}
                      className="w-full"
                    >
                      Claim Rewards
                    </Button>
                  </div>
                )}

                {!isConnected && (
                  <div className="text-center py-6 text-gray-500">
                    Connect your wallet to participate in validation
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
