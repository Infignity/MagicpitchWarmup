""" All view functions and their endpoints goes here """
import uuid
from beanie.odm.operators.find.comparison import In
from beanie.odm.operators.find.evaluation import RegEx
from beanie.odm.operators.update.general import Set
from typing import Optional, Union, Dict, List
from fastapi import APIRouter, Query, status, Request, Depends, Response, Body
from api.app_config import SCHEDULER_CLIENT_HOST, SCHEDULER_CLIENT_PORT
from api.auth.response_schemas import AuthorizationError
from api.warmups.request_schemas import UpdateWarmupStateRequest, DeleteWarmupRequest
from api.warmups.response_schemas import WarmupsDeleted, WarmupsUpdated
from api.utils.decorators import auth_decorators
from api.utils import validate_pydantic_object_ids
from api.auth import get_current_user, API_USER_TYPE
from beanie.odm.fields import PydanticObjectId
from api.warmups.request_schemas import CreateWarmUpRequest
from api.warmups.response_schemas import (
    CreateWarmupSuccess,
    CreateWarmupError,
    WarmupSearchResult,
)
from api.warmups import WARMUP_STATE, WARMUPS_PER_PAGE
from api.warmups.models import Warmup, WarmupDay
from api.mail_servers.models import MailServer
from api.email_lists.models import EmailList
from api.warmups.schemas import WarmupResult
from rpyc.core.protocol import Connection
import rpyc

# from scheduler.main import add_warmup_job

warmup_router = APIRouter(prefix="/warmups")


async def refine_warmup(
    user_id: PydanticObjectId, input_wrms: Union[Warmup, List[Warmup]]
) -> Union[WarmupResult, List[WarmupResult]]:
    """Adds all extra field to make up warmup result"""

    if isinstance(input_wrms, Warmup):
        input_w = input_wrms.model_copy(deep=True)
        mail_server = await MailServer.find(
            MailServer.user_id == user_id,
            MailServer.id == validate_pydantic_object_ids(input_w.mailserver_id),
        ).first_or_none()
        client_email_list = await EmailList.find(
            EmailList.user_id == user_id,
            EmailList.id == validate_pydantic_object_ids(input_w.client_email_list_id),
        ).first_or_none()
        reply_email_list = await EmailList.find(
            EmailList.user_id == user_id,
            EmailList.id == validate_pydantic_object_ids(input_w.reply_email_list_id),
        ).first_or_none()
        total_warmup_days = await WarmupDay.find(
            WarmupDay.warmup_id == input_w.id
        ).count()
        refined = WarmupResult(
            id=input_w.id,
            name=input_w.name,
            created_at=input_w.created_at,
            started_at=input_w.started_at,
            state=input_w.state,
            mailserver_name=mail_server.name,
            client_email_list_name=client_email_list.name
            if client_email_list
            else None,
            reply_email_list_name=reply_email_list.name if reply_email_list else None,
            user_id=input_w.user_id,
            max_days=input_w.max_days,
            increase_rate=input_w.increase_rate,
            start_volume=input_w.start_volume,
            daily_send_limit=input_w.daily_send_limit,
            auto_responder_enabled=input_w.auto_responder_enabled,
            target_open_rate=input_w.target_open_rate,
            target_reply_rate=input_w.target_reply_rate,
            total_warmup_days=total_warmup_days,
            total_addresses_mailed=len(input_w.addresses_mailed),
            current_warmup_day=input_w.current_warmup_day,
            status_text=input_w.status_text,
        )
    elif isinstance(input_wrms, list):
        refined = []
        for input_w in input_wrms:
            mail_server = await MailServer.find(
                MailServer.user_id == user_id,
                MailServer.id == validate_pydantic_object_ids(input_w.mailserver_id),
            ).first_or_none()
            client_email_list = await EmailList.find(
                EmailList.user_id == user_id,
                EmailList.id
                == validate_pydantic_object_ids(input_w.client_email_list_id),
            ).first_or_none()
            reply_email_list = await EmailList.find(
                EmailList.user_id == user_id,
                EmailList.id
                == validate_pydantic_object_ids(input_w.reply_email_list_id),
            ).first_or_none()
            total_warmup_days = await WarmupDay.find(
                WarmupDay.warmup_id == input_w.id
            ).count()
            refined_w = WarmupResult(
                id=input_w.id,
                name=input_w.name,
                created_at=input_w.created_at,
                started_at=input_w.started_at,
                state=input_w.state,
                mailserver_name=mail_server.name,
                client_email_list_name=client_email_list.name
                if client_email_list
                else None,
                reply_email_list_name=reply_email_list.name
                if reply_email_list
                else None,
                user_id=input_w.user_id,
                max_days=input_w.max_days,
                increase_rate=input_w.increase_rate,
                start_volume=input_w.start_volume,
                daily_send_limit=input_w.daily_send_limit,
                auto_responder_enabled=input_w.auto_responder_enabled,
                target_open_rate=input_w.target_open_rate,
                target_reply_rate=input_w.target_reply_rate,
                total_warmup_days=total_warmup_days,
                total_addresses_mailed=len(input_w.addresses_mailed),
                current_warmup_day=input_w.current_warmup_day,
                status_text=input_w.status_text,
            )
            refined.append(refined_w)
    else:
        raise TypeError(
            f"Argument `input_w` must be of type Union[Warmup, List[Warmup]] not {type(input_w)}"
        )

    return refined


