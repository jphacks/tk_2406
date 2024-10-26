from fastapi import APIRouter, Path, Query, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
from app.cruds import auth as auth_cruds
from starlette import status
from app.schemas import UserCreate, UserResponse, Token
from sqlalchemy.orm import Session
from app.database import get_db
from typing import Annotated
from datetime import datetime, timedelta
from jose import JWTError, jwt
import os
DbDependency = Annotated[Session, Depends(get_db)]
FormDependency = Annotated[OAuth2PasswordRequestForm, Depends()]

router = APIRouter(prefix="/customers", tags=["Customers"])

SECRET_KEY = os.getenv("SECRET_KEY")

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(datetime.timezone.utc) + timedelta(minutes=240)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm="HS256")
    return encoded_jwt

@router.post("/login", response_model=Token, status_code=status.HTTP_200_OK)
async def login(db: DbDependency, form_data: FormDependency):
    user = auth_cruds.authenticate_user(db, form_data.c_name, form_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    token = auth_cruds.create_access_token(user.username, user.id, timedelta(minutes=120))
    return {"access_token": token, "token_type": "bearer"}
    