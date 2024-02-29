from beanie import PydanticObjectId
from api.users.schemas import AutoResponder, AutoResponderData
from pydantic import Field
from typing import List
from api.schemas import CustomSchemaWithConfig


class AutoResponderDataResponse(AutoResponderData):
    # warmup_reply_volume: int = Field(description = "Total emails to reply to")
    # warmup_send_volume: int = Field(description = "Total emails to sent during warmup")
    # warmup_open_volume: int = Field(description = "Total emails to open")

    reply_emails: List = Field(
        description="Addresses whom emails were replied by auto responder", exclude=True
    )
    read_emails: List = Field(
        description="Addresses whom emails were read by auto responder", exclude=True
    )


class UserResponse(CustomSchemaWithConfig):
    id: PydanticObjectId = Field(
        description="User Id", default_factory=lambda: PydanticObjectId(), alias="_id"
    )

    username: str = Field(description="Username")
    email: str = Field(description="Email")
    fullname: str = Field(description="Full name - Firstname Lastname")


class CreateUserSuccess(CustomSchemaWithConfig):
    user: UserResponse = Field(description="New user")
    message: str = Field(default="User Created")
    description: str = Field(default="Successfully created user")


class CreateUserError(CustomSchemaWithConfig):
    message: str = Field(default="User creation failed")
    description: str = Field(default="More information about cause of failure")
