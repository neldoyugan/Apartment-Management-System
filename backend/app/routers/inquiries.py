from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app import models, schemas, auth

router = APIRouter(prefix="/api/inquiries", tags=["inquiries"])


@router.post("/", response_model=schemas.InquiryResponse)
def submit_inquiry(inquiry: schemas.InquiryCreate, db: Session = Depends(get_db)):
    db_inquiry = models.Inquiry(**inquiry.model_dump())
    db.add(db_inquiry)
    db.commit()
    db.refresh(db_inquiry)
    return db_inquiry


@router.get("/", response_model=List[schemas.InquiryResponse])
def list_inquiries(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_admin: models.Admin = Depends(auth.get_current_admin)
):
    return db.query(models.Inquiry).order_by(models.Inquiry.inquiry_date.desc()).offset(skip).limit(limit).all()


@router.get("/{inquiry_id}", response_model=schemas.InquiryResponse)
def get_inquiry(
    inquiry_id: int,
    db: Session = Depends(get_db),
    current_admin: models.Admin = Depends(auth.get_current_admin)
):
    inq = db.query(models.Inquiry).filter(models.Inquiry.inquiry_id == inquiry_id).first()
    if not inq:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    # Mark as read
    inq.is_read = 1
    db.commit()
    db.refresh(inq)
    return inq


@router.delete("/{inquiry_id}")
def delete_inquiry(
    inquiry_id: int,
    db: Session = Depends(get_db),
    current_admin: models.Admin = Depends(auth.get_current_admin)
):
    inq = db.query(models.Inquiry).filter(models.Inquiry.inquiry_id == inquiry_id).first()
    if not inq:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    db.delete(inq)
    db.commit()
    return {"message": "Inquiry deleted"}
