from fastapi import APIRouter, Path, Query, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
from app.cruds import restaurant_auth as restaurant_auth_cruds, restaurant_url as restaurant_url_cruds
from starlette import status
from app.schemas import Token, RestaurantCreate, CheckResponse, UrlResponse
from sqlalchemy.orm import Session
from app.database import get_db
from typing import Annotated
from datetime import timedelta

DbDependency = Annotated[Session, Depends(get_db)]
FormDependency = Annotated[OAuth2PasswordRequestForm, Depends(restaurant_auth_cruds.get_current_restaurant)]

router = APIRouter(prefix="/restaurant", tags=["auth"])

@router.post("/signup", response_model=Token, status_code=status.HTTP_201_CREATED)
async def create_restaurant(db: DbDependency, restaurant_create: RestaurantCreate):
    restaurant = restaurant_auth_cruds.create_restaurant(db, restaurant_create)
    if not restaurant:
        raise HTTPException(status_code=409, detail="Restaurant already has")
    token = restaurant_auth_cruds.create_access_token(restaurant.r_name, restaurant.r_id, timedelta(minutes=240))
    return {"access_token": token, "token_type": "bearer"}

@router.post("/login", response_model=Token, status_code=status.HTTP_200_OK)
async def login(db: DbDependency, form_data: FormDependency):
    restaurant = restaurant_auth_cruds.authenticate_restaurant(db, form_data.username, form_data.password)
    if not restaurant:
        raise HTTPException(status_code=401, detail="Incorrect name or password")
    token = restaurant_auth_cruds.create_access_token(restaurant.r_name, restaurant.r_id, timedelta(minutes=240))
    return {"access_token": token, "token_type": "bearer"}

@router.get("/url", response_model=UrlResponse, status_code=status.HTTP_201_CREATED)
async def create_restaurant(db: DbDependency, form_data: FormDependency):
    check = restaurant_url_cruds.create_check(db, form_data.id)
    if not check:
        raise HTTPException(status_code=400, detail="Restaurant doesn't Has")
    return check

@router.post("/url/{r_id}", response_model=CheckResponse, status_code=status.HTTP_200_OK)
async def login(db: DbDependency, check: str, r_id: int=Path(gt=0)):
    result = restaurant_url_cruds.confilm_check(db, r_id, check)
    if not result:
        raise HTTPException(status_code=400, detail="Incorrect url")
    return result