@warmup_router.post(
    "",
    tags=["Warmups"],
    summary="New warmup",
    description="Create a new warmup",
    responses={
        status.HTTP_201_CREATED: {"model": CreateWarmupSuccess},
        status.HTTP_401_UNAUTHORIZED: {"model": AuthorizationError},
        status.HTTP_400_BAD_REQUEST: {"model": CreateWarmupError},
    },
)
@auth_decorators.authorization_required
async def create_warmup(
    request: Request,
    response: Response,
    user: API_USER_TYPE = Depends(get_current_user),
    new_warmup_request: CreateWarmUpRequest = Body(description="Warmup Request body"),
):
    """Create warmup"""

    response.status_code = status.HTTP_400_BAD_REQUEST

    if await Warmup.find(
        Warmup.name == new_warmup_request.name, Warmup.user_id == user.id
    ).first_or_none():
        return CreateWarmupError(
            description=f"A warmup exists with name `{new_warmup_request.name}`"
        )

    mail_server = await MailServer.find(
        MailServer.user_id == user.id,
        MailServer.id == validate_pydantic_object_ids(new_warmup_request.mailserver_id),
    ).first_or_none()
    client_email_list = await EmailList.find(
        EmailList.user_id == user.id,
        EmailList.id
        == validate_pydantic_object_ids(new_warmup_request.client_email_list_id),
    ).first_or_none()
    reply_email_list = await EmailList.find(
        EmailList.user_id == user.id,
        EmailList.id
        == validate_pydantic_object_ids(new_warmup_request.reply_email_list_id),
    ).first_or_none()

    client_email_list_id, reply_email_list_id = None, None
    if client_email_list is not None:
        client_email_list_id = client_email_list.id
    if reply_email_list is not None:
        reply_email_list_id = reply_email_list.id

    if new_warmup_request.auto_responder_enabled and not reply_email_list:
        return CreateWarmupError(
            description=f"A valid `replyEmailListId` must be specified if the autoresponder is enabled otherwise set `autoresponderEnabled` to false"
        )
    elif not new_warmup_request.auto_responder_enabled and not client_email_list:
        return CreateWarmupError(
            description=f"A valid `clientEmailListId` must be specified if the autoresponder is disabled otherwise set `autoresponderEnabled` to true"
        )
    if not mail_server:
        return CreateWarmupError(
            description=f"A valid `mailserverId` must be specified"
        )

    new_warmup = Warmup(
        name=new_warmup_request.name,
        mailserver_id=mail_server.id,
        client_email_list_id=client_email_list_id,
        reply_email_list_id=reply_email_list_id,
        user_id=user.id,
        max_days=new_warmup_request.max_days,
        increase_rate=new_warmup_request.increase_rate,
        start_volume=new_warmup_request.start_volume,
        daily_send_limit=new_warmup_request.daily_send_limit,
        auto_responder_enabled=new_warmup_request.auto_responder_enabled,
        target_open_rate=new_warmup_request.target_open_rate,
        target_reply_rate=new_warmup_request.target_reply_rate,
    )

    total_warmup_days = await WarmupDay.find(
        WarmupDay.warmup_id == new_warmup.id
    ).count()

    new_warmup_result = WarmupResult(
        id=new_warmup.id,
        name=new_warmup.name,
        created_at=new_warmup.created_at,
        started_at=new_warmup.started_at,
        state=new_warmup.state,
        mailserver_name=mail_server.name,
        client_email_list_name=client_email_list.name if client_email_list else None,
        reply_email_list_name=reply_email_list.name if reply_email_list else None,
        user_id=new_warmup.user_id,
        max_days=new_warmup.max_days,
        increase_rate=new_warmup.increase_rate,
        start_volume=new_warmup.start_volume,
        daily_send_limit=new_warmup.daily_send_limit,
        auto_responder_enabled=new_warmup.auto_responder_enabled,
        target_open_rate=new_warmup.target_open_rate,
        target_reply_rate=new_warmup.target_reply_rate,
        total_warmup_days=total_warmup_days,
        total_addresses_mailed=len(new_warmup.addresses_mailed),
        current_warmup_day=new_warmup.current_warmup_day,
        status_text=new_warmup.status_text,
    )

    await new_warmup.create()
    
    try:
        scheduler_conn: Connection = rpyc.connect(
            SCHEDULER_CLIENT_HOST, SCHEDULER_CLIENT_PORT
        )
        job = scheduler_conn.root.add_job(new_warmup.model_dump_json(by_alias=True))
        print("JOB : ", job)
    except ConnectionRefusedError:
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return CreateWarmupError(
            message="An error occured in our server",
            description="Sorry, we could not complete your requset.",
        )

    response.status_code = status.HTTP_201_CREATED
    return CreateWarmupSuccess(warmup=new_warmup_result)


