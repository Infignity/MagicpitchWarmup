from enum import Enum

from beanie import PydanticObjectId
from pydantic import BaseModel, Field

from api import app_config


class Token(BaseModel):
    model_config = app_config.simple_pydantic_model_config

    access_token: str = Field(description="Access Token")
    token_type: str = Field(description="Access Token Type")
    user_id: PydanticObjectId = Field(description="Id of current user")
    username: str = Field(description="Username")
    
