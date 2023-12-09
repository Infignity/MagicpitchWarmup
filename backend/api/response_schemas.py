from pydantic import BaseModel, ConfigDict, Field
from api.schemas import CustomSchemaWithConfig
from typing import Literal, List, Union


class ResourceNotFound(CustomSchemaWithConfig):
    message: str = Field(description="Short Title")
    description: str = Field(description="Description")
    resource_type: Literal["emailList", "user", "mailServer", "warmup"] = Field(
        description="Type of resource"
    )


class InvalidRequestBody(CustomSchemaWithConfig):
    message: str = Field(description="Title", default="Error in request body")
    description: str = Field(description="Detailed info about error in request")


class CustomValidationErrorDetails(CustomSchemaWithConfig):
    loc: List[Union[int, str]] = Field(...)
    msg: str = Field(...)


class CustomValidationErrorResponse(CustomSchemaWithConfig):
    message: str = Field(description="Title", default="Validation Error")
    description: str = Field(
        description="Error details",
        default="There is atleast one validation error in your request body",
    )
    detail: List[CustomValidationErrorDetails] = Field(
        descripton="Array of objects", default=[]
    )
