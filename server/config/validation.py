# _id validation checker
def is_valid_id(_id):
    from re import match, compile

    pattern = compile(r"^[0-9a-fA-F]{24}$")
    if match(pattern, _id):
        return True
    return False


# Avatar selection
def getAvatar():
    import os
    from random import choice

    cloud = os.getenv("CLOUDINARY_CLOUD_NAME")
    ids_raw = os.getenv("AVATAR_PUBLIC_IDS", "")

    if not cloud or not ids_raw:
        return "https://api.dicebear.com/6.x/identicon/svg?seed=user"

    public_ids = [pid.strip() for pid in ids_raw.split(",") if pid.strip()]
    pid = choice(public_ids)
    return f"https://res.cloudinary.com/{cloud}/image/upload/{pid}"


# UUID Generation
def generate_uuid():
    from time import time
    from random import getrandbits
    from hashlib import md5

    timestamp = str(time()).encode("utf-8")
    random_number = str(getrandbits(128)).encode("utf-8")
    unique_string = timestamp + random_number

    uuid = md5(unique_string).hexdigest()
    return uuid


# Hash Passworrd
def hash_password(password):
    from bcrypt import hashpw, gensalt

    # Generate a salt and hash the password
    salt = gensalt()
    hashed_password = hashpw(password.encode("utf-8"), salt)
    return hashed_password


# Verify the passwords
def verify_password(password: bytes, hashed_password: bytes):
    from bcrypt import checkpw

    return checkpw(password, hashed_password)


# Generate quiz code
def generate_code(size: int = 6):
    from random import choices
    from string import ascii_uppercase, digits

    return "".join(choices(ascii_uppercase + digits, k=size))
