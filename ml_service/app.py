from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import os
from model import ModelWrapper

app = FastAPI()
model = ModelWrapper()

class TrainRequest(BaseModel):
    epochs: int = 10

class InferRequest(BaseModel):
    features: List[float]

class EmbeddingRequest(BaseModel):
    text: str

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/train")
def train(req: TrainRequest):
    # TODO: Load training data from database
    # TODO: Add model versioning
    try:
        model.train(epochs=req.epochs)
        return {"success": True, "message": "Model trained"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/infer")
def infer(req: InferRequest):
    # TODO: Add input validation
    # TODO: Add logging/monitoring
    try:
        prediction = model.predict(req.features)
        return {"success": True, "prediction": float(prediction)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/embeddings")
def embeddings(req: EmbeddingRequest):
    # TODO: Use proper embedding model (sentence-transformers, etc.)
    # TODO: Add PHI scrubbing
    try:
        embedding = model.get_embedding(req.text)
        return {"success": True, "vector": embedding}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

