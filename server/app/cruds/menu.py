from sqlalchemy.orm import Session, joinedload
from app.schemas import  DecodedToken
from app.models import Food, FoodAlcohol, Tag
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

def get_dish_all(db:Session, r_id: int):
    dishes_all = (
        db.query(
            Food.f_id, 
            Food.f_name,
            Food.price,
            Food.is_alcohol,
            Food.r_id,
            Tag.t_name,
            FoodAlcohol.degree,
            FoodAlcohol.f_quantity
        )
        .outerjoin(FoodAlcohol, Food.f_id == FoodAlcohol.f_id)
        .outerjoin(Tag, Food.t_id == Tag.t_id)
        .filter(Food.r_id == r_id)
        .all()
    )
    return dishes_all

def get_dishes_by_tag(db: Session, r_id: int, t_id: int):
    # Fetch dishes for a restaurant ID that match a specific tag
    dishes_by_tag = (
        db.query(
            Food.f_id, 
            Food.f_name,
            Food.price,
            Food.is_alcohol,
            Food.r_id,
            Tag.t_name,
            FoodAlcohol.degree,
            FoodAlcohol.f_quantity
        )
        .outerjoin(FoodAlcohol, Food.f_id == FoodAlcohol.f_id)
        .outerjoin(Tag, Food.t_id == Tag.t_id)
        .filter(Food.r_id == r_id).filter(Food.t_id == t_id)
        .all()
    )
    return dishes_by_tag

def create_tag(db: Session, r_id: int, t_name: str):
    # Create a new tag for a restaurant ID
    existing_tag = db.query(Tag).filter(Tag.r_id == r_id, Tag.t_name == t_name).first()
    if existing_tag:
        return None
    new_tag = Tag(r_id=r_id, t_name=t_name)
    db.add(new_tag)
    db.commit()
    db.refresh(new_tag)
    return new_tag

def create_dish(db: Session, r_id: int, f_name: str, price: int, t_id: int, is_alcohol: bool, degree: float):
    existing_dish = db.query(Food).filter(Food.r_id == r_id, Food.f_name == f_name).first()
    if existing_dish:
        return None
    # Create a new dish for a restaurant ID
    new_dish = Food(r_id=r_id, f_name=f_name, price=price, t_id=t_id, is_alcohol=is_alcohol)
    db.add(new_dish)
    db.commit()
    print(new_dish.f_id)
    if is_alcohol:      
        new_alcohol = FoodAlcohol(f_id=new_dish.f_id, degree=degree, f_quantity=0)
        db.add(new_alcohol)
    db.commit()
    db.refresh(new_dish)
    

    return new_dish

def update_dish(db: Session, r_id: int, f_id: int, f_name: str, price: int, tag: str):
    # Update a dish for a restaurant ID
    dish = db.query(Food).filter(Food.r_id == r_id, Food.f_id == f_id).first()
    if not dish:
        return None
    dish.f_name = f_name
    dish.price = price
    dish.tag = tag
    db.commit()
    db.refresh(dish)
    return dish
