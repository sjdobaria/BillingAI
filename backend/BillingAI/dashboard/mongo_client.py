"""
MongoDB client utility for connecting to MongoDB Atlas.
Uses pymongo to store and retrieve prediction records.
"""
from pymongo import MongoClient
from django.conf import settings

_client = None


def get_mongo_client():
    """Get or create a singleton MongoDB client connection."""
    global _client
    if _client is None:
        uri = settings.MONGODB_URI
        if not uri:
            raise ValueError(
                "MONGODB_URI is not set. Please configure it in your .env file."
            )
        _client = MongoClient(uri)
    return _client


def get_database():
    """Get the BillingAI database."""
    client = get_mongo_client()
    return client[settings.MONGODB_DB_NAME]


def get_predictions_collection():
    """Get the predictions collection."""
    db = get_database()
    return db['predictions']
