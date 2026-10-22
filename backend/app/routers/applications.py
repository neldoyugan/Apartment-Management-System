from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app import models, schemas, auth
import os, shutil, uuid, json

router = APIRouter(prefix="/api/applications", tags=["applications"])

UPLOAD_DIR = "uploads/documents"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/", response_model=schemas.ApplicationResponse)
async def submit_application(
    applicant_name: str = Form(...),
    contact_number: str = Form(...),
    email: str = Form(...),
    address: Optional[str] = Form(None),
    occupation: Optional[str] = Form(None),
    monthly_income: Optional[float] = Form(None),
    desired_unit: Optional[str] = Form(None),
    move_in_date: Optional[str] = Form(None),
    notes: Optional[str] = Form(None),
    document: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    document_path = None
    if document and document.filename:
        ext = os.path.splitext(document.filename)[1]
        filename = f"{uuid.uuid4()}{ext}"
        filepath = os.path.join(UPLOAD_DIR, filename)
        with open(filepath, "wb") as buffer:
            shutil.copyfileobj(document.file, buffer)
        document_path = f"/uploads/documents/{filename}"

    db_app = models.Application(
        applicant_name=applicant_name,
        contact_number=contact_number,
        email=email,
        address=address,
        occupation=occupation,
        monthly_income=monthly_income,
        desired_unit=desired_unit,
        move_in_date=move_in_date,
        notes=notes,
        document_path=document_path
    )
    db.add(db_app)
    db.commit()
    db.refresh(db_app)
    return db_app


@router.get("/", response_model=List[schemas.ApplicationResponse])
def list_applications(
    status: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_admin: models.Admin = Depends(auth.get_current_admin)
):
    query = db.query(models.Application)
    if status:
        query = query.filter(models.Application.status == status)
    return query.order_by(models.Application.application_date.desc()).offset(skip).limit(limit).all()


@router.get("/{application_id}", response_model=schemas.ApplicationResponse)
def get_application(
    application_id: int,
    db: Session = Depends(get_db),
    current_admin: models.Admin = Depends(auth.get_current_admin)
):
    app = db.query(models.Application).filter(models.Application.application_id == application_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    return app


@router.put("/{application_id}/status", response_model=schemas.ApplicationResponse)
def update_application_status(
    application_id: int,
    update: schemas.ApplicationUpdate,
    db: Session = Depends(get_db),
    current_admin: models.Admin = Depends(auth.get_current_admin)
):
    app = db.query(models.Application).filter(models.Application.application_id == application_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    if update.status:
        app.status = update.status
    db.commit()
    db.refresh(app)
    return app


@router.delete("/{application_id}")
def delete_application(
    application_id: int,
    db: Session = Depends(get_db),
    current_admin: models.Admin = Depends(auth.get_current_admin)
):
    app = db.query(models.Application).filter(models.Application.application_id == application_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    db.delete(app)
    db.commit()
    return {"message": "Application deleted"}
