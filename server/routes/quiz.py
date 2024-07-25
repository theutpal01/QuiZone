from flask import Blueprint, request, jsonify
from bson import ObjectId
from pymongo.errors import DuplicateKeyError

from server.config.validation import is_valid_id, generate_code
from server.models.quiz import quizCollection, validateData
from server.middleware.fetchUser import fetch_user


quiz = Blueprint("quiz", __name__)


# HANDLER 1 - API TO ADD QUIZ BY MANAGER(TEACHER)
@quiz.route("/add", methods = ["POST"])
def add():
    try:
        # Call middleware
        res = list(fetch_user())

        if res[0].get("type") == "error":
            return jsonify(res), res[1]
                
        user = dict(res[0].get("data"))
        
        # Validation
        if user.get("role") != "manager":
            return jsonify({"type": "error", "message": "Forbidden"}), 403
        
        # Get the req data
        managerId = user.get("_id")
        quizData = dict(dict(request.get_json()).get("data"))
        
        for key, value in quizData.items():
            if type(value) is type(str):
                quizData[key] = value.strip()
        
        while True:
            # Quiz code generation
            code = generate_code()
            if len(list(quizCollection.find({"code": code}))) == 0: break
        
        # Modify the data accordingly
        quizData.update({"userId": ObjectId(managerId), "name": str(quizData.get("name")).capitalize(), "code": code})
        error = validateData(quizData)

        if error:
                return jsonify({"type": "error", "message": error}), 400
            
        # Add the quiz data to database
        db_response = quizCollection.insert_one(quizData)
        
        if db_response.acknowledged:
            return jsonify({"type": "success", "message": "Quiz has been created successfully.", "data": str(db_response.inserted_id)}), 200

        return jsonify({"type": "success", "message": "Failed to create the quiz."}), 400
                
    except DuplicateKeyError:
        return jsonify({"type": "error", "message": "Name is already in use."}), 400
    
    except Exception as e:
        print("Error:", str(e))
        return jsonify({"type": "error", "message": "Something went wrong."}), 500
    
    
# HANDLER 2 - API TO DELETE QUIZ BY MANGER(TEACHER) OR ADMIN
@quiz.route("/remove", methods = ["POST"])
def remove():
    try:
        # Call middleware
        res = list(fetch_user())

        if res[0].get("type") == "error":
            return jsonify(res), res[1]
                
        user = dict(res[0].get("data"))
        
        # Validation
        if user.get("role") != "manager" and user.get("role") != "admin":
            return jsonify({"type": "error", "message": "Forbidden"}), 403
        
        # Get the req data
        quizId = dict(request.get_json()).get("data")
        
        # Throw error if _id is invalid
        if not is_valid_id(quizId): return jsonify({"type": "error", "message": "Quiz id is invalid."}), 400
            
        # Delete the quiz from database
        db_response = quizCollection.delete_one({"_id": ObjectId(quizId)})
        
        if db_response.deleted_count == 1:
            return jsonify({"type": "success", "message": "Successfull deleted this quiz."}), 200

        return jsonify({"type": "error", "message": "No quiz with this data found in the database."}), 400

    except Exception as e:
        print("Error:", str(e))
        return jsonify({"type": "error", "message": "Something went wrong."}), 500


# HANDLER 3 - API TO UPDATE QUIZ BY MANAGER(TEACHER)
@quiz.route("/update", methods = ["POST"])
def update():
    try:
        # Call middleware
        res = list(fetch_user())

        if res[0].get("type") == "error":
            return jsonify(res), res[1]
                
        user = dict(res[0].get("data"))
        
        # Validation
        if user.get("role") != "manager":
            return jsonify({"type": "error", "message": "Forbidden"}), 403
        
        # Get the req data
        data = dict(dict(request.get_json()).get("data"))
        _id, update_quiz_data = data.get("_id"), data.get("data")

        # Throw error if _id is invalid
        if not is_valid_id(_id):
            return jsonify({"type": "error", "message": "Quiz id is invalid."}), 400
            
        for key, value in update_quiz_data.items():
            if type(value) is type(str):
                update_quiz_data[key] = value.strip()

        # Update the database
        db_response = quizCollection.update_one({"_id": ObjectId(_id)}, {"$set": update_quiz_data})

        if not db_response.acknowledged:
            return jsonify({"type": "error", "message": "Cannot modified the quiz (No match found)."}), 400
        
        if db_response.modified_count == 1:
            return jsonify({"type": "success", "message": "Modified the quiz."}), 200
        
        return jsonify({"type": "error", "message": "Quiz not updated."}), 400
    
    except DuplicateKeyError:
        return jsonify({"type": "error", "message": "This name is already taken."}), 400
    
    except Exception as e:
        print("Error:", str(e))
        return jsonify({"type": "error", "message": "Something went wrong."}), 500    


# HANDLER 4 - API TO SEARCH FOR QUIZZES
@quiz.route("/search", methods = ["POST"])
def search():
    try:
        # Call middleware
        res = list(fetch_user())

        if res[0].get("type") == "error":
            return jsonify(res), res[1]
                    
        # Get the req data if any
        try:
            query = dict(dict(request.get_json()).get("data"))
        except: query = None

        # Search for quizzes according to query provided
        if not query:
            all_quizes = list(quizCollection.find())
        else:
            all_quizes = list(quizCollection.find(query))
        
        if not all_quizes: return jsonify({"type": "error", "message": "No quiz found"}), 400
        
        # Return the available quizzes
        for quizData in all_quizes:
            quizData.update({ "_id": str(quizData["_id"]), "userId": str(quizData["userId"]) })
        return jsonify({"type": "success", "message": f"Total quizes found: {len(all_quizes)}", "data": all_quizes}), 200
            
    except Exception as e:
        print("Error:", str(e))
        return jsonify({"type": "error", "message": "Something went wrong."}), 500


# HANDLER 5 - API TO GET QUIZ
@quiz.route("/get", methods = ["POST"])
def get():
    try:
        # Call middleware
        res = list(fetch_user())

        if res[0].get("type") == "error":
            return jsonify(res), res[1]

        # Get the req data
        _id = dict(request.get_json()).get("data")
        
        # Throw error if _id is invalid
        if not is_valid_id(_id): return jsonify({"type": "error", "message": "Quiz id is invalid."}), 400
        
        # Search and return the quiz if available
        quizData = quizCollection.find_one({"_id": ObjectId(_id)})
        
        if not quizData:
            return jsonify({"type": "error", "message": "Quiz not found."}), 400
        
        quizData.update({ "_id": str(quizData["_id"]), "userId": str(quizData["userId"]) })
        return jsonify({"type": "success", "message": "Quiz found", "data": quizData}), 200
    
    except Exception as e:
        print("Error:", str(e))
        return jsonify({"type": "error", "message": "Something went wrong."}), 500
