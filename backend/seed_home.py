from app.core.supabase import supabase
from datetime import datetime, timedelta

def seed_home():
    print("Seeding Home Page Data...")

    # 1. Clear old data to prevent duplicates (using delete with filters)
    print("Clearing old data...")
    supabase.table("coupons").delete().neq("id", "00000000-0000-0000-0000-000000000000").execute()
    supabase.table("services").delete().neq("id", "00000000-0000-0000-0000-000000000000").execute()
    supabase.table("addresses").delete().neq("id", "00000000-0000-0000-0000-000000000000").execute()
    
    # 2. Re-seed Address
    mock_user_id = "00000000-0000-0000-0000-000000000000"
    
    address = {
        "user_id": mock_user_id,
        "title": "Home",
        "flat_number": "",
        "building_name": "",
        "area": "Central",
        "city": "Pune",
        "state": "Maharahshatra",
        "pincode": "411001",
        "is_default": True
    }
    supabase.table("addresses").insert(address).execute()

    # 3. Re-seed Coupons (matching the 40% offer)
    valid_until = (datetime.now() + timedelta(days=30)).isoformat()
    coupons = [
        {
            "code": "SPECIAL40",
            "discount_percentage": 40,
            "max_discount_amount": 200,
            "min_order_amount": 300,
            "valid_until": valid_until,
            "is_active": True
        }
    ]
    for c in coupons:
        supabase.table("coupons").insert(c).execute()

    # 4. Re-seed Services (matching the icons in the screenshot)
    services = [
        {
            "name": "Washing", 
            "description": "Everyday laundry washing", 
            "base_price": 50, 
            "is_active": True,
            "icon_url": "https://img.icons8.com/?size=100&id=10243&format=png&color=0093D9"
        },
        {
            "name": "Iron", 
            "description": "Professional Ironing", 
            "base_price": 20, 
            "is_active": True,
            "icon_url": "https://img.icons8.com/?size=100&id=11197&format=png&color=0093D9"
        },
        {
            "name": "Dry Clean", 
            "description": "Premium dry cleaning", 
            "base_price": 100, 
            "is_active": True,
            "icon_url": "https://img.icons8.com/?size=100&id=46115&format=png&color=0093D9"
        },
        {
            "name": "Carpet Cleaning", 
            "description": "Deep carpet cleaning", 
            "base_price": 500, 
            "is_active": True,
            "icon_url": "https://img.icons8.com/?size=100&id=54418&format=png&color=0093D9"
        }
    ]
    for s in services:
        supabase.table("services").insert(s).execute()

    print("Home page seed complete!")

if __name__ == "__main__":
    seed_home()
