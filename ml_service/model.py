import os
import pickle
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import StandardScaler

MODEL_PATH = "models/model.pkl"
SCALER_PATH = "models/scaler.pkl"

class ModelWrapper:
    def __init__(self):
        self.model = LinearRegression()
        self.scaler = StandardScaler()
        self.is_trained = False
        self.load()

    def train(self, epochs: int = 10):
        from data_generator import generate_synthetic_data
        X, y = generate_synthetic_data(n_samples=100)
        X_scaled = self.scaler.fit_transform(X)
        self.model.fit(X_scaled, y)
        self.is_trained = True
        self.save()
        score = self.model.score(X_scaled, y)
        print(f"Training R² score: {score:.3f}")

    def predict(self, features: list[float]):
        if not self.is_trained:
            self.load()
        if not self.is_trained:
            raise ValueError("Model not trained")
        X = np.array(features).reshape(1, -1)
        X_scaled = self.scaler.transform(X)
        return self.model.predict(X_scaled)[0]

    def get_embedding(self, text: str) -> list[float]:
        # TODO: Replace with proper embedding model
        # Placeholder: hash-based embedding
        import hashlib
        hash_obj = hashlib.md5(text.encode())
        hash_int = int(hash_obj.hexdigest(), 16)
        embedding = [(hash_int >> i) & 1 for i in range(128)]
        return embedding

    def save(self):
        os.makedirs("models", exist_ok=True)
        with open(MODEL_PATH, "wb") as f:
            pickle.dump(self.model, f)
        with open(SCALER_PATH, "wb") as f:
            pickle.dump(self.scaler, f)

    def load(self):
        if os.path.exists(MODEL_PATH) and os.path.exists(SCALER_PATH):
            with open(MODEL_PATH, "rb") as f:
                self.model = pickle.load(f)
            with open(SCALER_PATH, "rb") as f:
                self.scaler = pickle.load(f)
            self.is_trained = True

