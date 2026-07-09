import multiprocessing

# Gunicorn konfigurasyonu
# Production'da FastAPI uygulamasının çökmemesi ve kendini yenilemesi için kullanılır.

workers_per_core = 2
cores = multiprocessing.cpu_count()
default_web_concurrency = workers_per_core * cores

bind = "0.0.0.0:8000"
worker_class = "uvicorn.workers.UvicornWorker"
workers = max(default_web_concurrency, 2)
keepalive = 120

# Memory leak'leri engellemek için worker belirli bir miktar işlemden sonra kendini restart eder.
max_requests = 1000
max_requests_jitter = 50

errorlog = "-"
loglevel = "info"
accesslog = "-"
access_log_format = '%(h)s %(l)s %(u)s %(t)s "%(r)s" %(s)s %(b)s "%(f)s" "%(a)s"'
