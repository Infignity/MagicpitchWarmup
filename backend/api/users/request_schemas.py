from pydantic import BaseModel, Field
from api import app_config
from typing import List, Literal
from api.schemas import CustomSchemaWithConfig


class CreateUserRequest(BaseModel):
    model_config = app_config.simple_pydantic_model_config

    username: str = Field(description="Username")
    email: str = Field(description="Email")
    password: str = Field(description="Password")
    fullname: str = Field(description="Full name - Firstname Lastname")
    access_code: str = Field(Description="Contact the admin for access code.")
