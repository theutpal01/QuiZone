# _id validation checker
def is_valid_id(_id):
    from re import match, compile

    pattern = compile(r"^[0-9a-fA-F]{24}$")
    if match(pattern, _id):
        return True
    return False


# Avatar selection
def getAvatar():
    from random import choice
    
    avatars = [
        "https://drive.google.com/uc?export=view&id=1dFzU3jDAVEgGNd41zgc5R_ftMLfp3smY",
        "https://drive.google.com/uc?export=view&id=1sTkgFweaqhUt6qODJ0wa_EFLtwSbxmQs",
        "https://drive.google.com/uc?export=view&id=1kn0yVMS_X-CqoQj2qmEKhPTlC88A6ZJR",
        "https://drive.google.com/uc?export=view&id=191lKllgQs7QusrAPelNfMfrrhSq6Ut9T",
        "https://drive.google.com/uc?export=view&id=13As9jPdanbvHCkqEJK1mbvm6qjnerAv9",
        "https://drive.google.com/uc?export=view&id=13Qf-PcIK3EUkJL_bILTzv1qKUkeZ37A_",
        "https://drive.google.com/uc?export=view&id=13BbDKeaO-_8tDjP7PKsOjU-pztMXt3iz",
        "https://drive.google.com/uc?export=view&id=13ZcbksoigNrWlKZ-vG-ZV81dhXZB5RM-",
    ]
    return choice(avatars)


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
