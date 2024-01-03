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
from api.auth.response_schemas import AuthorizationError
from api.email_lists import EmailListType, PAGE_SIZE
from api.email_lists.request_schemas import DeleteEmailListsRequest
from beanie.odm.operators.find.comparison import In
from api.response_schemas import ResourceNotFound

from api.utils import validate_pydantic_object_ids
from api import app_config
from api.email_lists.response_schemas import (
    PaginatedEmailLists,
    EmailListImportSuccess,
    EmailListImportError,
    EmailListsDeleted,
    EmailListUpdated,
)
from api.email_lists.models import EmailList
from api.utils.decorators import auth_decorators
from api.email_lists.schemas import BasicEmailList
from api.schemas import EmailDetails
from tempfile import TemporaryFile

email_list_router = APIRouter(prefix="/email-lists")


@email_list_router.post(
    "",
    tags=["Email Lists"],
    summary="Import emails from csv file",
    description="Import emails from csv file, csv file must have email and password columns, password column can be empty if listType is set to clientEmails.",
    responses={
        status.HTTP_201_CREATED: {"model": EmailListImportSuccess},
        status.HTTP_401_UNAUTHORIZED: {"model": AuthorizationError},
        status.HTTP_400_BAD_REQUEST: {"model": EmailListImportError},
    },
)
@auth_decorators.authorization_required
async def import_emails(
    request: Request,
    response: Response,
    user: API_USER_TYPE = Depends(get_current_user),
    list_type: EmailListType = Form(description="Email list type", alias="listType"),
    file: UploadFile = Form(description="File containing emails"),
    name: str = Form(description="Name of email list"),
):
    """Import emails from csv file"""

    response.status_code = status.HTTP_400_BAD_REQUEST
    if file.content_type != "text/csv":
        return EmailListImportError(description="File Content type must be 'text/csv'")

    if await EmailList.find(EmailList.name == name, EmailList.user_id == user.id).first_or_none():
        return EmailListImportError(
            description=f"An email list already has name `{name}`, please enter another name"
        )
    csv_content = await file.read()

    if not csv_content:
        response.status_code = status.HTTP_400_BAD_REQUEST
        return EmailListImportError(description="File name cannot be empty")

    random_name = generate_random_string(length=12, include_chars=False)
    user_id_str = str(user.id)
    new_upload_dir = app_config.create_path(
        os.path.join(app_config.USER_FILES_DIR, user_id_str), allow_absolute=True
    )

    full_file_path = os.path.join(new_upload_dir, f"{random_name}.csv")

    file_encoding = chardet.detect(csv_content)["encoding"]
    with open(full_file_path, file.file.mode) as upload_f:
        upload_f.write(csv_content)

    df = pandas.read_csv(full_file_path, encoding=file_encoding)

    df_columns = df.columns.to_list()

    if "email" and "password" not in df_columns:
        os.remove(full_file_path)
        return EmailListImportError(
            description=f"Csv file must contain 'email' and 'password' columns ",
            input=df_columns,
        )

    if not df["email"].notna().all():
        os.remove(full_file_path)
        return EmailListImportError(
            description=f"Not all rows in file `{file.filename}` have a valid email"
        )

    if not df["password"].notna().all() and list_type == "replyEmails":
        os.remove(full_file_path)
        return EmailListImportError(
            description=f"Not all rows in file `{file.filename}` have a valid password. Since this list is replyEmails, all rows must have a valid password."
        )

    df = df.fillna("")

    new_list = EmailList(
        emails=[
            EmailDetails(email=record["email"], password=record["password"])
            for record in df.to_dict(orient="records")
        ],
        name=name,
        email_list_type=list_type,
        user_id=user.id,
        url=f"/files/{user_id_str}/{random_name}.csv",
    )

    email_list_details = BasicEmailList(
        id=new_list.id,
        name=new_list.name,
        total_emails=len(new_list.emails),
        created_at=new_list.created_at,
        last_modified=new_list.last_modified,
        email_list_type=new_list.email_list_type,
        user_id=new_list.user_id,
        url=new_list.url,
    )

    await new_list.create()
    response.status_code = status.HTTP_201_CREATED

    return EmailListImportSuccess(email_list=email_list_details)


