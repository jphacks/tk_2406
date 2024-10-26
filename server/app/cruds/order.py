from app.schemas import OrderCreate
from sqlalchemy.orm import Session
from app.models import Order, OrderItem

def find_all(db: Session):
    return db.query(Order).all()

# def find_by_id(db: Session, id: int, user_id: int):
#     return db.query(Order).filter(Order.id == id).filter(Order.user_id == user_id).first()

# def find_by_name(db: Session, name: str):
#     return db.query(Order).filter(Order.name.like(f"%{name}%")).all()

def create(db: Session, order_create: OrderCreate, r_id: int, c_id: int):
    order_data = order_create.model_dump() # order_data = {f_ids: [1], quantity: 1}
    quantity = order_data["quantity"]
    f_ids = order_data["f_ids"]
    
    new_order = Order(c_id=c_id, r_id=r_id)
    
    db.add(new_order)
    db.commit()
    db.refresh(new_order)
    
    for f_id in f_ids:
        new_order_item = OrderItem(o_id=new_order.o_id, f_id=f_id, o_quantity=quantity)
        db.add(new_order_item)
    db.commit()
    return new_order

# def update(db: Session, id: int, order_update: OrderUpdate, user_id: int):
#     order = find_by_id(db, id, user_id)
#     if order is None:
#         return None
#     order.name = order.name if order_update.name is None else order_update.name
#     order.price = order.price if order_update.price is None else order_update.price
#     order.description = order.description if order_update.description is None else order_update.description
#     order.status = order.status if order_update.status is None else order_update.status
#     db.add(order)
#     db.commit()
#     return order


# def delete(db: Session, id: int, user_id: int):
#     order = find_by_id(db, id, user_id)
#     if order is None:
#         return None
#     db.delete(order)
#     db.commit()
#     return order