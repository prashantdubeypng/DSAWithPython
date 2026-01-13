from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from inference import predict_next_words

app = FastAPI(title="Next Word Prediction API")

# 🔥 CORS CONFIG
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",          
        "https://dsawithpython.vercel.app",
        "https://word-suggestion-mu.vercel.app" 
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class UserInput(BaseModel):
    text: str
    top_k: int = 5
    temperature: float = 0.8

@app.get("/")
def health_check():
    return {"status": "API is running"}

@app.post("/predict")
def predict(data: UserInput):
    predictions = predict_next_words(
        text=data.text,
        k=data.top_k,
        temperature=data.temperature
    )
    return {
        "input": data.text,
        "predictions": predictions
    }
