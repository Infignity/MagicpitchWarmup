""" This file contains utility functions for managing user and admin authentication """


from typing import Annotated, Union, Tuple
from uuid import uuid4
import random
import string
from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from jose.exceptions import ExpiredSignatureError
from passlib.context import CryptContext

from api import app_config
from api.users.models import User

bcrypt_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_bearer = OAuth2PasswordBearer(
    auto_error=False, tokenUrl=app_config.VERSION_PREFIX + "/auth/token"
)

API_USER_TYPE = Union[str, None, User]


async def get_current_user(
    token: Annotated[Union[str, None], Depends(oauth2_bearer)]
) -> API_USER_TYPE:
    response = None
    try:
        payload = jwt.decode(
            token, str(app_config.SECRET_KEY), algorithms=[app_config.ALGORITHM]
        )
        # username: str = payload.get("sub")
        user_id: str = payload.get("id")

        user = await User.get(user_id)
        if user is not None:
            response = user

    except JWTError as e:
        pass

    except AttributeError:
        pass

    except ExpiredSignatureError:
        response = "EXPIRED"

    return response


async def authenticate_user(username: str, password: str) -> Union[bool, User]:
    """Authenticates a user"""

    user = await User.find(User.username == username).first_or_none()
    response = False
    if user is not None:
        if bcrypt_context.verify(password, user.password):
            response = user
    return response


def generate_uid() -> str:
    """Generates a random unique identifier string"""
    return uuid4().hex


def generate_random_string(length=16, include_chars=True):
    """Generates a random password"""
    characters = string.ascii_letters + string.digits
    if include_chars:
        characters = characters + string.punctuation
    password = "".join(random.choice(characters) for i in range(length))
    return password
