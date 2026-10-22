from sqlalchemy import Column, Integer, String, Text, Float, DateTime, Enum, JSON
from sqlalchemy.sql import func
from app.database import Base


class Apartment(Base):
    __tablename__ = "apartments"

    apartment_id = Column(Integer, primary_key=True, index=True)
    unit_number = Column(String(50), unique=True, nullable=False)
    description = Column(Text)
    rent_price = Column(Float, nullable=False)
    bedrooms = Column(Integer, nullable=False)
    bathrooms = Column(Integer, nullable=False)
    floor_area = Column(Float, nullable=True)
    status = Column(Enum("available", "occupied", "maintenance"), default="available")
    images = Column(JSON, default=list)
    amenities = Column(JSON, default=list)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class Application(Base):
    __tablename__ = "applications"

    application_id = Column(Integer, primary_key=True, index=True)
    applicant_name = Column(String(150), nullable=False)
    contact_number = Column(String(30), nullable=False)
    email = Column(String(150), nullable=False)
    address = Column(Text)
    occupation = Column(String(100))
    monthly_income = Column(Float)
    desired_unit = Column(String(50))
    move_in_date = Column(String(20))
    document_path = Column(String(300))
    notes = Column(Text)
    application_date = Column(DateTime(timezone=True), server_default=func.now())
    status = Column(Enum("pending", "approved", "rejected", "under_review"), default="pending")


class Inquiry(Base):
    __tablename__ = "inquiries"

    inquiry_id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(150), nullable=False)
    email = Column(String(150), nullable=False)
    phone = Column(String(30))
    subject = Column(String(200))
    message = Column(Text, nullable=False)
    inquiry_date = Column(DateTime(timezone=True), server_default=func.now())
    is_read = Column(Integer, default=0)


class Admin(Base):
    __tablename__ = "admins"

    admin_id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, nullable=False)
    hashed_password = Column(String(300), nullable=False)
    full_name = Column(String(150))
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Gallery(Base):
    __tablename__ = "gallery"

    gallery_id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200))
    image_path = Column(String(300), nullable=False)
    category = Column(Enum("apartment", "building", "facility"), default="apartment")
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Announcement(Base):
    __tablename__ = "announcements"

    announcement_id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    content = Column(Text, nullable=False)
    is_published = Column(Integer, default=1)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
