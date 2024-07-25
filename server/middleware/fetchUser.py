from flask import request
from jwt import decode
from dotenv import load_dotenv
from os import getenv


def fetch_user():
    try:
        load_dotenv()
        token = request.headers.get("JWT-Token")
        
        if token == None:
            return [{"type": "error", "message": "Unautorized user."}, 403]
            
        user = decode(token, getenv("JWT_SECRET_KEY"), algorithms=['HS256'])

        if not user:
            return [{"type": "error", "message": "Invalid credentials."}, 400]
        
        return [{"type": "success", "data": user}, 200]

    except Exception as e:
        return [{"type": "error", "message": "Internal Server Error.", "data": str(e)}, 500]
        
    
