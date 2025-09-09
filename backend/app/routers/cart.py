from fastapi import APIRouter, Form

router = APIRouter()

@router.post("/items")
def add_to_cart(
    event_id: str = Form(...),
    session_id: str = Form(...),
    date: str = Form(...),
    time: str = Form(...),
    qty: int = Form(1)
):
    # Şimdilik demo → gerçek DB bağlantısı sonra yapılacak
    return {
        "message": "Sepete eklendi",
        "event_id": event_id,
        "session_id": session_id,
        "date": date,
        "time": time,
        "qty": qty
    }