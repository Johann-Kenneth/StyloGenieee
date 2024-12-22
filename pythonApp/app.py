# app.py

import os
from flask import Flask, request, jsonify,send_from_directory
from flask_cors import CORS
from PIL import Image
import numpy as np
import cv2
from stylist import PersonalStylist
from recommender import FashionRecommender
import google.generativeai as genai

from stylist import PersonalStylist
from recommender import FashionRecommender

app = Flask(__name__, static_url_path='/images', static_folder='images')

CORS(app)

# Initialize classes
stylist = PersonalStylist()
recommender = FashionRecommender()

API_KEY = "AIzaSyDvxhP2DnQaBU-sQfC6o9Eu7o3qigfXIWo"
genai.configure(api_key=API_KEY)

# Endpoint for personal stylist
@app.route('/upload', methods=['POST'])
def stylist_analysis():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    file = request.files['file']
    image = Image.open(file)
    image = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
    occasion = request.form.get('occasion', 'casual').lower()

    skin_tone = stylist.detect_skin_tone(image)
    body_shape = stylist.detect_body_shape(image)
    recommendations = stylist.get_recommendations(skin_tone, body_shape, occasion)

    return jsonify({
        "skin_tone": skin_tone,
        "body_shape": body_shape,
        "recommendations": recommendations
    })

# Endpoint for fashion recommendation


@app.route('/recommender', methods=['POST'])
def fashion_recommendation():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    file = request.files['file']
    filename = os.path.join('uploads', file.filename)
    file.save(filename)

    # Assume 'recommend' method returns a list of recommended image paths
    recommendations = recommender.recommend(filename)

    # Adding purchase links for each recommended image
    recommendations_with_links = [
        {
            "image": f"images/{os.path.basename(image_path)}",
            "purchase_link": "http://localhost:3000/purchase?image={image_path}"
        }
        for image_path in recommendations
    ]

    return jsonify({
        "uploaded_image": filename,
        "recommendations": recommendations_with_links
    })
@app.route('/<path:filename>')
def serve_image(filename):
    print("hellooooooooooooooooooooooooo")
    print(filename)
    return send_from_directory('images', filename)

@app.route('/outfit-suggestion', methods=['POST'])
def outfit_suggestion():
    data = request.json
    gender = data.get("gender")
    occasion = data.get("occasion")
    climate = data.get("climate")
    mood = data.get("mood")
    user_input = data.get("user_input", "")

    if not all([gender, occasion, climate, mood]):
        return jsonify({"error": "All fields (gender, occasion, climate, mood) are required"}), 400

    # Generate an outfit suggestion using Google Generative AI
    model = genai.GenerativeModel("models/gemini-1.0-pro")
    prompt = (
        f"Give me an outfit suggestion for a {gender} for a {occasion} "
        f"considering the climate '{climate}' and mood '{mood}', based on the following input: {user_input}"
    )
    response = model.generate_content(prompt)
    suggestion = response.text

    return jsonify({"outfit_suggestion": suggestion})


# if __name__ == '__main__':
#     app.run(port=5000, debug=True)

if __name__ == '__main__':
    if not os.path.exists('uploads'):
        os.makedirs('uploads')
    app.run(port=5000, debug=True)
