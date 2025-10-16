import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.image import MIMEImage
from typing import Optional
import asyncio
import os
from config import settings


class EmailService:
    @staticmethod
    def create_email_template(content: str, title: str = "iZonehub Makerspace") -> str:
        """Create a simple, beautiful email template"""
        return f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title}</title>
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
    def get_email_template(
        title: str,
        recipient_name: str,
        content: str,
        event_details: str = "",
        footer_text: str = ""
    ) -> str:
        """Generate a professional HTML email template with iZonehub branding"""
        return f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title}</title>
    <style>
        body {{
            margin: 0;
            padding: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f5f5f5;
            color: #333;
        }}
        .container {{
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }}
        .header {{
            background: linear-gradient(135deg, #2c378b 0%, #f56e00 100%);
            padding: 30px;
            text-align: center;
            color: white;
        }}
        .logo {{
            max-width: 200px;
            height: auto;
            margin-bottom: 20px;
        }}
        .header h1 {{
            margin: 0;
            font-size: 28px;
            font-weight: 600;
        }}
        .header p {{
            margin: 10px 0 0 0;
            font-size: 16px;
            opacity: 0.9;
        }}
        .content {{
            padding: 40px 30px;
        }}
        .greeting {{
            font-size: 18px;
            color: #2c378b;
            margin-bottom: 20px;
            font-weight: 600;
        }}
        .main-content {{
            font-size: 16px;
            line-height: 1.6;
            color: #333;
            margin-bottom: 30px;
        }}
        .event-details {{
            background-color: #f8f9fa;
            border-left: 4px solid #f56e00;
            padding: 20px;
            margin: 20px 0;
            border-radius: 5px;
        }}
        .event-details h3 {{
            margin: 0 0 15px 0;
            color: #2c378b;
            font-size: 18px;
        }}
        .detail-row {{
            display: flex;
            margin-bottom: 8px;
            align-items: center;
        }}
        .detail-icon {{
            font-size: 18px;
            margin-right: 10px;
            width: 20px;
        }}
        .qr-section {{
            text-align: center;
            background-color: #f8f9fa;
            padding: 30px;
            margin: 30px 0;
            border-radius: 10px;
            border: 2px dashed #f56e00;
        }}
        .qr-section h3 {{
            color: #2c378b;
            margin-bottom: 15px;
            font-size: 20px;
        }}
        .qr-section p {{
            color: #666;
            margin-bottom: 20px;
        }}
        .important-note {{
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 5px;
            padding: 15px;
            margin: 20px 0;
        }}
        .important-note h4 {{
            margin: 0 0 10px 0;
            color: #856404;
        }}
        .contact-info {{
            background-color: #e7f3ff;
            border-radius: 8px;
            padding: 20px;
            margin: 30px 0;
        }}
        .contact-info h4 {{
            margin: 0 0 15px 0;
            color: #2c378b;
        }}
        .contact-row {{
            display: flex;
            align-items: center;
            margin-bottom: 8px;
        }}
        .contact-icon {{
            margin-right: 10px;
            font-size: 16px;
        }}
        .footer {{
            background-color: #2c378b;
            color: white;
            padding: 30px;
            text-align: center;
        }}
        .footer-logo {{
            max-width: 150px;
            height: auto;
            margin-bottom: 20px;
            opacity: 0.9;
        }}
        .footer p {{
            margin: 5px 0;
            opacity: 0.9;
        }}
        .social-links {{
            margin: 20px 0;
        }}
        .social-links a {{
            color: #f56e00;
            text-decoration: none;
            margin: 0 10px;
            font-weight: 600;
        }}
        .btn {{
            display: inline-block;
            padding: 12px 25px;
            background-color: #f56e00;
            color: white;
            text-decoration: none;
            border-radius: 25px;
            font-weight: 600;
            margin: 10px 5px;
        }}
        .btn-secondary {{
            background-color: #2c378b;
        }}
        @media (max-width: 600px) {{
            .container {{
                margin: 0;
                border-radius: 0;
            }}
            .header, .content, .footer {{
                padding: 20px;
            }}
            .detail-row, .contact-row {{
                flex-direction: column;
                align-items: flex-start;
            }}
        }}
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <img src="http://izonedevs.co.zw/static/image/main-logo.png" alt="iZonehub Makerspace" class="logo">
            <h1>{title}</h1>
            <p>Zimbabwe's Premier Innovation Hub</p>
        </div>

        <!-- Content -->
        <div class="content">
            <div class="greeting">Hello {recipient_name}! 👋</div>
            
            <div class="main-content">
                {content}
            </div>

            {event_details}

            <div class="qr-section">
                <h3>🎫 Your Event QR Code</h3>
                <p>Please bring this QR code to the event for quick check-in. You can save it to your phone or print it out.</p>
                <p><strong>Note:</strong> The QR code is attached to this email as an image file.</p>
            </div>

            <div class="important-note">
                <h4>📋 Important Reminders:</h4>
                <ul style="margin: 10px 0; padding-left: 20px;">
                    <li>Arrive 15 minutes early for registration and setup</li>
                    <li>Bring your QR code (attached to this email)</li>
                    <li>Contact us if you need to cancel or modify your registration</li>
                    <li>Check your email for any event updates</li>
                </ul>
            </div>

            <div class="contact-info">
                <h4>📞 Contact Information</h4>
                <div class="contact-row">
                    <span class="contact-icon">📱</span>
                    <span><strong>Calls:</strong> +263 778 440 344</span>
                </div>
                <div class="contact-row">
                    <span class="contact-icon">💬</span>
                    <span><strong>WhatsApp:</strong> +263 71 249 1104</span>
                </div>
                <div class="contact-row">
                    <span class="contact-icon">✉️</span>
                    <span><strong>Email:</strong> izonemakers@gmail.com</span>
                </div>
                <div class="contact-row">
                    <span class="contact-icon">🌐</span>
                    <span><strong>Website:</strong> https://izonedevs.co.zw</span>
                </div>
            </div>

            <div style="text-align: center; margin: 30px 0;">
                <a href="https://izonedevs.co.zw/events" class="btn">View All Events</a>
                <a href="https://izonedevs.co.zw/communities" class="btn btn-secondary">Join Our Community</a>
            </div>

            {footer_text}
        </div>

        <!-- Footer -->
        <div class="footer">
            <img src="http://izonedevs.co.zw/static/image/main-logo.png" alt="iZonehub Makerspace" class="footer-logo">
            <p><strong>iZonehub Makerspace</strong></p>
            <p>Zimbabwe's Innovation Hub</p>
            <p>Empowering makers, developers, and innovators</p>
            
            <div class="social-links">
                <a href="#">Facebook</a> • 
                <a href="#">Twitter</a> • 
                <a href="#">LinkedIn</a> • 
                <a href="#">Instagram</a>
            </div>
            
            <p style="font-size: 14px; margin-top: 20px;">
                © 2025 iZonehub Makerspace. All rights reserved.<br>
                This email was sent to you because you registered for one of our events.
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
        is_html: bool = True
    ) -> bool:
        """Send email notification"""
        try:
            # Use SMTP if configured, otherwise log to console
            if settings.smtp_host and settings.smtp_user:
                return await EmailService._send_smtp_email(to_email, subject, body, from_name, is_html)
            else:
                # Fallback to console logging
                print(f"\n{'='*50}")
                print(f"📧 EMAIL NOTIFICATION")
                print(f"{'='*50}")
                print(f"To: {to_email}")
                print(f"From: {from_name}")
                print(f"Subject: {subject}")
                print(f"HTML: {is_html}")
                print(f"Body:\n{body[:500]}..." if len(body) > 500 else f"Body:\n{body}")
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
            
            # Add body (HTML or plain text)
            if is_html:
                msg.attach(MIMEText(body, 'html'))
            else:
                msg.attach(MIMEText(body, 'plain'))
            
            # Connect to Gmail SMTP
            server = smtplib.SMTP(settings.smtp_host, settings.smtp_port)
            server.starttls()  # Enable encryption
            server.login(settings.smtp_user, settings.smtp_password)
            
            # Send email
            text = msg.as_string()
            server.sendmail(settings.smtp_user, to_email, text)
            server.quit()
            
            print(f"✅ Professional email sent successfully to {to_email}")
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
            print(f"HTML: {is_html}")
            print(f"Body:\n{body[:500]}..." if len(body) > 500 else f"Body:\n{body}")
            print(f"Error: {e}")
            print(f"{'='*50}\n")
            return False
    
    @staticmethod
    async def send_contact_notification(contact_data: dict) -> bool:
        """Send notification for new contact message"""
        subject = f"🔔 New Contact Message: {contact_data.get('subject', 'No Subject')}"
        
        content = f"""
            <p>📬 <strong>A new contact message has been received from the iZonehub website:</strong></p>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <div style="margin-bottom: 15px;"><strong>Name:</strong> {contact_data.get('name', 'Not provided')}</div>
                <div style="margin-bottom: 15px;"><strong>Email:</strong> {contact_data.get('email', 'Not provided')}</div>
                <div style="margin-bottom: 15px;"><strong>Phone:</strong> {contact_data.get('phone', 'Not provided')}</div>
                <div style="margin-bottom: 15px;"><strong>Company:</strong> {contact_data.get('company', 'Not provided')}</div>
                <div style="margin-bottom: 15px;"><strong>Subject:</strong> {contact_data.get('subject', 'Not provided')}</div>
            </div>
            
            <div style="background-color: #e7f3ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h4 style="margin: 0 0 10px 0; color: #2c378b;">Message:</h4>
                <p style="margin: 0; white-space: pre-wrap; line-height: 1.6;">{contact_data.get('message', 'No message provided')}</p>
            </div>
        """
        
        footer_text = f"""
            <div style="text-align: center; background-color: #fff3cd; padding: 20px; border-radius: 8px;">
                <p style="margin: 0; color: #856404;"><strong>👆 Please respond to the sender at:</strong> {contact_data.get('email', 'Not provided')}</p>
            </div>
        """
        
        html_body = EmailService.get_email_template(
            title="New Contact Message",
            recipient_name="Admin Team",
            content=content,
            footer_text=footer_text
        )
        
        return await EmailService.send_email(
            to_email="izonemakers@gmail.com",
            subject=subject,
            body=html_body,
            from_name="iZonehub Website"
        )
    
    @staticmethod
    async def send_join_application_notification(join_data: dict) -> bool:
        """Send notification for new community join application"""
        subject = f"New Community Join Application - {join_data.get('community', 'Unknown')}"
        
        body = f"""
New community join application received:

Name: {join_data.get('name', 'Not provided')}
Email: {join_data.get('email', 'Not provided')}
Phone: {join_data.get('phone', 'Not provided')}
Preferred Community: {join_data.get('community', 'Not provided')}
Experience Level: {join_data.get('experience', 'Not provided')}

Interests and Goals:
{join_data.get('interests', 'No details provided')}

---
Please review this application and contact the applicant at: {join_data.get('email', 'Not provided')}
        """.strip()
        
        return await EmailService.send_email(
            to_email="izonemakers@gmail.com",
            subject=subject,
            body=body
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
        subject = f"✅ Registration Confirmed: {event.title}"
        
        # Format date and time
        start_date = event.start_date.strftime("%A, %B %d, %Y")
        start_time = event.start_date.strftime("%I:%M %p")
        end_time = event.end_date.strftime("%I:%M %p") if event.start_date.date() == event.end_date.date() else event.end_date.strftime("%A, %B %d, %Y at %I:%M %p")
        
        # Build location info
        if event.is_online:
            location_info = f"""
                <div class="detail-row">
                    <span class="detail-icon">💻</span>
                    <span><strong>Format:</strong> Online Event</span>
                </div>
                <div class="detail-row">
                    <span class="detail-icon">🔗</span>
                    <span><strong>Meeting Link:</strong> {event.meeting_url or 'Will be provided before the event'}</span>
                </div>
            """
        else:
            location_info = f"""
                <div class="detail-row">
                    <span class="detail-icon">📍</span>
                    <span><strong>Location:</strong> {event.location or 'iZonehub Makerspace'}</span>
                </div>
            """
        
        # Main content
        content = f"""
            <p>🎉 <strong>Congratulations!</strong> Your registration for our event has been confirmed. We're excited to have you join us!</p>
            
            <p>This email contains all the important details about your registration and the event. Please save this email and bring your QR code (attached) for quick check-in at the event.</p>
        """
        
        # Event details section
        event_details = f"""
            <div class="event-details">
                <h3>📅 Event Details</h3>
                <div class="detail-row">
                    <span class="detail-icon">🎯</span>
                    <span><strong>Event:</strong> {event.title}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-icon">�</span>
                    <span><strong>Date:</strong> {start_date}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-icon">🕒</span>
                    <span><strong>Time:</strong> {start_time} - {end_time}</span>
                </div>
                {location_info}
                <div class="detail-row">
                    <span class="detail-icon">💰</span>
                    <span><strong>Registration Fee:</strong> ${event.registration_fee:.2f}</span>
                </div>
                
                <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #e0e0e0;">
                    <h4 style="margin: 0 0 10px 0; color: #2c378b;">📋 Your Registration Details</h4>
                    <div class="detail-row">
                        <span class="detail-icon">🆔</span>
                        <span><strong>Registration ID:</strong> #{registration.id}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-icon">✅</span>
                        <span><strong>Status:</strong> {registration.registration_status.title()}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-icon">📅</span>
                        <span><strong>Registered:</strong> {registration.created_at.strftime("%B %d, %Y at %I:%M %p")}</span>
                    </div>
                </div>
            </div>
        """
        
        # Footer text with event description
        footer_text = f"""
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h4 style="margin: 0 0 10px 0; color: #2c378b;">About This Event</h4>
                <p style="margin: 0; color: #666; line-height: 1.6;">{event.description}</p>
            </div>
            
            <p style="color: #666; font-size: 14px; text-align: center; margin-top: 30px;">
                Thank you for being part of the iZonehub community! We can't wait to see you at the event.
            </p>
        """
        
        # Generate HTML email
        html_body = EmailService.get_email_template(
            title="Event Registration Confirmed",
            recipient_name=name,
            content=content,
            event_details=event_details,
            footer_text=footer_text
        )
        
        # Send email with QR code attachment
        return await EmailService._send_email_with_attachment(
            to_email=email,
            subject=subject,
            body=html_body,
            attachment_path=qr_code_path,
            attachment_name=f"event_qr_code_{registration.id}.png",
            is_html=True
        )
    
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
            if settings.smtp_host and settings.smtp_user:
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
                print(f"HTML: {is_html}")
                print(f"Body:\n{body[:500]}..." if len(body) > 500 else f"Body:\n{body}")
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
            
            # Add body text (HTML or plain text)
            if is_html:
                msg.attach(MIMEText(body, 'html'))
            else:
                msg.attach(MIMEText(body, 'plain'))
            
            # Add QR code attachment
            if os.path.exists(attachment_path):
                with open(attachment_path, 'rb') as f:
                    img_data = f.read()
                    img = MIMEImage(img_data)
                    img.add_header('Content-Disposition', f'attachment; filename="{attachment_name}"')
                    msg.attach(img)
            else:
                print(f"⚠️ Warning: QR code file not found at {attachment_path}")
            
            # Connect to Gmail SMTP
            server = smtplib.SMTP(settings.smtp_host, settings.smtp_port)
            server.starttls()  # Enable encryption
            server.login(settings.smtp_user, settings.smtp_password)
            
            # Send email
            text = msg.as_string()
            server.sendmail(settings.smtp_user, to_email, text)
            server.quit()
            
            print(f"✅ Professional HTML email with QR code sent successfully to {to_email}")
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
            print(f"HTML: {is_html}")
            print(f"Body:\n{body[:500]}..." if len(body) > 500 else f"Body:\n{body}")
            print(f"Error: {e}")
            print(f"{'='*50}\n")
            return False