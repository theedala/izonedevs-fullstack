from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.image import MIMEImage
from typing import Optional
from html import escape
import asyncio
import os
import smtplib
from config import settings


class EmailService:
    @staticmethod
    def _html_text(value, fallback: str = "Not provided") -> str:
        """Render untrusted values safely inside HTML email content."""
        if value is None or not str(value).strip():
            value = fallback
        return escape(str(value))

    @staticmethod
    def _header_text(value, fallback: str = "No Subject") -> str:
        """Keep user-controlled text safe for email headers."""
        if value is None or not str(value).strip():
            value = fallback
        return str(value).replace("\r", " ").replace("\n", " ")

    @staticmethod
    def create_email_template(content: str, title: str = "iZonehub Makerspace") -> str:
        """Create a simple, beautiful email template"""
        return f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{EmailService._html_text(title, 'iZonehub Makerspace')}</title>
</head>
<body style="margin: 0; padding: 20px; font-family: Arial, sans-serif; background-color: #f5f5f5;">
    <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #2c378b 0%, #f56e00 100%); padding: 30px 20px; text-align: center;">
            <img src="http://izonedevs.co.zw/static/image/main-logo.png" alt="iZonehub Logo" style="height: 60px; margin-bottom: 15px;">
            <h1 style="color: white; margin: 0; font-size: 24px; font-weight: bold;">iZonehub Makerspace</h1>
            <p style="color: #f0f0f0; margin: 5px 0 0 0; font-size: 14px;">Zimbabwe's Innovation Hub</p>
        </div>
        
        <!-- Content -->
        <div style="padding: 30px 20px; line-height: 1.6; color: #333;">
            {content}
        </div>
        
        <!-- Footer -->
        <div style="background-color: #1a1a1a; color: #cccccc; padding: 20px; text-align: center; font-size: 12px;">
            <p style="margin: 0 0 10px 0;">
                <strong>iZonehub Makerspace</strong><br>
                Zimbabwe's Premier Innovation Hub
            </p>
            <p style="margin: 0 0 10px 0;">
                📧 izonemakers@gmail.com | 🌐 izonedevs.co.zw<br>
                📞 +263 778 440 344 | 💬 +263 71 249 1104 (WhatsApp)
            </p>
            <p style="margin: 0; color: #888;">
                Building the future of technology in Zimbabwe, one innovation at a time.
            </p>
        </div>
    </div>
