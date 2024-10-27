from sqlalchemy.orm import Session, joinedload
from app.schemas import  DecodedToken, DishResponse
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
    
def fing_tags_all(db:Session, r_id: int):
    return db.query(Tag).filter(Tag.r_id == r).all()

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
        ).filter(Food.r_id == r_id)
        .outerjoin(FoodAlcohol, Food.f_id == FoodAlcohol.f_id)
        .outerjoin(Tag, Food.t_id == Tag.t_id)
        .all()
    )
    dishes_all = [ DishResponse(
            f_id = item[0],
            f_name = item[1],
            price = item[2],
            is_alcohol = item[3],
            r_id = item[4],
            tag = item[5],
            degree = item[6],
            f_quantity = item[7]
        )
        for item in dishes_all]
    
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
        .filter(Food.r_id == r_id, Food.t_id == t_id)
        .outerjoin(FoodAlcohol, Food.f_id == FoodAlcohol.f_id)
        .outerjoin(Tag, Food.t_id == Tag.t_id)
        
        .all()
    )
    dishes_by_tag = [ DishResponse(
            f_id = item[0],
            f_name = item[1],
            price = item[2],
            is_alcohol = item[3],
            r_id = item[4],
            tag = item[5],
            degree = item[6],
            f_quantity = item[7]
        )
        for item in dishes_by_tag]
    return dishes_by_tag

def get_dishes_by_id(db: Session, r_id: int, f_id: int):
    """
    get one dish by f_id from a restaurant by r_id
    """
    dishes_by_id = (
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
    .filter(Food.r_id==r_id, Food.f_id == f_id)  # Filter by f_id
    .first()  # Get only one result
    )
    return DishResponse(
        f_id = dishes_by_id[0],
        f_name = dishes_by_id[1],
        price = dishes_by_id[2],
        is_alcohol = dishes_by_id[3],
        r_id = dishes_by_id[4],
        tag = dishes_by_id[5],
        degree = dishes_by_id[6],
        f_quantity = dishes_by_id[7]
    )

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

def create_dish(db: Session, r_id: int, f_name: str, price: int, t_id: int, is_alcohol: bool, degree: float, f_quantity: int):

    existing_dish = db.query(Food).filter(Food.r_id == r_id, Food.f_name == f_name).first()
    if existing_dish:
        return None
    # Create a new dish for a restaurant ID
    new_dish = Food(r_id=r_id, f_name=f_name, price=price, t_id=t_id, is_alcohol=is_alcohol)
    db.add(new_dish)
    db.commit()
    db.refresh(new_dish)

    if is_alcohol:      
        new_alcohol = FoodAlcohol(f_id=new_dish.f_id, degree=degree, f_quantity=f_quantity)
        db.add(new_alcohol)
    db.commit()
    

    return get_dishes_by_id(db, r_id, new_dish.f_id)

def update_dish(db: Session,f_id:int, r_id: int, updated_items: dict):
    existing_dish = db.query(Food).filter(Food.r_id == r_id, Food.f_id == f_id).first()
    if not existing_dish:
        return None

    for key, value in updated_items.items():
        if key not in ('degree', 'f_quantity'):
            setattr(existing_dish, key, value)
        else:
            if existing_dish.is_alcohol or updated_items.get('is_alcohol', None):
                existing_alcohol = db.query(FoodAlcohol).filter(FoodAlcohol.f_id == f_id).first()
                if existing_alcohol:
                    setattr(existing_alcohol, key, value)
                else:
                    raise Exception("Use cases not expected yet")
            else:
                return -1
    
    db.commit()
    update_dish = get_dishes_by_id(db, r_id, f_id)
    return DishResponse(
        f_id=update_dish.f_id,
        f_name=update_dish.f_name,
        price=update_dish.price,
        is_alcohol=update_dish.is_alcohol,
        r_id=update_dish.r_id,
        tag=update_dish.tag,
        degree=update_dish.degree,
        f_quantity=update_dish.f_quantity
    )

def delete_dish(db: Session, f_id: int, r_id: int):
    existing_dish = db.query(Food).filter(Food.r_id == r_id, Food.f_id == f_id).first()
    if not existing_dish:
        return None
    if existing_dish.is_alcohol:
        existing_alcohol = db.query(FoodAlcohol).filter(FoodAlcohol.f_id == f_id).first()
        db.delete(existing_alcohol)
    db.delete(existing_dish)
    db.commit()
    return True