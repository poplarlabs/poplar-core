from sqlalchemy import Column, Integer, String, Index
from .database import Base

class Address(Base):
    __tablename__ = "addresses"

    id = Column(Integer, primary_key=True, index=True)
    street = Column(String, index=True)
    locality = Column(String, index=True) # Represents 'locality'
    region = Column(String, index=True) # Represents 'region'
    country = Column(String, index=True) # Represents 'country'
    zip_code = Column(String, index=True)

    # Add compound index for faster filtering by region and locality
    __table_args__ = (Index('ix_addresses_region_locality', 'region', 'locality', 'country'),)
