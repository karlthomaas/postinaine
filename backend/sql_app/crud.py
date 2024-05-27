from sqlalchemy.orm import Session

from . import models, schemas

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_user_by_token(db: Session, api_token: str):
    return db.query(models.User).filter(models.User.api_token == api_token).first()

def get_user_by_id(db: Session, id: int):
    return db.query(models.User).filter(models.User.id == id).first()

def create_user(db: Session, user: schemas.UserCreate):
    db_user = models.User(id=user.id, email=user.email, api_token=user.api_token)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def create_refresh_token(db: Session, refresh_token: schemas.RefreshTokenCreate):
    db_refresh_token = models.RefreshToken(**refresh_token.dict())
    db.add(db_refresh_token)
    db.commit()
    db.refresh(db_refresh_token)
    return db_refresh_token

def get_refresh_token(db: Session, token: str):
    return db.query(models.RefreshToken).filter(models.RefreshToken.token == token).first()

def delete_refresh_token(db: Session, token: str):
    db.query(models.RefreshToken).filter(models.RefreshToken.token == token).delete()
    db.commit()
    return True

