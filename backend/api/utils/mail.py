from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import smtplib
import imaplib
from typing import Union, Tuple
import socket
import ssl


def test_smtp_server(
    hostname: str, port: int, email: str, password: str, security: str, to_email: str
) -> Union[Tuple[str], None]:
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
        message["Subject"] = "MailServer Verification"
        message["From"] = email
        message["To"] = to_email

        html = f"""
            <html>
                <body>
                    <p>
                        This email is from magicpitch mail verification system. 
                        If you are seeing this message,
                        it means your smtp server is working.
                    </p>
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


def test_imap_server(
    hostname: str, port: int, email: str, password: str, security: str
) -> Union[Tuple[str], None]:
    timeout = 10
    try:
        if security == "ssl":
            server = imaplib.IMAP4_SSL(hostname, port, timeout=timeout)
        elif security == "tls":
            server = imaplib.IMAP4(hostname, port, timeout=timeout)
            server.starttls()
        elif security == "unsecure":
            server = imaplib.IMAP4(hostname, port, timeout=timeout)

        # Log in to the IMAP server
        server.login(email, password)

        # List the available mailboxes (you can customize this part)
        status, mailbox_list = server.list()
        message = ""
        if status == "OK":
            message = "IMAP server test successful. Mailboxes available:\n" + "\n".join(
                mailbox_list
            )
        else:
            message = (
                "IMAP server test successful, but failed to retrieve mailbox list."
            )

        # Close the IMAP connection
        server.logout()

        return message, "success"
    except Exception as e:
        return f"An error occurred", "failed"
