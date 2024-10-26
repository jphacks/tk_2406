from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# CORSの設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Order(BaseModel):
    items: list


def calculate_alcohol_intensity(order_items):
    for i in order_items:
        print(i)
    intensity = len(order_items)
    return intensity


@app.post("/calculate-alcohol/")
async def calculate_alcohol(order: Order):
    intensity = calculate_alcohol_intensity(order.items)
    return {"intensity": intensity}
