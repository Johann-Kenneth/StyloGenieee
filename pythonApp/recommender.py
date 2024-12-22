# recommender.py

import numpy as np
import pickle as pkl
import tensorflow as tf
from tensorflow.keras.applications.resnet50 import ResNet50, preprocess_input
from tensorflow.keras.layers import GlobalMaxPool2D
from sklearn.neighbors import NearestNeighbors
from numpy.linalg import norm
from tensorflow.keras.preprocessing import image

class FashionRecommender:
    def __init__(self):
        self.image_features = pkl.load(open('models/Images_features.pkl', 'rb'))
        self.filenames = pkl.load(open('models/filenames.pkl', 'rb'))
        model = ResNet50(weights='imagenet', include_top=False, input_shape=(224, 224, 3))
        self.model = tf.keras.models.Sequential([model, GlobalMaxPool2D()])
        self.model.trainable = False

        self.neighbors = NearestNeighbors(n_neighbors=6, algorithm='brute', metric='euclidean')
        self.neighbors.fit(self.image_features)

    def extract_features(self, image_path):
        img = image.load_img(image_path, target_size=(224, 224))
        img_array = image.img_to_array(img)
        img_expand_dim = np.expand_dims(img_array, axis=0)
        img_preprocess = preprocess_input(img_expand_dim)
        result = self.model.predict(img_preprocess).flatten()
        return result / norm(result)

    def recommend(self, image_path):
        input_features = self.extract_features(image_path)
        _, indices = self.neighbors.kneighbors([input_features])
        return [self.filenames[idx] for idx in indices[0][1:]]
