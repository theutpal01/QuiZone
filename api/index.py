from sys import path
path.append("../quizProject")

from flask import Flask, jsonify
from flask_cors import CORS
from server.routes.user import user
from server.routes.auth import auth
from server.routes.quiz import quiz
from server.routes.result import result


# Initialize
app = Flask(__name__)
CORS(app)


# Test Api
@app.route("/api/hello/test", methods=["POST", "GET"])
def hello():
    return jsonify({"message": "Hello World"}), 200


# Connecting endpoints
app.register_blueprint(user, url_prefix="/api/user")
app.register_blueprint(auth, url_prefix="/api/auth")
app.register_blueprint(quiz, url_prefix="/api/quiz")
app.register_blueprint(result, url_prefix="/api/result")