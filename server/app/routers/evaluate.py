from fastapi import APIRouter, Depends
from app.cruds import customer_auth as customer_auth_cruds
from app.cruds import evaluate as evaluate_cruds
from starlette import status
from app.schemas import DecodedToken
from sqlalchemy.orm import Session
from app.database import get_db
from typing import Annotated

DbDependency = Annotated[Session, Depends(get_db)]
CustomerDependency = Annotated[DecodedToken, Depends(customer_auth_cruds.get_current_customer)]


router = APIRouter(prefix="/customer/evaluate", tags=["auth"])

@router.get("/", status_code=status.HTTP_200_OK)
async def get_is_evaluated(db: DbDependency, customer: CustomerDependency):
    return evaluate_cruds.is_evaluated(db, customer.id)

@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_evaluation(db: DbDependency, customer: CustomerDependency):
    return evaluate_cruds.create(db, customer.id)