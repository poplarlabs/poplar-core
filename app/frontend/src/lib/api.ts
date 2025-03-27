import { PropertyFormData } from '@/components/PropertySubmission/PropertyForm';

const API_BASE_URL = 'http://localhost:8000';

export async function uploadToIPFS(data: PropertyFormData): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/ipfs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ property_data: data }),
  });

  if (!response.ok) {
    throw new Error('Failed to upload to IPFS');
  }

  const result = await response.json();
  return result.ipfs_hash;
}

export async function getFromIPFS(ipfsHash: string): Promise<PropertyFormData> {
  const response = await fetch(`${API_BASE_URL}/ipfs/${ipfsHash}`);

  if (!response.ok) {
    throw new Error('Failed to fetch from IPFS');
  }

  const result = await response.json();
  return result.data;
}
