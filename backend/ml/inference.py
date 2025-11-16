"""
ML model inference for predictions.
"""
import joblib
import numpy as np
import os

MODEL_PATH = 'models/model.pkl'
SCALER_PATH = 'models/scaler.pkl'

def loadModel():
    """Load trained model and scaler."""
    if not os.path.exists(MODEL_PATH) or not os.path.exists(SCALER_PATH):
        raise FileNotFoundError("Model files not found. Please train the model first.")
    
    model = joblib.load(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)
    
    return { 'model': model, 'scaler': scaler }

def predict(model_dict, features):
    """
    Make prediction using the model.
    
    Args:
        model_dict: Dictionary with 'model' and 'scaler' keys
        features: Array of features [severity, day_of_week, has_mood, symptom_type_encoded]
    
    Returns:
        Predicted severity value
    """
    model = model_dict['model']
    scaler = model_dict['scaler']
    
    # Scale features
    features_scaled = scaler.transform([features])
    
    # Predict
    prediction = model.predict(features_scaled)[0]
    
    # Clip to valid range
    return max(1, min(10, round(prediction, 1)))

