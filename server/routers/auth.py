from fastapi import APIRouter, Path, Query, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
from cruds import auth as auth_cruds
from starlette import status
from server.schemas import UserCreate, UserResponse, Token
from sqlalchemy.orm import Session
from server.database import get_db
from typing import Annotated
from datetime import timedelta

# DbDependency = Annotated[Session, Depends(get_db)]
# FormDependency = Annotated[OAuth2PasswordRequestForm, Depends()]

# router = APIRouter(prefix="/auth", tags=["auth"])

# @router.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
# async def create_user(db: DbDependency, user_create: UserCreate):
#     user = auth_cruds.create_user(db, user_create)
#     if not user:
#         raise HTTPException(status_code=409, detail="User already has")
#     return auth_cruds.create_user(db, user_create)

# @router.post("/login", response_model=Token, status_code=status.HTTP_200_OK)
# async def login(db: DbDependency, form_data: FormDependency):
#     user = auth_cruds.authenticate_user(db, form_data.username, form_data.password)
#     if not user:
#         raise HTTPException(status_code=401, detail="Incorrect username or password")
#     token = auth_cruds.create_access_token(user.username, user.id, timedelta(minutes=120))
#     return {"access_token": token, "token_type": "bearer"}