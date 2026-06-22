from app.core.supabase import supabase

def update_images():
    print("Updating service images...")
    
    updates = [
        {"name": "Wash & Fold", "icon_url": "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?q=80&w=600&auto=format&fit=crop"},
        {"name": "Wash & Iron", "icon_url": "https://images.unsplash.com/photo-1517677129300-07b130802f46?q=80&w=600&auto=format&fit=crop"},
        {"name": "Dry Cleaning", "icon_url": "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?q=80&w=600&auto=format&fit=crop"},
        {"name": "Shoe Cleaning", "icon_url": "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=600&auto=format&fit=crop"},
        {"name": "Blazer / Suit", "icon_url": "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?q=80&w=600&auto=format&fit=crop"},
        {"name": "Blankets", "icon_url": "https://images.unsplash.com/photo-1583847268964-b28e515d9cc0?q=80&w=600&auto=format&fit=crop"}
    ]
    
    for u in updates:
        try:
            supabase.table("services").update({"icon_url": u["icon_url"]}).eq("name", u["name"]).execute()
            print(f"Updated {u['name']}")
        except Exception as e:
            print(f"Failed to update {u['name']}: {e}")

if __name__ == "__main__":
    update_images()
