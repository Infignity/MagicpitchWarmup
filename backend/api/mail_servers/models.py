from beanie import PydanticObjectId
from pydantic import Field
from api.app_config import simple_pydantic_model_config, current_utc_timestamp
from beanie.odm.documents import Document
from datetime import datetime

from api.mail_servers.schemas import MailServerConnectionDetails


class MailServer(Document):
    class Settings:
        name = "mail_servers"
        use_state_management = True

    model_config = simple_pydantic_model_config

    id: PydanticObjectId = Field(
        description="Mail server id",
        default_factory=lambda: PydanticObjectId(),
        alias="_id",
    )

    name: str = Field(description="Name of mail server", default="New mail server")
    added_on: int = Field(
        description="Creation time - UTC TIMESTAMP", default_factory=current_utc_timestamp
    )
    last_modified: int = Field(
        description="Last modified date - UTC TIMESTAMP", default_factory=current_utc_timestamp
    )

    user_id: PydanticObjectId = Field(description="Id of user")
    # imap_details: MailServerConnectionDetails = Field(description = "Imap details for connecting this mailserver...")
    smtp_details: MailServerConnectionDetails = Field(
        description="Smtp details for connecting this mailserver..."
    )
