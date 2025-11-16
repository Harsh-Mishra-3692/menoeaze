"""
Train ML model for MenoEaze symptom prediction and analysis.
"""
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
import joblib
import os

def load_data(csv_path='data/symptoms.csv'):
    """Load training data from CSV or generate synthetic data."""
    if os.path.exists(csv_path):
        df = pd.read_csv(csv_path)
    else:
        # Generate synthetic data for training
        df = generate_synthetic_data()
    
    return df

def generate_synthetic_data(n_samples=1000):
    """Generate synthetic symptom data for training."""
    np.random.seed(42)
    
    data = {
        'severity': np.random.randint(1, 11, n_samples),
        'day_of_week': np.random.randint(0, 7, n_samples),
        'has_mood': np.random.randint(0, 2, n_samples),
        'symptom_type_encoded': np.random.randint(0, 10, n_samples),
        'target_severity': None
    }
    
    # Create target (next day severity prediction)
    data['target_severity'] = (
        data['severity'] * 0.6 +
        np.random.normal(0, 1, n_samples) +
        data['has_mood'] * 0.5
    ).clip(1, 10)
    
    return pd.DataFrame(data)

def train_model():
    """Train the ML model."""
    print("Loading data...")
    df = load_data()
    
    # Features
    X = df[['severity', 'day_of_week', 'has_mood', 'symptom_type_encoded']].values
    y = df['target_severity'].values
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    # Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Train model
    print("Training model...")
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train_scaled, y_train)
    
    # Evaluate
    train_score = model.score(X_train_scaled, y_train)
    test_score = model.score(X_test_scaled, y_test)
    
    print(f"Train R²: {train_score:.3f}")
    print(f"Test R²: {test_score:.3f}")
    
    # Save model and scaler
    os.makedirs('models', exist_ok=True)
    joblib.dump(model, 'models/model.pkl')
    joblib.dump(scaler, 'models/scaler.pkl')
    
    print("Model saved to models/model.pkl")
    return model, scaler

if __name__ == '__main__':
    train_model()

