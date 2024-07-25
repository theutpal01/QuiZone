from flask import Blueprint, request, jsonify
from os import getenv
from dotenv import load_dotenv
from bson import ObjectId
from requests import post

from server.config.validation import is_valid_id
from server.models.auth import authCollection
from server.middleware.fetchUser import fetch_user


# Initialize
user = Blueprint("user", __name__)
load_dotenv()


# HANDLER 1 - API TO SEND THE EMAIL TO ADMIN BY USERS
@user.route("/message", methods = ["POST"])
def message():
    try:
        # Get the req data
        data = dict(request.get_json()).get("data")
        
        # Send mail
        url = getenv("MAILER")
        headers = {"Content-Type": "application/json; charset=utf-8"}
        body = {
            "sender": {
                "name": getenv("SENDER_NAME"),
                "mail": getenv("SENDER_EMAIL"),
                "password": getenv("SENDER_PASSWORD")
            },
            "receiver": getenv("OWNER_EMAIL"),
            "subject": data.get("subject") + f" (By - {data.get('name')}, {data.get('email')})",
            "data": data.get("message")
        }
        mail_response = post(url, headers=headers, json=body)
        mail_response = dict(mail_response.json())

        if mail_response.get("type") == "error":
            return jsonify({"type": "error", "message": "Could not send the email."}), 400
        
        return jsonify({"type": "success", "message": "Email has been sent."}), 200

    except Exception as e:
        print("Error:", str(e))
        return jsonify({"type": "error", "message": "Something went wrong."}), 500
   

# HANDLER 2 - API TO SEARCH EVERY USERS IN THE DATABASE
@user.route("/search", methods = ["POST"])
def search():
    try:
        # Call middleware
        res = list(fetch_user())

        if res[0].get("type") == "error":
            return jsonify(res), res[1]
        
        try:
            # Get the req data
            query = dict(dict(request.get_json()).get("data"))
            if {"role": "admin"} in query: query = None
        except: query = None

        # Search according to query in database
        if res[0]["data"]["role"] == "admin":
            all_users = list(authCollection.find())
        elif not query or len(query) == 0 :
            all_users = list(authCollection.find({"_id": {"$ne": ObjectId(res[0]["data"]["_id"])}}))
        else:
            all_users = list(authCollection.find(query))
        
        if not all_users: return jsonify({"type": "error", "message": "No User found",}), 400
        
        # Return the available users
        for userData in all_users:
            userData.update({ "_id": str(userData["_id"]) })
            del userData["password"]
            
            if  res[0]["data"]["role"] != "admin":
                del userData["verification_token"]
                del userData["gender"]
                
        return jsonify({"type": "success", "message": f"Total users found: {len(all_users)}", "data": all_users}), 200

    except Exception as e:
        print("Error:", str(e))
        return jsonify({"type": "error", "message": "Something went wrong."}), 500


# HANDLER 3 - API FOR GET PARTICULAR USER            
@user.route("/get", methods = ["POST"])
def get():
    try:
        # Call middleware
        res = list(fetch_user())

        if res[0].get("type") == "error":
            return jsonify(res), res[1]

        # Get the req data
        try:
            _id = dict(request.get_json()).get("data")
        except:
            _id = res[0].get("data").get("_id")
        
        user = authCollection.find_one({"_id": ObjectId(_id)})
        if user:
            del user["password"]
            del user["verification_token"]
            user["_id"] = str(user["_id"])
            return jsonify({"type": "success", "message": "User found", "data": user}), 200
        
        return jsonify({"type": "error", "message": "User not found."}), 400
        
    except Exception as e:
        print("Error:", str(e))
        return jsonify({"type": "error", "message": "Something went wrong."}), 500


# HANDLER 4 - API FOR GET PARTICULAR USER VERIFIED STATUS
@user.route("/getstatus", methods = ["POST"])
def getStatus():
    try:
        _id = dict(request.get_json()).get("data")
        
        user = authCollection.find_one({"_id": ObjectId(_id)})
        print(user)
        if user:
            return jsonify({"type": "success", "message": "User found", "verified": user.get("verified")}), 200
        
        return jsonify({"type": "error", "message": "User not found."}), 400
        
    except Exception as e:
        print("Error:", str(e))
        return jsonify({"type": "error", "message": "Something went wrong."}), 500



# HANDLER 5 - API FOR ADD RESULT DATA
@user.route("/updateprofile", methods = ["POST"])
def update_profile():
    try:
        # Call middleware
        res = list(fetch_user())
        
        if res[0].get("type") == "error":
            return jsonify(res), res[1]
                
        # Get the req data
        data = dict(dict(request.get_json()).get("data"))
        _id, update_user_data = data.get("_id"), data.get("data")
        upadateFields = ["name", "bio", "gender", "class", "verified", "role"]
        
        for key in update_user_data.keys():
            if key not in upadateFields:
                del update_user_data[key]
            
        if not is_valid_id(_id): return jsonify({"type": "error", "message": "User id is invalid."}), 400
                    
        # Validations   
        for key, value in update_user_data.items():
            if type(value) is type(str):
                update_user_data[key] = value.strip()

        if update_user_data.get("name") is not None and len(update_user_data.get("name")) <= 3:
            return jsonify({"type": "error", "message": "Name should be greater than 3 letters."}), 400

        # Update the user info
        db_response = authCollection.update_one({"_id": ObjectId(_id)}, {"$set": update_user_data})
        
        if not db_response.acknowledged:
            return jsonify({"type": "error", "message": "Profile not updated."}), 400
        
        if db_response.modified_count == 1:
            return jsonify({"type": "success", "message": "Profile is updated."}), 200
        
        return jsonify({"type": "error", "message": "Profile not updated"}), 400

    except Exception as e:
        print("Error:", str(e))
        return jsonify({"type": "error", "message": "Something went wrong."}), 500
