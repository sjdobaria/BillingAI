# from pymongo import MongoClient
# import os

# Local MongoDB
# client = MongoClient(os.getenv("Mongo_url"))
# client = MongoClient("mongodb://localhost:27017/")

# db = client["billing_ai"]
# predictions_collection = db["predictions"]


from pymongo import MongoClient
import os
import dotenv

client = MongoClient(os.getenv("MONGODB_URI"))
db = client["billing_ai"]
predictions_collection = db["predictions"]

print("CONNECTED TO:", predictions_collection.full_name)
