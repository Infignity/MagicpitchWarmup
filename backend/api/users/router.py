import json.decoder
from typing import Union

from fastapi import APIRouter, Depends, Request, Response, status, Path, Query

from api.auth import bcrypt_context, get_current_user, API_USER_TYPE
from api.auth.response_schemas import AuthorizationError
from api.users.schemas import AutoResponder
from api.utils.decorators import auth_decorators
from api.users.models import User
from api.users.request_schemas import CreateUserRequest
from api.users.response_schemas import UserResponse, CreateUserSuccess, CreateUserError
from api.response_schemas import ResourceNotFound
from api import app_config


users_router = APIRouter(prefix="/users")


@users_router.post(
    "",
    tags=["Users"],
    summary="Create new User",
    description="Registers a new user to the database",
    responses={
        status.HTTP_201_CREATED: {"model": CreateUserSuccess},
        status.HTTP_400_BAD_REQUEST: {"model": CreateUserError},
        status.HTTP_401_UNAUTHORIZED: {"model": AuthorizationError},
    },
)
async def create_user(
    request: Request,
    response: Response,
    create_user_request: CreateUserRequest,
    user: API_USER_TYPE = Depends(get_current_user),
):
    """Register a new user"""

    response.status_code = status.HTTP_400_BAD_REQUEST
    # Check access code
    if create_user_request.access_code != app_config.ACCESS_CODE:
        return CreateUserError(description="Invalid access code")

    # Check if user & email already exists
    for field, value in {
        "username": create_user_request.username,
        "email": create_user_request.email,
    }.items():
        result = await User.find({field: value}).first_or_none()
        if result:
            return CreateUserError(
                description=f"User with {field} '{value}' already exists"
            )

    hashed_password = bcrypt_context.hash(create_user_request.password)
    new_user = User(
        email=create_user_request.email,
        password=hashed_password,
        username=create_user_request.username,
        fullname=create_user_request.fullname,
    )

    user_model_result = UserResponse.model_validate(new_user.model_dump(by_alias=True))

    await new_user.create()

    response.status_code = status.HTTP_201_CREATED
    return CreateUserSuccess(user=user_model_result)


@users_router.get(
    "",
    tags=["Users"],
    summary="Get user",
    description="Get user details",
    responses={
        status.HTTP_401_UNAUTHORIZED: {"model": AuthorizationError},
        status.HTTP_200_OK: {"model": UserResponse},
    },
)
@auth_decorators.authorization_required
async def get_user(
    request: Request,
    response: Response,
    user: API_USER_TYPE = Depends(get_current_user),
):
    """Get the current user"""

    response.status_code = status.HTTP_200_OK
    raw_dict = user.model_dump(by_alias=True)

    return UserResponse(**raw_dict)
