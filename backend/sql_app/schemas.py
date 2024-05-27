from pydantic import BaseModel
from datetime import datetime

class UserBase(BaseModel):
    email: str
    
class UserCreate(UserBase):
    id: str
    email: str
    api_token: str
    
class User(UserBase):
    email: str
    api_token: str
    
    class Config:
        orm_mode = True

class RefreshTokenBase(BaseModel):
    user_id: str
    
class RefreshTokenCreate(RefreshTokenBase):
    token: str
    expires_at: datetime
    
class RefreshToken(RefreshTokenBase):
    token: str
    expires_at: str
    
    class Config:
        orm_mode = True