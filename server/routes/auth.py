from flask import Blueprint, request, jsonify
from os import getenv
from dotenv import load_dotenv
from re import match
from pymongo.errors import DuplicateKeyError
from bson import ObjectId
from requests import post
from jwt import encode

from server.config.validation import getAvatar, is_valid_id, generate_uuid, hash_password, verify_password
from server.config.mail_template import activate, resetPassword
from server.models.auth import authCollection, validateData
from server.middleware.fetchUser import fetch_user

# Initialize
auth = Blueprint("auth", __name__)
load_dotenv()


# HANDLER 1 - API FOR REGISTERATION OF USER
@auth.route("/register", methods = ["POST"])
def register():
    
    try:
        # Get the request data
        data = dict(dict(request.get_json()).get("data"))
        for key, value in data.items():
            if type(value) is type(str):
                data[key] = value.strip()
            
        
        # Check if all the fields are correct and validate
        emailPattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b'
        if len(data.get("name")) <= 3:
            return jsonify({"type": "error", "message": "Name should be greater than 3 letters."}), 400
        
        elif not match(emailPattern, data.get("email")):
            return jsonify({"type": "error", "message": "Please enter a valid email address."}), 400
        
        elif len(data.get("password")) < 8 or len(data.get("password")) > 20:
            return jsonify({"type": "error", "message": "Password should be between 8 to 20 letters."}), 400
        
        elif data.get("password") != data.get("confirm_password"):
            return jsonify({"type": "error", "message": "Password do not match."}), 400
        
        data.pop("confirm_password")
        verify_url = data.pop("verification_url")
        verification_token = generate_uuid()
        
        # Update the data accordingly before adding it to database 
        data.update({"email": data.get("email").lower(), "password": hash_password(data.get("password")).decode("utf-8"), "verification_token": verification_token, "avatar": getAvatar()})
        error = validateData(data)
        
        if error:
            # Throw errors if any
            return jsonify({"type": "error", "message": error}), 400
        
        # Write the data in database
        result = authCollection.insert_one(data)
        
        if result.acknowledged:
            # Send the verification email
            url = getenv("MAILER")
            headers = {"Content-Type": "application/json; charset=utf-8"}
            body = {
                "sender": {
                    "name": getenv("SENDER_NAME"),
                    "mail": getenv("SENDER_EMAIL"),
                    "password": getenv("SENDER_PASSWORD")
                },
                "receiver": data.get("email"),
                "subject": "Please activate your account.",
                "data": activate(f"{verify_url}?verification_token={verification_token}&_id={result.inserted_id}")
            }
            mail_response = post(url, headers=headers, json=body)
            mail_response = dict(mail_response.json())
            
            if mail_response.get("type") == "error":
                # Throw errors if any
                return jsonify({"type": "error", "message": "Could not send the email."}), 400
            
            else:
                # Return the success response
                return jsonify({"type": "success", "message": "Registration succesful!", "data": {"_id": str(result.inserted_id), "verification_token": verification_token}}), 200
            
        return jsonify({"type": "error", "message": "Could not update the database."}), 400
                
    except DuplicateKeyError:
        return jsonify({"type": "error", "message": "This email is already taken."}), 400
    
    except Exception as e:
        print("Error:", str(e))
        return jsonify({"type": "error", "message": "Something went wrong."}), 500


