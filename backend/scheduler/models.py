from datetime import datetime
from typing import List, Optional, Literal

from bunnet import PydanticObjectId, Indexed
from bunnet.odm.documents import Document
from pydantic import Field

from scheduler import settings
from scheduler.schemas import (
    AutoresponderDayData,
    EmailDetails,
    MailServerConnectionDetails,
)


WARMUP_STATE = Literal["running", "completed", "failed", "paused", "notStarted"]
EmailListType = Literal["replyEmails", "clientEmails"]
DAILY_EMAIL_SEND_LIMIT = 1000000

class WarmupEmail(Document):
    class Settings:
        name = "warmup_emails"
        use_state_management = True

    model_config = settings.simple_pydantic_model_config

    id: PydanticObjectId = Field(
        description="Warmup Id", default_factory=lambda: PydanticObjectId(), alias="_id"
    )
    subject: Indexed(str, unique=True) = Field(description="Subject")
    responses: List[str] = Field(description="List of responses")
    body: str = Field(description="Html formatted body")


class User(Document):
    class Settings:
        name = "users"
        use_state_management = True

    model_config = settings.simple_pydantic_model_config

    id: PydanticObjectId = Field(
        description="User Id", default_factory=lambda: PydanticObjectId(), alias="_id"
    )

    username: str = Field(description="Username")
    email: str = Field(description="Email")
    password: str = Field(description="Password")
    fullname: str = Field(description="Full name - Firstname Lastname")


class WarmupDay(Document):
    class Settings:
        name = "warmup_days"
        use_state_management = True

    model_config = settings.simple_pydantic_model_config

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
    reputation_score: float = Field(description="Reputation score 0-1", default=0)
    reply_rate_score: float = Field(description="Reply rate score 0-1", default=0)
    open_rate_score: float = Field(description="Open rate score 0-1", default=0)

    autoresponder_data: Optional[AutoresponderDayData] = Field(
        description="Data associated with autoresponder only if autoresponder is enabled in warmup",
        default=None,
    )

    client_emails_sent: List[EmailDetails] = Field(
        description="Client emails sent", default=[]
    )
    reply_emails_sent: List[EmailDetails] = Field(
        description="Reply emails sent", default=[]
    )

    batch_id: str = Field(description="Unique identifier for all emails sent this day")


class Warmup(Document):
    class Settings:
        name = "warmups"
        use_state_management = True

    model_config = settings.simple_pydantic_model_config

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
        description="Max number of emails to send daily", ge=200, le=DAILY_EMAIL_SEND_LIMIT
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


class EmailList(Document):
    class Settings:
        name = "email_lists"
        use_state_management = True

    model_config = settings.simple_pydantic_model_config

    id: PydanticObjectId = Field(
        description="Email list id",
        default_factory=lambda: PydanticObjectId(),
        alias="_id",
    )

    name: str = Field(description="Name of email list", default="New email list")
    emails: List[EmailDetails] = Field(
        description="List of email addresses", default=[]
    )
    created_at: datetime = Field(
        description="Creation time of email list", default_factory=datetime.now
    )
    last_modified: datetime = Field(
        description="Last modified date of email list", default_factory=datetime.now
    )
    email_list_type: EmailListType = Field(description="Email list type")
    user_id: PydanticObjectId = Field(description="Id of user")
    url: str = Field(description="Url to file")


class MailServer(Document):
    class Settings:
        name = "mail_servers"
        use_state_management = True

    model_config = settings.simple_pydantic_model_config

    id: PydanticObjectId = Field(
        description="Mail server id",
        default_factory=lambda: PydanticObjectId(),
        alias="_id",
    )

    name: str = Field(description="Name of mail server", default="New mail server")
    added_on: datetime = Field(
        description="Creation time", default_factory=datetime.now
    )
    last_modified: datetime = Field(
        description="Last modified date", default_factory=datetime.now
    )

    user_id: PydanticObjectId = Field(description="Id of user")
    # imap_details: MailServerConnectionDetails = Field(description = "Imap details for connecting this mailserver...")
    smtp_details: MailServerConnectionDetails = Field(
        description="Smtp details for connecting this mailserver..."
    )
