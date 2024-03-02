from datetime import datetime
from typing import Optional, List
from beanie.odm.documents import Document
from beanie import PydanticObjectId
from api.announcements import ANNOUNCEMENT_PRIORITY
from pydantic import Field
from api.app_config import current_utc_timestamp, simple_pydantic_model_config


class Announcement(Document):
    class Settings:
        name = "announcements"
        use_state_management = True

    model_config = simple_pydantic_model_config

    id: PydanticObjectId = Field(
        description="Document id",
        default_factory=lambda: PydanticObjectId(),
        alias="_id",
    )

    message: str = Field(description="Name of email list")
    details: Optional[str] = Field(description="More details about message", default=None)
    added_at: int = Field(description="UTC TIMESTAMP - time announcement was added.", default_factory=current_utc_timestamp)
    priority: ANNOUNCEMENT_PRIORITY = Field(description="Priority", default="normal")