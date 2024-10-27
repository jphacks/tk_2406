from sqlalchemy.orm import Session
from sqlalchemy.sql.expression import and_
from sqlalchemy import func
from app.models import Order, OrderItem, Food, FoodAlcohol

def get_status(db: Session, c_id: int):
    total = db.query(
        func.sum(FoodAlcohol.degree * FoodAlcohol.f_quantity * OrderItem.o_quantity)
    ).select_from(Order).join(
        OrderItem, Order.o_id == OrderItem.o_id
    ).join(
        Food, OrderItem.f_id == Food.f_id
    ).join(
        FoodAlcohol, Food.f_id == FoodAlcohol.f_id
    ).filter(
        and_(Order.c_id == c_id, Order.is_evaluated == False)
    ).scalar()
    
    total = 0 if total is None else total

    #### FIX ME!!!! ####
    # total: 飲酒量(ml)×アルコール度数(%)×注文数
    # 純アルコール量が20gを超えるかどうかを判定する
    # https://www.asahibeer.co.jp/customer/alcohol/
    if total*0.8 < 10:#まだ大丈夫
        status = "green"
    elif total*0.8 < 20:#もう少しでアウト
        status = "yellow"
    else:#アウト
        status = "red"

    return status