@warmup_router.get(
    "",
    tags=["Warmups"],
    summary="Search warmups",
    description="Search all warmups. Note that results are paginated",
    responses={
        status.HTTP_200_OK: {"model": WarmupSearchResult},
        status.HTTP_401_UNAUTHORIZED: {"model": AuthorizationError},
    },
)
@auth_decorators.authorization_required
async def serch_warmups(
    request: Request,
    response: Response,
    user: API_USER_TYPE = Depends(get_current_user),
    index: int = Query(
        ge=0,
        description="Start index of paginated results",
        le=1000,
        default=0,
    ),
    name: Optional[str] = Query(description="Search by warmup name", default=None),
    state: Optional[WARMUP_STATE] = Query(
        description="Search by warmup state", default=None
    ),
):
    """Search warmups"""

    search_params = {"userId": user.id}
    if name:
        search_params["name"] = {"$regex": rf"^{name}", "$options": "i"}

    if state:
        search_params["state"] = state

    res = Warmup.find(search_params)
    total_results = await res.count()
    results = await res.skip(index).limit(WARMUPS_PER_PAGE).to_list()
    results = await refine_warmup(user.id, results)

    response.status_code = status.HTTP_200_OK
    return WarmupSearchResult(total_results=total_results, results=results, index=index)


@warmup_router.post(
    "/update-state",
    tags=["Warmups"],
    summary="Update warmups state",
    description="Update state of multiple warmups",
    responses={
        status.HTTP_200_OK: {"model": WarmupsUpdated},
        status.HTTP_401_UNAUTHORIZED: {"model": AuthorizationError},
    },
)
async def update_warmup_state(
    request: Request,
    response: Response,
    user: API_USER_TYPE = Depends(get_current_user),
    update_warmup_state_request: UpdateWarmupStateRequest = Body(
        description="Request body"
    ),
):
    """Update multiple warmup state"""

    _update_states = {"pause": "paused", "resume": "running"}

    res = await Warmup.find_many(
        Warmup.user_id == user.id,
        In(
            Warmup.id,
            validate_pydantic_object_ids(update_warmup_state_request.warmup_ids),
        ),
    ).update_many(
        Set({Warmup.state: _update_states[update_warmup_state_request.state]})
    )
    response.status_code = status.HTTP_200_OK
    return WarmupsUpdated(update_count=res.modified_count)


@warmup_router.post(
    "/delete",
    tags=["Warmups"],
    summary="Delete warmups",
    description="Delete multiple warmups",
    responses={
        status.HTTP_200_OK: {"model": WarmupsDeleted},
        status.HTTP_401_UNAUTHORIZED: {"model": AuthorizationError},
    },
)
async def delete_warmups(
    request: Request,
    response: Response,
    user: API_USER_TYPE = Depends(get_current_user),
    delete_warmup_request: DeleteWarmupRequest = Body(description="Request body"),
):
    """Delete multiple warmups"""

    res = await Warmup.find(
        Warmup.user_id == user.id,
        In(Warmup.id, validate_pydantic_object_ids(delete_warmup_request.warmup_ids)),
    ).delete()
    response.status_code = status.HTTP_200_OK
    return WarmupsUpdated(update_count=res.deleted_count)
