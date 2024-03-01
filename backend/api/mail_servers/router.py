import smtplib
import imaplib
from typing import Literal, Optional
from fastapi import APIRouter, Body, Depends, status, Request, Path, Query, Response
from api.auth import get_current_user, API_USER_TYPE
from api.email_lists.response_schemas import EmailListUpdated
from api.mail_servers import MAIL_SERVER_PAGE_SIZE
from api.mail_servers.request_schemas import (
    DeleteMailServersRequest,
    MailServerVerificationRequest,
    NewMailServerRequest,
    
    UpdateMailServerRequest,
)
from api.app_config import current_utc_timestamp
from api.mail_servers.response_schemas import (
    AddMailserverError,
    AddMailserverSuccess,
    MailServerVerificationStatus,
    MailserverSearchResult,
    MailserverUpdated,
    MailserversDeleted,
)
from api.utils import validate_pydantic_object_ids
from api.utils.decorators import auth_decorators
from datetime import datetime
from api.mail_servers.models import MailServer
from api.auth.response_schemas import AuthorizationError
from api.response_schemas import InvalidRequestBody, ResourceNotFound
from beanie.odm.operators.find.comparison import In

from api.utils.mail import test_imap_server, test_smtp_server

mail_server_router = APIRouter(prefix="/mailservers")


@mail_server_router.post(
    "",
    tags=["Mail Servers"],
    summary="Add mailserver",
    description="Add new mailsever. Please use /mailservers/verify to validate details before sending to this api.",
    responses={
        status.HTTP_201_CREATED: {"model": AddMailserverSuccess},
        status.HTTP_401_UNAUTHORIZED: {"model": AuthorizationError},
        status.HTTP_400_BAD_REQUEST: {"model": AddMailserverError},
    },
)
@auth_decorators.authorization_required
async def add_new_mailserver(
    request: Request,
    response: Response,
    user: API_USER_TYPE = Depends(get_current_user),
    new_mail_server_request: NewMailServerRequest = Body(
        description="Request body for new mail server"
    ),
):
    """Add new mail server"""

    response.status_code = status.HTTP_400_BAD_REQUEST
    if await MailServer.find(
        MailServer.name == new_mail_server_request.name
    ).first_or_none():
        return AddMailserverError(
            description=f"An email list already has name `{new_mail_server_request.name}`, please enter another name"
        )

    new_mail_server = MailServer(
        name=new_mail_server_request.name,
        user_id=user.id,
        # imap_details = new_mail_server_request.imap_details,
        smtp_details=new_mail_server_request.smtp_details,
    )

    response.status_code = status.HTTP_201_CREATED
    await new_mail_server.create()
    return AddMailserverSuccess(mail_server=new_mail_server)


@mail_server_router.get(
    "",
    tags=["Mail Servers"],
    summary="Get all mailservers",
    description="Get all mailservers. Note that results are paginated",
    responses={
        status.HTTP_200_OK: {"model": MailserverSearchResult},
        status.HTTP_401_UNAUTHORIZED: {"model": AuthorizationError},
    },
)
@auth_decorators.authorization_required
async def get_all_mail_servers(
    request: Request,
    response: Response,
    user: API_USER_TYPE = Depends(get_current_user),
    index: int = Query(
        ge=0,
        description="Start index of paginated results",
        le=1000,
        default=0,
    ),
    name: Optional[str] = Query(description="Search by mailserver name", default=None),
):
    """Search mail servers"""

    search_params = {"userId": user.id}
    if name:
        search_params["name"] = {"$regex": rf"^{name}", "$options": "i"}

    res = MailServer.find(search_params)
    total_mail_servers = await res.count()
    results = await res.skip(index).limit(MAIL_SERVER_PAGE_SIZE).to_list()

    response.status_code = status.HTTP_200_OK
    return MailserverSearchResult(
        total_results=total_mail_servers, results=results, index=index
    )


@mail_server_router.post(
    "/delete",
    tags=["Mail Servers"],
    summary="Delete Mailservers",
    description="Delete multiple mail servers by specifying a list of mailserver ids",
    responses={
        status.HTTP_200_OK: {"model": MailserversDeleted},
        status.HTTP_401_UNAUTHORIZED: {"model": AuthorizationError},
    },
)
@auth_decorators.authorization_required
async def delete_mail_servers(
    request: Request,
    response: Response,
    user: API_USER_TYPE = Depends(get_current_user),
    delete_request: DeleteMailServersRequest = Body(description="Delete request body"),
):
    """Delete mailservers"""

    delete_result = await MailServer.find(
        MailServer.user_id == user.id,
        In(MailServer.id, validate_pydantic_object_ids(delete_request.mail_server_ids)),
    ).delete()

    response.status_code = status.HTTP_200_OK
    return MailserversDeleted(total_mailservers_deleted=delete_result.deleted_count)


