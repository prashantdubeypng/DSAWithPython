FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

COPY requirement.txt .

RUN pip install --no-cache-dir "numpy<2"


RUN pip install --no-cache-dir \
    torch==2.0.1+cpu \
    torchvision==0.15.2+cpu \
    --index-url https://download.pytorch.org/whl/cpu


RUN pip install --no-cache-dir fastapi uvicorn transformers==4.35.2

COPY . .

EXPOSE 3005

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "3005"]