</body>
</html>
        """

    @staticmethod
    async def send_email(
        to_email: str,
        subject: str,
        body: str,
        from_name: str = "iZonehub Makerspace",
        is_html: bool = False
    ) -> bool:
        """Send email notification"""
        try:
            # Use SMTP if configured, otherwise log to console
            if settings.smtp_host and settings.smtp_user and settings.smtp_password:
                return await EmailService._send_smtp_email(to_email, subject, body, from_name, is_html)
            else:
                # Fallback to console logging
                print(f"\n{'='*50}")
                print(f"📧 EMAIL NOTIFICATION")
                print(f"{'='*50}")
                print(f"To: {to_email}")
                print(f"From: {from_name}")
                print(f"Subject: {subject}")
                print(f"Type: {'HTML' if is_html else 'TEXT'}")
                print(f"Body:\n{body[:200]}...")
                print(f"{'='*50}\n")
                return True
            
        except Exception as e:
            print(f"Error sending email: {e}")
            return False

    @staticmethod
    async def _send_smtp_email(
        to_email: str,
        subject: str,
        body: str,
        from_name: str,
        is_html: bool = False
    ) -> bool:
        """Send email via SMTP"""
        try:
            msg = MIMEMultipart()
            msg['From'] = f"{from_name} <{settings.smtp_user}>"
            msg['To'] = to_email
            msg['Subject'] = subject
            
            # Add body text
            mime_type = 'html' if is_html else 'plain'
            msg.attach(MIMEText(body, mime_type))
            
            # Connect to Gmail SMTP
            server = smtplib.SMTP(settings.smtp_host, settings.smtp_port)
            server.starttls()  # Enable encryption
            server.login(settings.smtp_user, settings.smtp_password)
            
            # Send email
            text = msg.as_string()
            server.sendmail(settings.smtp_user, to_email, text)
            server.quit()
            
            print(f"✅ Email sent successfully to {to_email}")
            return True
            
        except Exception as e:
            print(f"❌ SMTP Error: {e}")
            # Fallback to console logging if SMTP fails
            print(f"\n{'='*50}")
            print(f"📧 EMAIL FALLBACK (SMTP Failed)")
            print(f"{'='*50}")
            print(f"To: {to_email}")
            print(f"From: {from_name}")
            print(f"Subject: {subject}")
            print(f"Body:\n{body[:200]}...")
            print(f"Error: {e}")
            print(f"{'='*50}\n")
            return False

    @staticmethod
    async def _send_email_with_attachment(
        to_email: str,
        subject: str,
        body: str,
        attachment_path: str,
        attachment_name: str,
        from_name: str = "iZonehub Makerspace",
        is_html: bool = False
    ) -> bool:
        """Send email with attachment"""
        try:
            # Use SMTP if configured
            if settings.smtp_host and settings.smtp_user and settings.smtp_password:
                return await EmailService._send_smtp_email_with_attachment(
                    to_email, subject, body, attachment_path, attachment_name, from_name, is_html
                )
            else:
                # Fallback to console logging
                print(f"\n{'='*50}")
                print(f"📧 EMAIL WITH ATTACHMENT")
                print(f"{'='*50}")
                print(f"To: {to_email}")
                print(f"From: {from_name}")
                print(f"Subject: {subject}")
                print(f"Attachment: {attachment_name}")
                print(f"Type: {'HTML' if is_html else 'TEXT'}")
                print(f"Body:\n{body[:200]}...")
                print(f"{'='*50}\n")
                return True
            
        except Exception as e:
            print(f"Error sending email with attachment: {e}")
            return False
    
    @staticmethod
    async def _send_smtp_email_with_attachment(
        to_email: str,
        subject: str,
        body: str,
        attachment_path: str,
        attachment_name: str,
        from_name: str,
        is_html: bool = False
    ) -> bool:
        """Send email with attachment via SMTP"""
        try:
            msg = MIMEMultipart()
            msg['From'] = f"{from_name} <{settings.smtp_user}>"
            msg['To'] = to_email
            msg['Subject'] = subject
            
            # Add body text
            mime_type = 'html' if is_html else 'plain'
            msg.attach(MIMEText(body, mime_type))
            
            # Add QR code attachment
            if os.path.exists(attachment_path):
                with open(attachment_path, 'rb') as f:
                    img_data = f.read()
                    img = MIMEImage(img_data)
                    img.add_header('Content-Disposition', f'attachment; filename="{attachment_name}"')
                    msg.attach(img)
            
            # Connect to Gmail SMTP
            server = smtplib.SMTP(settings.smtp_host, settings.smtp_port)
            server.starttls()  # Enable encryption
            server.login(settings.smtp_user, settings.smtp_password)
            
            # Send email
            text = msg.as_string()
            server.sendmail(settings.smtp_user, to_email, text)
            server.quit()
            
            print(f"✅ Email with QR code sent successfully to {to_email}")
            return True
            
        except Exception as e:
            print(f"❌ SMTP Error (with attachment): {e}")
            # Fallback to console logging if SMTP fails
            print(f"\n{'='*50}")
            print(f"📧 EMAIL WITH ATTACHMENT FALLBACK (SMTP Failed)")
            print(f"{'='*50}")
            print(f"To: {to_email}")
            print(f"From: {from_name}")
            print(f"Subject: {subject}")
            print(f"Attachment: {attachment_name} ({attachment_path})")
            print(f"Body:\n{body[:200]}...")
            print(f"Error: {e}")
            print(f"{'='*50}\n")
            return False

    @staticmethod
    async def send_contact_notification(contact_data: dict) -> bool:
        """Send notification for new contact message"""
        contact_subject = EmailService._header_text(contact_data.get('subject'), 'No Subject')
        subject = f"New Contact Message: {contact_subject}"
        contact_name = EmailService._html_text(contact_data.get('name'))
        contact_email = EmailService._html_text(contact_data.get('email'))
        contact_phone = EmailService._html_text(contact_data.get('phone'))
        contact_message_subject = EmailService._html_text(contact_data.get('subject'))
        contact_message = EmailService._html_text(contact_data.get('message'), 'No message provided')
        
        content = f"""
