import { useState } from 'react'
import { useAccount, useWriteContract, useReadContract } from 'wagmi'
import { parseEther } from 'viem'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { LocationSelector, type LocationData } from '@/components/shared/LocationSelector'
import { generatePropertyId } from '@/lib/utils'
import { POPLAR_CONTRACT_ADDRESS, POPLAR_CONTRACT_ABI, ROOT_TOKEN_ADDRESS, ROOT_TOKEN_ABI } from '@/contracts'

interface ValidationFormData extends LocationData {
  parcelNumber: string
  fee: string
}

const initialFormData: ValidationFormData = {
  country: 'US',
  region: '',
  locality: '',
  parcelNumber: '',
  fee: '100' // Default fee in ROOT tokens
}

export function RequestValidation() {
  const { address, isConnected } = useAccount()
  const [formData, setFormData] = useState<ValidationFormData>(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [propertyId, setPropertyId] = useState<`0x${string}` | null>(null)

  // Contract interactions
  const { writeContractAsync: approveTokens } = useWriteContract()
  const { writeContractAsync: requestValidation } = useWriteContract()

  // Check ROOT token allowance
  const { data: allowance } = useReadContract({
    address: ROOT_TOKEN_ADDRESS,
    abi: ROOT_TOKEN_ABI,
    functionName: 'allowance',
    args: [address!, POPLAR_CONTRACT_ADDRESS],
    query: {
      enabled: isConnected,
    },
  })

  // Check if location is valid
  const { data: isLocationValid } = useReadContract({
    address: POPLAR_CONTRACT_ADDRESS,
    abi: POPLAR_CONTRACT_ABI,
    functionName: 'isValidLocation',
    args: [formData.country, formData.region, formData.locality],
    query: {
      enabled: !!(formData.country && formData.region && formData.locality),
    },
  })

  // Check if property exists
  const { data: isPropertyRegistered } = useReadContract({
    address: POPLAR_CONTRACT_ADDRESS,
    abi: POPLAR_CONTRACT_ABI,
    functionName: 'isPropertyRegistered',
    args: propertyId ? [propertyId] : undefined,
    query: {
      enabled: !!propertyId,
    },
  })

  const handleLocationChange = (locationData: LocationData) => {
    setFormData(prev => ({
      ...prev,
      ...locationData
    }))

    // Update property ID when location or parcel changes
    if (locationData.country && locationData.region && locationData.locality && formData.parcelNumber) {
      const newPropertyId = generatePropertyId(
        locationData.country,
        locationData.region,
        locationData.locality,
        formData.parcelNumber
      )
      setPropertyId(newPropertyId)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Update property ID when parcel number changes
    if (name === 'parcelNumber' && value && formData.country && formData.region && formData.locality) {
      const newPropertyId = generatePropertyId(
        formData.country,
        formData.region,
        formData.locality,
        value
      )
      setPropertyId(newPropertyId)
    }
  }

  const validateForm = (): boolean => {
    if (!formData.country || !formData.region || !formData.locality) {
      setError('All location fields are required')
      return false
    }
    if (!isLocationValid) {
      setError('Invalid location combination')
      return false
    }
    if (!formData.parcelNumber) {
      setError('Parcel number is required')
      return false
    }
    if (!isPropertyRegistered) {
      setError('Property not found in registry')
      return false
    }
    if (!formData.fee || parseFloat(formData.fee) <= 0) {
      setError('Valid fee amount is required')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!isConnected) {
      setError('Please connect your wallet first')
      return
    }

    if (!validateForm()) {
      return
    }

    try {
      setIsSubmitting(true)

      const fee = parseEther(formData.fee)

      // Check and get ROOT token approval if needed
      if (!allowance || allowance < fee) {
        const approveTx = await approveTokens({
          address: ROOT_TOKEN_ADDRESS,
          abi: ROOT_TOKEN_ABI,
          functionName: 'approve',
          args: [POPLAR_CONTRACT_ADDRESS, fee],
        })
        console.log('Approval transaction:', approveTx)
      }

      // Request validation
      if (!propertyId) throw new Error('Property ID is required')
      const validationTx = await requestValidation({
        address: POPLAR_CONTRACT_ADDRESS,
        abi: POPLAR_CONTRACT_ABI,
        functionName: 'requestValidation',
        args: [propertyId, fee] as const,
      })
      console.log('Validation request transaction:', validationTx)

      // Reset form on success
      setFormData(initialFormData)
      setPropertyId(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during submission')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Request Property Validation</CardTitle>
        <CardDescription>
          Request validation for a registered property. This requires staking ROOT tokens.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <LocationSelector
            value={formData}
            onChange={handleLocationChange}
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="parcelNumber">Parcel Number</Label>
              <Input
                id="parcelNumber"
                name="parcelNumber"
                value={formData.parcelNumber}
                onChange={handleInputChange}
                placeholder="Enter parcel number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fee">Validation Fee (ROOT)</Label>
              <Input
                id="fee"
                name="fee"
                type="number"
                min="0"
                step="1"
                value={formData.fee}
                onChange={handleInputChange}
                placeholder="Enter fee amount"
              />
            </div>
          </div>

          {propertyId && (
            <Alert>
              <AlertTitle>Property ID</AlertTitle>
              <AlertDescription className="break-all font-mono text-sm">
                {propertyId}
              </AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={
              isSubmitting ||
              !isConnected ||
              !propertyId ||
              isLocationValid === undefined ||
              isLocationValid === false ||
              isPropertyRegistered === undefined ||
              isPropertyRegistered === false
            }
          >
            {isSubmitting ? 'Submitting...' :
             !isConnected ? 'Connect Wallet to Submit' :
             !propertyId ? 'Enter Property Details' :
             isLocationValid === undefined ? 'Checking Location...' :
             isLocationValid === false ? 'Invalid Location' :
             isPropertyRegistered === undefined ? 'Checking Property...' :
             isPropertyRegistered === false ? 'Property Not Found' :
             'Request Validation'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
