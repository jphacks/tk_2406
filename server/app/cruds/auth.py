from sqlalchemy.orm import Session
from server.app.schemas import UserCreate, DecodedToken
from server.app.models import User
from datetime import datetime, timedelta
from typing import Annotated
from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from server.config import get_settings
import hashlib
import base64
import os

# ALGORITHM = "HS256"
# SECRET_KEY = get_settings().secret_key

# oauth2_schema = OAuth2PasswordBearer(tokenUrl="/auth/login")

# def create_user(db: Session, user_create: UserCreate):
#     existing_user = db.query(User).filter(User.username == user_create.username).first()
#     if existing_user:
#         return None
#     salt = base64.b64encode(os.urandom(32))
#     hashed_password = hashlib.pbkdf2_hmac("sha256", user_create.password.encode(), salt, 10).hex()
#     new_user = User(
#         username=user_create.username,
#         password=hashed_password,
#         salt=salt.decode()
#     )
#     db.add(new_user)
#     db.commit()
#     return new_user

# def authenticate_user(db: Session, username: str, password: str):
#     user = db.query(User).filter(User.username == username).first()
#     if not user:
#         return None
#     hashed_password = hashlib.pbkdf2_hmac("sha256", password.encode(), user.salt.encode(), 10).hex()
#     if user.password != hashed_password:
#         return None
#     return user

# def create_access_token(username: str, user_id: int, expires_delta: timedelta):
#     expires = datetime.now() + expires_delta
#     payload = {"sub": username, "id": user_id, "exp": expires}
#     return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

# def get_current_user(token: Annotated[str, Depends(oauth2_schema)]):
#     try:
#         payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
#         username = payload.get("sub")
#         user_id = payload.get("id")
#         if username is None or user_id is None:
#             return None
#         return DecodedToken(username=username, user_id=user_id)

#     except JWTError:
#         raise JWTError