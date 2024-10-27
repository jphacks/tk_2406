from sqlalchemy.orm import Session
from app.schemas import RestaurantCreate, DecodedToken
from app.models import Restaurant
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

oauth2_schema = OAuth2PasswordBearer(tokenUrl="/restaurant/login")

def create_restaurant(db: Session, restaurant_create: RestaurantCreate):
    existing_restaurant = db.query(Restaurant).filter(Restaurant.r_name == restaurant_create.r_name).first()
    if existing_restaurant:
        return None
    salt = base64.b64encode(os.urandom(32))
    hashed_password = hashlib.pbkdf2_hmac("sha256", restaurant_create.password.encode(), salt, 10).hex()
    new_restaurant = Restaurant(
        r_name=restaurant_create.r_name,
        password=hashed_password,
        salt=salt.decode()
    )
    db.add(new_restaurant)
    db.commit()
    return new_restaurant

def authenticate_restaurant(db: Session, r_name: str, password: str):
    restaurant = db.query(Restaurant).filter(Restaurant.r_name == r_name).first()
    if not restaurant:
        return None
    hashed_password = hashlib.pbkdf2_hmac("sha256", password.encode(), restaurant.salt.encode(), 10).hex()
    if restaurant.password != hashed_password:
        return None
    return restaurant

def create_access_token(r_name: str, r_id: int, expires_delta: timedelta):
    expires = datetime.now() + expires_delta
    payload = {"sub": r_name, "id": r_id, "exp": expires}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def decode_token(token: Annotated[str, Depends(oauth2_schema)]):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        r_name = payload.get("sub")
        r_id = payload.get("id")
        if r_name is None or r_id is None:
            return None
        return DecodedToken(name=r_name, id=r_id)

    except JWTError:
        raise JWTError
    
    