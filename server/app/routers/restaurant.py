from fastapi import APIRouter, Path, Query, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
from app.cruds import restaurant_auth as restaurant_auth_cruds
from starlette import status
from app.schemas import UserCreate, UserResponse, Token
from sqlalchemy.orm import Session
from app.database import get_db
from typing import Annotated
from datetime import timedelta

DbDependency = Annotated[Session, Depends(get_db)]
FormDependency = Annotated[OAuth2PasswordRequestForm, Depends()]

router = APIRouter(prefix="/restaurant", tags=["auth"])

# @router.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
# async def create_user(db: DbDependency, user_create: UserCreate):
#     user = auth_cruds.create_user(db, user_create)
#     if not user:
#         raise HTTPException(status_code=409, detail="User already has")
#     return auth_cruds.create_user(db, user_create)

@router.post("/login", response_model=Token, status_code=status.HTTP_200_OK)
async def login(db: DbDependency, form_data: FormDependency):
    restaurant = restaurant_auth_cruds.authenticate_restaurant(db, form_data.username, form_data.password)
    if not restaurant:
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    token = restaurant_auth_cruds.create_access_token(restaurant.r_name, restaurant.id, timedelta(minutes=240))
    return {"access_token": token, "token_type": "bearer"}