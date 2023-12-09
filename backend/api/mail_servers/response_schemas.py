from api.schemas import (
    BaseGenericResponse,
    CustomSchemaWithConfig,
    PaginatedSearchResults,
)
from typing import List, Literal
from api.mail_servers.models import MailServer
from api.mail_servers import MAIL_SERVER_PAGE_SIZE
from pydantic import Field


class MailServerVerificationStatus(CustomSchemaWithConfig):
    message: str = Field(description="Short message")
    description: str = Field(default="Description of verification status")
    verification_type: Literal["imap", "smtp"] = Field(description="Verification Type")
    verification_status: Literal["success", "failed"] = Field(
        description="Verification status"
    )


class AddMailserverSuccess(CustomSchemaWithConfig):
    message: str = Field(default="Mailserver added successfully")
    description: str = Field(default="Mailserver has been successfully added")
    mail_server: MailServer = Field(description="Information about new mail_server")


class AddMailserverError(CustomSchemaWithConfig):
    message: str = Field(
        description="Title about error", default="Failed adding mail server"
    )
    description: str = Field(
        description="Detailed info about failure",
        default="An error occured while adding the mail server",
    )


class MailserverUpdated(CustomSchemaWithConfig):
    message: str = Field(default="Mailserver updated")
    description: str = Field(default="Mailserver was updated successfully")


class MailserversDeleted(CustomSchemaWithConfig):
    message: str = Field(default="Mailservers deleted")
    description: str = Field(default="Successfully deleted mailservers")
    total_mailservers_deleted: int = Field(
        description="Total number of mailservers deleted"
    )


class MailserverSearchResult(PaginatedSearchResults):
    page_size: int = Field(
        description="Total results per page", default=MAIL_SERVER_PAGE_SIZE
    )
    results: List[MailServer] = Field(description="List of results")
