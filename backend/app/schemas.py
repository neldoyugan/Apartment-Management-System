from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime


# ─── Apartment ───────────────────────────────────────────────────────────────

class ApartmentBase(BaseModel):
    unit_number: str
    description: Optional[str] = None
    rent_price: float
    bedrooms: int
    bathrooms: int
    floor_area: Optional[float] = None
    status: Optional[str] = "available"
    images: Optional[List[str]] = []
    amenities: Optional[List[str]] = []

class ApartmentCreate(ApartmentBase):
    pass

class ApartmentUpdate(BaseModel):
    unit_number: Optional[str] = None
    description: Optional[str] = None
    rent_price: Optional[float] = None
    bedrooms: Optional[int] = None
    bathrooms: Optional[int] = None
    floor_area: Optional[float] = None
    status: Optional[str] = None
    images: Optional[List[str]] = None
    amenities: Optional[List[str]] = None

class ApartmentResponse(ApartmentBase):
    apartment_id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ─── Application ─────────────────────────────────────────────────────────────

class ApplicationCreate(BaseModel):
    applicant_name: str
    contact_number: str
    email: str
    address: Optional[str] = None
    occupation: Optional[str] = None
    monthly_income: Optional[float] = None
    desired_unit: Optional[str] = None
    move_in_date: Optional[str] = None
    notes: Optional[str] = None

class ApplicationUpdate(BaseModel):
    status: Optional[str] = None

class ApplicationResponse(ApplicationCreate):
    application_id: int
    document_path: Optional[str] = None
    application_date: Optional[datetime] = None
    status: str

    class Config:
        from_attributes = True


# ─── Inquiry ─────────────────────────────────────────────────────────────────

class InquiryCreate(BaseModel):
    full_name: str
    email: str
    phone: Optional[str] = None
    subject: Optional[str] = None
    message: str

class InquiryResponse(InquiryCreate):
    inquiry_id: int
    inquiry_date: Optional[datetime] = None
    is_read: int

    class Config:
        from_attributes = True


# ─── Admin ───────────────────────────────────────────────────────────────────

class AdminLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None


# ─── Gallery ─────────────────────────────────────────────────────────────────

class GalleryResponse(BaseModel):
    gallery_id: int
    title: Optional[str] = None
    image_path: str
    category: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ─── Announcement ────────────────────────────────────────────────────────────

class AnnouncementCreate(BaseModel):
    title: str
    content: str
    is_published: Optional[int] = 1

class AnnouncementUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    is_published: Optional[int] = None

class AnnouncementResponse(AnnouncementCreate):
    announcement_id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ─── Stats ───────────────────────────────────────────────────────────────────

class DashboardStats(BaseModel):
    total_apartments: int
    available_units: int
    occupied_units: int
    total_applications: int
    pending_applications: int
    total_inquiries: int
    unread_inquiries: int
    total_gallery: int
