from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.database import Base, engine
from app.routers import apartments, applications, inquiries, gallery, admin, announcements
import os

# Create all tables
Base.metadata.create_all(bind=engine)

# Ensure upload dirs exist
os.makedirs("uploads/apartments", exist_ok=True)
os.makedirs("uploads/documents", exist_ok=True)
os.makedirs("uploads/gallery", exist_ok=True)

app = FastAPI(
    title="Apartment Website API",
    description="REST API for Apartment Website",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files for uploads
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Routers
app.include_router(admin.router)
app.include_router(apartments.router)
app.include_router(applications.router)
app.include_router(inquiries.router)
app.include_router(gallery.router)
app.include_router(announcements.router)


@app.get("/")
def root():
    return {"message": "Apartment Website API is running", "docs": "/docs"}


@app.get("/health")
def health():
    return {"status": "ok"}
