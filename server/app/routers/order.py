from fastapi import APIRouter, Path, Depends
from app.cruds import customer_auth as customer_auth_cruds
from starlette import status
from app.schemas import DecodedToken, OrderCreate
from sqlalchemy.orm import Session
from app.database import get_db
from typing import Annotated

DbDependency = Annotated[Session, Depends(get_db)]
CustomerDependency = Annotated[DecodedToken, Depends(customer_auth_cruds.get_current_customer)]


router = APIRouter(prefix="/customer/order", tags=["auth"])

@router.post("/{r_id}", status_code=status.HTTP_201_CREATED)
async def create_order(db: DbDependency, customer: CustomerDependency, order_create: OrderCreate, r_id: int=Path(gt=0)):
    return customer_auth_cruds.create_order(db, order_create, customer.id, r_id)