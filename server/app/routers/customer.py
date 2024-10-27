from fastapi import APIRouter, Path, Query, HTTPException, Header, Depends
from fastapi.security import OAuth2PasswordRequestForm
from app.cruds import customer_auth as customer_auth_cruds, menu as menu_cruds
from starlette import status
from app.schemas import DishResponse
from sqlalchemy.orm import Session
from app.database import get_db
from typing import Annotated, List, Optional
from config import get_settings

DbDependency = Annotated[Session, Depends(get_db)]
FormDependency = Annotated[OAuth2PasswordRequestForm, Depends(customer_auth_cruds.get_current_customer)]

router = APIRouter(prefix="/customer", tags=["Customers"])

SECRET_KEY =get_settings().secret_key

@router.get("/dish/{r_id}",response_model=List[DishResponse], status_code=status.HTTP_200_OK)
async def get_dish(db:DbDependency, r_id: int, t_id: Optional[int] = Query(None, gt=0, examples=[1])):
    if t_id:
        dishes = menu_cruds.get_dishes_by_tag(db, r_id, t_id)
    else:
        dishes = menu_cruds.get_dish_all(db, r_id)
    return dishes




