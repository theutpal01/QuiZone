from jsonschema import validate, ValidationError
from datetime import datetime

from server.config.db import connectDB


schema = {
    "type": "object",
    "properties": {
        "userId": {},
        "quizId": {},
        "name": {"type": "string"},
        "email": {"type": "string", "format": "email"},
        "class": {"type": "string"},
        "subject": {"type": "string"},
        "answers": {"type": "object"},
        "score": {"type": "array", "items": {"type": "string"}, "minItems": 3},
        "timestamp": {"type": "string", "default": str(datetime.utcnow())},
    },
    "additionalProperties": True,
}
db = connectDB()
resultCollection = db.result


def validateData(object: dict, defaultCheck: bool = True):
    if defaultCheck:
        for key, value in schema.get("properties").items():
            if key not in object:
                if "default" in value:
                    object[key] = value["default"]

    try:
        return validate(object, schema)

    except ValidationError as e:
        return str(e)
