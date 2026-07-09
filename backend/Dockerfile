# Çok Aşamalı (Multi-Stage) Build - Hafif ve Güvenli
FROM python:3.11-slim as builder

WORKDIR /app

# Sistem bağımlılıkları (psycopg2/asyncpg derlemesi için)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip wheel --no-cache-dir --no-deps --wheel-dir /app/wheels -r requirements.txt


FROM python:3.11-slim

WORKDIR /app

# Sadece çalışma zamanı bağımlılıkları
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/wheels /wheels
COPY --from=builder /app/requirements.txt .

RUN pip install --no-cache /wheels/*

COPY ./app /app/app
COPY ./gunicorn_conf.py /app/gunicorn_conf.py

# Kodu root olmayan kullanıcıyla çalıştır (Güvenlik)
RUN useradd -m -u 1000 appuser
USER appuser

# Production ortamı için Gunicorn Process Manager
CMD ["gunicorn", "-c", "gunicorn_conf.py", "app.main:app"]
