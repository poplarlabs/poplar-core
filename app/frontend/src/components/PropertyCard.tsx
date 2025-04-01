import { Property } from './PropertyList';

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const getStatusColor = (status: Property['validationStatus']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'validated':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold mb-2">{property.address.street}</h3>
          <p className="text-gray-600">
            {property.address.city}, {property.address.state} {property.address.zip}
          </p>
          <p className="text-sm text-gray-500 mt-1">Parcel: {property.parcelNumber}</p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
            property.validationStatus
          )}`}
        >
          {property.validationStatus.charAt(0).toUpperCase() + property.validationStatus.slice(1)}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-500">Submitted</p>
          <p className="font-medium">{formatDate(property.submissionDate)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Stake Amount</p>
          <p className="font-medium">{property.stake.amount} ROOT</p>
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center">
            <span className="text-gray-500">Submitted by:</span>
            <span className="ml-2 font-mono">{property.submitterAddress}</span>
          </div>
          <button
            className="text-blue-600 hover:text-blue-800 font-medium"
            onClick={() => {
              // TODO: Implement view details action
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
