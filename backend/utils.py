from fastapi import (
    Depends,
    FastAPI,
    Request,
    Form,
    HTTPException,
    File,
    UploadFile,
    Header,
)
from fastapi.responses import FileResponse
from starlette.middleware.cors import CORSMiddleware

import uvicorn

from schemas import *

from typing import Annotated, Dict, Any

from models import *
import models
from database import SessionLocal

from sqlalchemy.orm import Session

from datetime import datetime, timedelta
from jose import JWTError, jwt

import importlib

# TODO: refactor to .env or config file
SECRET_KEY = "chinchoppa-chinchoppa"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 3  # 3 дня


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


db_dep = Annotated[Session, Depends(get_db)]


async def get_current_user(db: db_dep, authorization: str = Header(...)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Не удалось проверить учетные данные",
        headers={"WWW-Authenticate": "Bearer"},
    )
    token = authorization.split(" ")[1] if " " in authorization else None

    if token is None:
        raise credentials_exception

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
        user = db.query(User).filter(User.id == user_id).first()
        if user is None:
            user = db.query(Worker).filter(Worker.id == user_id).first()
            if user is None:
                raise credentials_exception
        return user 
    except JWTError:
        raise credentials_exception
    
current_user_dep = Annotated[User, Depends(get_current_user)]


def load_tests(testfile: str) -> Dict[str, Any]:
    spec = importlib.util.spec_from_file_location(testfile, f'files/tests/{testfile}')
    tests_module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(tests_module)
    return tests_module.tests


def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta if expires_delta else datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt