from pydantic import BaseModel
from typing import Optional
import uuid

class ServiceBase(BaseModel):
    name: str
    description: Optional[str] = None
    base_price: float
    is_active: bool = True

class Service(ServiceBase):
    id: uuid.UUID

class PackageBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    is_active: bool = True

class Package(PackageBase):
    id: uuid.UUID
