from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app import models, schemas, auth

router = APIRouter(prefix="/api/announcements", tags=["announcements"])


@router.get("/", response_model=List[schemas.AnnouncementResponse])
def list_announcements(db: Session = Depends(get_db)):
    return db.query(models.Announcement).filter(
        models.Announcement.is_published == 1
    ).order_by(models.Announcement.created_at.desc()).all()


@router.get("/all", response_model=List[schemas.AnnouncementResponse])
def list_all_announcements(
    db: Session = Depends(get_db),
    current_admin: models.Admin = Depends(auth.get_current_admin)
):
    return db.query(models.Announcement).order_by(models.Announcement.created_at.desc()).all()


@router.post("/", response_model=schemas.AnnouncementResponse)
def create_announcement(
    announcement: schemas.AnnouncementCreate,
    db: Session = Depends(get_db),
    current_admin: models.Admin = Depends(auth.get_current_admin)
):
    db_ann = models.Announcement(**announcement.model_dump())
    db.add(db_ann)
    db.commit()
    db.refresh(db_ann)
    return db_ann


@router.put("/{announcement_id}", response_model=schemas.AnnouncementResponse)
def update_announcement(
    announcement_id: int,
    update: schemas.AnnouncementUpdate,
    db: Session = Depends(get_db),
    current_admin: models.Admin = Depends(auth.get_current_admin)
):
    ann = db.query(models.Announcement).filter(models.Announcement.announcement_id == announcement_id).first()
    if not ann:
        raise HTTPException(status_code=404, detail="Announcement not found")
    for key, value in update.model_dump(exclude_unset=True).items():
        setattr(ann, key, value)
    db.commit()
    db.refresh(ann)
    return ann


@router.delete("/{announcement_id}")
def delete_announcement(
    announcement_id: int,
    db: Session = Depends(get_db),
    current_admin: models.Admin = Depends(auth.get_current_admin)
):
    ann = db.query(models.Announcement).filter(models.Announcement.announcement_id == announcement_id).first()
    if not ann:
        raise HTTPException(status_code=404, detail="Announcement not found")
    db.delete(ann)
    db.commit()
    return {"message": "Announcement deleted"}
