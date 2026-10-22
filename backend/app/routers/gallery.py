from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app import models, schemas, auth
import os, shutil, uuid

router = APIRouter(prefix="/api/gallery", tags=["gallery"])

UPLOAD_DIR = "uploads/gallery"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.get("/", response_model=List[schemas.GalleryResponse])
def list_gallery(
    category: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Gallery)
    if category:
        query = query.filter(models.Gallery.category == category)
    return query.order_by(models.Gallery.created_at.desc()).all()


@router.post("/", response_model=schemas.GalleryResponse)
async def upload_gallery_image(
    title: Optional[str] = Form(None),
    category: str = Form("apartment"),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_admin: models.Admin = Depends(auth.get_current_admin)
):
    ext = os.path.splitext(file.filename)[1]
    filename = f"{uuid.uuid4()}{ext}"
    filepath = os.path.join(UPLOAD_DIR, filename)

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    db_img = models.Gallery(
        title=title,
        image_path=f"/uploads/gallery/{filename}",
        category=category
    )
    db.add(db_img)
    db.commit()
    db.refresh(db_img)
    return db_img


@router.delete("/{gallery_id}")
def delete_gallery_image(
    gallery_id: int,
    db: Session = Depends(get_db),
    current_admin: models.Admin = Depends(auth.get_current_admin)
):
    img = db.query(models.Gallery).filter(models.Gallery.gallery_id == gallery_id).first()
    if not img:
        raise HTTPException(status_code=404, detail="Image not found")

    # Remove file from disk
    filepath = img.image_path.lstrip("/")
    if os.path.exists(filepath):
        os.remove(filepath)

    db.delete(img)
    db.commit()
    return {"message": "Image deleted"}
