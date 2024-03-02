from api.schemas import BaseGenericResponse, CustomSchemaWithConfig
from typing import List
from pydantic import Field
from api.email_lists import PAGE_SIZE

class AnnouncementsDeleted(CustomSchemaWithConfig):
    message: str = Field(default="Successfully deleted announcements")
    description: str = Field(default="The announcements were deleted successfully.")
    total_announcements_deleted: int = Field(
        description="Total number of announcements deleted"
    )
