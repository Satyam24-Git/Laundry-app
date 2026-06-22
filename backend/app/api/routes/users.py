from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
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

class AddressCreate(BaseModel):
    title: str
    flat_number: str
    building_name: str
    area: str
    city: str
    pincode: str
    is_default: Optional[bool] = False

class AddressUpdate(BaseModel):
    title: Optional[str] = None
    flat_number: Optional[str] = None
    building_name: Optional[str] = None
    area: Optional[str] = None
    city: Optional[str] = None
    pincode: Optional[str] = None
    is_default: Optional[bool] = None

class UserProfile(BaseModel):
    id: uuid.UUID
    email: str
    phone: str
    full_name: str

class UserProfileUpdate(BaseModel):
    email: Optional[str] = None
    phone: Optional[str] = None
    full_name: Optional[str] = None

@router.get("/me", response_model=UserProfile)
def get_user_profile(user_id: str = Depends(get_current_user_id)):
    try:
        res = supabase.table("users").select("*").eq("id", user_id).execute()
        if not res.data:
            return UserProfile(id=user_id, email="john.smith@example.com", phone="+91 9876543210", full_name="John Smith")
        return res.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/me", response_model=UserProfile)
def update_user_profile(profile: UserProfileUpdate, user_id: str = Depends(get_current_user_id)):
    try:
        update_data = {k: v for k, v in profile.dict().items() if v is not None}
        if not update_data:
            raise HTTPException(status_code=400, detail="No fields to update")
            
        res = supabase.table("users").update(update_data).eq("id", user_id).execute()
        if not res.data:
            # Fallback for dummy user
            # In a real app we'd just raise 404, but to keep the frontend working if DB is empty:
            insert_data = {"id": user_id, "email": "john.smith@example.com", "phone": "+91 9876543210", "full_name": "John Smith"}
            insert_data.update(update_data)
            res = supabase.table("users").insert(insert_data).execute()
            if not res.data:
                raise HTTPException(status_code=400, detail="Failed to update profile")
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

@router.post("/me/addresses", response_model=Address)
def create_user_address(address: AddressCreate, user_id: str = Depends(get_current_user_id)):
    try:
        if address.is_default:
            supabase.table("addresses").update({"is_default": False}).eq("user_id", user_id).execute()
            
        data = address.dict()
        data["user_id"] = user_id
        res = supabase.table("addresses").insert(data).execute()
        if not res.data:
            raise HTTPException(status_code=400, detail="Failed to create address")
        return res.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/me/addresses/{address_id}", response_model=Address)
def update_user_address(address_id: str, address: AddressUpdate, user_id: str = Depends(get_current_user_id)):
    try:
        # Check if address belongs to user
        existing = supabase.table("addresses").select("*").eq("id", address_id).eq("user_id", user_id).execute()
        if not existing.data:
            raise HTTPException(status_code=404, detail="Address not found")
            
        update_data = {k: v for k, v in address.dict().items() if v is not None}
        if update_data.get("is_default"):
            supabase.table("addresses").update({"is_default": False}).eq("user_id", user_id).execute()

        if update_data:
            res = supabase.table("addresses").update(update_data).eq("id", address_id).execute()
            if not res.data:
                raise HTTPException(status_code=400, detail="Failed to update address")
            return res.data[0]
        return existing.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

