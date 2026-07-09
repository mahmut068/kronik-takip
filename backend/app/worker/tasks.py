from app.worker.celery_app import celery_app
import time

@celery_app.task(name="app.worker.tasks.analyze_patient_risk_data")
def analyze_patient_risk_data(patient_id: str) -> dict:
    """
    Bu fonksiyon yapay zeka analiz süreçlerini veya ağır veri işleme
    kuyruklarını simüle eder. Ana API ipliğini bloklamadan arka planda çalışır.
    """
    print(f"[CELERY WORKER] Hasta ID: {patient_id} analiz ediliyor...")
    
    # Gerçek dünya senaryosunda burada 10-30 saniyelik bir analiz modeli çalışır.
    time.sleep(10) 
    
    result = {
        "patient_id": patient_id,
        "status": "COMPLETED",
        "risk_score_calculated": 85.4,
        "is_critical": True
    }
    
    print(f"[CELERY WORKER] Analiz tamamlandı! Sonuç: {result}")
    return result
