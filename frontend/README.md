# Next Word Predictor Frontend

Modern web UI for the LSTM-powered next word prediction API.

## Tech Stack

- **Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **API**: Fetch to FastAPI backend

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

- Real-time next word predictions
- Adjustable Top-K and Temperature parameters
- Click predictions to auto-append and re-predict
- Dark mode ML-product aesthetic
- Responsive design (mobile + desktop)

## API Endpoint

```
POST https://dsawithpython-production.up.railway.app/predict
```

Request body:
```json
{
  "text": "the meaning of life is",
  "top_k": 5,
  "temperature": 0.8
}
```
