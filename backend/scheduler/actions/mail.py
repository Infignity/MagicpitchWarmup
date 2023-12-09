from scheduler.models import EmailDetails, MailServer, WarmupEmail
from typing import Dict, List
import ssl
import smtplib
import imaplib
import socket
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from scheduler.settings import ENVIRONMENT


def send_single_mail(
    hostname, port, security, email, password, to_email, subject, body, batch_id
):
    try:
        # Create an SMTP object based on the security option

        if security == "ssl":
            context = ssl.create_default_context()
            server = smtplib.SMTP_SSL(hostname, port, context=context, timeout=10)
        elif security == "tls":
            server = smtplib.SMTP(hostname, port, timeout=10)
            server.starttls()
        elif security == "unsecure":
            server = smtplib.SMTP(hostname, port, timeout=10)

        # Login to the SMTP server
        server.login(email, password)

        message = MIMEMultipart()
        message["Subject"] = subject
        message["From"] = email
        message["To"] = to_email

        html = f"""
            <html>
                <body>
                    <div data-warmup-id="{batch_id}">
                        {body}
                    </div>
                </body>
            </html>
        """

        mime = MIMEText(html, "html")
        message.attach(mime)

        # Test email sending (you can customize this part)
        server.sendmail(email, to_email, message.as_string())

        # Close the SMTP connection
        server.quit()

        return "SMTP verification successful.", "success"

    except smtplib.SMTPException as e:
        return f"SMTP error: {str(e)}", "failed"
    except socket.timeout:
        return f"SMTP error: timed out", "failed"
    except Exception as e:
        print(e.__class__)
        return f"An error occurred: {str(e)}", "failed"


def send_warmup_emails(batch_id, contacts: List[EmailDetails], mail_server: MailServer):
    """Send warmup emails to contacts"""

    chunk_size = 10

    for i in range(0, len(contacts), chunk_size):
        contacts_list = contacts[i : i + chunk_size]
        result: List[Dict] = WarmupEmail.aggregate(
            [{"$sample": {"size": chunk_size}}]
        ).to_list()

        for contact, warmup_email in zip(contacts_list, result):
            send_single_mail(
                hostname=mail_server.smtp_details.hostname,
                port=mail_server.smtp_details.port,
                security=mail_server.smtp_details.security,
                email=mail_server.smtp_details.email,
                password=mail_server.smtp_details.password,
                to_email="huejohn647@gmail.com"
                if ENVIRONMENT != "production"
                else contact.email,
                subject=warmup_email["subject"],
                body=warmup_email["body"],
                batch_id=batch_id,
            )
