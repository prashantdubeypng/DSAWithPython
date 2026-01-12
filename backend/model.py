import torch
import torch.nn as nn

class LSTMModel(nn.Module):
    def __init__(self, vocab_size, embed_dim, hidden_dim, pad_token_id):
        super().__init__()

        self.embedding = nn.Embedding(
            vocab_size,
            embed_dim,
            padding_idx=pad_token_id
        )

        self.lstm = nn.LSTM(
            input_size=embed_dim,
            hidden_size=hidden_dim,
            batch_first=True,
            
        )

        self.fc = nn.Linear(hidden_dim, vocab_size)

    def forward(self, input_ids):
        emb = self.embedding(input_ids)
        out, _ = self.lstm(emb)
        logits = self.fc(out)
        return logits