# HANDLER 2 - API FOR VERIFICATION OF USER
@auth.route("/verify", methods = ["POST"])
def verify():
    try:
        # Get the request data
        data = dict(dict(request.get_json()).get("data"))
        verification_token, _id = data.get("verification_token"), data.get("_id")
        print(verification_token)
        print(_id)
        print("DOING")

        # Throw error if mongo db _id is not valid    
        if not is_valid_id(_id): return jsonify({"type": "error", "message": "Something went wrong! Please contact to administrator."}), 400
        print("ID IS VALD")
        # Search in the database with the provided _id & verification_token
        user = authCollection.find_one({"_id": ObjectId(_id), "verification_token": verification_token})
        print(user)
        if not user:
            return jsonify({"type": "error", "message": ["Something went wrong!", "Please contact to administrator."]}), 400
        
        elif user and user.get("role") == "manager":
            return jsonify({"type": "success", "message": ["Please wait for some time.", "Administrator will review and validate your request."]})
        
        user = dict(user)
        user.update({"_id": str(user.get("_id"))})
        del user["password"]
        
        if not user.get("verified"):
            # Make the user verified (Update the database)
            user.update({"verified": True})
            update_response = authCollection.update_one({"_id": ObjectId(_id)}, {"$set": {"verified": True}})

            if update_response.modified_count == 1:
                return jsonify({"type": "success", "message": ["You are now a verified user.", "Please login to proceed."], "data": user}), 200
            
        elif user.get("verified"):
            return jsonify({"type": "success", "message": ["You are already a verified user.", "Please login to proceed."], "data": user}), 200
        
        return jsonify({"type": "error", "message": ["Something went wrong!" ,"Please contact to administrator."]}), 400

    except Exception as e:
        print("Error:", str(e))
        return jsonify({"type": "error", "message": "Something went wrong."}), 500


# HANDLER 3 - API FOR LOGIN OF USER
@auth.route("/login", methods = ["POST"])
def login():
    try:
        # Get the request data
        data = dict(dict(request.get_json()).get("data"))
        for key, value in data.items():
            if type(value) is type(str):
                data[key] = value.strip()
        
        # Search in the database (email)
        user = authCollection.find_one({"email": data.get("email")})
        
        # Verification process
        if not user:
            return jsonify({"type": "error", "message": "Invaild credentials."}), 400
        
        
        if user and not verify_password(data.get("password").encode("utf-8"), user.get("password").encode("utf-8")):
            return jsonify({"type": "error", "message": "Invaild credentials."}), 400
        
        if user and not user.get("verified"):
            return jsonify({"type": "error", "message": "You are not verified. Check your inbox."}), 400
        
        if user and verify_password(data.get("password").encode("utf-8"), user.get("password").encode("utf-8")):
            token = encode({"_id": str(user["_id"]), "name": user["name"], "email": user["email"], "role": user["role"], "class": user["class"]}, getenv("JWT_SECRET_KEY"), algorithm='HS256')
            return jsonify({"type": "success", "message": "Loggedin successfully.", "data": {"_id": str(user.get("_id")), "token": token}}), 200

        return jsonify({"type": "error", "message": "Invaild credentials."}), 400
    
    except Exception as e:
        print("Error:", str(e))
        return jsonify({"type": "error", "message": "Something went wrong."}), 500


# HANDLER 4 - API FOR GENERATING RESETING PASSWORD REQUEST
@auth.route("/reset", methods = ["POST"])
def reset():
    try:
        # Get the request data
        data = (dict(request.get_json()).get("data"))
        email, reset_url = data.get("email"), data.get("reset_url")
        
        # Search for email in database
        user = authCollection.find_one({"email": email})
        if not user:
            return jsonify({"type": "error", "message": "The email address do not exists."}), 400

        code = generate_uuid()
        db_response = authCollection.update_one({"_id": user.get("_id")}, {"$set": {"code": code}})
        
        if db_response.modified_count == 0:
            return jsonify({"type": "error", "message": "Couldnot send the email."}), 400
        
        # Send the mail to that user
        url = getenv("MAILER")
        headers = {"Content-Type": "application/json; charset=utf-8"}
        body = {
            "sender": {
                "name": getenv("SENDER_NAME"),
                "mail": getenv("SENDER_EMAIL"),
                "password": getenv("SENDER_PASSWORD")
            },
            "receiver": user.get("email"),
            "subject": "Password reset request.",
            "data": resetPassword(f"{reset_url}?code={code}&_id={str(user.get('_id'))}", user.get("name"))
        }
        mail_response = post(url, headers=headers, json=body)
        mail_response = dict(mail_response.json())

        if mail_response.get("type") == "error":
            return jsonify({"type": "error", "message": "Couldnot send the email."}), 400
        
        return jsonify({"type": "success", "message": "Email has been sent."}), 200

    except Exception as e:
        print("Error:", str(e))
        return jsonify({"type": "error", "message": "Something went wrong."}), 500


