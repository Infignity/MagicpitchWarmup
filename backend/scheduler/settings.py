import os
import random
import string
from datetime import datetime
from typing import List, Literal, Union
from bunnet import PydanticObjectId
from pydantic import ConfigDict
from starlette.config import Config
from bson.errors import InvalidId
import ssl
import logging
from colorlog import ColoredFormatter
from starlette.datastructures import CommaSeparatedStrings, Secret


BASE_DIR = "/".join(os.path.dirname(os.path.realpath(__file__)).split("/")[:-1])
config = Config(os.path.join(BASE_DIR, ".env"))

logger = logging.getLogger(__name__)

logger.setLevel(logging.INFO)

formatter = ColoredFormatter(
    "%(log_color)s%(asctime)s%(reset)s - %(process)s - %(log_color)s%(levelname)s%(reset)s - %(message)s",
    datefmt="%B %d, %Y : %I:%M:%S%p",
    log_colors={
        "DEBUG": "green",
        "INFO": "blue",
        "WARNING": "yellow",
        "ERROR": "red",
        "CRITICAL": "red,bg_white",
    },
)

# Create a console handler
console_handler = logging.StreamHandler()

# Set the formatter for the console handler
console_handler.setFormatter(formatter)
logger.addHandler(console_handler)


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


def validate_pydantic_object_ids(
    _ids: Union[str, List[str]], convert_to_pydantic_object_id: bool = True
) -> Union[str, None, List[PydanticObjectId]]:
    """
    Filters off invalid PydanticObjectId strings
    :params _ids: List of id strings
    :params convert_to_pydantic_object_id - weather to convert valid strings to PydanticObjectId
    :return: Valid PydanticObjectId strings
    """

    if _ids == None:
        return None
    if _ids == []:
        return []

    if isinstance(_ids, str):
        valid_id = None
        try:
            object_id = PydanticObjectId(_ids)
            valid_id = object_id if convert_to_pydantic_object_id else _ids
        except InvalidId:
            pass
        return valid_id

    elif isinstance(_ids, PydanticObjectId):
        return _ids

    valid_ids = []
    for _id in _ids:
        try:
            object_id = PydanticObjectId(_id)
            if convert_to_pydantic_object_id:
                valid_ids.append(object_id)
            else:
                valid_ids.append(_id)
        except InvalidId:
            pass
    return valid_ids


def generate_random_string(length=16, include_chars=False):
    """Generates a random string"""
    characters = string.ascii_letters + string.digits
    if include_chars:
        characters = characters + string.punctuation
    password = "".join(random.choice(characters) for i in range(length))
    return password


ENVIRONMENT: Literal["development", "production", "staging"] = config("ENVIRONMENT")

MONGODB_CONN_STRING = config("MONGODB_CONN_STRING")
DB_NAME = config("MONGODB_DB_NAME")

SCHEDULER_SERVER_HOST = config("SCHEDULER_SERVER_HOST", default="0.0.0.0")
SCHEDULER_SERVER_PORT = config("SCHEDULER_SERVER_PORT", cast=int, default=8203)

SCHEDULER_CLIENT_HOST = config("SCHEDULER_CLIENT_HOST", default="worker")
SCHEDULER_CLIENT_PORT = config("SCHEDULER_CLIENT_PORT", cast=int, default=8203)

TRACKING_PIXELS_DIR = create_path("files/tpx_emails")
