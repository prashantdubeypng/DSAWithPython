from fastapi import FastAPI
from pydantic import BaseModel
from inference import predict_next_words

app = FastAPI(title="Next Word Prediction API")

class UserInput(BaseModel):
    text: str
    top_k: int = 5
    temperature: float = 0.8
@app.post("/predict")
def predict(data: UserInput):
    predictions = predict_next_words(
        text=data.text,
        k=data.top_k,
        temperature=data.temperature
    )
    print(predictions)

    return {
        "input": data.text,
        "predictions": predictions
    }
