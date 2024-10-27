from fastapi import APIRouter, Path, Query, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm

from app.cruds import restaurant_auth as restaurant_auth_cruds, menu as menu_cruds, restaurant_url as restaurant_url_cruds
from starlette import status
from app.schemas import Token, RestaurantCreate, DishCreate, TagCreate, DishUpdate, DishResponse, UrlResponse, UrlCheck, TagResponse

from sqlalchemy.orm import Session
from app.database import get_db
from typing import Annotated, List, Optional
from datetime import timedelta
from app.cruds.auth import JWTBearer

from typing import Optional

DbDependency = Annotated[Session, Depends(get_db)]
FormDependency = Annotated[OAuth2PasswordRequestForm, Depends(restaurant_auth_cruds.get_current_restaurant)]

router = APIRouter(prefix="/restaurant", tags=["restaurants"])

@router.post("/tag",dependencies=[Depends(JWTBearer())], status_code=status.HTTP_201_CREATED)
async def create_tag(db: DbDependency, tag_create: TagCreate, token: str = Depends(JWTBearer())):
#async def create_tag(db: DbDependency, token: FormDependency, tag_create: TagCreate):
    r_name, r_id = restaurant_auth_cruds.get_current_restaurant(token)
    if not r_id:
        raise HTTPException(status_code=401, detail="Invalid token")
    tag = menu_cruds.create_tag(db, r_id[1], tag_create.t_name)
    if not tag:
        raise HTTPException(status_code=409, detail="Tag already exists")
    return tag


@router.get("/tag",dependencies=[Depends(JWTBearer())], status_code=status.HTTP_201_CREATED)
async def create_tag(db: DbDependency, token: str = Depends(JWTBearer())):
#async def create_tag(db: DbDependency, token: FormDependency, tag_create: TagCreate):
    r_name, r_id = restaurant_auth_cruds.get_current_restaurant(token)
    if not r_id:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    return menu_cruds.find_tags_all(db, r_id[1])

    
@router.get("/dish",dependencies=[Depends(JWTBearer())],response_model=List[DishResponse], status_code=status.HTTP_200_OK)
async def get_dish(db:DbDependency, t_id: Optional[int] = Query(None, gt=0, examples=[1]), token:str = Depends(JWTBearer())):
    r_name, r_id = restaurant_auth_cruds.get_current_restaurant(token)
    if t_id:
        dishes = menu_cruds.get_dishes_by_tag(db, r_id[1], t_id)
    else:
        dishes = menu_cruds.get_dish_all(db, r_id[1])
    return dishes

@router.post("/dish",dependencies=[Depends(JWTBearer())], response_model=DishResponse, status_code=status.HTTP_201_CREATED)
async def create_dish(db: DbDependency, dish_create: DishCreate, token:str = Depends(JWTBearer())):
    r_name, r_id = restaurant_auth_cruds.get_current_restaurant(token)
    if not r_id:
        raise HTTPException(status_code=401, detail="Invalid token")
    f_name, price, t_id, is_alcohol, degree, f_quantity = dish_create.f_name, dish_create.price, dish_create.t_id, dish_create.is_alcohol, dish_create.degree, dish_create.f_quantity
    new_dish = menu_cruds.create_dish(db, r_id[1], f_name, price, t_id, is_alcohol, degree, f_quantity)

    if not new_dish:
        raise HTTPException(status_code=409, detail="Dish already exists")
    
    return new_dish

@router.put("/dish/{f_id}", dependencies=[Depends(JWTBearer())], response_model=DishResponse, status_code=status.HTTP_202_ACCEPTED)
async def update_dish(db: DbDependency, f_id: int, dish_update: DishUpdate, token:str = Depends(JWTBearer())):
    r_name, r_id = restaurant_auth_cruds.get_current_restaurant(token)
    if not r_id:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    # Filter out None values from the update dictionary
    update_data = {k: v for k, v in dish_update.__dict__.items() if v is not None}
    
    # Update the dish with only the provided fields
    updated_dish = menu_cruds.update_dish(db, f_id, r_id[1], updated_items=update_data)
    if updated_dish == -1:
        raise HTTPException(status_code=403, detail="Non-alcohol dish cannot have degree and f_quantity")
    
    return updated_dish

@router.get("/url", response_model=UrlResponse, status_code=status.HTTP_201_CREATED)
async def create_restaurant(db: DbDependency, form_data: FormDependency):
    check = restaurant_url_cruds.create_check(db, form_data.id)
    print(check)
    if not check:
        raise HTTPException(status_code=400, detail="Restaurant doesn't Has")
    print(check.check)
    return check

@router.post("/url/{r_id}", response_model=Optional[dict], status_code=status.HTTP_200_OK)
async def login(db: DbDependency, check: UrlCheck, r_id: int=Path(gt=0)):
    result = restaurant_url_cruds.confirm_check(db, r_id, check.check)
    if not result:
        raise HTTPException(status_code=400, detail="Incorrect url")
    return 

