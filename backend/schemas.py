from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class LoginSchema(BaseModel):
    username: str
    password: str


class CourseCheck(BaseModel):
    id: str


class CodeExecute(BaseModel):
    lang: str
    code: str
    testfile: str
    task_id: int


class NewBidSchema(BaseModel):
    philial: int
    kid_name: Optional[str] = None
    kid_phone: Optional[str] = None
    kid_email: Optional[str] = None
    parent_name: Optional[str] = None
    parent_phone: Optional[str] = None
    parent_email: Optional[str] = None
    day_of_birth: Optional[str] = None
    how_known: Optional[str] = None
    state: Optional[str] = None
    comment: Optional[str] = None
