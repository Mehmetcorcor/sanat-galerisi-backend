from sqlalchemy import Column, Integer, String, Float, ForeignKey, JSON, DateTime
from sqlalchemy.sql import func
from app.db.base import Base

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    order_no = Column(String, unique=True, index=True)  # SEVA-xxxx kodu
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    items = Column(JSON, nullable=True)                 # sepetteki ürünler [{eventId, title, date, time, qty, unitPrice, subtotal}, ...]
    amount = Column(Float, nullable=False)              # toplam tutar
    status = Column(String, default="pending")          # pending | paid | cancelled
    created_at = Column(DateTime(timezone=True), server_default=func.now())