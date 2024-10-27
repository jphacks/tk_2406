from fastapi import APIRouter, Depends, Path
from app.cruds import customer_auth as customer_auth_cruds
from app.cruds import status as status_cruds
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
    return status_cruds.get_status(db, customer.id)