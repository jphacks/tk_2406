from fastapi import APIRouter, Path, Query, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
from app.cruds import restaurant_auth as restaurant_auth_cruds, menu as menu_cruds
from starlette import status
from app.schemas import Token, RestaurantCreate, DishCreate, TagCreate, DishUpdate, DishResponse
from sqlalchemy.orm import Session
from app.database import get_db
from typing import Annotated, List, Optional
from datetime import timedelta
from app.cruds.auth import JWTBearer

DbDependency = Annotated[Session, Depends(get_db)]
FormDependency = Annotated[OAuth2PasswordRequestForm, Depends()]

router = APIRouter(prefix="/restaurant", tags=["restaurants"])

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
        raise HTTPException(status_code=401, detail="Incorrect rname or password")
    token = restaurant_auth_cruds.create_access_token(restaurant.r_name, restaurant.r_id, timedelta(minutes=240))
    return {"access_token": token, "token_type": "bearer"}

@router.post("/tag",dependencies=[Depends(JWTBearer())], status_code=status.HTTP_201_CREATED)
async def create_tag(db: DbDependency, tag_create: TagCreate, token:str = Depends(JWTBearer())):
    r_name, r_id = restaurant_auth_cruds.decode_token(token)
    if not r_id:
        raise HTTPException(status_code=401, detail="Invalid token")
    tag = menu_cruds.create_tag(db, r_id[1], tag_create.t_name)
    if not tag:
        raise HTTPException(status_code=409, detail="Tag already exists")
    return tag
    
@router.get("/dish",dependencies=[Depends(JWTBearer())],response_model=List[DishResponse], status_code=status.HTTP_200_OK)
async def get_dish(db:DbDependency, t_id: Optional[int] = Query(None, gt=0, examples=[1]), token:str = Depends(JWTBearer())):
    r_name, r_id = restaurant_auth_cruds.decode_token(token)
    if t_id:
        dishes = menu_cruds.get_dishes_by_tag(db, r_id[1], t_id)
    else:
        dishes = menu_cruds.get_dish_all(db, r_id[1])
    return dishes

@router.post("/dish",dependencies=[Depends(JWTBearer())], response_model=DishResponse, status_code=status.HTTP_201_CREATED)
async def create_dish(db: DbDependency, dish_create: DishCreate, token:str = Depends(JWTBearer())):
    r_name, r_id = restaurant_auth_cruds.decode_token(token)
    if not r_id:
        raise HTTPException(status_code=401, detail="Invalid token")
    f_name, price, t_id, is_alcohol,degree = dish_create.f_name, dish_create.price, dish_create.t_id, dish_create.is_alcohol, dish_create.degree
    new_dish = menu_cruds.create_dish(db, r_id[1], f_name, price, t_id, is_alcohol, degree)

    if not new_dish:
        raise HTTPException(status_code=409, detail="Dish already exists")
    
    return new_dish

@router.put("/dish/{f_id}", dependencies=[Depends(JWTBearer())], response_model=DishResponse, status_code=status.HTTP_202_ACCEPTED)
async def update_dish(db: DbDependency, f_id: int, dish_update: DishUpdate, token:str = Depends(JWTBearer())):
    r_name, r_id = restaurant_auth_cruds.decode_token(token)
    if not r_id:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    # Filter out None values from the update dictionary
    update_data = {k: v for k, v in dish_update.__dict__.items() if v is not None}
    
    # Update the dish with only the provided fields
    updated_dish = menu_cruds.update_dish(db, f_id, r_id[1], updated_items=update_data)
    if updated_dish == -1:
        raise HTTPException(status_code=403, detail="Non-alcohol dish cannot have degree and f_quantity")
    
    return updated_dish
