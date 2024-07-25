from jsonschema import validate, ValidationError
from datetime import datetime

from server.config.db import connectDB


schema = {
    "type": "object",
    "required": ["name", "email", "password"],
    "properties": {
        "name": {"type": "string"},
        "email": {"type": "string", "format": "email"},
        "password": {"type": "string", "format": "byte"},
        "role": {"type": "string", "default": "user"},
        "class": {"type": "string", "default": "Null"},
        "gender": {"type": "string", "default": ""},
        "bio": {"type": "string", "default": ""},
        "avatar": {"type": "string", "default": ""},
        "verified": {"type": "boolean", "default": False},
        "verification_token": {"type": "string"},
        "timestamp": {"type": "string", "default": str(datetime.utcnow())}
    },
    "additionalProperties": True,
}
db = connectDB()
authCollection = db.auth
authCollection.create_index([("email", 1)], unique=True)


def validateData(object:dict, defaultCheck:bool = True):
    if defaultCheck:
        for key, value in schema.get("properties").items():
            if key not in object:
                if 'default' in value:
                    object[key] = value['default']
    
    try:
        return validate(object, schema)
    except ValidationError as e:
        return str(e)


