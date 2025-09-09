# backend/app/routers/events.py
from fastapi import APIRouter

router = APIRouter()

# Tüm etkinliklerin örnek seans verileri
EVENT_SESSIONS = {
    "seramik-modelleme": [
        {
            "session_id": "SM-12-1",
            "date": "2025-09-7",
            "times": [
                {"time": "13:00", "price": 800, "stock": 12, "key": "SM-12-1-1400"},
                {"time": "15:00", "price": 800, "stock": 10, "key": "SM-12-1-1800"},
            ],
        },
        {
            "session_id": "SM-19-1",
            "date": "2025-09-13",
            "times": [
                {"time": "18:00", "price": 800, "stock": 14, "key": "SM-19-1-1400"},
                {"time": "20:00", "price": 800, "stock": 8,  "key": "SM-19-1-2000"},
            ],
        },
    ],
    "seramik-boyama": [
        {
            "session_id": "SB-13-1",
            "date": "2025-09-18",
            "times": [
                {"time": "13:00", "price": 400, "stock": 16, "key": "SB-13-1-1300"},
                {"time": "18:00", "price": 400, "stock": 12, "key": "SB-13-1-1700"},
            ],
        },
        {
            "session_id": "SB-20-1",
            "date": "2025-09-19",
            "times": [
                {"time": "18:00", "price": 400, "stock": 18, "key": "SB-20-1-1300"},
                {"time": "20:00", "price": 400, "stock": 10, "key": "SB-20-1-1900"},
            ],
        },
    ],
    "mum-atolyesi": [
        {
            "session_id": "M-14-1",
            "date": "2025-09-28",
            "times": [
                {"time": "13:00", "price": 800, "stock": 20, "key": "M-14-1-1500"},
                {"time": "18:00", "price": 800, "stock": 15, "key": "M-14-1-1800"},
            ],
        },
        {
            "session_id": "M-21-1",
            "date": "2025-09-28",
            "times": [
                {"time": "18:00", "price": 800, "stock": 20, "key": "M-21-1-1200"},
                {"time": "20:00", "price": 800, "stock": 15, "key": "M-21-1-1600"},
            ],
        },
    ],
    "dokulu-tuval": [
        {
            "session_id": "DT-15-1",
            "date": "2025-09-21",
            "times": [
                {"time": "13:00", "price": 800, "stock": 14, "key": "DT-15-1-1400"},
                {"time": "18:00", "price": 800, "stock": 12, "key": "DT-15-1-1800"},
            ],
        },
        {
            "session_id": "DT-22-1",
            "date": "2025-09-27",
            "times": [
                {"time": "18:00", "price": 800, "stock": 16, "key": "DT-22-1-1400"},
                {"time": "20:00", "price": 800, "stock": 10, "key": "DT-22-1-1900"},
            ],
        },
    ],
    "cini-boyama": [
        {
            "session_id": "C-16-1",
            "date": "2025-09-14",
            "times": [
                {"time": "13:00", "price": 800, "stock": 18, "key": "C-16-1-1300"},
                {"time": "18:00", "price": 800, "stock": 12, "key": "C-16-1-1700"},
            ],
        },
        {
            "session_id": "C-23-1",
            "date": "2025-09-20",
            "times": [
                {"time": "18:00", "price": 800, "stock": 18, "key": "C-23-1-1300"},
                {"time": "20:00", "price": 800, "stock": 10, "key": "C-23-1-1900"},
            ],
        },
    ],
    "ayna-boyama": [
        {
            "session_id": "AB-12-1",
            "date": "2025-09-27",
            "times": [
                {"time": "13:00", "price": 800, "stock": 40, "key": "AB-12-1-1400"},
                {"time": "18:00", "price": 800, "stock": 25, "key": "AB-12-1-1800"},
            ],
        },
        {
            "session_id": "AB-18-1",
            "date": "2025-09-27",
            "times": [
                {"time": "18:00", "price": 800, "stock": 40, "key": "AB-18-1-1400"},
                {"time": "20:00", "price": 800, "stock": 15, "key": "AB-18-1-2000"},
            ],
        },
    ],
    "resim-atolyesi": [
        {
            "session_id": "R-17-1",
            "date": "2025-09-21",
            "times": [
                {"time": "13:00", "price": 800, "stock": 20, "key": "R-17-1-1400"},
                {"time": "18:00", "price": 800, "stock": 16, "key": "R-17-1-1800"},
            ],
        },
        {
            "session_id": "R-24-1",
            "date": "2025-09-27",
            "times": [
                {"time": "18:00", "price": 800, "stock": 20, "key": "R-24-1-1400"},
                {"time": "20:00", "price": 800, "stock": 14, "key": "R-24-1-1900"},
            ],
        },
    ],
    "amigurumi": [
        {
            "session_id": "A-19-1",
            "date": "2025-09-25",
            "times": [
                {"time": "18:00", "price": 800, "stock": 20, "key": "A-19-1-1300"},
                {"time": "20:00", "price": 800, "stock": 18, "key": "A-19-1-1600"},
            ],
        },
        {
            "session_id": "A-26-1",
            "date": "2025-09-26",
            "times": [
                {"time": "18:00", "price": 800, "stock": 20, "key": "A-26-1-1200"},
                {"time": "20:00", "price": 800, "stock": 18, "key": "A-26-1-1500"},
            ],
        },
    ],
}

@router.get("/{event_id}/sessions")
def get_event_sessions(event_id: str):
    # event_id yoksa boş liste döner (404 yerine 200 + [])
    return EVENT_SESSIONS.get(event_id, [])