# HANDLER 5 - API FOR CHECKING WHETHER THE REQUEST OF RESETING PWD WAS GENERATED OR NOT
@auth.route("/check", methods = ["POST"])
def check():
    try:
        # Get the request data
        _id, code = (dict(request.get_json()).get("data")).get("_id"), (dict(request.get_json()).get("data")).get("code")
        
        # Throw erro is _id is not valid
        if is_valid_id(_id) and authCollection.find_one({"_id": ObjectId(_id), "code": code}):
            return jsonify({"type": "success", "message": "Request initiated by the user"}), 200

        return jsonify({"type": "error", "message": "No request initiated by the user"}), 400
    
    except Exception as e:
        print("Error:", str(e))
        return jsonify({"type": "error", "message": "Something went wrong."}), 500


# HANDLER 6 - API FOR CHANGING USER PASSWORD
@auth.route("/change", methods = ["POST"])
def change():
    try:
        # Get the req data
        _id, password = (dict(request.get_json()).get("data")).get("_id"), (dict(request.get_json()).get("data")).get("password")
        
        # Validation
        if len(password) < 8 or len(password) > 20:
            return jsonify({"type": "error", "message": "Password should be between 8 to 20 letters."}), 400
        
        if not is_valid_id(_id):
            return jsonify({"type": "error", "message": "Failed to update password."}), 400
        
        user = authCollection.find_one({"_id": ObjectId(_id)})
        if not user:
            return jsonify({"type": "error", "message": "Failed to update password."}), 400
            
        if verify_password(password.encode("utf-8"), user.get("password").encode("utf-8")):
            return jsonify({"type": "error", "message": "Password should not be old one."}), 400
        
        # Update the password in the database
        db_response = authCollection.update_one({"_id": ObjectId(_id)}, {"$set": {"password": hash_password(password).decode("utf-8"), "code": ""}})
        
        if db_response.modified_count == 1:
            return jsonify({"type": "success", "message": "Your paassword is updated."}), 200
        
        return jsonify({"type": "error", "message": "Failed to update password."}), 400

    except Exception as e:
        print("Error:", str(e))
        return jsonify({"type": "error", "message": "Something went wrong."}), 500
    

# HANDLER 7 - API FOR ADDING A USER BY ADMIN
@auth.route("/add", methods = ["POST"])
def add():
    try:
        # Call middleware
        res = list(fetch_user())

        if res[0].get("type") == "error":
            return jsonify(res), res[1]
                
        user = dict(res[0].get("data"))
        
        # Validations
        if user.get("role") != "admin":
            return jsonify({"type": "error", "message": "Forbidden"}), 403
        
        # Get the req data
        data = dict(dict(request.get_json()).get("data"))
        for key, value in data.items():
            if type(value) is type(str):
                data[key] = value.strip()
            
        emailPattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b'
        
        # Check if all the fields are correct (validation)
        if len(data.get("name")) <= 3:
            return jsonify({"type": "error", "message": "Name should be greater than 3 letters."}), 400
        
        if not match(emailPattern, data.get("email")):
            return jsonify({"type": "error", "message": "Please enter a valid email address."}), 400
        
        if len(data.get("password")) < 8 or len(data.get("password")) > 20:
            return jsonify({"type": "error", "message": "Password should be between 8 to 20 letters."}), 400
        
        verification_token = generate_uuid()
        data.update({"email": data.get("email").lower(), "password": hash_password(data.get("password")).decode("utf-8"), "verification_token": verification_token, "avatar": getAvatar()})
        error = validateData(data)
        
        if error:
            return jsonify({"type": "error", "message": error}), 400
        
        # Insert user data into the database
        result = authCollection.insert_one(data)
        
        if result.acknowledged:
            return jsonify({"type": "success", "message": "Successfully added a user!", "data": str(result.inserted_id)}), 200
        
        return jsonify({"type": "error", "message": "Could not update the database."}), 400

    except DuplicateKeyError:
        return jsonify({"type": "error", "message": "This email is already taken."}), 400
    
    except Exception as e:
        print("Error:", str(e))
        return jsonify({"type": "error", "message": "Something went wrong."}), 500


