# backend/app/services/emailer.py
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from app.core.config import settings

conf = ConnectionConfig(
    MAIL_USERNAME=settings.MAIL_USERNAME,
    MAIL_PASSWORD=settings.MAIL_PASSWORD,
    MAIL_FROM=settings.MAIL_FROM or settings.MAIL_USERNAME,
    MAIL_FROM_NAME=getattr(settings, "MAIL_FROM_NAME", "SEVA Studio & Store"),
    MAIL_PORT=settings.MAIL_PORT,
    MAIL_SERVER=settings.MAIL_SERVER,

    MAIL_STARTTLS=getattr(settings, "MAIL_STARTTLS", True),
    MAIL_SSL_TLS=getattr(settings, "MAIL_SSL_TLS", False),

    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True,
    SUPPRESS_SEND=False,   # yanlışlıkla True olmasın
)

async def send_welcome_mail(to_email: str):
    # Mail ayarı yoksa sessiz geç
    if not (settings.MAIL_SERVER and settings.MAIL_USERNAME and settings.MAIL_PASSWORD):
        print("MAIL SKIPPED: Missing SMTP settings")
        return

    html = f"""
    <div style="font-family:Arial,sans-serif">
      <h2>SEVA Studio &amp; Store</h2>
      <p>Merhaba, <b>{to_email}</b>!</p>
      <p>Aramıza hoş geldin 🎨<br>
      Etkinlik biletlerini hesabından takip edebilirsin.</p>
      <p>Sevgiler,<br>SEVA Ekibi</p>
    </div>
    """

    message = MessageSchema(
        subject="SEVA Studio – Aramıza Hoş Geldin",
        recipients=[to_email],
        body=html,
        subtype=MessageType.html,
    )

    try:
        fm = FastMail(conf)
        await fm.send_message(message)
        print(f"MAIL OK: Sent welcome to {to_email}")
    except Exception as e:
        # Terminalde görürsün
        print("MAIL ERROR:", repr(e))