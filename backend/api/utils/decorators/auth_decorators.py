from functools import wraps
from typing import Union, Callable

from starlette import status
from fastapi import Request, Response
from api.app_config import ALLOWED_IPS, ENVIRONMENT
from api.auth.response_schemas import AuthorizationError


def authorization_required(func):
    """Decorator to ensure that endpoint is login protected, use like this `@authorization_required` without parentheses"""

    @wraps(func)
    async def wrapper(*args, **kwargs):
        user = kwargs["user"]
        response = kwargs["response"]

        # Check if user is valid
        if user is None:
            response.status_code = status.HTTP_401_UNAUTHORIZED
            return AuthorizationError(
                description="Unable to validate user, check Bearer token"
            )
        return await func(*args, **kwargs)

    return wrapper


def ip_restricted(func):
    """Decorator to restrict access to only allowed ips defined in the ALLOWED_IPS env variable"""

    @wraps(func)
    async def wrapper(*args, **kwargs):
        request: Request = kwargs["request"]
        response: Response = kwargs["response"]

        if ENVIRONMENT == "production":
            client_ip_address = request.headers.get("x-forwarded-for")
            if client_ip_address:
                sp = client_ip_address.split(",", 1)
                if len(sp):
                    client_ip_address = sp[0].strip()
            # Check if user's ip address is in ALLOWED_IPS list
            if client_ip_address not in ALLOWED_IPS or "0.0.0.0" not in ALLOWED_IPS:
                response.status_code = status.HTTP_403_FORBIDDEN
                return {
                    "message": "Access Restricted",
                    "description": "Sorry, you do not have authority to access this resource :(",
                }
        return await func(*args, **kwargs)

    return wrapper
