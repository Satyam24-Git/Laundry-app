from fastapi import APIRouter, HTTPException, Depends
from typing import List
from app.models.order import OrderCreate, OrderResponse
from app.core.supabase import supabase
import uuid

router = APIRouter()

# Mock user id dependency for now until auth is fully set up
def get_current_user_id() -> str:
    return "00000000-0000-0000-0000-000000000000"

@router.post("/", response_model=OrderResponse)
def create_order(order_in: OrderCreate, user_id: str = Depends(get_current_user_id)):
    try:
        order_data = {
            "customer_id": user_id,
            "address_id": str(order_in.address_id),
            "package_id": str(order_in.package_id),
            "total_amount": order_in.total_amount,
            "special_instructions": order_in.special_instructions,
            "pickup_date": order_in.pickup_date,
            "pickup_time_slot": order_in.pickup_time_slot,
            "status": "placed"
        }
        order_res = supabase.table("orders").insert(order_data).execute()
        if not order_res.data:
            raise HTTPException(status_code=500, detail="Failed to create order")
            
        order = order_res.data[0]

        if order_in.items:
            items_data = [
                {
                    "order_id": order["id"],
                    "service_id": str(item.service_id),
                    "quantity": item.quantity,
                    "price_per_unit": item.price_per_unit
                }
                for item in order_in.items
            ]
            supabase.table("order_items").insert(items_data).execute()

        # Append items to the order object to match response model if needed
        order["items"] = []
        return order
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/", response_model=List[OrderResponse])
def get_user_orders(user_id: str = Depends(get_current_user_id)):
    try:
        response = supabase.table("orders").select("*").eq("customer_id", user_id).execute()
        
        # Format response
        orders = response.data
        for order in orders:
            order["items"] = [] # Return empty items array for now or fetch items
            
        return orders
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
