from fastapi import FastAPI

from fastapi.middleware.cors import CORSMiddleware

from fastapi.staticfiles import StaticFiles

from crm import router as crm_router
from lms import router as lms_router

app = FastAPI()

app.include_router(crm_router)
app.include_router(lms_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # TODO: add allowed origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/images", StaticFiles(directory="images"), name="images")