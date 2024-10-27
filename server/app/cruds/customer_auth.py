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

oauth2_schema = OAuth2PasswordBearer(tokenUrl="/customer/login")

def create_customer(db: Session, customer_create: CustomerCreate):
    existing_customer = db.query(Customer).filter(Customer.c_name == customer_create.c_name).first()
    if existing_customer:
        return None
    salt = base64.b64encode(os.urandom(32))
    hashed_password = hashlib.pbkdf2_hmac("sha256", customer_create.password.encode(), salt, 10).hex()
    new_customer = Customer(
        c_name=customer_create.c_name,
        email=customer_create.email,
        password=hashed_password,
        salt=salt.decode()
    )
    db.add(new_customer)
    db.commit()
    return new_customer

def authenticate_customer(db: Session, c_name: str, password: str):
    customer = db.query(Customer).filter(Customer.c_name == c_name).first()
    if not customer:
        return None
    hashed_password = hashlib.pbkdf2_hmac("sha256", password.encode(), customer.salt.encode(), 10).hex()
    if customer.password != hashed_password:
        return None
    return customer

def create_access_token(c_name: str, c_id: int, expires_delta: timedelta):
    expires = datetime.now() + expires_delta
    payload = {"sub": c_name, "id": c_id, "exp": expires}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def get_current_customer(token: Annotated[str, Depends(oauth2_schema)]):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        c_name = payload.get("sub")
        c_id = payload.get("id")
        if c_name is None or c_id is None:
            return None
        return DecodedToken(name=c_name, id=c_id)

    except JWTError:
        raise JWTError