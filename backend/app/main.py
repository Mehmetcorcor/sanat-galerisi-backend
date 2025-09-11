import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# ⬇️ EKLE: tabloları oluşturmak için
from app.db.base import Base
from app.db.session import engine
from app.models import user, event, cart 
from app.models import order

from app.routers import auth, events, cart as cart_router, payment
from app.routers import orders
from app.services.emailer import send_welcome_mail

app = FastAPI(title="Sanat Galerisi API")

render_url = os.getenv("RENDER_EXTERNAL_URL")
origins = [
    "https://sevastudio.com",
    "https://www.sevastudio.com",
    "http://localhost:5500",
    "http://127.0.0.1:5500",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"ok": True}

# ⬇️ Uygulama açılırken tabloları oluştur
@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)

# Routerlar
app.include_router(auth.router,        prefix="/auth",    tags=["Auth"])
app.include_router(events.router,      prefix="/events",  tags=["Events"])
app.include_router(cart_router.router, prefix="/cart",    tags=["Cart"])
app.include_router(payment.router,     prefix="/payment", tags=["Payment"])
app.include_router(orders.router,      prefix="/orders",  tags=["Orders"])

@app.get("/")
def root():
    return {"message": "Sanat Galerisi Backend Çalışıyor 🚀"}


@app.get("/test-mail")
async def test_mail(to: str):
    """
    Hızlı test: /test-mail?to=mail@adres.com
    """
    await send_welcome_mail(to)
    return {"message": f"{to} adresine test maili gönderildi"}