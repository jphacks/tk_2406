from fastapi import FastAPI, Request

from app.routers import restaurant, customer, order, evaluate

from fastapi.middleware.cors import CORSMiddleware
import time

app = FastAPI()

origins = [
    "http://10.10.2.46:80",  # フロントエンドのオリジン
    "http://localhost:5173",
    # 他に許可したいオリジンがあれば追加
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 許可するオリジンのリスト
    allow_credentials=True,
    allow_methods=["*"],  # 許可するHTTPメソッド（GET, POSTなど）
    allow_headers=["*"],  # 許可するHTTPヘッダー
)


@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response

app.include_router(restaurant.router)
app.include_router(customer.router)
app.include_router(order.router)
app.include_router(evaluate.router)
