from fastapi import APIRouter, Path, Query, HTTPException, Header, Depends
from fastapi.security import OAuth2PasswordRequestForm
from app.cruds import customer_auth as customer_auth_cruds
from starlette import status
from app.schemas import CustomerCreate, Token
from sqlalchemy.orm import Session
from app.database import get_db
from typing import Annotated
from datetime import datetime, timedelta
from jose import JWTError, jwt
from config import get_settings
DbDependency = Annotated[Session, Depends(get_db)]
FormDependency = Annotated[OAuth2PasswordRequestForm, Depends()]

router = APIRouter(prefix="/customers", tags=["Customers"])

SECRET_KEY =get_settings().secret_key



@router.post("/login", response_model=Token, status_code=status.HTTP_200_OK)
async def login(db: DbDependency, form_data: FormDependency):
    customer = customer_auth_cruds.authenticate_customer(db, form_data.username, form_data.password)
    if not customer:
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    token = customer_auth_cruds.create_access_token(customer.c_name, customer.c_id, timedelta(minutes=240))
    return {"access_token": token, "token_type": "bearer"}

@router.post("/signup", response_model=Token, status_code=status.HTTP_201_CREATED)
async def signup(db: DbDependency, customer: CustomerCreate):
    customer = customer_auth_cruds.create_customer(db, customer)
    if customer is None:
        raise HTTPException(status_code=400, detail="User already exists")
    token = customer_auth_cruds.create_access_token(customer.c_name, customer.c_id, timedelta(minutes=240))
    return {"c_id": customer.c_id, "access_token": token, "token_type": "bearer"}




