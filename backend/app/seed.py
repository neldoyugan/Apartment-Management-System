"""
Seed script — run once to create default admin and sample apartments.
Usage: python -m app.seed (from backend/ directory)
"""
from app.database import SessionLocal, engine, Base
from app import models
from app.auth import get_password_hash

def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # ── Admin ────────────────────────────────────────────────
        if not db.query(models.Admin).filter(models.Admin.username == "admin").first():
            admin = models.Admin(
                username="admin",
                hashed_password=get_password_hash("admin123"),
                full_name="System Administrator"
            )
            db.add(admin)
        print("[OK] Admin created: admin / admin123")

        # ── Apartments ───────────────────────────────────────────
        sample_apartments = [
            {
                "unit_number": "101",
                "description": "Cozy studio apartment on the first floor with city views. Modern interior with full kitchen and high-speed Wi-Fi included.",
                "rent_price": 12000,
                "bedrooms": 1,
                "bathrooms": 1,
                "floor_area": 35.0,
                "status": "available",
                "amenities": ["Wi-Fi", "Air Conditioning", "Kitchen", "City View"],
                "images": []
            },
            {
                "unit_number": "201",
                "description": "Spacious 2-bedroom apartment with a stunning panoramic view. Features two full bathrooms, walk-in closet, and premium appliances.",
                "rent_price": 20000,
                "bedrooms": 2,
                "bathrooms": 2,
                "floor_area": 65.0,
                "status": "available",
                "amenities": ["Wi-Fi", "Air Conditioning", "Kitchen", "Panoramic View", "Walk-in Closet"],
                "images": []
            },
            {
                "unit_number": "302",
                "description": "Luxurious 3-bedroom penthouse suite with private terrace. Perfect for families seeking space and elegance.",
                "rent_price": 35000,
                "bedrooms": 3,
                "bathrooms": 2,
                "floor_area": 110.0,
                "status": "available",
                "amenities": ["Wi-Fi", "Air Conditioning", "Kitchen", "Private Terrace", "Parking"],
                "images": []
            },
            {
                "unit_number": "102",
                "description": "Fully furnished studio with balcony access. Ideal for young professionals. Utilities included in rent.",
                "rent_price": 14500,
                "bedrooms": 1,
                "bathrooms": 1,
                "floor_area": 38.0,
                "status": "occupied",
                "amenities": ["Wi-Fi", "Air Conditioning", "Balcony", "Furnished"],
                "images": []
            },
            {
                "unit_number": "205",
                "description": "Modern 2-bedroom unit with open floor plan. Corner unit with abundant natural light and garden view.",
                "rent_price": 22000,
                "bedrooms": 2,
                "bathrooms": 1,
                "floor_area": 70.0,
                "status": "available",
                "amenities": ["Wi-Fi", "Air Conditioning", "Garden View", "Corner Unit"],
                "images": []
            },
            {
                "unit_number": "303",
                "description": "Executive 3-bedroom suite with dedicated workspace. Premium finishes throughout with smart home features.",
                "rent_price": 38000,
                "bedrooms": 3,
                "bathrooms": 3,
                "floor_area": 120.0,
                "status": "maintenance",
                "amenities": ["Wi-Fi", "Smart Home", "Air Conditioning", "Private Office", "Parking"],
                "images": []
            },
        ]

        for apt_data in sample_apartments:
            if not db.query(models.Apartment).filter(models.Apartment.unit_number == apt_data["unit_number"]).first():
                apt = models.Apartment(**apt_data)
                db.add(apt)

        # ── Announcements ────────────────────────────────────────
        if db.query(models.Announcement).count() == 0:
            announcements = [
                models.Announcement(
                    title="Welcome to Solara Residences!",
                    content="We're thrilled to welcome you to Solara Residences. Our team is dedicated to providing you with a comfortable and luxurious living experience. Feel free to reach out to us for any questions.",
                    is_published=1
                ),
                models.Announcement(
                    title="New Amenity: Rooftop Garden Now Open",
                    content="We're excited to announce the grand opening of our rooftop garden. Residents can now enjoy stunning panoramic city views while relaxing in a beautifully landscaped environment.",
                    is_published=1
                ),
                models.Announcement(
                    title="Maintenance Schedule — Water Interruption",
                    content="Please be advised that there will be a scheduled water interruption on June 28, 2026, from 8:00 AM to 12:00 PM for routine pipe maintenance. We apologize for any inconvenience.",
                    is_published=1
                ),
            ]
            for ann in announcements:
                db.add(ann)

        db.commit()
        print("[OK] Sample data seeded successfully!")

    finally:
        db.close()


if __name__ == "__main__":
    seed()