<h2 style="color: #2c378b;">New Contact Message 📬</h2>

<p>A new contact message has been received from the iZonehub website:</p>

<div style="background-color: #f8f9ff; border-left: 4px solid #2c378b; padding: 20px; margin: 20px 0; border-radius: 5px;">
    <p><strong>Name:</strong> {contact_name}</p>
    <p><strong>Email:</strong> {contact_email}</p>
    <p><strong>Phone:</strong> {contact_phone}</p>
    <p><strong>Subject:</strong> {contact_message_subject}</p>
</div>

<div style="background-color: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 5px;">
    <h3 style="margin-top: 0;">Message:</h3>
    <p>{contact_message}</p>
</div>

<p>Please respond to the sender at: <strong>{contact_email}</strong></p>
        """
        
        html_body = EmailService.create_email_template(content, "New Contact Message")
        
        return await EmailService.send_email(
            to_email="izonemakers@gmail.com",
            subject=subject,
            body=html_body,
            is_html=True
        )
    
    @staticmethod
    async def send_join_application_notification(join_data: dict) -> bool:
        """Send notification for new community join application"""
        community = EmailService._header_text(join_data.get('community'), 'Unknown')
        subject = f"New Community Join Application - {community}"
        join_name = EmailService._html_text(join_data.get('name'))
        join_email = EmailService._html_text(join_data.get('email'))
        join_phone = EmailService._html_text(join_data.get('phone'))
        join_community = EmailService._html_text(join_data.get('community'))
        join_experience = EmailService._html_text(join_data.get('experience'))
        join_interests = EmailService._html_text(join_data.get('interests'), 'No details provided')
        
        content = f"""
<h2 style="color: #f56e00;">New Community Application 🚀</h2>

<p>A new community join application has been received:</p>

<div style="background-color: #fff8f0; border-left: 4px solid #f56e00; padding: 20px; margin: 20px 0; border-radius: 5px;">
    <p><strong>Name:</strong> {join_name}</p>
    <p><strong>Email:</strong> {join_email}</p>
    <p><strong>Phone:</strong> {join_phone}</p>
    <p><strong>Preferred Community:</strong> {join_community}</p>
    <p><strong>Experience Level:</strong> {join_experience}</p>
</div>

<div style="background-color: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 5px;">
    <h3 style="margin-top: 0;">Interests and Goals:</h3>
    <p>{join_interests}</p>
</div>

<p>Please review this application and contact the applicant at: <strong>{join_email}</strong></p>
        """
        
        html_body = EmailService.create_email_template(content, "New Community Application")
        
        return await EmailService.send_email(
            to_email="izonemakers@gmail.com",
            subject=subject,
            body=html_body,
            is_html=True
        )

    @staticmethod
    async def send_event_registration_confirmation(
        email: str,
        name: str,
        event,
        registration,
        qr_code_path: str
    ) -> bool:
        """Send event registration confirmation with QR code"""
        event_title_header = EmailService._header_text(event.title, 'iZonehub Event')
        subject = f"Registration Confirmed: {event_title_header}"
        safe_event_title = EmailService._html_text(event.title, 'iZonehub Event')
        safe_name = EmailService._html_text(name)
        safe_start_date = EmailService._html_text(event.start_date.strftime("%B %d, %Y at %I:%M %p"))
        safe_end_date = EmailService._html_text(
            event.end_date.strftime("%I:%M %p")
            if event.start_date.date() == event.end_date.date()
            else event.end_date.strftime("%B %d, %Y at %I:%M %p")
        )
        fee = float(event.registration_fee or 0)
        
        # Build location info
        if event.is_online:
            safe_meeting_url = EmailService._html_text(event.meeting_url, 'Will be provided before the event')
            location_info = f"<strong>Online Event</strong><br>Meeting Link: {safe_meeting_url}"
        else:
            safe_location = EmailService._html_text(event.location, 'iZonehub Makerspace')
            location_info = f"<strong>Location:</strong> {safe_location}"
        
        # Create simple email content
        content = f"""
