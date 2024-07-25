from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
from dotenv import load_dotenv
from os import getenv


# Connect to MongoDB
def connectDB():
    
    load_dotenv()
    client = MongoClient(getenv("DATABASE_URI"))
    try:
        client.admin.command('ping')
        return client[getenv("DATABASE_NAME")]
        
    except ConnectionFailure:
        return str(ConnectionError)
