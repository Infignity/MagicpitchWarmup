from typing import List, Optional, Literal
from pydantic import BaseModel, Field
from scheduler.settings import simple_pydantic_model_config, current_utc_timestamp
from datetime import datetime

MailServerSecurityProtocol = Literal["ssl", "tls", "unsecure"]


class CustomSchemaWithConfig(BaseModel):
    """Custom schema with configurations , other schemas and models can inherit from this class"""

    model_config = simple_pydantic_model_config


class AutoResponder(CustomSchemaWithConfig):
    is_active: bool = Field(description="Autoresponder is active", default=False)
    created_on: datetime = Field(
        description="Creation date of autoresponder - UTC TIMESTAMP", default_factory=current_utc_timestamp
    )


class EmailDetails(CustomSchemaWithConfig):
    email: str = Field(description="Email Address")
    password: Optional[str] = Field(
        description="Password to email account", default=None
    )


class AutoresponderDayData(CustomSchemaWithConfig):
    reply_volume: int = Field(description="Amount of emails to reply to")
    open_volume: int = Field(description="Amount of emails to open")

    replied_emails: List[EmailDetails] = Field(description="Emails replied to")
    opened_emails: List[EmailDetails] = Field(description="Emails read")


class MailServerConnectionDetails(CustomSchemaWithConfig):
    hostname: str = Field(description="Hostname of server")
    port: int = Field(description="Server port")
    email: str = Field(description="Email address")
    password: str = Field(description="Server passwords")
    security: MailServerSecurityProtocol = Field(description="Server security protocol")
