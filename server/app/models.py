from app.database import Base
from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

class Restaurant(Base):
    __tablename__ = "restaurants"
    __table_args__ = {'extend_existing': True}
    r_id = Column(Integer, primary_key=True)
    r_name = Column(String(255), nullable=False, unique=True)
    password = Column(String(255), nullable=False)
    salt = Column(String(255), nullable=True)

class Food(Base):
    __tablename__ = "foods"
    __table_args__ = {'extend_existing': True}
    f_id = Column(Integer, primary_key=True)
    r_id = Column(Integer, ForeignKey("restaurants.r_id", ondelete="CASCADE"), nullable=False)
    f_name = Column(String(255), nullable=False, unique=True)
    price = Column(Integer, nullable=False)
    t_id = Column(Integer, ForeignKey("tags.t_id", ondelete="CASCADE"), nullable=False)
    is_alcohol = Column(Boolean, nullable=False)
    restaurant = relationship("Restaurant", back_populates="foods")

Restaurant.foods = relationship("Food", order_by=Food.f_id, back_populates="restaurant")

class Tag(Base):
    __tablename__ = "tags"
    __table_args__ = {'extend_existing': True}
    t_id = Column(Integer, primary_key=True)
    t_name = Column(String(255), nullable=False, unique=True)
    
Restaurant.tags = relationship("Tag", order_by=Tag.t_id, back_populates="restaurant")

class FoodAlcohol(Base):
    __tablename__ = "food_alcohol"
    __table_args__ = {'extend_existing': True}
    f_id = Column(Integer, ForeignKey("foods.f_id", ondelete="CASCADE"), primary_key=True)
    degree = Column(Float, nullable=False)
    f_quantity = Column(Integer, nullable=False)

    food = relationship("Food", back_populates="alcohol")

Food.alcohol = relationship("FoodAlcohol", uselist=False, back_populates="food")

class Customer(Base):
    __tablename__ = "customers"
    __table_args__ = {'extend_existing': True}
    c_id = Column(Integer, primary_key=True)
    c_name = Column(String(255), nullable=False, unique=True)
    email = Column(String(255), nullable=False)
    password = Column(String(255), nullable=False)
    salt = Column(String(255), nullable=True)

class Order(Base):
    __tablename__ = "orders"
    __table_args__ = {'extend_existing': True}
    o_id = Column(Integer, primary_key=True)
    c_id = Column(Integer, ForeignKey("customers.c_id", ondelete="CASCADE"), nullable=False)
    r_id = Column(Integer, ForeignKey("restaurants.r_id", ondelete="CASCADE"), nullable=False)
    o_datetime = Column(DateTime, default=datetime.now)

    customer = relationship("Customer", back_populates="orders")
    restaurant = relationship("Restaurant", back_populates="orders")

Customer.orders = relationship("Order", order_by=Order.o_id, back_populates="customer")
Restaurant.orders = relationship("Order", order_by=Order.o_id, back_populates="restaurant")

class OrderItem(Base):
    __tablename__ = "order_items"
    __table_args__ = {'extend_existing': True}
    oi_id = Column(Integer, primary_key=True)
    o_id = Column(Integer, ForeignKey("orders.o_id", ondelete="CASCADE"), nullable=False)
    f_id = Column(Integer, ForeignKey("foods.f_id", ondelete="CASCADE"), nullable=False)
    o_quantity = Column(Integer, nullable=False)

    order = relationship("Order", back_populates="items")
    food = relationship("Food")

Order.items = relationship("OrderItem", order_by=OrderItem.oi_id, back_populates="order")

class Evaluation(Base):
    __tablename__ = "evaluations"
    __table_args__ = {'extend_existing': True}
    e_id = Column(Integer, primary_key=True)
    c_id = Column(Integer, ForeignKey("customers.c_id", ondelete="CASCADE"), nullable=False)
    e_day = Column(DateTime, default=datetime.now)
    evaluation = Column(Boolean, nullable=False)
    total_quantity = Column(Integer, nullable=False)
    customer = relationship("Customer", back_populates="evaluations")

Customer.evaluations = relationship("Evaluation", order_by=Evaluation.e_id, back_populates="customer")