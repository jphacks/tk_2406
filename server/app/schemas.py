from enum import Enum
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from datetime import datetime

# class ItemStatus(Enum):
#     ON_SALE = "ON_SALE"
#     SOLD_OUT = "SOLD_OUT"

# class ItemCreate(BaseModel):
#     name: str = Field(min_length=2, max_length=20, examples=["PC"])
#     price: int = Field(gt=0, examples=[10000])
#     description: Optional[str] = Field(None, examples=["bihin"])

# class ItemUpdate(BaseModel):
#     name: Optional[str] = Field(None, min_length=2, max_length=20, examples=["PC"])
#     price: Optional[int] = Field(None, gt=0, examples=[10000])
#     description: Optional[str] = Field(None, examples=["bihin"])
#     status: Optional[ItemStatus] = Field(None, examples=[ItemStatus.ON_SALE])

# class ItemResponse(BaseModel):
#     id: int = Field(gt=0, examples=[1])
#     name: Optional[str] = Field(min_length=2, max_length=20, examples=["PC"])
#     price: Optional[int] = Field(gt=0, examples=[10000])
#     description: Optional[str] = Field(examples=["bihin"])
#     status: Optional[ItemStatus] = Field(examples=[ItemStatus.ON_SALE])
#     created_at: datetime
#     updated_at: datetime
#     model_config = ConfigDict(from_attributes=True)
#     user_id: int

class TagCreate(BaseModel):
    t_name: str = Field(min_length=1, examples=["drink"])

class TagResponse(BaseModel):
    t_id: int = Field(gt=0, examples=[1])
    r_id: int = Field(gt=0, examples=[1])
    t_name: str = Field(min_length=1, examples=["drink"])
    model_config = ConfigDict(from_attributes=True)

class RestaurantCreate(BaseModel):
    r_name: str = Field(min_length=2, examples=["user1"])
    password: str = Field(min_length=8, examples=["test1234"])

class CustomerCreate(BaseModel):
    c_name: str = Field(min_length=2, examples=["user1"])
    email: str = Field(examples=["test@example.com"])
    password: str = Field(min_length=8, examples=["test1234"])

class OrderUnit(BaseModel):
    f_id: int = Field(gt=0, examples=[1])
    quantity: int = Field(gt=0, examples=[1])

class OrderCreate(BaseModel):
    orders: List[OrderUnit] = Field(default_factory=list, examples=[[
        {"f_id": 1, "quantity": 1},
        {"f_id": 2, "quantity": 10}
    ]])

class UrlCheck(BaseModel):
    check: str = Field(min_length=1, examples=["HASHEDIDANDPASSWORD"])

class UrlResponse(BaseModel):
    r_id:  int = Field(gt=0, examples=[1])
    check: str = Field(min_length=1, examples=["HASHEDIDANDPASSWORD"])

class OrderResponse(BaseModel):
    pass

class Token(BaseModel):
    access_token: str
    token_type: str

class DecodedToken(BaseModel):
    name: str
    id: int

class RestaurantCreate(BaseModel):
    r_name: str = Field(min_length=2, examples=["user1"])
    password: str = Field(min_length=8, examples=["test1234"])

class CustomerCreate(BaseModel):
    c_name: str = Field(min_length=2, examples=["user1"])
    email: str = Field(examples=["test@example.com"])
    password: str = Field(min_length=8, examples=["test1234"])


    
class DishCreate(BaseModel):
    f_name: str = Field(min_length=2, examples=["Beer"])
    price: int = Field(gt=0, examples=[500])
    t_id: int = Field(gt=0, examples=[1])
    is_alcohol: bool = Field(examples=[True], default=False)
    degree: Optional[float] = Field(None, examples=[5.0])
    f_quantity: Optional[int] = Field(None, examples=[100])

class DishUpdate(BaseModel):
    f_name: Optional[str] = Field(default=None, min_length=2, example="Beer")
    price: Optional[int] = Field(default=None, gt=0, example=500)
    is_alcohol: Optional[bool] = Field(default=None, example=True)
    degree: Optional[float] = Field(default=None, example=5.0)
    f_quantity: Optional[int] = Field(default=None, example=100)

class DishResponse(BaseModel):
    r_id: int = Field(gt=0, examples=[1])
    f_id: int = Field(gt=0, examples=[1])
    f_name: str = Field(min_length=2, examples=["Beer"])
    price : int = Field(gt=0, examples=[500])
    tag : str = Field(min_length=2, examples=["drink"])
    is_alcohol: bool = Field(examples=[True], default=False)
    degree: Optional[float] = Field(None, example=5.0)  # Optional field
    f_quantity: Optional[int] = Field(None, example=100)  # Optional field