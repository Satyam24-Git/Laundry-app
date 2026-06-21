from typing import Optional
from sqlmodel import Field, SQLModel
from datetime import datetime
import uuid

class UserBase(SQLModel):
    email: str
    phone: Optional[str] = None
    full_name: Optional[str] = None
    role: str = "customer"

class User(UserBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class UserCreate(UserBase):
    password: str

class UserRead(UserBase):
    id: uuid.UUID
    created_at: datetime
