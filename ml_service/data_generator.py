import numpy as np
from typing import Tuple

def generate_synthetic_data(n_samples: int = 100) -> Tuple[np.ndarray, np.ndarray]:
    """Generate synthetic symptom time-series data."""
    np.random.seed(42)
    # Features: day_of_cycle, age, stress_level, sleep_hours
    X = np.random.rand(n_samples, 4)
    X[:, 0] = np.random.randint(1, 29, n_samples)  # day_of_cycle
    X[:, 1] = np.random.uniform(45, 60, n_samples)  # age
    X[:, 2] = np.random.uniform(1, 10, n_samples)  # stress_level
    X[:, 3] = np.random.uniform(5, 9, n_samples)  # sleep_hours
    
    # Target: symptom severity (0-10)
    # Simple linear relationship with some noise
    y = (
        2 * X[:, 0] / 29 +  # cycle effect
        0.1 * X[:, 1] +     # age effect
        0.5 * X[:, 2] +     # stress effect
        -0.3 * X[:, 3] +    # sleep effect
        np.random.normal(0, 1, n_samples)
    )
    y = np.clip(y, 0, 10)
    
    return X, y

