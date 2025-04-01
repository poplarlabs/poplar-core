import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { activeStates } from '@/lib/constants'
import { activeCounties } from '@/lib/counties'

export interface LocationData {
  country: string
  region: string
  locality: string
}

interface LocationSelectorProps {
  value: LocationData
  onChange: (newValue: LocationData) => void
  className?: string
}

export function LocationSelector({ value, onChange, className = '' }: LocationSelectorProps) {
  const handleRegionChange = (newRegion: string) => {
    onChange({
      ...value,
      region: newRegion,
      locality: '' // Reset locality when region changes
    })
  }

  const handleLocalityChange = (newLocality: string) => {
    onChange({
      ...value,
      locality: newLocality
    })
  }

  return (
    <div className={`grid grid-cols-2 gap-4 ${className}`}>
      <div className="space-y-2">
        <Label htmlFor="region">State/Region</Label>
        <Select value={value.region} onValueChange={handleRegionChange}>
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
          value={value.locality}
          onValueChange={handleLocalityChange}
          disabled={!value.region}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select county" />
          </SelectTrigger>
          <SelectContent>
            {(activeCounties[value.region] || []).map((county, idx) => (
              <SelectItem key={idx} value={county}>
                {county}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
