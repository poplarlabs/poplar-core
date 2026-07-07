import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost/poplar_db") # Default for example

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    """ Dependency to get a database session """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    """ Initialize database tables """
    # Import all modules here that might define models so that
    # they will be registered properly on the metadata. Otherwise
    # you will have to import them first before calling init_db().
    # In this case, import the models module.
    from . import models # noqa
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("Database tables created.")
