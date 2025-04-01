import { Property } from './PropertyList';
import { formatEther } from 'viem';
import { formatAddress } from '@/lib/utils';

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const getStatusInfo = (status: Property['validationStatus']): { text: string; color: string } => {
    switch (status) {
      case 0:
      case 1:
        return { text: 'Pending', color: 'bg-yellow-100 text-yellow-800' };
      case 2:
        return { text: 'Validated', color: 'bg-green-100 text-green-800' };
      default:
        return { text: 'Rejected', color: 'bg-red-100 text-red-800' };
    }
  };

  const formatDate = (timestamp: bigint) => {
    if (!timestamp) return 'N/A';
    return new Date(Number(timestamp) * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const statusInfo = getStatusInfo(property.validationStatus);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold mb-2">{property.locality}, {property.region}</h3>
          <p className="text-gray-600">
            {property.country}
          </p>
          <p className="text-sm text-gray-500 mt-1">Parcel: {property.parcel}</p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}
        >
          {statusInfo.text}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-500">Submitted</p>
          <p className="font-medium">{formatDate(property.lastUpdateTime)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Stake Amount</p>
          <p className="font-medium">{Number(formatEther(property.stakedAmount)).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 4 })} ROOT</p>
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center">
            <span className="text-gray-500">Submitted by:</span>
            <span className="ml-2 font-mono">{formatAddress(property.submitter)}</span>
          </div>
          <button
            className="text-blue-600 hover:text-blue-800 font-medium"
            onClick={() => {
              console.log('View details:', property.id);
            }}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
