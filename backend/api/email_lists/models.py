from datetime import datetime
from typing import Optional, List
from beanie.odm.documents import Document
from beanie import PydanticObjectId
from api.email_lists.schemas import EmailListType
from api.schemas import EmailDetails
from pydantic import Field
from api import app_config


class EmailList(Document):
    class Settings:
        name = "email_lists"
        use_state_management = True

    model_config = app_config.simple_pydantic_model_config

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
