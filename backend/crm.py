from fastapi import APIRouter, Response

from schemas import *

from utils import db_dep, create_access_token, current_user_dep, ACCESS_TOKEN_EXPIRE_MINUTES

from datetime import datetime, timedelta

from models import *


router = APIRouter(prefix="/crm")

@router.post("/login")
async def login(db: db_dep, data: LoginSchema, response: Response):
    worker = db.query(Worker).filter(Worker.login == data.username).first()
    if worker is not None:
        if worker.password == data.password:
            access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
            access_token = create_access_token(data={"sub": str(worker.id)}, expires_delta=access_token_expires)
            
            response.status_code = 200
            return {"access_token": access_token, "token_type": "bearer"}

    response.status_code = 401
    return {"error": "Неверный логин или пароль"}


@router.get("/me")
async def get_users_me(current_user: current_user_dep):
    return current_user


@router.post("/me")
async def post_users_me(current_user: current_user_dep):
    return current_user


@router.post("/create_new_bid")
async def post_users_me(current_user: current_user_dep, db: db_dep, data: NewBidSchema):
    return 1
