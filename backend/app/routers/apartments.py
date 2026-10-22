from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app import models, schemas, auth
import os, shutil, uuid

router = APIRouter(prefix="/api/apartments", tags=["apartments"])

UPLOAD_DIR = "uploads/apartments"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.get("/", response_model=List[schemas.ApartmentResponse])
def list_apartments(
    search: Optional[str] = Query(None),
    min_price: Optional[float] = Query(None),
    max_price: Optional[float] = Query(None),
    bedrooms: Optional[int] = Query(None),
    status: Optional[str] = Query(None),
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    query = db.query(models.Apartment)
    if search:
        query = query.filter(
            models.Apartment.unit_number.ilike(f"%{search}%") |
            models.Apartment.description.ilike(f"%{search}%")
        )
    if min_price is not None:
        query = query.filter(models.Apartment.rent_price >= min_price)
    if max_price is not None:
        query = query.filter(models.Apartment.rent_price <= max_price)
    if bedrooms is not None:
        query = query.filter(models.Apartment.bedrooms == bedrooms)
    if status:
        query = query.filter(models.Apartment.status == status)
    return query.offset(skip).limit(limit).all()


@router.get("/{apartment_id}", response_model=schemas.ApartmentResponse)
def get_apartment(apartment_id: int, db: Session = Depends(get_db)):
    apt = db.query(models.Apartment).filter(models.Apartment.apartment_id == apartment_id).first()
    if not apt:
        raise HTTPException(status_code=404, detail="Apartment not found")
    return apt


@router.post("/", response_model=schemas.ApartmentResponse)
def create_apartment(
    apartment: schemas.ApartmentCreate,
    db: Session = Depends(get_db),
    current_admin: models.Admin = Depends(auth.get_current_admin)
):
    db_apt = models.Apartment(**apartment.model_dump())
    db.add(db_apt)
    db.commit()
    db.refresh(db_apt)
    return db_apt


@router.put("/{apartment_id}", response_model=schemas.ApartmentResponse)
def update_apartment(
    apartment_id: int,
    apartment: schemas.ApartmentUpdate,
    db: Session = Depends(get_db),
    current_admin: models.Admin = Depends(auth.get_current_admin)
):
    db_apt = db.query(models.Apartment).filter(models.Apartment.apartment_id == apartment_id).first()
    if not db_apt:
        raise HTTPException(status_code=404, detail="Apartment not found")
    for key, value in apartment.model_dump(exclude_unset=True).items():
        setattr(db_apt, key, value)
    db.commit()
    db.refresh(db_apt)
    return db_apt


@router.delete("/{apartment_id}")
def delete_apartment(
    apartment_id: int,
    db: Session = Depends(get_db),
    current_admin: models.Admin = Depends(auth.get_current_admin)
):
    db_apt = db.query(models.Apartment).filter(models.Apartment.apartment_id == apartment_id).first()
    if not db_apt:
        raise HTTPException(status_code=404, detail="Apartment not found")
    db.delete(db_apt)
    db.commit()
    return {"message": "Apartment deleted"}


@router.post("/{apartment_id}/upload-image")
async def upload_apartment_image(
    apartment_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_admin: models.Admin = Depends(auth.get_current_admin)
):
    db_apt = db.query(models.Apartment).filter(models.Apartment.apartment_id == apartment_id).first()
    if not db_apt:
        raise HTTPException(status_code=404, detail="Apartment not found")

    ext = os.path.splitext(file.filename)[1]
    filename = f"{uuid.uuid4()}{ext}"
    filepath = os.path.join(UPLOAD_DIR, filename)

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    images = db_apt.images or []
    images.append(f"/uploads/apartments/{filename}")
    db_apt.images = images
    db.commit()
    db.refresh(db_apt)
    return {"image_url": f"/uploads/apartments/{filename}", "apartment": db_apt}
