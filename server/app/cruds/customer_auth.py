from sqlalchemy.orm import Session
from app.schemas import CustomerCreate, DecodedToken
from app.models import Customer
from datetime import datetime, timedelta
from typing import Annotated
from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from config import get_settings
import hashlib
import base64
import os

ALGORITHM = "HS256"
SECRET_KEY = get_settings().secret_key

oauth2_schema = OAuth2PasswordBearer(tokenUrl="/auth/login")

def create_customer(db: Session, customer_create: CustomerCreate):
    existing_user = db.query(Customer).filter(Customer.c_name == customer_create.r_name).first()
    if existing_user:
        return None
    salt = base64.b64encode(os.urandom(32))
    hashed_password = hashlib.pbkdf2_hmac("sha256", customer_create.password.encode(), salt, 10).hex()
    new_customer = Customer(
        c_name=customer_create.c_name,
        password=hashed_password,
        salt=salt.decode()
    )
    db.add(new_customer)
    db.commit()
    return new_customer

def authenticate_customer(db: Session, r_name: str, password: str):
    customer = db.query(Customer).filter(Customer.r_name == r_name).first()
    if not customer:
        return None
    hashed_password = hashlib.pbkdf2_hmac("sha256", password.encode(), customer.salt.encode(), 10).hex()
    if customer.password != hashed_password:
        return None
    return customer

def create_access_token(r_name: str, r_id: int, expires_delta: timedelta):
    expires = datetime.now() + expires_delta
    payload = {"sub": r_name, "id": r_id, "exp": expires}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def get_current_customer(token: Annotated[str, Depends(oauth2_schema)]):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        r_name = payload.get("sub")
        r_id = payload.get("id")
        if r_name is None or r_id is None:
            return None
        return DecodedToken(name=r_name, id=r_id)

    except JWTError:
        raise JWTError