import os
import smtplib
from email.message import EmailMessage


def _send_via_resend(to_emails: list[str], job_title: str, body: str) -> bool:
    import resend

    api_key = os.getenv("RESEND_API_KEY")
    if not api_key:
        raise RuntimeError("Email delivery is not configured. Set RESEND_API_KEY.")

    resend.api_key = api_key
    resend.Emails.send({
        "from": os.getenv("RESEND_FROM_EMAIL", "onboarding@resend.dev"),
        "to": to_emails,
        "subject": f"Candidate Shortlist: {job_title}",
        "text": body,
    })
    return True


def _send_via_smtp(to_emails: list[str], job_title: str, body: str) -> bool:
    host = os.getenv("SMTP_SERVER", os.getenv("SMTP_HOST", "smtp.gmail.com"))
    port = int(os.getenv("SMTP_PORT", "587"))
    user = os.getenv("SMTP_USER", "")
    password = os.getenv("SMTP_PASS", os.getenv("SMTP_PASSWORD", ""))

    if not user or not password:
        raise RuntimeError("Email delivery is not configured. Set SMTP_USER and SMTP_PASS.")

    message = EmailMessage()
    message.set_content(body)
    message["Subject"] = f"Candidate Shortlist: {job_title}"
    message["From"] = user
    message["To"] = ", ".join(to_emails)

    with smtplib.SMTP(host, port) as server:
        server.starttls()
        server.login(user, password)
        server.send_message(message)
    return True


def send_shortlist_email(to_emails: list[str], job_title: str, body: str) -> bool:
    """Send a shortlist through Resend by default, with SMTP as a fallback option."""
    provider = os.getenv("EMAIL_PROVIDER", "resend").strip().lower()
    if provider == "smtp":
        return _send_via_smtp(to_emails, job_title, body)
    if provider == "resend":
        return _send_via_resend(to_emails, job_title, body)
    raise RuntimeError("Unsupported EMAIL_PROVIDER. Use 'resend' or 'smtp'.")
