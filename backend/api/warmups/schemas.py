""" Define pydantic models here """
from beanie import PydanticObjectId
from pydantic import BaseModel, validator, Field
from typing import List, Dict, Union, Optional, Iterable
from uuid import uuid4
from enum import Enum
from datetime import datetime
from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Literal
from api.schemas import CustomSchemaWithConfig, EmailDetails
from api.warmups import WARMUP_STATE


class AutoresponderDayData(CustomSchemaWithConfig):
    reply_volume: int = Field(description="Amount of emails to reply to")
    open_volume: int = Field(description="Amount of emails to open")

    replied_emails: List[EmailDetails] = Field(description="Emails replied to")
    opened_emails: List[EmailDetails] = Field(description="Emails read")


class WarmupResult(CustomSchemaWithConfig):
    id: PydanticObjectId = Field(
        description="Warmup id ",
        alias="_id",
    )

    name: str = Field(description="Name of warmup", default="New warmup")
    created_at: datetime = Field(
        description="Date when warmup was created", default_factory=datetime.now
    )
    started_at: datetime = Field(
        description="Date when warmup was started", default_factory=datetime.now
    )
    state: WARMUP_STATE = Field(
        description="Current state of warmup", default="notStarted"
    )

    mailserver_name: Optional[str] = Field(
        description="Name of mailserver associated with this warmup", default=None
    )
    client_email_list_name: Optional[str] = Field(
        description="Name of client email list associated with this warmup",
        default=None,
    )
    reply_email_list_name: Optional[str] = Field(
        description="Name of reply email list associated with this warmup", default=None
    )

    user_id: PydanticObjectId = Field(description="Id of user")

    max_days: int = Field(
        description="Maximum number of days warmup should run, leave empty if you want to run contineously.",
        default=0,
    )
    increase_rate: float = Field(
        description="Rate of increase in sending volume. You can specify a value between 0.1 - 0.9 for relative amount, e.g 0.5 for 50%. You can as well specify a valus between 1-20.",
        ge=0.1,
        le=20,
    )
    start_volume: int = Field(
        description="Start volume referrs to the number of send volume to start with. Specify a value between 10-50.",
        ge=10,
        le=20,
    )
    daily_send_limit: int = Field(
        description="Max number of emails to send daily", ge=200, le=500
    )

    auto_responder_enabled: bool = Field(
        description="Enable autoresponder for this warmup.", default=False
    )
    target_open_rate: float = Field(
        description="Target open rate if autoresponder is enabled. Specify a value between 0.1 - 0.9 for relative amount, e.g 0.5 for 50%. You can as well specify a valus between 1-20.",
        ge=0.1,
        le=1000,
    )
    target_reply_rate: float = Field(
        description="Target reply rate if autoresponder is enabled. Specify a value between 0.1 - 0.9 for relative amount, e.g 0.5 for 50%. You can as well specify a valus between 1-20.",
        ge=0.1,
        le=1000,
    )

    total_warmup_days: int = Field(
        description="Amount of days warmup has been running, 0 means no data available yet."
    )
    total_addresses_mailed: int = Field(
        description="Total email addresses mailed across all warmup days"
    )

    current_warmup_day: int = Field(description="Current warmup day count", default=1)
    status_text: Optional[str] = Field(
        description="Message about current status, could be error message.",
        default=None,
    )
