""" Create and validate access tokens """
from datetime import timedelta, datetime
from typing import Annotated

from beanie import PydanticObjectId
from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from jose import jwt
from starlette import status
from starlette.requests import Request
from starlette.responses import Response

from api import app_config
from api.auth import authenticate_user
from api.auth.schemas import Token
from api.auth.response_schemas import AuthorizationError

auth_router = APIRouter(prefix="/auth")


def create_access_token(
    username: str, user_id: PydanticObjectId, expires_delta: timedelta
) -> str:
    """
    Create access token
    :param username: Username
    :param user_id: Unique identifier
    :param expires_delta: Expiration Timedelta
    :return: Access token
    """

    encode = {"sub": username, "id": str(user_id)}
    expires = datetime.utcnow() + expires_delta
    encode.update({"exp": expires})
    return jwt.encode(
        encode, str(app_config.SECRET_KEY), algorithm=app_config.ALGORITHM
    )


@auth_router.post(
    "/token",
    tags=["Authentication"],
    summary="Access Token",
    description="Login and generate access token",
    responses={status.HTTP_200_OK: {"model": Token}},
)
async def login_for_access_token(
    request: Request,
    response: Response,
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
):
    """Generate access token"""

    user = await authenticate_user(form_data.username, form_data.password)
    if not user:
        response.status_code = status.HTTP_401_UNAUTHORIZED
        return AuthorizationError(description="Unable to validate credentials")

    token = create_access_token(
        user.username, user.id, timedelta(seconds=app_config.ACCESS_TOKEN_EXPIRE_TIME)
    )
    return Token(access_token=token, token_type="bearer", user_id=user.id)