<h2 style="color: #2c378b; margin-bottom: 20px;">Registration Confirmed! 🎉</h2>

        <p>Dear <strong>{safe_name}</strong>,</p>

<p>Thank you for registering for our event! Your registration has been confirmed and we're excited to see you there.</p>

<div style="background-color: #f8f9ff; border-left: 4px solid #2c378b; padding: 20px; margin: 20px 0; border-radius: 5px;">
    <h3 style="color: #2c378b; margin: 0 0 15px 0;">📅 Event Details</h3>
    <p style="margin: 5px 0;"><strong>Event:</strong> {safe_event_title}</p>
    <p style="margin: 5px 0;"><strong>Date & Time:</strong> {safe_start_date} - {safe_end_date}</p>
    <p style="margin: 5px 0;">{location_info}</p>
    <p style="margin: 5px 0;"><strong>Registration Fee:</strong> ${fee:.2f}</p>
</div>

<div style="background-color: #fff8f0; border-left: 4px solid #f56e00; padding: 20px; margin: 20px 0; border-radius: 5px;">
    <h3 style="color: #f56e00; margin: 0 0 15px 0;">✅ Your Registration</h3>
    <p style="margin: 5px 0;"><strong>Registration ID:</strong> #{registration.id}</p>
    <p style="margin: 5px 0;"><strong>Status:</strong> {registration.registration_status.title()}</p>
    <p style="margin: 5px 0;"><strong>Registration Date:</strong> {registration.created_at.strftime("%B %d, %Y")}</p>
</div>

<div style="background-color: #f0f9ff; border: 2px dashed #2c378b; padding: 20px; margin: 20px 0; border-radius: 10px; text-align: center;">
    <h3 style="color: #2c378b; margin: 0 0 10px 0;">🎫 Your QR Code</h3>
    <p style="margin: 10px 0; color: #666;">Your QR code is attached to this email. Please bring it for quick check-in!</p>
    <p style="font-size: 14px; color: #888;">📎 Attachment: event_qr_code_{registration.id}.png</p>
</div>

<div style="background-color: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 5px;">
    <h3 style="color: #333; margin: 0 0 15px 0;">📋 Important Information</h3>
    <ul style="margin: 0; padding-left: 20px; color: #666;">
        <li>Please arrive 15 minutes early for registration and setup</li>
        <li>Bring your QR code (attached) for quick check-in</li>
        <li>Contact us if you need to cancel or modify your registration</li>
        <li>Check your email for any updates before the event</li>
    </ul>
</div>

<p style="margin-top: 30px;">We look forward to seeing you at the event!</p>

<p style="margin-bottom: 0;">
    Best regards,<br>
    <strong>The iZonehub Makerspace Team</strong>
</p>
        """
        
        # Create HTML email
        html_body = EmailService.create_email_template(content, f"Registration Confirmed - {event_title_header}")
        
        # Send email with QR code attachment
        return await EmailService._send_email_with_attachment(
            to_email=email,
            subject=subject,
            body=html_body,
            attachment_path=qr_code_path,
            attachment_name=f"event_qr_code_{registration.id}.png",
            is_html=True
        )