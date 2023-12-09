from api.app_config import simple_pydantic_model_config, to_camel_case
from pydantic import BaseModel, Field, ConfigDict
from typing import Dict, Optional


class CustomSchemaWithConfig(BaseModel):
    """Custom schema with configurations , other schemas and models can inherit from this class"""

    model_config = simple_pydantic_model_config


class PaginatedSearchResults(CustomSchemaWithConfig):
    page_size: int = Field(description="Total results per page", default=20)
    index: int = Field(description="Current result index", default=0)
    total_results: int = Field(description="Total results", default=0)
    query: Dict = Field(description="Search query that was executed", default={})


class BaseGenericResponse(BaseModel):
    model_config = ConfigDict(
        str_strip_whitespace=True,
        use_enum_values=True,
        alias_generator=to_camel_case,
        populate_by_name=True,
        extra="allow",
    )

    message: str = Field(description="Title of response")
    description: str = Field(description="Information about response")


class EmailDetails(CustomSchemaWithConfig):
    email: str = Field(description="Email Address")
    password: Optional[str] = Field(
        description="Password to email account", default=None
    )