@mail_server_router.put(
    "/{mail_server_id}",
    tags=["Mail Servers"],
    summary="Update Mailserver",
    description="Update single mailserver",
    responses={
        status.HTTP_200_OK: {"model": MailserverUpdated},
        status.HTTP_401_UNAUTHORIZED: {"model": AuthorizationError},
        status.HTTP_404_NOT_FOUND: {"model": ResourceNotFound},
        status.HTTP_400_BAD_REQUEST: {"model": AddMailserverError},
    },
)
@auth_decorators.authorization_required
async def delete_mail_servers(
    request: Request,
    response: Response,
    user: API_USER_TYPE = Depends(get_current_user),
    mail_server_id: str = Path(descripiton="Id of mailserver to update"),
    update_request: UpdateMailServerRequest = Body(description="Update request body"),
):
    """Update mailserver"""

    target_mail_server = await MailServer.find(
        MailServer.user_id == user.id,
        MailServer.id == validate_pydantic_object_ids(mail_server_id),
    ).first_or_none()
    if not target_mail_server:
        response.status_code = status.HTTP_404_NOT_FOUND
        return ResourceNotFound(
            message="Invalid mailserver id",
            description="Sorry, there is no mailserver with this id",
            resource_type="mailServer",
        )

    if (
        await MailServer.find(MailServer.name == update_request.name).first_or_none()
        and target_mail_server.name != update_request.name
    ):
        response.status_code = status.HTTP_400_BAD_REQUEST
        return AddMailserverError(
            description=f"A mailserver already has name `{update_request.name}`, please enter another name"
        )

    target_mail_server.name = update_request.name
    # target_mail_server.imap_details = update_request.imap_details
    target_mail_server.smtp_details = update_request.smtp_details
    target_mail_server.last_modified = current_utc_timestamp()

    await target_mail_server.save_changes()

    response.status_code = status.HTTP_200_OK
    return MailserverUpdated()


@mail_server_router.post(
    "/verify",
    tags=["Mail Servers"],
    summary="Verify Mailserver",
    description="Verify mailserver details - smtp/imap - No authorization required",
    responses={
        status.HTTP_200_OK: {"model": MailServerVerificationStatus},
        status.HTTP_400_BAD_REQUEST: {"model": InvalidRequestBody},
    },
)
async def verify_mail_server_details(
    request: Request,
    response: Response,
    verification_request: MailServerVerificationRequest = Body(
        description="Request body of verification"
    ),
):
    """Verify mailserver details"""

    message = ""
    description = ""
    verification_status = ""

    if verification_request.verification_type == "smtp":
        if not verification_request.recipient_email:
            response.status_code = status.HTTP_400_BAD_REQUEST
            return InvalidRequestBody(
                description="Field `recipientEmail` must be specified when verificationType is set to `smtp`"
            )
        _description, verification_status = test_smtp_server(
            hostname=verification_request.hostname,
            port=verification_request.port,
            email=verification_request.email,
            security=verification_request.security,
            to_email=verification_request.recipient_email,
            password=verification_request.password,
        )

        if verification_status != "success":
            message = "Verification failed"
            description = f"Sorry, we could'nt complete the verification, check your credentials | {_description}"
        else:
            message = "Verification success"
            description = (
                "Verification successful, you can now send emails with this mailserver"
            )
    # else:
    # 	_description, verification_status = test_imap_server(
    # 		hostname=verification_request.hostname,
    # 		port=verification_request.port,
    # 		email=verification_request.email,
    # 		security=verification_request.security,
    # 		password=verification_request.password
    # 	)

    # 	if verification_status != "success":
    # 		message = "Verification failed"
    # 		description = f"Sorry, we could'nt complete the verification, check your credentials | {_description}"
    # 	else:
    # 		message = "Verification success"
    # 		description = "Imap server verification successful"

    response.status_code = status.HTTP_200_OK
    return MailServerVerificationStatus(
        message=message,
        description=description,
        verification_type=verification_request.verification_type,
        verification_status=verification_status,
    )
