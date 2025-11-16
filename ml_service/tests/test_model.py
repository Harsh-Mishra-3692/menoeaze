import unittest
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import numpy as np
from model import ModelWrapper

class TestModel(unittest.TestCase):
    def setUp(self):
        self.model = ModelWrapper()

    def test_embedding(self):
        embedding = self.model.get_embedding("test text")
        self.assertEqual(len(embedding), 128)
        self.assertIsInstance(embedding[0], (int, float))

    def test_train_predict(self):
        self.model.train(epochs=5)
        prediction = self.model.predict([15, 50, 5, 7])
        self.assertIsInstance(prediction, (int, float))

if __name__ == "__main__":
    unittest.main()

