from beanie import PydanticObjectId
from pydantic import Field
from typing import Optional
from api.schemas import CustomSchemaWithConfig
from datetime import datetime
from api.email_lists import EmailListType


class BasicEmailList(CustomSchemaWithConfig):
    id: PydanticObjectId = Field(
        description="Email list id",
        default_factory=lambda: PydanticObjectId(),
        alias="_id",
    )

    name: str = Field(description="Name of email list", default="New email list")
    total_emails: int = Field(description="Total emails", default=0)
    created_at: datetime = Field(
        description="Creation time of email list", default_factory=datetime.now
    )
    last_modified: datetime = Field(
        description="Last modified date of email list", default_factory=datetime.now
    )
    email_list_type: EmailListType = Field(description="Email list type")
    user_id: Optional[PydanticObjectId] = Field(description="Id of user")
    url: str = Field(description="Url to file")
