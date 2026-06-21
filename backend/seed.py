from app.core.supabase import supabase
from datetime import datetime, timedelta

def seed_db():
    print("Seeding database...")
    
    # 1. Services
    services_data = [
        {"name": "Wash & Fold", "description": "Everyday laundry washed and folded", "base_price": 0, "is_active": True},
        {"name": "Wash & Iron", "description": "Everyday laundry washed and ironed", "base_price": 0, "is_active": True},
        {"name": "Dry Cleaning", "description": "Premium dry cleaning for delicate fabrics", "base_price": 0, "is_active": True},
        {"name": "Shoe Cleaning", "description": "Professional shoe cleaning", "base_price": 199, "is_active": True},
        {"name": "Blazer / Suit", "description": "Premium dry cleaning for suits", "base_price": 299, "is_active": True},
        {"name": "Blankets", "description": "Heavy blanket washing", "base_price": 349, "is_active": True}
    ]
    print("Inserting services...")
    for s in services_data:
        try:
            supabase.table("services").insert(s).execute()
        except Exception as e:
            print(f"Skipping service {s['name']}: {e}")

    # 2. Packages
    packages_data = [
        {"name": "Small Load", "description": "15-20 Clothes (1 Person)", "price": 249, "is_active": True},
        {"name": "Medium Load", "description": "25-35 Clothes (2 People)", "price": 499, "is_active": True},
        {"name": "Large Load", "description": "40-60 Clothes (Family)", "price": 999, "is_active": True}
    ]
    print("Inserting packages...")
    for p in packages_data:
        try:
            supabase.table("packages").insert(p).execute()
        except Exception as e:
            print(f"Skipping package {p['name']}: {e}")

    # 3. User
    # Note: we are inserting directly into public.users which is fine for custom auth table or extended profile
    # The actual ID used in the mock auth is "00000000-0000-0000-0000-000000000000", let's create a user with that ID
    mock_user_id = "00000000-0000-0000-0000-000000000000"
    user_data = {
        "id": mock_user_id,
        "email": "john.smith@example.com",
        "phone": "+91 9876543210",
        "full_name": "John Smith",
        "role": "customer"
    }
    print("Inserting user...")
    try:
        supabase.table("users").insert(user_data).execute()
    except Exception as e:
        print(f"Skipping user: {e}")

    # 4. Addresses
    addresses_data = [
        {
            "user_id": mock_user_id,
            "title": "Home",
            "flat_number": "Apt 4B",
            "building_name": "Sunrise Towers",
            "area": "123 Main St",
            "city": "Mumbai",
            "pincode": "400001",
            "is_default": True
        },
        {
            "user_id": mock_user_id,
            "title": "Office",
            "flat_number": "Block B",
            "building_name": "Tech Park",
            "area": "Andheri East",
            "city": "Mumbai",
            "pincode": "400069",
            "is_default": False
        }
    ]
    print("Inserting addresses...")
    for a in addresses_data:
        try:
            supabase.table("addresses").insert(a).execute()
        except Exception as e:
            print(f"Skipping address {a['title']}: {e}")

    # 5. Coupons
    valid_until = (datetime.now() + timedelta(days=30)).isoformat()
    coupons_data = [
        {
            "code": "SAVE50",
            "discount_percentage": 50,
            "max_discount_amount": 200,
            "min_order_amount": 300,
            "valid_until": valid_until,
            "is_active": True
        },
        {
            "code": "WELCOME20",
            "discount_percentage": 20,
            "max_discount_amount": 100,
            "min_order_amount": 250,
            "valid_until": valid_until,
            "is_active": True
        }
    ]
    print("Inserting coupons...")
    for c in coupons_data:
        try:
            supabase.table("coupons").insert(c).execute()
        except Exception as e:
            print(f"Skipping coupon {c['code']}: {e}")

    print("Seeding complete!")

if __name__ == "__main__":
    seed_db()
