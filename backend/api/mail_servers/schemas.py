""" Schemas for mail servers router """

from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Literal
from datetime import datetime
from api.schemas import CustomSchemaWithConfig


MailServerSecurityProtocol = Literal["ssl", "tls", "unsecure"]


class MailServerConnectionDetails(CustomSchemaWithConfig):
    hostname: str = Field(description="Hostname of server")
    port: int = Field(description="Server port")
    email: str = Field(description="Email address")
    password: str = Field(description="Server passwords")
    security: MailServerSecurityProtocol = Field(description="Server security protocol")
