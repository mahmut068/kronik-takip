from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
import time

app = FastAPI(
    title="SentryHealth API",
    description="Yüksek Performanslı ve Çökme Korumalı Sağlık Verisi Backend Mimarisi",
    version="1.0.0"
)

# Global Exception Handler (Kritik Hata Yalıtımı)
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    # Loglama işlemi burada yapılabilir (Örn: Sentry, Datadog)
    print(f"CRITICAL ERROR [Global Handler]: {exc}")
    return JSONResponse(
        status_code=500,
        content={"message": "Sistemde beklenmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.", "details": str(exc)},
    )

# Performans Metrikleri Middleware'i
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response

@app.get("/")
async def root():
    return {"status": "SentryHealth API V1 Çalışıyor", "architecture": "FastAPI + Celery + PostgreSQL"}

@app.get("/health")
async def health_check():
    # İleriki fazda DB ve Redis ping kontrolleri buraya eklenecek
    return {"status": "HEALTHY"}
