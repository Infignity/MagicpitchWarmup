"""  Main entrypoint of application """

from fastapi import FastAPI, Request, Response, status
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from fastapi.staticfiles import StaticFiles
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from api.response_schemas import CustomValidationErrorResponse

from api import app_config
from api.database import init_db
from api.security import limiter

from api.users.router import users_router
from api.warmups.router import warmup_router
from api.auth.router import auth_router
from api.email_lists.router import email_list_router
from api.mail_servers.router import mail_server_router
from api.announcements.router import announcements_router

from api.users.models import User
from api.warmups.models import Warmup, WarmupDay
from api.email_lists.models import EmailList
from api.mail_servers.models import MailServer
from api.announcements.models import Announcement


app = FastAPI(
    summary="Magicpitch Warmup Api",
    version=app_config.API_VERSION,
    description="""
		# Warmup
		Powerful WebApp to automate the process of warming up email servers.

		## Features
		* Automated workflow
		* Support for automatic image increase
		* Provides statistics about warmup status, Reply rate ... etc..
		* Support for automatic replies.
	""",
    title="WarmupApi",
    redoc_url="/",
    docs_url="/swagger",
    responses={
        status.HTTP_422_UNPROCESSABLE_ENTITY: {
            "description": "Validation Error",
            "model": CustomValidationErrorResponse,
        }
    },
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/files", StaticFiles(directory="files/user_data"), name="files")

# Used for rate limiting ..
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Add routers
app.include_router(users_router, prefix=app_config.VERSION_PREFIX)
app.include_router(warmup_router, prefix=app_config.VERSION_PREFIX)
app.include_router(auth_router, prefix=app_config.VERSION_PREFIX)
app.include_router(email_list_router, prefix=app_config.VERSION_PREFIX)
app.include_router(mail_server_router, prefix=app_config.VERSION_PREFIX)
app.include_router(announcements_router, prefix=app_config.VERSION_PREFIX)

# Models to initialize
MODELS = [User, EmailList, MailServer, WarmupDay, Warmup, Announcement]


@app.on_event("startup")
async def start_db():
    """Initializes the database"""
    await init_db(MODELS)


@app.exception_handler(RequestValidationError)
async def request_validation_exception_handler(
    request: Request, exc: RequestValidationError
) -> JSONResponse:
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "message": "Request Body Validation Error",
            "description": "There is atleast one validation error in your request body",
            "detail": jsonable_encoder(exc.errors(), exclude={"url", "type"}),
        },
    )


@app.exception_handler(status.HTTP_404_NOT_FOUND)
async def not_found(request: Request, exc) -> JSONResponse:
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "message": "Not found",
            "description": "Sorry the requested resource was not found :(",
        },
    )