@email_list_router.get(
    "",
    tags=["Email Lists"],
    summary="Get all email lists",
    description="Get all email lists, user can also download them",
    responses={
        status.HTTP_200_OK: {"model": PaginatedEmailLists},
        status.HTTP_401_UNAUTHORIZED: {"model": AuthorizationError},
    },
)
@auth_decorators.authorization_required
async def get_all_email_lists(
    request: Request,
    response: Response,
    user: API_USER_TYPE = Depends(get_current_user),
    list_type: Optional[Literal["replyEmails", "clientEmails"]] = Query(
        description="Type of email list, leave empty to return all",
        default=None,
        alias="listType",
    ),
    index: int = Query(
        ge=0,
        description="Start index of paginated results",
        le=1000,
        default=0,
    ),
    name: Optional[str] = Query(description="Search by email list name", default=None),
):
    """Get all email lists"""

    search_params = {"userId": user.id}
    if name:
        search_params["name"] = {"$regex": rf"^{name}", "$options": "i"}

    if list_type in ["replyEmails", "clientEmails"]:
        search_params["emailListType"] = list_type

    res = EmailList.find(search_params)

    total_email_lists = await res.count()
    email_lists = [
        BasicEmailList(
            id=email_list.id,
            name=email_list.name,
            total_emails=len(email_list.emails),
            created_at=email_list.created_at,
            last_modified=email_list.last_modified,
            email_list_type=email_list.email_list_type,
            user_id=email_list.user_id,
            url=email_list.url,
        )
        for email_list in await res.skip(index).limit(PAGE_SIZE).to_list()
    ]

    response.status = status.HTTP_200_OK

    return PaginatedEmailLists(
        total_email_lists=total_email_lists, email_lists=email_lists
    )


@email_list_router.post(
    "/delete",
    tags=["Email Lists"],
    summary="Delete Email Lists",
    description="Delete multiple email lists by specifying a list of email list ids",
    responses={
        status.HTTP_200_OK: {"model": EmailListsDeleted},
        status.HTTP_401_UNAUTHORIZED: {"model": AuthorizationError},
    },
)
@auth_decorators.authorization_required
async def delete_email_lists(
    request: Request,
    response: Response,
    user: API_USER_TYPE = Depends(get_current_user),
    delete_request: DeleteEmailListsRequest = Body(description="Delete request body"),
):
    """Delete email lists"""

    find_result = EmailList.find(
        EmailList.user_id == user.id,
        In(EmailList.id, validate_pydantic_object_ids(delete_request.email_list_ids)),
    )

    target_user_email_lists = await find_result.to_list()

    for email_list in target_user_email_lists:
        path_without_url = email_list.url.replace("/files/", "")
        file_full_path = os.path.join(app_config.USER_FILES_DIR, path_without_url)

        if os.path.exists(file_full_path):
            os.remove(file_full_path)

    delete_result = await find_result.delete()

    response.status_code = status.HTTP_200_OK
    return EmailListsDeleted(total_email_lists_deleted=delete_result.deleted_count)


