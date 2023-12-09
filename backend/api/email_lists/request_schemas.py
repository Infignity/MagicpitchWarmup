from api.schemas import CustomSchemaWithConfig
from pydantic import Field
from typing import List


class DeleteEmailListsRequest(CustomSchemaWithConfig):
    email_list_ids: List[str] = Field(description="List of email list ids to delete")
