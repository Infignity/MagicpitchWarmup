from pydantic import Field
from api.mail_servers.schemas import (
    MailServerConnectionDetails,
    MailServerSecurityProtocol,
)
from api.schemas import CustomSchemaWithConfig
from typing import List, Literal, Optional


class NewMailServerRequest(CustomSchemaWithConfig):
    name: str = Field(description="Name of mail server", default="New mail server")
    # imap_details: MailServerConnectionDetails = Field(description = "Imap details for connecting this mailserver...")
    smtp_details: MailServerConnectionDetails = Field(
        description="Smtp details for connecting this mailserver..."
    )


class UpdateMailServerRequest(CustomSchemaWithConfig):
    name: str = Field(description="Name of mail server", default="New mail server")
    # imap_details: MailServerConnectionDetails = Field(description = "Imap details for connecting this mailserver...")
    smtp_details: MailServerConnectionDetails = Field(
        description="Smtp details for connecting this mailserver..."
    )


class DeleteMailServersRequest(CustomSchemaWithConfig):
    mail_server_ids: List[str] = Field(description="List of mail server ids to delete")


class MailServerVerificationRequest(CustomSchemaWithConfig):
    hostname: str = Field(description="Hostname of server")
    port: int = Field(description="Server port")
    email: str = Field(description="Email address")
    password: str = Field(description="Server passwords")
    security: MailServerSecurityProtocol = Field(description="Server security protocol")
    verification_type: Literal["smtp", "imap"] = Field(
        description="Verification type", default="smtp"
    )
    recipient_email: Optional[str] = Field(
        description="Email address of recipient, this is used to send verification email when testing smtp",
        default=None,
    )
