import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
import yaml

# Initialize OpenAI client with API key from environment
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise ValueError("OPENAI_API_KEY environment variable is not set.")
client = OpenAI(api_key=OPENAI_API_KEY)

app = Flask(__name__)
CORS(app)  # Enable CORS for the app

def load_endpoints(path: str) -> dict:
    """Loads endpoints configuration from a YAML file."""
    try:
        with open(path, 'r') as file:
            return yaml.safe_load(file)
    except FileNotFoundError:
        raise FileNotFoundError(f"YAML file not found at {path}")
    except yaml.YAMLError as e:
        raise ValueError(f"Error parsing YAML file: {e}")

endpoints = load_endpoints("endpoints.yml")

@app.route(endpoints["action_endpoint"]["send_message"], methods=['POST'])
def send_message():
    """Handles the sending of a message to OpenAI and returns its response."""
    data = request.json
    user_message = data.get('message')

    if not user_message:
        return jsonify({'error': 'No message provided'}), 400

    try:
        # Call OpenAI API with the user's message
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": user_message}
            ]
        )
        chat_response = response.choices[0].message.content
        return jsonify({'response': chat_response})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    try:
        port = int(os.environ.get('PORT', endpoints["port"]))
        app.run(host=endpoints["action_endpoint"]["host"], port=port, debug=True)
    except KeyError as e:
        raise KeyError(f"Missing required configuration for {e}")
    except ValueError as e:
        raise ValueError(f"Invalid configuration value: {e}")
