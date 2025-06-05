from flask import Flask, request, jsonify
from flask_cors import CORS
from rag_utils import generate_answer

app = Flask(__name__)
CORS(app)  # Allow React frontend to access

@app.route("/api/ask", methods=["POST"])
def ask():
    query = request.json.get("query", "")
    response = generate_answer(query)
    return jsonify({"reply": response})

@app.route("/", methods=["GET"])
def home():
    return jsonify({"status": "Server is running"})

if __name__ == "__main__":
    print("Server starting on http://localhost:5000")
    app.run(host="0.0.0.0", port=5001, debug=True)