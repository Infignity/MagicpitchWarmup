from pydantic import Field, ValidationInfo
from api.schemas import CustomSchemaWithConfig
from typing import List, Literal, Optional
from api.app_config import simple_pydantic_model_config
from beanie.odm.fields import PydanticObjectId
import asyncio
import concurrent.futures
from api.mail_servers.models import MailServer
from api.warmups.models import Warmup
from api.email_lists.models import EmailList

DAILY_EMAIL_SEND_LIMIT = 1000000

class CreateWarmUpRequest(CustomSchemaWithConfig):
    name: str = Field(description="Name of warmup", default="New warmup")

    mailserver_id: str = Field(
        description="Id of mailserver associated with this warmup"
    )
    client_email_list_id: Optional[str] = Field(
        description="Id of client email list associated with this warmup", default=None
    )
    reply_email_list_id: Optional[str] = Field(
        description="Id of reply email list associated with this warmup", default=None
    )

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
        description="Max number of emails to send daily", ge=200, le=DAILY_EMAIL_SEND_LIMIT
    )

    auto_responder_enabled: bool = Field(
        description="Enable autoresponder for this warmup.", default=False
    )

    target_open_rate: float = Field(
        description="Specify a value between 0.1 - 0.9 for relative amount, e.g 0.5 for 50%. You can as well specify a valus between 1-20.",
        ge=0.1,
        le=1000,
    )
    target_reply_rate: float = Field(
        description="Specify a value between 0.1 - 0.9 for relative amount, e.g 0.5 for 50%. You can as well specify a valus between 1-20.",
        ge=0.1,
        le=1000,
    )
    
    scheduled_at: int = Field(description="Preferred time warmup should run - UTC TIMESTAMP")


class UpdateWarmupStateRequest(CustomSchemaWithConfig):
    warmup_ids: List[str] = Field(description="List of warmup ids to update")
    state: Literal["pause", "resume"] = Field(
        description="Update state", default="pause"
    )


class DeleteWarmupRequest(CustomSchemaWithConfig):
    warmup_ids: List[str] = Field(description="List of warmup ids to delete")
