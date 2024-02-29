from enum import Enum
from typing import List, Literal
from api.schemas import CustomSchemaWithConfig
from pydantic import Field
from datetime import datetime


class AutoResponder(CustomSchemaWithConfig):
    is_active: bool = Field(description="Autoresponder is active", default=False)
    created_on: datetime = Field(
        description="Creation date of autoresponder", default_factory=datetime.now
    )


class AutoResponderData(CustomSchemaWithConfig):
    warmup_reply_volume: int = Field(description="Total emails to reply to")
    warmup_send_volume: int = Field(description="Total emails to sent during warmup")
    warmup_open_volume: int = Field(description="Total emails to open")

    reply_emails: List = Field(
        description="Addresses whom emails were replied by auto responder"
    )
    read_emails: List = Field(
        description="Addresses whom emails were read by auto responder"
    )
