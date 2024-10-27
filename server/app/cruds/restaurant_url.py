from sqlalchemy.orm import Session
from app.schemas import DecodedToken, UrlResponse
from app.models import Restaurant
from typing import Annotated
from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from config import get_settings
import hashlib

ALGORITHM = "HS256"
SECRET_KEY = get_settings().secret_key

oauth2_schema = OAuth2PasswordBearer(tokenUrl="/restaurant/login")

def get_current_restaurant(token: Annotated[str, Depends(oauth2_schema)]):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        r_name = payload.get("sub")
        r_id = payload.get("id")
        if r_name is None or r_id is None:
            return None
        return DecodedToken(name=r_name, id=r_id)

    except JWTError:
        raise JWTError
    

def create_check(db: Session, r_id: int):
    restaurant = db.query(Restaurant).filter(Restaurant.r_id == r_id).first()
    if not restaurant:
        return None
    check_origin = str(r_id) + restaurant.password
    hashed_check = hashlib.pbkdf2_hmac("sha256", check_origin.encode(), restaurant.salt.encode(), 10).hex()
    print(hashed_check)
    return UrlResponse(check=hashed_check)
    
def confirm_check(db: Session, r_id: int, check: str):
    restaurant = db.query(Restaurant).filter(Restaurant.r_id == r_id).first()
    if not restaurant:
        return None
    check_origin = str(r_id) + restaurant.password
    hashed_check = hashlib.pbkdf2_hmac("sha256", check_origin.encode(), restaurant.salt.encode(), 10).hex()
    return hashed_check == check
    