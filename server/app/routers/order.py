from fastapi import APIRouter, Path, Depends
from app.cruds import customer_auth as customer_auth_cruds
from app.cruds import order as order_cruds
from starlette import status
from app.schemas import DecodedToken, OrderCreate, OrderResponse
from sqlalchemy.orm import Session
from app.database import get_db
from typing import Annotated

DbDependency = Annotated[Session, Depends(get_db)]
CustomerDependency = Annotated[DecodedToken, Depends(customer_auth_cruds.get_current_customer)]


router = APIRouter(prefix="/customer/order", tags=["auth"])

@router.post("/{r_id}", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
async def create_order(db: DbDependency, customer: CustomerDependency, order_create: OrderCreate, r_id: int=Path(gt=0)):
    return order_cruds.create(db, order_create, r_id, customer.id)