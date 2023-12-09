from datetime import datetime
from typing import List, Optional

from beanie import PydanticObjectId
from beanie.odm.documents import Document
from pydantic import Field

from api import app_config
from api.users.schemas import AutoResponder


class User(Document):
    class Settings:
        name = "users"
        use_state_management = True

    model_config = app_config.simple_pydantic_model_config

    id: PydanticObjectId = Field(
        description="User Id", default_factory=lambda: PydanticObjectId(), alias="_id"
    )

    username: str = Field(description="Username")
    email: str = Field(description="Email")
    password: str = Field(description="Password")
    fullname: str = Field(description="Full name - Firstname Lastname")
