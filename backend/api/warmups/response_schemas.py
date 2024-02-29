from api.schemas import CustomSchemaWithConfig, PaginatedSearchResults
from typing import List, Literal
from api.warmups.schemas import WarmupResult
from api.warmups import WARMUPS_PER_PAGE
from pydantic import Field


class CreateWarmupSuccess(CustomSchemaWithConfig):
    message: str = Field(default="Warmup created")
    description: str = Field(default="Warmup has been successfully created")
    warmup: WarmupResult = Field(description="Information about new warmup")


class CreateWarmupError(CustomSchemaWithConfig):
    message: str = Field(
        description="Title about error", default="Failed creating warmup"
    )
    description: str = Field(
        description="Detailed info about failure",
        default="An error occured while creating the warmup",
    )


class WarmupSearchResult(PaginatedSearchResults):
    page_size: int = Field(
        description="Total results per page", default=WARMUPS_PER_PAGE
    )
    results: List[WarmupResult] = Field(description="List of results")


class WarmupsUpdated(CustomSchemaWithConfig):
    message: str = Field(default="Warmups Updated successfully")
    description: str = Field(default="Warmups updated successfully.")
    update_count: int = Field(description="Total number of warmups updated")


class WarmupsDeleted(CustomSchemaWithConfig):
    message: str = Field(default="Warmups deleted successfully")
    description: str = Field(default="Warmups deleted successfully.")
    delete_count: int = Field(description="Total number of warmups deleted")
