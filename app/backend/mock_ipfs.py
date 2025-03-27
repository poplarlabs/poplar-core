import hashlib
import json
from typing import Dict, Any

class MockIPFSStorage:
    def __init__(self):
        self._storage: Dict[str, Any] = {}

    def add(self, data: Dict[str, Any]) -> str:
        # Convert data to a consistent string format for hashing
        data_str = json.dumps(data, sort_keys=True)

        # Create a hash using SHA-256
        hash_object = hashlib.sha256(data_str.encode())
        ipfs_hash = hash_object.hexdigest()

        # Store the data with the hash as the key
        self._storage[ipfs_hash] = data

        return ipfs_hash

    def get(self, ipfs_hash: str) -> Dict[str, Any]:
        return self._storage.get(ipfs_hash)

# Create a global instance
ipfs_storage = MockIPFSStorage()