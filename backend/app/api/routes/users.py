from fastapi import APIRouter, HTTPException, Depends
from typing import List
from pydantic import BaseModel
from app.core.supabase import supabase
import uuid

router = APIRouter()

def get_current_user_id() -> str:
    return "00000000-0000-0000-0000-000000000000"

class Address(BaseModel):
    id: uuid.UUID
    title: str
    flat_number: str
    building_name: str
    area: str
    city: str
    pincode: str
    is_default: bool

class UserProfile(BaseModel):
    id: uuid.UUID
    email: str
    phone: str
    full_name: str

@router.get("/me", response_model=UserProfile)
def get_user_profile(user_id: str = Depends(get_current_user_id)):
    try:
        res = supabase.table("users").select("*").eq("id", user_id).execute()
        if not res.data:
            return UserProfile(id=user_id, email="john.smith@example.com", phone="+91 9876543210", full_name="John Smith")
        return res.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/me/addresses", response_model=List[Address])
def get_user_addresses(user_id: str = Depends(get_current_user_id)):
    try:
        res = supabase.table("addresses").select("*").eq("user_id", user_id).execute()
        return res.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
