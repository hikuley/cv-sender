from fastapi import HTTPException
import os
import smtplib
from email.mime.application import MIMEApplication
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from backend.requests.email_request import EmailRequest

from fastapi import HTTPException
from dotenv import load_dotenv
import os


# Load environment variables from the .env file in the previous folder
load_dotenv(os.path.join(os.path.dirname(__file__), '../../', '.env'))

class EmailService:
    def __init__(self):
        self.smtp_server = "smtp.gmail.com"
        self.port = 587
        self.sender_email = os.getenv("EMAIL_USER", "")
        self.password = os.getenv("EMAIL_PASSWORD", "")

        if not self.sender_email or not self.password:
            raise HTTPException(status_code=500, detail="Email credentials not configured, please check the .env file")

    def send_email(self, email_request: EmailRequest):
        # Create message
        msg = MIMEMultipart()
        msg['Subject'] = email_request.subject
        msg['From'] = self.sender_email
        msg['To'] = email_request.to_email
        msg['Bcc'] = self.sender_email

        # Add message body
        msg.attach(MIMEText(email_request.cover_letter))

        cv_type = email_request.cv_type
        file_name = cv_type.fileName
        # Add CV attachment
        try:
            file_path = os.path.join(os.path.dirname(__file__), '..', 'PDFs', file_name)
            with open(file_path, "rb") as f:
                part = MIMEApplication(f.read(), Name=file_name, _subtype="pdf")
                part['Content-Disposition'] = f'attachment; filename="{file_name}"'
                msg.attach(part)
        except FileNotFoundError as e:
            print(e)
            raise HTTPException(status_code=404, detail=f"File {file_name} not found")

        # Send email
        with smtplib.SMTP(self.smtp_server, self.port) as server:
            server.starttls()
            server.login(self.sender_email, self.password)
            server.send_message(msg)
            print(f"Email sent successfully to {email_request.to_email}")
