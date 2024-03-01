from beanie import PydanticObjectId
from pydantic import Field
from typing import Optional
from api.schemas import CustomSchemaWithConfig
from api.email_lists import EmailListType


class BasicEmailList(CustomSchemaWithConfig):
    id: PydanticObjectId = Field(
        description="Email list id",
        default_factory=lambda: PydanticObjectId(),
        alias="_id",
    )

    name: str = Field(description="Name of email list", default="New email list")
    total_emails: int = Field(description="Total emails", default=0)
    created_at: int = Field(
        description="Creation time of email list"
    )
    last_modified: int = Field(
        description="Last modified date of email list"
    )
    email_list_type: EmailListType = Field(description="Email list type")
    user_id: Optional[PydanticObjectId] = Field(description="Id of user")
    url: str = Field(description="Url to file")
