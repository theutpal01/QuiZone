from flask import Blueprint, request, jsonify
from bson import ObjectId

from server.config.validation import is_valid_id
from server.models.result import resultCollection, validateData
from server.middleware.fetchUser import fetch_user


result = Blueprint("result", __name__)


# HANDLER 1 - API FOR ADD RESULT DATA
@result.route("/add", methods=["POST"])
def add():
    try:
        # Call middleware
        res = list(fetch_user())

        if res[0].get("type") == "error":
            return jsonify(res), res[1]

        user = dict(res[0].get("data"))

        # Validation
        if user.get("role") != "user":
            return jsonify({"type": "error", "message": "Forbidden"}), 403

        # Get the req data
        resultData = dict(dict(request.get_json()).get("data"))
        resultData.update({"userId": ObjectId(resultData.get("userId")), "quizId": ObjectId(resultData.get("quizId"))})
        error = validateData(resultData)

        if error:
            return jsonify({"type": "error", "message": error}), 400

        for key, value in resultData.items():
            if type(value) is type(str):
                resultData[key] = value.strip()

        # Add to database
        db_response = resultCollection.insert_one(resultData)

        if db_response.acknowledged:
            return jsonify({"type": "success", "message": "Successfully added user's result!", "data": str(db_response.inserted_id)}), 200

        return jsonify({"type": "error", "message": "Could not update the database."}), 400
    
    except Exception as e:
        print("Error:", str(e))
        return jsonify({"type": "error", "message": "Something went wrong."}), 500


# HANDLER 2 - API FOR ADD RESULT DATA
@result.route("/remove", methods=["POST"])
def remove():
    try:
        # Call middleware
        res = list(fetch_user())

        if res[0].get("type") == "error":
            return jsonify(res), res[1]

        user = dict(res[0].get("data"))
        if user.get("role") != "admin":
            return jsonify({"type": "error", "message": "Forbidden"}), 403

        # Get the req data
        _id = dict(request.get_json()).get("data")

        # Throw error if _id is invalid
        if not is_valid_id(_id):
            return jsonify({"type": "error", "message": "User's result id is invalid."}), 400

        # Delete the result data
        db_response = resultCollection.delete_one({"_id": ObjectId(_id)})
        if db_response.deleted_count == 1:
            return jsonify({"type": "success", "message": "Successfull deleted this user's result."}), 200

        return jsonify({"type": "error", "message": "No user's result with this data found in the database."}), 400

    except Exception as e:
        print("Error:", str(e))
        return jsonify({"type": "error", "message": "Something went wrong."}), 500


# HANDLER 3 - API TO SEARCH RESULT DATA
@result.route("/search", methods=["POST"])
def search():
    try:
        # Call middleware
        res = list(fetch_user())

        if res[0].get("type") == "error":
            return jsonify(res), res[1]

        # Get the req data
        try:
            query = dict(dict(request.get_json()).get("data"))
        except:
            query = None

        # Search for data in db according to query provided
        if not query:
            all_results = list(resultCollection.find())
        else:
            keys = ["_id", "userId", "quizId"]
            for key in query:
                if key in keys:
                    query.update({key: ObjectId(query[key])})
            all_results = list(resultCollection.find(query))

        if not all_results:
            return jsonify({"type": "error", "message": "No results found"}), 400

        # Returen the data
        for resultData in all_results:
            resultData.update({ "_id": str(resultData["_id"]), "userId": str(resultData["userId"]), "quizId": str(resultData["quizId"]) })
        
        return jsonify({"type": "success", "message": f"Total user's result found: {len(all_results)}", "data": all_results}), 200
    
    except Exception as e:
        print("Error:", str(e))
        return jsonify({"type": "error", "message": "Something went wrong."}), 500
