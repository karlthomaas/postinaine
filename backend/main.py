import os
import jwt
import requests
import uuid
from dotenv import load_dotenv

from pydantic import BaseModel
from fastapi import Depends, FastAPI, HTTPException, Response, Request
from fastapi.middleware.cors import CORSMiddleware

from sql_app.database import SessionLocal, engine
from sql_app import crud, models, schemas
from sqlalchemy.orm import Session

from datetime import datetime, timedelta

models.Base.metadata.create_all(bind=engine)

load_dotenv()

JWT_SECRET = os.getenv("JWT_SECRET")
FRONTEND_URL = os.getenv("FRONTEND_URL")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class Login(BaseModel):
    """ Login request body """
    email: str
    api_token: str


@app.post("/login")
async def login(response: Response, body: Login, db: Session = Depends(get_db)):
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


    db_user = crud.get_user_by_token(db, api_token=body.api_token)
    
    if db_user and db_user.email != body.email:
        raise HTTPException(status_code=400, detail="API key is already in use by another user")

    if not db_user:
        user = schemas.UserCreate(id=str(uuid.uuid4()), email=body.email, api_token=body.api_token)
        db_user = crud.create_user(db=db, user=user)


    refresh_token = schemas.RefreshTokenCreate(user_id=db_user.id, token=str(uuid.uuid4()), expires_at=(datetime.now() + timedelta(days=30)))
    db_refresh_token = crud.create_refresh_token(db=db, refresh_token=refresh_token)
    
    token = jwt.encode({"id": str(db_user.id)}, JWT_SECRET)
    response.set_cookie(key="token", value=token, httponly=True, secure=True, samesite="None", expires=60*5)
    response.set_cookie(key="is_authenticated", value="true", httponly=False, secure=True, samesite="None", expires=60*5)
    response.set_cookie(key="refresh_token", value=db_refresh_token.token, httponly=True, secure=True, samesite="None", expires=60*60*24*30)
    
    return {"id": db_user.id}
    
    
@app.get("/session")
async def session(request: Request, db: Session = Depends(get_db)):
    """ Session endpoint """

    token = request.cookies.get("token")
    
    if not token:
        raise HTTPException(status_code=401, detail="Unauthorized")

    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
    
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Unauthorized")

    db_user = crud.get_user_by_id(db, id=payload['id'])
  
    if not db_user:
        raise HTTPException(status_code=401, detail="Unauthorized")

    return {"id": db_user.id}

@app.post("/refresh")
async def refresh(request: Request, response: Response, db: Session = Depends(get_db)):
    """ Refresh endpoint """

    refresh_token = request.cookies.get("refresh_token")
    if not refresh_token:
        raise HTTPException(status_code=401, detail="Unauthorized")

    db_refresh_token = crud.get_refresh_token(db, token=refresh_token)
    if not db_refresh_token:
        raise HTTPException(status_code=401, detail="Unauthorized")

    if db_refresh_token.expires_at < datetime.now():
        crud.delete_refresh_token(db, token=refresh_token)
        raise HTTPException(status_code=401, detail="Unauthorized")

    db_user = crud.get_user_by_id(db, id=db_refresh_token.user_id)
    
    if not db_user:
        raise HTTPException(status_code=401, detail="Unauthorized")

    token = jwt.encode({"id": str(db_user.id)}, JWT_SECRET)
    response.set_cookie(key="token", value=token, httponly=True, secure=True, samesite="None", expires=10)
    response.set_cookie(key="is_authenticated", value="true", httponly=False, secure=True, samesite="None", expires=60*5)
    response.set_cookie(key="refresh_token", value=db_refresh_token.token, httponly=True, secure=True, samesite="None", expires=60*60*24*30)
    
    return {"id": db_user.id}

@app.get("/news")
async def news(request: Request, db: Session = Depends(get_db)):
    
    token = request.cookies.get("token")
    
    if not token:
        raise HTTPException(status_code=401, detail="Unauthorized")

    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
    
    except:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    
    db_user = crud.get_user_by_id(db, id=payload['id'])
    
    url = "https://newsapi.org/v2/top-headlines?country=us&category=technology"
    headers = {
        "X-Api-Key": db_user.api_token,
    }
    
    response = requests.get(url, headers=headers, timeout=10).json()
    return response

@app.post('/logout')
async def logout(request: Request, response: Response, db: Session = Depends(get_db)):
    refresh_token = request.cookies.get("refresh_token")
    
    response.delete_cookie("token")
    response.delete_cookie("is_authenticated")
    response.delete_cookie("refresh_token")
    
    if refresh_token:
        crud.delete_refresh_token(db, token=refresh_token)
    
    return {"message": "success"}