from sqlalchemy.orm import Session
from sqlalchemy.sql.expression import and_
from sqlalchemy import func
from app.models import Order, OrderItem, Food, FoodAlcohol, Evaluation

def is_evaluated(db: Session, c_id: int):

    not_evaluated_order = db.query(Order).filter(
       and_(Order.c_id == c_id, Order.is_evaluated == False)
    ).outerjoin(
        OrderItem, Order.o_id == OrderItem.o_id
    ).outerjoin(
        FoodAlcohol, OrderItem.f_id == FoodAlcohol.f_id
    ).all()

    return len(not_evaluated_order) == 0

def create(db: Session, c_id: int):
    
    # not_evaluated_orderの、OrderItemに紐づくFoodAlcoholを取得
    # FoodAlcoholのdegreeとf_quantityとOrderItem.o_quantityを掛け合わせた値を合計した値を取得する
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
    is_good = total*0.8 < 20

    # 評価情報をEvaluationsに記録する
    evaluation = Evaluation(c_id=c_id, evaluation=is_good, total_quantity=total)
    db.add(evaluation)

    # 評価したことを記録する
    db.query(Order).filter(
        and_(Order.c_id == c_id, Order.is_evaluated == False)
    ).update({Order.is_evaluated: True}, synchronize_session=False)

    db.commit()

    return total





