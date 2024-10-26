from fastapi import APIRouter, Path, Query, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
from app.cruds import restaurant_auth as restaurant_auth_cruds
from app.cruds import menu
from starlette import status
from app.schemas import Token, RestaurantCreate, DishCreate, FoodResponse, TagCreate, DishView, DishResponse
from sqlalchemy.orm import Session
from app.database import get_db
from typing import Annotated, List, Optional
from datetime import timedelta

DbDependency = Annotated[Session, Depends(get_db)]
FormDependency = Annotated[OAuth2PasswordRequestForm, Depends()]

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
        raise HTTPException(status_code=401, detail="Incorrect rname or password")
    token = restaurant_auth_cruds.create_access_token(restaurant.r_name, restaurant.r_id, timedelta(minutes=240))
    return {"access_token": token, "token_type": "bearer"}

@router.post("/tag", status_code=status.HTTP_201_CREATED)
async def create_tag(db: DbDependency, token: Annotated[str, Depends(restaurant_auth_cruds.oauth2_schema)],tag_create: TagCreate):
    r_name, r_id = restaurant_auth_cruds.get_current_restaurant(token)
    if not r_id:
        raise HTTPException(status_code=401, detail="Invalid token")
    tag = menu.create_tag(db, r_id[1], tag_create.t_name)
    if not tag:
        raise HTTPException(status_code=409, detail="Tag already exists")
    return tag
    
@router.get("/dish", status_code=status.HTTP_200_OK)
async def get_dish(db:DbDependency, token: Annotated[str, Depends(restaurant_auth_cruds.oauth2_schema)], dish_view: DishView):
    r_name, r_id = restaurant_auth_cruds.get_current_restaurant(token)
    if dish_view.t_id:
        dishes = menu.get_dish_by_tag(db, r_id[1], dish_view.t_id)
    else:
        dishes = menu.get_dish_all(db, r_id[1])
    
    dishes =  [
        DishResponse(
            f_id = item[0],
            f_name = item[1],
            price = item[2],
            is_alcohol = item[3],
            r_id = item[4],
            tag = item[5],
            degree = item[6],
            f_quantity = item[7]
        )
        for item in dishes
    ]
    return dishes

@router.post("/dish",response_model=FoodResponse, status_code=status.HTTP_201_CREATED)
async def create_dish(db: DbDependency, token: Annotated[str, Depends(restaurant_auth_cruds.oauth2_schema)], dish_create: DishCreate):
    r_name, r_id = restaurant_auth_cruds.get_current_restaurant(token)
    if not r_id:
        raise HTTPException(status_code=401, detail="Invalid token")
    f_name, price, t_id, is_alcohol,degree = dish_create.f_name, dish_create.price, dish_create.t_id, dish_create.is_alcohol, dish_create.degree
    dish = menu.create_dish(db, r_id[1], f_name, price, t_id, is_alcohol, degree)

    if not dish:
        raise HTTPException(status_code=409, detail="Dish already exists")
    return dish

@router.put("/dishxx/{f_id}", response_model=FoodResponse, status_code=status.HTTP_200_OK)
async def update_dish(db: DbDependency, token: Annotated[str, Depends(restaurant_auth_cruds.oauth2_schema)], t_id: int, f_id: int = Path(..., title="Food ID"), f_name: Optional[str] = None, price: Optional[int] = None):
    r_name, r_id = restaurant_auth_cruds.get_current_restaurant(token)
    if not r_id:
        raise HTTPException(status_code=401, detail="Invalid token")
    print(1)
    dish = menu.update_dish(db, f_id, r_id, f_name, price, t_id)
    if not dish:
        raise HTTPException(status_code=404, detail="Dish not found")
    return dish