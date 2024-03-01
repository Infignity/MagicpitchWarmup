""" Define all configurations """

import os
import json
import rpyc
from typing import Literal
from pydantic import ConfigDict
from starlette.config import Config
from starlette.datastructures import CommaSeparatedStrings, Secret
from apscheduler.triggers.interval import IntervalTrigger
from datetime import datetime

BASE_DIR = "/".join(os.path.dirname(os.path.realpath(__file__)).split("/")[:-1])

config = Config(os.path.join(BASE_DIR, ".env"))


def create_path(path_str: str, allow_absolute=False) -> str:
    """Creates a directory in the specified path, if path does not exist, they'll be created"""
    if not allow_absolute:
        full_path = os.path.join(BASE_DIR, path_str)
    else:
        full_path = path_str

    if not os.path.exists(full_path):
        os.makedirs(full_path, exist_ok=True)
    return full_path

def current_utc_timestamp() -> int:
    return int(datetime.now().timestamp())


ACCESS_TOKEN_EXPIRE_TIME = 3600 * 72  # 3 days

API_VERSION = config("API_VERSION")
MONGODB_CONN_STRING = config("MONGODB_CONN_STRING")
DB_NAME = config("MONGODB_DB_NAME")
SECRET_KEY = config("SECRET_KEY", cast=Secret)
ALGORITHM = config("ALGORITHM")

ENVIRONMENT: Literal["development", "production", "staging"] = config("ENVIRONMENT")
OPENAI_API_KEY = config("OPENAI_API_KEY", default="")
ACCESS_CODE = config("ACCESS_CODE", default="admin")
ALLOWED_IPS = config("ALLOWED_IPS", cast=CommaSeparatedStrings, default=[])
TEST_EMAILS = config("TEST_EMAILS", cast=CommaSeparatedStrings, default=[])

SCHEDULER_CLIENT_HOST = config("SCHEDULER_CLIENT_HOST", default="worker")
SCHEDULER_CLIENT_PORT = config("SCHEDULER_CLIENT_PORT", cast=int, default=8203)


LOG_FILES_DIR = create_path("logs")
TEMP_FILES_DIR = create_path("files/tmps")
USER_FILES_DIR = create_path("files/user_data")
ENV_DIR = create_path("env")


VERSION_PREFIX = f"/{API_VERSION}"


def to_camel_case(snake_str: str):
    """
    Converts a string in snake case to camel case
    :param snake_str: A string in snake case
    :return: A string in camel case
    """

    components = snake_str.split("_")
    components = [components[0]] + [x.capitalize() for x in components[1:]]
    camel_case_str = "".join(components)
    return camel_case_str


simple_pydantic_model_config = ConfigDict(
    str_strip_whitespace=True,
    use_enum_values=True,
    alias_generator=to_camel_case,
    populate_by_name=True,
)

simple_pydantic_model_config_with_ignored_extra_fields = ConfigDict(
    str_strip_whitespace=True,
    use_enum_values=True,
    alias_generator=to_camel_case,
    populate_by_name=True,
    extra="ignore",
)
