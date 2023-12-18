""" This module contains all database models for this package """


import os
from datetime import datetime, timedelta
from pydantic import Field
from beanie import PydanticObjectId
from api.schemas import EmailDetails
from api.warmups.schemas import AutoresponderDayData
from api.app_config import simple_pydantic_model_config
from beanie.odm.documents import Document
from typing import Any, Optional, Literal, List
from api.warmups import WARMUP_STATE


class WarmupDay(Document):
    class Settings:
        name = "warmup_days"
        use_state_management = True

    model_config = simple_pydantic_model_config

    id: PydanticObjectId = Field(
        description="WarmupDay Id",
        default_factory=lambda: PydanticObjectId(),
        alias="_id",
    )

    warmup_id: PydanticObjectId = Field(description="Id of warmup")
    nday: int = Field(description="Current day count")
    actual_total_send_volume: int = Field(
        description="The actual amount of send emails this day"
    )
    date: datetime = Field(
        description="Date when warmupday was ran", default_factory=datetime.now
    )

    state: WARMUP_STATE = Field(description="Current state of warmupday")
    reputation_score: float = Field(description="Reputation score 0-1")
    reply_rate_score: float = Field(description="Reply rate score 0-1")
    open_rate_score: float = Field(description="Open rate score 0-1")

    autoresponder_data: Optional[AutoresponderDayData] = Field(
        description="Data associated with autoresponder"
    )

    client_emails_sent: List[EmailDetails] = Field(description="Client emails sent")
    reply_emails_sent: List[EmailDetails] = Field(description="Reply emails sent")


class Warmup(Document):
    class Settings:
        name = "warmups"
        use_state_management = True

    model_config = simple_pydantic_model_config

    id: PydanticObjectId = Field(
        description="Warmup id ",
        default_factory=lambda: PydanticObjectId(),
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

    mailserver_id: PydanticObjectId = Field(
        description="Id of mailserver associated with this warmup"
    )
    client_email_list_id: Optional[PydanticObjectId] = Field(
        description="Id of client email list associated with this warmup", default=None
    )
    reply_email_list_id: Optional[PydanticObjectId] = Field(
        description="Id of reply email list associated with this warmup", default=None
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

    addresses_mailed: List[str] = Field(
        description="Email addresses mailed across all warmup days", default=[]
    )

    current_warmup_day: int = Field(description="Current warmup day count", default=0)
    status_text: Optional[str] = Field(
        description="Message about current status, could be error message.",
        default=None,
    )
