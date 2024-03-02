from api.schemas import CustomSchemaWithConfig
from pydantic import Field
from typing import List, Optional, Literal
from api.announcements import ANNOUNCEMENT_PRIORITY

class NewAnnouncementRequest(CustomSchemaWithConfig):
    message: str = Field(description="Short announcement")
    details: Optional[str] = Field(description="More details about message", default=None)
    priority: ANNOUNCEMENT_PRIORITY = Field(description="Priority", default="normal")
    
    
class DeleteAnnouncementRequest(CustomSchemaWithConfig):
    announcement_ids: List[str] = Field(description="ids of announcements to delete")
