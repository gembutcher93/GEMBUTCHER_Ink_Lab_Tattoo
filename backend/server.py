from fastapi import FastAPI, APIRouter, HTTPException, BackgroundTasks
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import smtplib
from email.message import EmailMessage
from email.utils import formatdate
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# SMTP config (optional — booking works even if email fails)
SMTP_HOST = os.environ.get('SMTP_HOST', '').strip()
SMTP_PORT = int(os.environ.get('SMTP_PORT', '587').strip() or '587')
SMTP_USER = os.environ.get('SMTP_USER', '').strip()
SMTP_PASSWORD = os.environ.get('SMTP_PASSWORD', '').strip().replace(' ', '')
NOTIFY_EMAIL = os.environ.get('NOTIFY_EMAIL', SMTP_USER).strip()

app = FastAPI(title="GemButcher API")
api_router = APIRouter(prefix="/api")


def send_booking_email(booking: 'Booking') -> None:
    """Send booking notification to studio inbox via Gmail SMTP.
    Runs in a BackgroundTask so the API responds fast even if SMTP is slow.
    Silently logs on failure — booking is already persisted in Mongo.
    """
    if not (SMTP_HOST and SMTP_USER and SMTP_PASSWORD and NOTIFY_EMAIL):
        print("[BOOKING-EMAIL] SMTP not fully configured — skipping", flush=True)
        return
    try:
        msg = EmailMessage()
        msg['Subject'] = f"[GemButcher] Nuova prenotazione · {booking.name} · {booking.style}"
        msg['From'] = f"GemButcher Booking <{SMTP_USER}>"
        msg['To'] = NOTIFY_EMAIL
        msg['Reply-To'] = booking.email
        msg['Date'] = formatdate(localtime=True)

        lines = [
            f"Nuova richiesta di prenotazione — {booking.created_at.isoformat()}",
            "",
            f"Nome:           {booking.name}",
            f"Email:          {booking.email}",
            f"Telefono:       {booking.phone or '—'}",
            f"Stile:          {booking.style}",
            f"Zona corpo:     {booking.body_placement or '—'}",
            f"Dimensione:     {booking.size or '—'}",
            f"Data preferita: {booking.preferred_date or '—'}",
            f"Lingua:         {booking.language}",
            "",
            "Visione / descrizione:",
            booking.description,
            "",
            f"— ID interno: {booking.id}",
        ]
        msg.set_content("\n".join(lines))

        with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=15) as s:
            s.ehlo()
            s.starttls()
            s.ehlo()
            s.login(SMTP_USER, SMTP_PASSWORD)
            s.send_message(msg)
        print(f"[BOOKING-EMAIL] sent for booking {booking.id} to {NOTIFY_EMAIL}", flush=True)
    except Exception as exc:  # noqa: BLE001
        print(f"[BOOKING-EMAIL] FAILED for booking {booking.id}: {type(exc).__name__}: {exc}", flush=True)


# ---- Models ----
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class StatusCheckCreate(BaseModel):
    client_name: str


class BookingCreate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    style: str  # polynesian | cyberpunk | anime | patutikon
    body_placement: Optional[str] = None
    size: Optional[str] = None
    description: str
    preferred_date: Optional[str] = None
    language: Optional[str] = "it"


class Booking(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    phone: Optional[str] = None
    style: str
    body_placement: Optional[str] = None
    size: Optional[str] = None
    description: str
    preferred_date: Optional[str] = None
    language: Optional[str] = "it"
    status: str = "pending"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# ---- Routes ----
@api_router.get("/")
async def root():
    return {"message": "GemButcher API online", "studio": "Podere 173 - Ozieri"}


@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_obj = StatusCheck(**input.model_dump())
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.status_checks.insert_one(doc)
    return status_obj


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for c in status_checks:
        if isinstance(c.get('timestamp'), str):
            c['timestamp'] = datetime.fromisoformat(c['timestamp'])
    return status_checks


@api_router.post("/bookings", response_model=Booking)
async def create_booking(payload: BookingCreate):
    booking = Booking(**payload.model_dump())
    doc = booking.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.bookings.insert_one(doc)
    send_booking_email(booking)  # synchronous — Gmail SMTP < 2s
    return booking


@api_router.get("/bookings", response_model=List[Booking])
async def list_bookings():
    docs = await db.bookings.find({}, {"_id": 0}).sort("created_at", -1).to_list(200)
    for d in docs:
        if isinstance(d.get('created_at'), str):
            d['created_at'] = datetime.fromisoformat(d['created_at'])
    return docs


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
