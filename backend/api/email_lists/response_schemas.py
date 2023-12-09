from api.schemas import BaseGenericResponse, CustomSchemaWithConfig
from typing import List
from api.email_lists.models import EmailList
from api.email_lists.schemas import BasicEmailList
from pydantic import Field
from api.email_lists import PAGE_SIZE


class PaginatedEmailLists(CustomSchemaWithConfig):
    email_lists: List[BasicEmailList] = Field(
        description="List of email lists", default=[]
    )
    total_email_lists: int = Field(description="Total number of email lists")
    page_size: int = Field(description="Page size", default=PAGE_SIZE)


class EmailListImportSuccess(BaseGenericResponse):
    message: str = Field(default="Email list imported")
    description: str = Field(default="Email list was imported successfully")
    email_list: BasicEmailList = Field(description="Information about new email list")


class EmailListImportError(BaseGenericResponse):
    message: str = Field(
        description="Title about error", default="Failed importing email list"
    )
    description: str = Field(
        description="Detailed info about failure",
        default="An error occured while importing email list",
    )


class EmailListUpdated(BaseGenericResponse):
    message: str = Field(default="Email list updated")
    description: str = Field(default="Email list was updated successfully")


class EmailListsDeleted(CustomSchemaWithConfig):
    message: str = Field(default="Successfully deleted email lists")
    description: str = Field(default="The email lists were deleted successfully.")
    total_email_lists_deleted: int = Field(
        description="Total number of email lists deleted"
    )
