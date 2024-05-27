import os
import requests
from dotenv import load_dotenv
import jwt

from pydantic import BaseModel
from fastapi import FastAPI, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware


load_dotenv()

JWT_SECRET = os.getenv("JWT_SECRET")
FRONTEND_URL = os.getenv("FRONTEND_URL")

origins = [
    FRONTEND_URL,
]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Login(BaseModel):
    """ Login request body """
    email: str
    api_token: str


@app.post("/login")
async def login(response: Response, body: Login):
    """ Login endpoint """
    url = "https://newsapi.org/v2/everything?q=logintest"
    headers = {
        "X-Api-Key": body.api_token,
    }

    api_response = requests.get(url, headers=headers, timeout=5)

    if api_response.status_code == 401:
        # return error 401
        raise HTTPException(status_code=401, detail="Invalid API Token")

    if api_response.status_code != 200:
        # return error 500
        raise HTTPException(status_code=500, detail="Internal Server Error")

    encoded_jwt = jwt.encode({"email": body.email}, JWT_SECRET, algorithm="HS256")
    response.set_cookie(key="token", value=encoded_jwt, secure=True, samesite="None")
    return {"message": "success"}
