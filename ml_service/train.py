#!/usr/bin/env python3
"""Training script for MenoEaze ML model."""
from model import ModelWrapper

if __name__ == "__main__":
    model = ModelWrapper()
    print("Training model...")
    model.train(epochs=10)
    print("Training complete. Model saved to models/model.pkl")

