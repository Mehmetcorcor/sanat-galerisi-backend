from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models.order import Order
from app.core.config import settings

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def ensure_admin(admin_key: str | None):
    if not admin_key or admin_key != settings.ADMIN_KEY:
        raise HTTPException(status_code=401, detail="Yetkisiz (admin_key hatalı).")

@router.get("/", summary="Tüm siparişleri listele (admin)")
def list_orders(admin_key: str = Query(None), db: Session = Depends(get_db)):
    ensure_admin(admin_key)
    return db.query(Order).order_by(Order.id.desc()).all()

@router.get("/{order_no}", summary="Siparişi getir (admin)")
def get_order(order_no: str, admin_key: str = Query(None), db: Session = Depends(get_db)):
    ensure_admin(admin_key)
    order = db.query(Order).filter(Order.order_no == order_no).first()
    if not order:
        raise HTTPException(status_code=404, detail="Sipariş bulunamadı.")
    return order

@router.patch("/{order_no}/status", summary="Sipariş durumunu güncelle (admin)")
def update_status(
    order_no: str,
    new_status: str = Query(..., description="pending|paid|cancelled"),
    admin_key: str = Query(None),
    db: Session = Depends(get_db)
):
    ensure_admin(admin_key)
    if new_status not in {"pending", "paid", "cancelled"}:
        raise HTTPException(status_code=400, detail="Geçersiz status.")
    order = db.query(Order).filter(Order.order_no == order_no).first()
    if not order:
        raise HTTPException(status_code=404, detail="Sipariş bulunamadı.")
    order.status = new_status   # artık uyarı olmayacak
    db.commit()
    db.refresh(order)
    return {"message": "Güncellendi", "order_no": order_no, "status": order.status}