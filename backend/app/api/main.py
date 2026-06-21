from fastapi import APIRouter
from app.api.routes import users, services, orders, wallet

api_router = APIRouter()

api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(services.router, prefix="/services", tags=["services"])
api_router.include_router(orders.router, prefix="/orders", tags=["orders"])
api_router.include_router(wallet.router, prefix="/wallet", tags=["wallet"])
