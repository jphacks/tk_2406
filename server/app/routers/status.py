from fastapi import APIRouter, Depends, Path
from app.cruds import customer_auth as customer_auth_cruds
from app.cruds import evaluate as evaluate_cruds
from starlette import status
from app.schemas import DecodedToken
from sqlalchemy.orm import Session
from app.database import get_db
from typing import Annotated

DbDependency = Annotated[Session, Depends(get_db)]
CustomerDependency = Annotated[DecodedToken, Depends(customer_auth_cruds.get_current_customer)]

router = APIRouter(prefix="/customer/status", tags=["auth"])

@router.get("/", status_code=status.HTTP_200_OK)
async def get_status(db: DbDependency, customer: CustomerDependency):
    return evaluate_cruds.get_status(db, customer.id)

@router.post("/{r_id}", status_code=status.HTTP_201_CREATED)
async def update_status(db: DbDependency, customer: CustomerDependency, r_id: int=Path(gt=0)):
    return evaluate_cruds.update_status(db, r_id, customer.id)