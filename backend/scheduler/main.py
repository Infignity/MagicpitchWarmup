#!/usr/bin/python3

from celery import Celery
from typing import Dict
import logging
import ssl
import rpyc
from rpyc.utils.server import ThreadedServer
from scheduler.actions.warmup import periodic_warmup
from typing import Dict
from pymongo import MongoClient
from bunnet import init_bunnet
from datetime import datetime
from bunnet.odm.operators.find.comparison import NotIn
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.jobstores.mongodb import MongoDBJobStore
from apscheduler.triggers.interval import IntervalTrigger

from scheduler.settings import (
    MONGODB_CONN_STRING,
    DB_NAME,
    ENVIRONMENT,
    validate_pydantic_object_ids,
    logger,
    SCHEDULER_SERVER_HOST,
    SCHEDULER_SERVER_PORT,
)
from scheduler.models import User, Warmup, WarmupDay, EmailList, MailServer, WarmupEmail

client = MongoClient(MONGODB_CONN_STRING)

mongo_jobstore = MongoDBJobStore(DB_NAME, "scheduler", client)
scheduler = BackgroundScheduler()
scheduler.add_jobstore(mongo_jobstore)


MODELS = [User, EmailList, MailServer, WarmupDay, Warmup, WarmupEmail]
init_bunnet(database=client[DB_NAME], document_models=MODELS)

scheduler.start()


def add_job(warmup: Warmup):
    """Adds job to scheduler"""

    interval_trigger = IntervalTrigger(days=1)
    # if environment is development then set interval trigger to be 30mins
    if ENVIRONMENT == "development":
        interval_trigger = IntervalTrigger(seconds=30)

    return scheduler.add_job(
        periodic_warmup,
        trigger=interval_trigger,
        id=str(warmup.id),
        replace_existing=True,
        next_run_time=datetime.now(),
        kwargs={"warmup_": warmup},
    )


class SchedulerService(rpyc.Service):
    def exposed_add_job(self, warmup_json):
        warmup = Warmup.model_validate_json(warmup_json)
        return add_job(warmup)

    def exposed_modify_job(self, job_id, jobstore=None, **changes):
        return scheduler.modify_job(job_id, jobstore, **changes)

    def exposed_reschedule_job(
        self, job_id, jobstore=None, trigger=None, **trigger_args
    ):
        return scheduler.reschedule_job(job_id, jobstore, trigger, **trigger_args)

    def exposed_pause_job(self, job_id):
        return scheduler.pause_job(job_id)

    def exposed_resume_job(self, job_id, jobstore=None):
        return scheduler.resume_job(job_id, jobstore)

    def exposed_remove_job(self, job_id):
        scheduler.remove_job(job_id)

    def exposed_get_job(self, job_id):
        return scheduler.get_job(job_id)

    def exposed_get_jobs(self, jobstore=None):
        return scheduler.get_jobs(jobstore)


def main(*args, **kwargs):
    # Initialize warmup jobs

    chunk_size = 5

    job_ids = [job.id for job in scheduler.get_jobs()]
    res = Warmup.find(
        Warmup.state != "completed",
        NotIn(Warmup.id, validate_pydantic_object_ids(job_ids)),
    )
    all_warmups = res.to_list()

    total_warmups = res.count()
    if total_warmups <= 0:
        logger.info("No warmups found ...")
    else:
        logger.info(f"Found {total_warmups} warmups .. Starting {total_warmups} jobs")
        for i in range(0, total_warmups, chunk_size):
            for warmup in all_warmups[i : i + chunk_size]:
                add_job(warmup)
        logger.info("All jobs started.")


logger.info(
    f"Starting RPYC Server | Running worker: {SCHEDULER_SERVER_HOST}:{SCHEDULER_SERVER_PORT}"
)
print(
    f"Starting RPYC Server | Running worker: {SCHEDULER_SERVER_HOST}:{SCHEDULER_SERVER_PORT}"
)

main()

protocol_config = {"allow_public_attrs": True}
server = ThreadedServer(
    SchedulerService,
    hostname=SCHEDULER_SERVER_HOST,
    port=SCHEDULER_SERVER_PORT,
    protocol_config=protocol_config,
)
try:
    server.start()
except (KeyboardInterrupt, SystemExit):
    pass
finally:
    scheduler.shutdown(wait=True)
    server.close()
