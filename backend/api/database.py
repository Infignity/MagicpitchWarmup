""" Includes code to communicate with mongodb database """

from typing import List

import motor.motor_asyncio
from beanie import init_beanie

from api import app_config


async def init_db(models: List):
    """
    Initializes the database connection using async motor driver
    :param models: A list of models to add
    """
    client = motor.motor_asyncio.AsyncIOMotorClient(app_config.MONGODB_CONN_STRING)
    await init_beanie(
        database=client.get_default_database(app_config.DB_NAME), document_models=models
    )
