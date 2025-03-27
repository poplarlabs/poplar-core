from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Dict, Any
from mock_ipfs import ipfs_storage
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Property IPFS API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PropertyData(BaseModel):
    property_data: Dict[str, Any]

@app.post("/ipfs")
async def add_to_ipfs(data: PropertyData):
    try:
        ipfs_hash = ipfs_storage.add(data.property_data)
        return {"ipfs_hash": ipfs_hash}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/ipfs/{ipfs_hash}")
async def get_from_ipfs(ipfs_hash: str):
    data = ipfs_storage.get(ipfs_hash)
    if data is None:
        raise HTTPException(status_code=404, detail="Data not found")
    return {"ipfs_hash": ipfs_hash, "data": data}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
