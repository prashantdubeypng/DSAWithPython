FROM pytorch/pytorch:2.1.0-cpu

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir fastapi uvicorn transformers

COPY . .

EXPOSE 3005

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "3005"]
