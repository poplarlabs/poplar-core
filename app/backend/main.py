import os
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from typing import Dict, Any, Optional
from .mock_ipfs import ipfs_storage
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from contextlib import asynccontextmanager

# Import DB stuff
from . import models
from .database import SessionLocal, engine, get_db as get_real_db, init_db as init_real_db
from .mock_db import get_mock_db, init_mock_db
from .models import Address


# Load environment variables from .env file
load_dotenv()

# --- Environment Variable Check ---
USE_MOCK_DB = os.getenv("USE_MOCK_DB", "false").lower() == "true"

# --- Database Initialization ---
if USE_MOCK_DB:
    init_db_func = init_mock_db # Function to potentially call at startup
    get_db_session = get_mock_db
    print("Using MOCK database.")
else:
    # Ensure tables are created before first use if using real DB
    # This might be better in startup, but works here for simplicity.
    try:
        models.Base.metadata.create_all(bind=engine)
        print("Database tables checked/created.")
    except Exception as e:
        print(f"Error creating database tables: {e}")
        # Decide how to handle this - exit? proceed without DB?
        # For now, let it potentially fail later if DB is needed.
    init_db_func = init_real_db # Function to potentially call at startup
    get_db_session = get_real_db
    print("Using REAL database.")


# --- Lifespan Event Handler ---
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic
    print(f"Application startup: {'Mock' if USE_MOCK_DB else 'Real'} database setup checked.")
    yield
    # Shutdown logic (if any) could go here
    # print("Application shutdown.")

app = FastAPI(title="Poplar API", lifespan=lifespan)

# Configure CORS
# TODO: Review origins for production
origins = [
    os.getenv("FRONTEND_URL", "http://localhost:5173"), # Default to common dev port
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Pydantic Models --- #

class UploadData(BaseModel):
    # Define structure expected for IPFS upload if needed, assuming JSON for now
    data: Dict[str, Any]

class UploadResponse(BaseModel):
    dataPointer: str # Renamed from ipfs_hash

class IpfsGetResponse(BaseModel):
    dataPointer: str # Renamed from ipfs_hash
    data: Dict[str, Any]

class ConfigResponse(BaseModel):
    rootTokenAddress: Optional[str]
    poplarParametersAddress: Optional[str]
    submissionValidationAddress: Optional[str]
    treasuryAddress: Optional[str]
    chainId: Optional[str]
    rpcUrl: Optional[str]

class AddressResponse(BaseModel):
    id: int
    street: str
    locality: str # Mapped from city in the model
    region: str   # Mapped from state in the model
    zip_code: str

    class Config:
        from_attributes = True # Pydantic V2 uses this instead of orm_mode


# --- API Endpoints --- #

@app.get("/api/config", response_model=ConfigResponse)
async def get_config():
    """Provides frontend with necessary blockchain configuration."""
    return ConfigResponse(
        rootTokenAddress=os.getenv("ROOT_TOKEN_CONTRACT_ADDRESS"),
        poplarParametersAddress=os.getenv("POPLAR_PARAMETERS_CONTRACT_ADDRESS"),
        submissionValidationAddress=os.getenv("SUBMISSION_VALIDATION_CONTRACT_ADDRESS"),
        treasuryAddress=os.getenv("TREASURY_CONTRACT_ADDRESS"),
        chainId=os.getenv("CHAIN_ID"),
        rpcUrl=os.getenv("RPC_URL")
    )

# Renamed from /ipfs, response model updated
@app.post("/api/upload", response_model=UploadResponse)
async def upload_data(payload: UploadData):
    """(Optional) Uploads data to IPFS (currently mock) and returns the pointer."""
    try:
        # Assuming payload.data is the dictionary to store
        data_pointer = ipfs_storage.add(payload.data)
        return UploadResponse(dataPointer=data_pointer)
    except Exception as e:
        # Log the error for debugging
        # logger.error(f"IPFS upload failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to upload data.")

# Kept path, response model updated
@app.get("/ipfs/{ipfs_hash}", response_model=IpfsGetResponse)
async def get_from_ipfs(ipfs_hash: str):
    """(Optional) Retrieves data from IPFS (currently mock) via its hash/pointer."""
    data = ipfs_storage.get(ipfs_hash)
    if data is None:
        raise HTTPException(status_code=404, detail="Data not found in IPFS mock storage")
    return IpfsGetResponse(dataPointer=ipfs_hash, data=data)

@app.get("/api/addresses/random", response_model=AddressResponse)
async def get_random_address(
    region: Optional[str] = None,
    locality: Optional[str] = None,
    db: Session = Depends(get_db_session) # Use the dynamic session getter
):
    """
    Retrieves a random address, optionally filtered by region (state) and locality (city).
    """
    try:
        query = db.query(models.Address) # Use models.Address

        filters = {}
        # Map API params to model fields
        if region:
            filters['state'] = region
        if locality:
            filters['city'] = locality

        if filters:
            query = query.filter_by(**filters)

        # Order randomly
        if USE_MOCK_DB:
            # Mock DB random ordering happens within its query object
            random_address_data = query.order_by("random").first() # Pass dummy arg
            if random_address_data and isinstance(random_address_data, dict):
                 # Map dict keys to AddressResponse fields explicitly
                 # Ensure keys match the mock data structure
                 random_address = AddressResponse(
                     id=random_address_data['id'],
                     street=random_address_data['street'],
                     locality=random_address_data.get('locality', random_address_data.get('city')), # Handle potential key name difference
                     region=random_address_data.get('region', random_address_data.get('state')), # Handle potential key name difference
                     zip_code=random_address_data['zip_code']
                 )
            else:
                 random_address = None # No mock data found or not a dict
        else:
            # Use database-specific random function for efficiency
            random_address = query.order_by(func.random()).first()

        if random_address is None:
            raise HTTPException(status_code=404, detail="No matching address found")

        # Pydantic's response_model handles the conversion if `from_attributes=True` is set
        # For mock DB, we manually created an AddressResponse instance above.
        # For real DB, the SQLAlchemy model instance is automatically converted.
        return random_address
    except Exception as e:
        print(f"Error fetching random address: {e}") # Basic logging
        # Depending on the error, might want different status codes
        raise HTTPException(status_code=500, detail="Internal server error retrieving address.")


# --- Main Execution --- #

if __name__ == "__main__":
    import uvicorn
    # Use environment variable for port, default to 8000
    port = int(os.getenv("PORT", 8000))
    # Ensure host is correct for accessibility (e.g., Docker)
    host = os.getenv("HOST", "0.0.0.0")
    print(f"Starting server on {host}:{port}")
    uvicorn.run(app, host=host, port=port)
