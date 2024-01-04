# Gunicorn configuration file

import multiprocessing
from api import app_config
import os

max_requests = 1000
max_requests_jitter = 50

accesslog = os.path.join(app_config.LOG_FILES_DIR, "gunicorn_access.log")
access_log_format = '%(h)s %(l)s %(u)s %(t)s "%(r)s" %(s)s %(b)s "%(f)s" "%(a)s"'

bind = "0.0.0.0:8080"
reload = True

worker_class = "uvicorn.workers.UvicornWorker"
workers = (multiprocessing.cpu_count() * 2) + 1
