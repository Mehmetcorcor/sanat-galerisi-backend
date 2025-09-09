# backend/app/routers/auth.py
from fastapi import APIRouter, Depends, HTTPException, Form, BackgroundTasks
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.models.user import User
from app.core.security import (
    get_password_hash,
    verify_password,
    create_access_token,
)
from app.services.emailer import send_welcome_mail

router = APIRouter()


# --- DB dependency ---
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/register")
def register(
    background_tasks: BackgroundTasks,
    email: str = Form(...),
    password: str = Form(...),
    db: Session = Depends(get_db),
):
    """Kullanıcı kaydı + hoş geldin maili (arka plan)."""

    
    exists = db.query(User).filter(User.email == email).first()
    if exists:
        raise HTTPException(status_code=400, detail="Bu email zaten kayıtlı.")

    # kullanıcı oluştur
    user = User(email=email, hashed_pw=get_password_hash(password)) 
    db.add(user)
    db.commit()
    db.refresh(user)

    # maili arka planda gönder (emailer kendi içinden env kontrol ediyor)
    background_tasks.add_task(send_welcome_mail, email)

    return {"message": "Kayıt başarılı", "user_id": user.id}


@router.post("/login")
def login(
    email: str = Form(...),
    password: str = Form(...),
    db: Session = Depends(get_db),
):
    """Giriş ve JWT üretimi."""
    user = db.query(User).filter(User.email == email).first()

    if not user or not verify_password(password, user.hashed_pw):  # <— DİKKAT: hashed_pw
        raise HTTPException(status_code=401, detail="Geçersiz email veya şifre.")

    token = create_access_token({"sub": user.email})
    return {"access_token": token, "token_type": "bearer"}