from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import uuid

class OrderItemCreate(BaseModel):
    service_id: uuid.UUID
    quantity: int = 1
    price_per_unit: float

class OrderCreate(BaseModel):
    address_id: uuid.UUID
    package_id: uuid.UUID
    total_amount: float
    special_instructions: Optional[str] = None
    pickup_date: str
    pickup_time_slot: str
    items: List[OrderItemCreate] = []

class OrderResponse(OrderCreate):
    id: uuid.UUID
    customer_id: uuid.UUID
    status: str
    created_at: datetime
