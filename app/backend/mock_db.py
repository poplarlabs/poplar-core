# app/backend/mock_db.py
import random
from typing import Optional
from pydantic import BaseModel

# Mock data structure (can be expanded)
MOCK_ADDRESSES = [
    {"id": 1, "street": "1 E Pershing Rd", "city": "Kansas City", "locality": "Jackson County", "region": "MO", "zip_code": "64108"},
    {"id": 2, "street": "4800 Noland Rd", "city": "Kansas City", "locality": "Jackson County", "region": "MO", "zip_code": "64133"},
    {"id": 3, "street": "101 E Magnolia Ave", "city": "Foley", "locality": "Baldwin County", "region": "AL", "zip_code": "36535"},
    {"id": 4, "street": "201 E Michigan Ave", "city": "Foley", "locality": "Baldwin County", "region": "AL", "zip_code": "36535"},
    {"id": 5, "street": "100 5th St", "city": "Basin", "locality": "Big Horn County", "region": "WY", "zip_code": "82410"},
]

class MockQuery:
    """ Simulates basic SQLAlchemy query filtering and ordering """
    def __init__(self, data):
        self._data = data

    def filter_by(self, **kwargs):
        filtered_data = [
            item for item in self._data
            if all(item.get(key) == value for key, value in kwargs.items())
        ]
        return MockQuery(filtered_data)

    def order_by(self, *args):
        # Mock random ordering by shuffling
        shuffled_data = self._data[:]
        random.shuffle(shuffled_data)
        return MockQuery(shuffled_data)

    def first(self):
        return self._data[0] if self._data else None

class MockSession:
    """ Simulates a database session """
    def query(self, model):
        if model.__name__ == "Address":
             return MockQuery(MOCK_ADDRESSES)
        return MockQuery([])

    def close(self):
        pass

def get_mock_db():
    """ Dependency to get a mock database session """
    db = MockSession()
    try:
        yield db
    finally:
        db.close()

def init_mock_db():
    """ Mock database initialization (does nothing) """
    print("Using mock database. Skipping table creation.")
    pass

# Mock Address class mirroring the Pydantic model for response consistency
class MockAddressModel(BaseModel):
    id: int
    street: str
    city: str  # Added city field
    locality: str # Represents County
    region: str
    zip_code: str
