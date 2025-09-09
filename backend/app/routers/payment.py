from fastapi import APIRouter, Form, Depends, Request, HTTPException
from sqlalchemy.orm import Session
import uuid, json
from jose import jwt, JWTError

from app.core.config import settings
from app.db.session import SessionLocal
from app.models.order import Order
from app.models.user import User

router = APIRouter()

# Banka bilgilerin (güncelle)
BANK_INFO = {
    "iban": "TR58 0013 4000 0242 2843 2000 01",
    "alici": "Şevval Akdeniz",
    "banka": "Banka Adı",
}

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_user_from_request(request: Request, db: Session) -> User | None:
    """Authorization: Bearer <token> içinden kullanıcıyı bulur (yoksa None döner)."""
    auth = request.headers.get("authorization") or request.headers.get("Authorization")
    if not auth or not auth.lower().startswith("bearer "):
        return None
    token = auth.split(" ", 1)[1].strip()
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        email = payload.get("sub")
        if not email:
            return None
        return db.query(User).filter(User.email == email).first()
    except JWTError:
        return None

@router.get("/havale/info")
def havale_info():
    return BANK_INFO

@router.post("/havale")
def havale_fast(
    request: Request,
    amount: float = Form(...),
    items_json: str = Form("[]"),   # Frontend isterse sepeti JSON string olarak yollar
    db: Session = Depends(get_db),
):
    # order no üret
    order_no = uuid.uuid4().hex[:8].upper()

    # kullanıcıyı token'dan bul (opsiyonel)
    user = get_user_from_request(request, db)
    user_id = user.id if user else None

    # items parse et
    try:
        items = json.loads(items_json) if items_json else []
    except Exception:
        items = []

    # siparişi kaydet
    order = Order(
        order_no=order_no,
        user_id=user_id,
        items=items,
        amount=amount,
        status="pending",
    )
    db.add(order)
    db.commit()
    db.refresh(order)

    return {
        **BANK_INFO,
        "tutar": amount,
        "aciklama": f"SEVA-{order_no}",
        "order_no": order_no,
        "yontem": "Havale / FAST",
    }