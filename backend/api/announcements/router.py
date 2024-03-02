""" This module contains code for CRUD on emails """

from beanie import PydanticObjectId
from fastapi import (
    APIRouter,
    Body,
    Path,
    Request,
    Depends,
    Form,
    Response,
    status,
    UploadFile,
    Query,
)
from typing import Optional, Union, Literal
import pandas
import os
from datetime import datetime
import chardet
from api.auth import API_USER_TYPE, generate_random_string, get_current_user
from api.auth.response_schemas import AuthorizationError, AnnouncementsDeleted
from api.announcements.request_schemas import DeleteAnnouncementRequest, NewAnnouncementRequest
from beanie.odm.operators.find.comparison import In
from api.response_schemas import ResourceNotFound

from api.utils import validate_pydantic_object_ids
from api import app_config
from api.announcements.models import Announcement
from api.utils.decorators import auth_decorators
from tempfile import TemporaryFile

announcements_router = APIRouter(prefix="/announcements")


@announcements_router.post(
    "",
    tags=["Announcements"],
    summary="Add new announcement",
    description="Add a new announcement, note that only admin accounts can add , update and delete announcements, regular accounts can only see announcements",
    responses={
        status.HTTP_201_CREATED: {"model": Announcement},
        status.HTTP_401_UNAUTHORIZED: {"model": AuthorizationError}
    },
)
@auth_decorators.authorization_required
@auth_decorators.admin_only
async def import_emails(
    request: Request,
    response: Response,
    new_announcement_request: NewAnnouncementRequest,
    user: API_USER_TYPE = Depends(get_current_user),
):
    """ Add announcement """

    new_announcement = Announcement(
        message = new_announcement_request.message,
        details = new_announcement_request.details,
        priority = new_announcement_request.priority
    )

    response.status = status.HTTP_201_CREATED
    await new_announcement.create()
    return new_announcement

@announcements_router.get(
    "",
    tags=["Announcements"],
    summary="Get all announcements",
    description="Get all announcements - No pagination"
)
@auth_decorators.authorization_required
async def get_all_announcements(
    request: Request,
    response: Response,
    user: API_USER_TYPE = Depends(get_current_user)
) -> List[Announcement]:
    
    """ Get all announcements """

    response.status = status.HTTP_200_OK
    return await Announcement.find().to_list()


@announcements_router.post(
    "/delete",
    tags=["Anouncements"],
    summary="Delete announcements",
    description="Delete multiple announcements",
    responses={
        status.HTTP_200_OK: {"model": AnouncementsDeleted},
        status.HTTP_401_UNAUTHORIZED: {"model": AuthorizationError},
    },
)
@auth_decorators.authorization_required
@auth_decorators.admin_only
async def delete_email_lists(
    request: Request,
    response: Response,
    user: API_USER_TYPE = Depends(get_current_user),
    delete_request: DeleteAnnouncementRequest = Body(description="Delete request body"),
):
    """ Delete announcements """

    find_result = Announcement.find(
        In(Announcement.id, validate_pydantic_object_ids(delete_request.announcement_ids)),
    )
    delete_result = await find_result.delete()
    response.status_code = status.HTTP_200_OK
    
    return AnnouncementsDeleted(total_announcements_deleted=delete_result.deleted_count)
