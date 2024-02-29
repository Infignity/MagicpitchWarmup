from enum import Enum
from beanie import PydanticObjectId
from pydantic import BaseModel, Field

from api import app_config


class AuthorizationError(BaseModel):
    message: str = Field(default="Authorization Error")
    description: str = Field(description="Error details")
