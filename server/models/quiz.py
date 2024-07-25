from datetime import datetime
from jsonschema import validate, ValidationError

from server.config.db import connectDB

schema = {
    "type": "object",
    "required": ["name", "questions", "subject"],
    "properties": {
        "userId": {},
        "name": {"type": "string"},
        "code": {"type": "string"},
        "class": {"type": "string"},
        "questions": {"type": "array", "items": {
            "type": "object",
            "properties": {
                "question": {"type": "string"},
                "options": {"type": "array", "items": { "type": "string"}},
                "answer": {"type": "string"}},
            },
        },
        "subject": {"type": "string"},
        "active": {"type": "boolean", "default": True},
        "timestamp": {"type": "string", "default": str(datetime.utcnow())}
    },
    "additionalProperties": True,
}

db = connectDB()
quizCollection = db.quiz
quizCollection.create_index([("code", 1)], unique=True)
quizCollection.create_index([("name", 2)], unique=True)


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