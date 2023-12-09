from uuid import uuid4
import pathlib
from typing import Union
import os
from typing import List, Union
from beanie.odm.fields import PydanticObjectId
from bson.errors import InvalidId

from api.app_config import BASE_DIR


def strip_whitespaces(_object: Union[str, List]) -> Union[str, List]:
    """
    Strips whitespaces from element or elements
    :param _object: A list or a string
    :return: Returns a list or a string
    """
    if isinstance(_object, List):
        processed = [elem.strip() for elem in _object]
    elif isinstance(_object, str):
        processed = _object.strip()
    else:
        raise ValueError(
            f"_object must be of type `list` or `str`, got {type(_object)}"
        )
    return processed


def validate_pydantic_object_ids(
    _ids: Union[str, List[str]], convert_to_pydantic_object_id: bool = True
) -> Union[str, None, List[PydanticObjectId]]:
    """
    Filters off invalid PydanticObjectId strings
    :params _ids: List of id strings
    :params convert_to_pydantic_object_id - weather to convert valid strings to PydanticObjectId
    :return: Valid PydanticObjectId strings
    """

    if _ids == None:
        return None
    if _ids == []:
        return []

    if isinstance(_ids, str):
        valid_id = None
        try:
            object_id = PydanticObjectId(_ids)
            valid_id = object_id if convert_to_pydantic_object_id else _ids
        except InvalidId:
            pass
        return valid_id

    elif isinstance(_ids, PydanticObjectId):
        return _ids

    valid_ids = []
    for _id in _ids:
        try:
            object_id = PydanticObjectId(_id)
            if convert_to_pydantic_object_id:
                valid_ids.append(object_id)
            else:
                valid_ids.append(_id)
        except InvalidId:
            pass
    return valid_ids
