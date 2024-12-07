from flask import Flask, render_template, jsonify, request
from flask_cors import CORS
import os
from waitress import serve
import sys

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/test')
def test():
    return jsonify({"status": "Server is running!", "message": "If you see this, the connection works!"})

@app.route('/save-capture', methods=['POST'])
def save_capture():
    data = request.json
    # TODO: Implement saving of image and orientation data
    return jsonify({"status": "success"})

if __name__ == '__main__':
    print("Server starting with Waitress (production server)...")
    print("Access the app on your phone using one of these URLs:")
    print("http://192.168.68.61:80")  # Your Wi-Fi IP
    print("http://192.168.137.1:80")  # Your other network IP
    print("http://localhost:80")      # Local testing
    print("\nTo test connectivity:")
    print("1. Try accessing /test endpoint (e.g., http://192.168.68.61/test)")
    print("2. You should see a JSON response if connection is successful")
    print("\nNote: If port 80 doesn't work, you'll need to add a rule in Comodo Firewall for Python")
    try:
        serve(app, host='0.0.0.0', port=80, threads=4)
    except PermissionError:
        print("\nError: Cannot use port 80 (requires admin privileges)")
        print("Trying alternative port 8080...")
        print("Please add this to Comodo Firewall rules:")
        print(f"Program: {sys.executable}")
        print("Port: 8080")
        serve(app, host='0.0.0.0', port=8080, threads=4)
