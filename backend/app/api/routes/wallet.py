from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import uuid
from app.core.supabase import supabase

router = APIRouter()

def get_current_user_id() -> str:
    return "00000000-0000-0000-0000-000000000000"

class Transaction(BaseModel):
    id: uuid.UUID
    amount: float
    type: str # 'credit' or 'debit'
    description: str
    created_at: datetime

class RechargeRequest(BaseModel):
    amount: float

class RechargeResponse(BaseModel):
    message: str
    amount: float
    new_balance: float

class Coupon(BaseModel):
    id: uuid.UUID
    code: str
    discount_percentage: float
    max_discount_amount: float
    min_order_amount: float

class WalletBalance(BaseModel):
    balance: float

@router.get("/transactions", response_model=List[Transaction])
def get_transactions(user_id: str = Depends(get_current_user_id)):
    try:
        response = supabase.table("payments").select("*").eq("user_id", user_id).execute()
        
        transactions = []
        for payment in response.data:
            transactions.append({
                "id": payment["id"],
                "amount": payment["amount"],
                "type": "credit" if payment.get("status") == "completed" else "debit",
                "description": f"Payment via {payment.get('payment_method', 'unknown')}",
                "created_at": payment["created_at"]
            })
        return transactions
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/recharge", response_model=RechargeResponse)
def recharge_wallet(req: RechargeRequest, user_id: str = Depends(get_current_user_id)):
    try:
        payment_data = {
            "user_id": user_id,
            "amount": req.amount,
            "status": "completed",
            "payment_method": "Mock Gateway"
        }
        res = supabase.table("payments").insert(payment_data).execute()
        
        return RechargeResponse(
            message="Wallet recharged successfully",
            amount=req.amount,
            new_balance=req.amount # mock balance
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/balance", response_model=WalletBalance)
def get_wallet_balance(user_id: str = Depends(get_current_user_id)):
    try:
        res = supabase.table("payments").select("*").eq("user_id", user_id).execute()
        balance = 1250.0 # Start with promotional balance
        for p in res.data:
            if p.get("status") == "completed":
                balance += float(p["amount"])
        return WalletBalance(balance=balance)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/coupons", response_model=List[Coupon])
def get_coupons():
    try:
        res = supabase.table("coupons").select("*").eq("is_active", True).execute()
        return res.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