@email_list_router.put(
    "/{email_list_id}",
    tags=["Email Lists"],
    summary="Update email list",
    description="Add more emails or replace an entire email list",
    responses={
        status.HTTP_200_OK: {"model": EmailListUpdated},
        status.HTTP_401_UNAUTHORIZED: {"model": AuthorizationError},
        status.HTTP_404_NOT_FOUND: {"model": ResourceNotFound},
        status.HTTP_400_BAD_REQUEST: {"model": EmailListImportError},
    },
)
@auth_decorators.authorization_required
async def update_email_list(
    request: Request,
    response: Response,
    user: API_USER_TYPE = Depends(get_current_user),
    email_list_id: str = Path(descripiton="Id of email list to update"),
    update_type: Literal["merge", "replace", "mergeOverwrite"] = Form(
        description="Merge will join the emails \
			uploaded to the ones this list already has. \
			Replace will clear already existing emails \
			and use the ones from this file. \
			mergeOverwrite will merge both emails and \
			overwrite duplicates with the values from new list",
        alias="updateType",
        default="merge",
    ),
    file: Optional[UploadFile] = Form(
        description="File containing emails", default=None
    ),
    name: Optional[str] = Form(description="Name of email list", default=None),
):
    """Update email list"""

    target_email_list = await EmailList.find(
        EmailList.user_id == user.id,
        EmailList.id == validate_pydantic_object_ids(email_list_id),
    ).first_or_none()
    if not target_email_list:
        response.status_code = status.HTTP_404_NOT_FOUND
        return ResourceNotFound(
            message="Invalid email list id",
            description="Sorry, there is no email list with this id",
            resource_type="emailList",
        )
    updated_rows = 0
    resulting_df: Optional[pandas.DataFrame] = None

    if name:
        if (
            await EmailList.find(EmailList.name == name).first_or_none()
            and target_email_list.name != name
        ):
            return EmailListImportError(
                description=f"An email list already has name `{name}`, please enter another name"
            )

    if file:
        response.status_code = status.HTTP_400_BAD_REQUEST

        if file.content_type != "text/csv":
            return EmailListImportError(
                description="File Content type must be 'text/csv'"
            )
        csv_content = await file.read()
        if not csv_content:
            response.status_code = status.HTTP_400_BAD_REQUEST
            return EmailListImportError(description="File cannot be empty")
        path_without_url = target_email_list.url.replace("/files/", "")
        target_email_list_file_path = os.path.join(
            app_config.USER_FILES_DIR, path_without_url
        )
        
        random_filename = (
            generate_random_string(length=12, include_chars=False) + ".csv"
        )
        
    
        with TemporaryFile(mode="rb+", suffix=".csv") as upload_f:
            upload_f.write(csv_content)
            upload_f.seek(0)
            
            if os.path.exists(target_email_list_file_path):
                file_encoding = chardet.detect(csv_content)["encoding"]
                
                update_df = pandas.read_csv(upload_f, encoding=file_encoding)
                update_df_columns = update_df.columns.to_list()

                if "email" and "password" not in update_df_columns:
                    return EmailListImportError(
                        description=f"Csv file must contain 'email' and 'password' columns ",
                        input=update_df_columns,
                    )
                if not update_df["email"].notna().all():
                    return EmailListImportError(
                        description=f"Not all rows in file `{file.filename}` have a valid email"
                    )
                if (
                    not update_df["password"].notna().all()
                    and target_email_list.email_list_type == "replyEmails"
                ):
                    return EmailListImportError(
                        description=f"Not all rows in file `{file.filename}` have a valid password. Since this list is replyEmails, all rows must have a valid password."
                    )
                update_df = update_df.fillna("")
                original_df = pandas.read_csv(target_email_list_file_path)
                original_df = original_df.fillna("")
                if update_type in ["mergeOverwrite", "merge"]:
                    # Calaulate difference - Rows from update_df that are not in original_df

                    if update_type == "merge":
                        df_diff = update_df[
                            ~(update_df["email"].isin(original_df["email"]))
                        ].reset_index(drop=True)
                        # Add only new rows without overwriting already existing ones
                        resulting_df = pandas.concat(
                            [original_df, df_diff], ignore_index=True
                        )

                    else:
                        # Add rows and overwrite already existing ones with updated password
                        merged_df = pandas.merge(
                            update_df, original_df, how="outer", on=["email", "password"]
                        )
                        resulting_df = merged_df.drop_duplicates(
                            keep="first", subset=["email"]
                        )

                elif update_type == "replace":
                    # Replace all rows
                    resulting_df = update_df.copy(deep=True)

    is_modified = False
    if name:
        target_email_list.name = name
        is_modified = True

    if resulting_df is not None:
        target_email_list.emails = [
            EmailDetails(email=record["email"], password=record["password"])
            for record in resulting_df.to_dict(orient="records")
        ]
        resulting_df.to_csv(target_email_list_file_path, index=False)
        is_modified = True

    if is_modified:
        target_email_list.last_modified = datetime.now()

    await target_email_list.save_changes()

    response.status_code = status.HTTP_200_OK
    return EmailListUpdated()
