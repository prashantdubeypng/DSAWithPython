import torch
from transformers import AutoTokenizer
from model import LSTMModel

# ---------- DEVICE ----------
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# ---------- TOKENIZER ----------
tokenizer = AutoTokenizer.from_pretrained("gpt2")
tokenizer.pad_token = tokenizer.eos_token

# ---------- MODEL ----------
model = LSTMModel(
    vocab_size=tokenizer.vocab_size,
    embed_dim=128,
    hidden_dim=256,
    pad_token_id=tokenizer.pad_token_id
)
import os
import urllib.request

MODEL_PATH = "model_weights.pt"
MODEL_URL = "https://github.com/prashantdubeypng/DSAWithPython/releases/download/v1.0/model_weights.pt"

def ensure_model_weights():
    if not os.path.exists(MODEL_PATH):
        print("Downloading model weights...")
        urllib.request.urlretrieve(MODEL_URL, MODEL_PATH)
        print("Model weights downloaded.")

ensure_model_weights()

model.load_state_dict(
    torch.load("model_weights.pt", map_location=device)
)

model.to(device)
model.eval()

# ---------- PREPROCESS ----------
def preprocess(text: str) -> str:
    return text.lower().strip()

# ---------- PREDICTION ----------
def predict_next_words(text: str, k: int = 5, temperature: float = 0.8):
    text = preprocess(text)

    enc = tokenizer(text, return_tensors="pt")
    input_ids = enc["input_ids"].to(device)
    attention_mask = enc["attention_mask"].to(device)

    with torch.no_grad():
        logits = model(input_ids)

        seq_len = attention_mask.sum().item()
        last_logits = logits[0, seq_len - 1]

        probs = torch.softmax(last_logits / temperature, dim=-1)
        top_probs, top_ids = torch.topk(probs, k)

    results = []
    for prob, idx in zip(top_probs, top_ids):
        results.append({
            "token": tokenizer.decode([idx.item()]),
            "probability": float(prob.item())
        })

    return results
