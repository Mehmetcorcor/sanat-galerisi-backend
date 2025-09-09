from sqlalchemy import Column, Integer, String
from app.db.base import Base

class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    date = Column(String, nullable=False)   # şimdilik string
    time = Column(String, nullable=False)
    price = Column(Integer, nullable=False)