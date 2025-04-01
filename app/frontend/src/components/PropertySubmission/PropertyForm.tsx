import { useState, useEffect } from 'react'
import { useAccount, useWriteContract, useReadContract } from 'wagmi'
import { parseEther } from 'viem'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { activeStates } from '@/lib/constants'
import { activeCounties } from '@/lib/counties'
import { uploadToIPFS } from '@/lib/api'
import { ROOT_TOKEN_ADDRESS, ROOT_TOKEN_ABI, POPLAR_CONTRACT_ADDRESS, POPLAR_CONTRACT_ABI } from '@/contracts'

export interface PropertyFormData {
  country: string
  region: string
  locality: string
  parcelNumber: string
  streetAddress: string
  city: string
  zipCode: string
  legalDescription: string
}

const initialFormData: PropertyFormData = {
  country: 'US',
  region: 'Alabama',
  locality: 'Baldwin County',
  parcelNumber: '1234567890',
  streetAddress: '123 Main St',
  city: 'Birmingham',
  zipCode: '35201',
  legalDescription: 'Lot 1, Block 2 of Sunset Heights Addition'
}

const MINIMUM_STAKE = parseEther('100') // 100 ROOT tokens

export function PropertyForm() {
  const { address, isConnected } = useAccount()
  const [formData, setFormData] = useState<PropertyFormData>(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Contract interactions
  const { writeContractAsync: approveTokens } = useWriteContract()
  const { writeContractAsync: submitProperty } = useWriteContract()

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

  // Add debug logging
  useEffect(() => {
    console.log('Location validation state:', {
      country: formData.country,
      region: formData.region,
      locality: formData.locality,
      isLocationValid,
      isEnabled: !!(formData.country && formData.region && formData.locality)
    })
  }, [formData.country, formData.region, formData.locality, isLocationValid])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleRegionChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      region: value,
      locality: ''
    }))
  }

  const handleLocalityChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      locality: value
    }))
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
    if (!formData.streetAddress) {
      setError('Street address is required')
      return false
    }
    if (!formData.city) {
      setError('City is required')
      return false
    }
    if (!formData.zipCode || !/^\d{5}(-\d{4})?$/.test(formData.zipCode)) {
      setError('Valid ZIP code is required')
      return false
    }
    if (!formData.legalDescription) {
      setError('Legal description is required')
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

      // Upload to IPFS
      const ipfsHash = await uploadToIPFS(formData)
      console.log('Property data uploaded to IPFS:', ipfsHash)

      // Check and get ROOT token approval if needed
      if (!allowance || allowance < MINIMUM_STAKE) {
        const approveTx = await approveTokens({
          address: ROOT_TOKEN_ADDRESS,
          abi: ROOT_TOKEN_ABI,
          functionName: 'approve',
          args: [POPLAR_CONTRACT_ADDRESS, MINIMUM_STAKE],
        })
        console.log('Approval transaction:', approveTx)
      }

      // Submit property to contract
      const submitTx = await submitProperty({
        address: POPLAR_CONTRACT_ADDRESS,
        abi: POPLAR_CONTRACT_ABI,
        functionName: 'submitProperty',
        args: [
          formData.country,
          formData.region,
          formData.locality,
          formData.parcelNumber,
          ipfsHash
        ],
      })
      console.log('Submit transaction:', submitTx)

      // Reset form on success
      setFormData(initialFormData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during submission')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Submit Property Record</CardTitle>
        <CardDescription>
          Enter property details. This will require a stake in ROOT tokens.
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

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="region">State/Region</Label>
              <Select value={formData.region} onValueChange={handleRegionChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {activeStates.map(state => (
                    <SelectItem key={state.name} value={state.name}>
                      {state.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="locality">County/Locality</Label>
              <Select
                value={formData.locality}
                onValueChange={handleLocalityChange}
                disabled={!formData.region}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select county" />
                </SelectTrigger>
                <SelectContent>
                  {(activeCounties[formData.region] || []).map((county, idx) => (
                    <SelectItem key={idx} value={county}>
                      {county}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

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
          </div>

          <div className="space-y-2">
            <Label htmlFor="streetAddress">Street Address</Label>
            <Input
              id="streetAddress"
              name="streetAddress"
              value={formData.streetAddress}
              onChange={handleInputChange}
              placeholder="Enter street address"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="Enter city"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="zipCode">ZIP Code</Label>
              <Input
                id="zipCode"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleInputChange}
                placeholder="Enter ZIP code"
                pattern="\d{5}(-\d{4})?"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="legalDescription">Legal Description</Label>
            <Input
              id="legalDescription"
              name="legalDescription"
              value={formData.legalDescription}
              onChange={handleInputChange}
              placeholder="Enter legal description"
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || !isConnected || isLocationValid === undefined || isLocationValid === false}
          >
            {isSubmitting ? 'Submitting...' :
             !isConnected ? 'Connect Wallet to Submit' :
             isLocationValid === undefined ? 'Checking Location...' :
             isLocationValid === false ? 'Invalid Location' :
             'Submit Property Record'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
