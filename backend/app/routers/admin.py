from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import timedelta
from app.database import get_db
from app import models, schemas, auth

router = APIRouter(prefix="/api/admin", tags=["admin"])


@router.post("/login", response_model=schemas.Token)
def login(credentials: schemas.AdminLogin, db: Session = Depends(get_db)):
    admin = auth.authenticate_admin(db, credentials.username, credentials.password)
    if not admin:
        raise HTTPException(status_code=401, detail="Invalid username or password")
    access_token = auth.create_access_token(
        data={"sub": admin.username},
        expires_delta=timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me")
def get_me(current_admin: models.Admin = Depends(auth.get_current_admin)):
    return {
        "admin_id": current_admin.admin_id,
        "username": current_admin.username,
        "full_name": current_admin.full_name
    }


@router.get("/stats", response_model=schemas.DashboardStats)
def get_stats(
    db: Session = Depends(get_db),
    current_admin: models.Admin = Depends(auth.get_current_admin)
):
    total_apartments = db.query(models.Apartment).count()
    available_units = db.query(models.Apartment).filter(models.Apartment.status == "available").count()
    occupied_units = db.query(models.Apartment).filter(models.Apartment.status == "occupied").count()
    total_applications = db.query(models.Application).count()
    pending_applications = db.query(models.Application).filter(models.Application.status == "pending").count()
    total_inquiries = db.query(models.Inquiry).count()
    unread_inquiries = db.query(models.Inquiry).filter(models.Inquiry.is_read == 0).count()
    total_gallery = db.query(models.Gallery).count()

    return schemas.DashboardStats(
        total_apartments=total_apartments,
        available_units=available_units,
        occupied_units=occupied_units,
        total_applications=total_applications,
        pending_applications=pending_applications,
        total_inquiries=total_inquiries,
        unread_inquiries=unread_inquiries,
        total_gallery=total_gallery
    )
