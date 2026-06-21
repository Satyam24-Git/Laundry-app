from fastapi import APIRouter, HTTPException
from typing import List
from app.models.service import Service, Package
from app.core.supabase import supabase

router = APIRouter()

@router.get("/", response_model=List[Service])
def get_services():
    try:
        response = supabase.table("services").select("*").eq("is_active", True).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/packages", response_model=List[Package])
def get_packages():
    try:
        response = supabase.table("packages").select("*").eq("is_active", True).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
