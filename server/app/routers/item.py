from fastapi import APIRouter, Path, Query, HTTPException, Depends
from app.cruds import item as item_cruds, auth as auth_cruds
from starlette import status
from app.schemas import ItemCreate, ItemUpdate, ItemResponse, DecodedToken
from sqlalchemy.orm import Session
from app.database import get_db
from typing import Annotated

# DbDependency = Annotated[Session, Depends(get_db)]

# UserDependency = Annotated[DecodedToken, Depends(auth_cruds.get_current_user)]

# router = APIRouter(prefix="/items", tags=["Items"])

# @router.get("", response_model=list[ItemResponse], status_code=status.HTTP_200_OK)
# async def find_all(db: DbDependency):
#     return item_cruds.find_all(db)

# @router.post("", response_model=ItemResponse, status_code=status.HTTP_201_CREATED)
# async def create(db: DbDependency, user: UserDependency, item_create: ItemCreate):
#     return item_cruds.create(db, item_create, user.user_id)

# @router.get("/", response_model=list[ItemResponse], status_code=status.HTTP_200_OK)
# async def find_by_name(db: DbDependency, name: str=Query(min_length=2, max_length=20)):
#     return item_cruds.find_by_name(db, name)

# @router.get("/{id}", response_model=ItemResponse, status_code=status.HTTP_200_OK)
# async def find_by_id(db: DbDependency, user: UserDependency, id: int=Path(gt=0)):
#     found_item = item_cruds.find_by_id(db, id, user.user_id)
#     if not found_item:
#         raise HTTPException(status_code=404, detail="Item not found")
#     return found_item

# @router.put("/{id}", response_model=ItemResponse, status_code=status.HTTP_200_OK)
# async def update(db: DbDependency, user: UserDependency, item_update: ItemUpdate, id: int=Path(gt=0)):
#     update_item = item_cruds.update(db, id, item_update, user.user_id)
#     if not update_item:
#         raise HTTPException(status_code=404, detail="Item not found")
#     return update_item

# @router.delete("/{id}", response_model=ItemResponse, status_code=status.HTTP_202_ACCEPTED)
# async def delete(db: DbDependency, user: UserDependency, id: int=Path(gt=0)):
#     delete_item = item_cruds.delete(db, id, user.user_id)
#     if not delete_item:
#         raise HTTPException(status_code=404, detail="Item not found")
#     return delete_item