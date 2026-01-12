FROM python:3.11-slim

WORKDIR /app

# System deps (minimal)
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first (cache-friendly)
COPY requirement.txt .

# Install CPU-only PyTorch + runtime deps
RUN pip install --no-cache-dir \
    torch==2.1.0+cpu \
    torchvision==0.16.0+cpu \
    --index-url https://download.pytorch.org/whl/cpu \
    && pip install --no-cache-dir fastapi uvicorn transformers

# Copy app code
COPY . .

EXPOSE 3005

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "3005"]