# HANDLER 8 - API TO DELETE USER BY ADMIN
@auth.route("/remove", methods = ["POST"])
def remove():
    try:
        # Call middleware
        res = list(fetch_user())

        if res[0].get("type") == "error":
            return jsonify(res), res[1]
                
        user = dict(res[0].get("data"))
        
        # Validations
        if user.get("role") != "admin":
            return jsonify({"type": "error", "message": "Forbidden"}), 403
        
        # Get the req data
        _id = dict(request.get_json()).get("data")

        # Throw error if _id is not valid
        if not is_valid_id(_id): return jsonify({"type": "error", "message": "User id is invalid."}), 400
        
        # Delete the user data from the database
        db_response = authCollection.delete_one({"_id": ObjectId(_id)})
        
        if db_response.deleted_count == 1:
            return jsonify({"type": "success", "message": "Successfull deleted this user."}), 200

        return jsonify({"type": "error", "message": "No user with this data found in the database."}), 400

    except Exception as e:
        print("Error:", str(e))
        return jsonify({"type": "error", "message": "Something went wrong."}), 500


# HANDLER 9 - API TO UPDATE THE USERDATA
@auth.route("/update", methods = ["POST"])
def update():
    try:
        # Call middleware
        res = list(fetch_user())

        if res[0].get("type") == "error":
            return jsonify(res), res[1]
        
        # Validations        
        user = dict(res[0].get("data"))
        
        if user.get("role") != "admin":
            return jsonify({"type": "error", "message": "Forbidden"}), 403
        
        # Get the req data
        data = dict(dict(request.get_json()).get("data"))
        _id, update_user_data = data.get("_id"), data.get("data")
        
        # Throw error if _id is not valid
        if not is_valid_id(_id): 
            return jsonify({"type": "error", "message": "User id is invalid."}), 400
        
        # Validations  
        for key, value in update_user_data.items():
            if type(value) is type(str):
                update_user_data[key] = value.strip()
                        
        try:
            del update_user_data["password"]
        except: pass

        emailPattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b'
                                
        if update_user_data.get("name") is not None and len(update_user_data.get("name")) <= 3:
            return jsonify({"type": "error", "message": "Name should be greater than 3 letters."}), 400

        if update_user_data.get("name") is not None and not match(emailPattern, update_user_data.get("email")):
            return jsonify({"type": "error", "message": "Please enter a valid email address."}), 400
                        
        # Update the user info in the database
        db_response = authCollection.update_one({"_id": ObjectId(_id)}, {"$set": update_user_data})
        
        if not db_response.acknowledged:
            return jsonify({"type": "error", "message": "Can not modified the user data (No match found)"}), 400
        
        if db_response.modified_count == 1:
            return jsonify({"type": "success", "message": "Modified the user data"}), 200
        
        return jsonify({"type": "error", "message": "User not updated."}), 200
    
    except DuplicateKeyError:
        return jsonify({"type": "error", "message": "This email is already taken."}), 400
    
    except Exception as e:
        print("Error:", str(e))
        return jsonify({"type": "error", "message": "Something went wrong."}), 500
