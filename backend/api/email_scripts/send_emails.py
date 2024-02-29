import ssl
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

print("creating ssl context ...")
context = ssl.create_default_context()

server = "smtp.google.com"
port = 465

sender_email = "lukasmedasky@gmail.com"
receiver_email = "bengabdev4@gmail.com"
username = "lukasmedasky@gmail.com"
password = "davumiujchuatdro"

EMAILS = [
    "vknylfop2@gmail.com",
    "xvdujknz8@gmail.com",
    "xubgdjqf2@gmail.com",
    "bengabdev4@gmail.com",
]


def mail(
    _mailer,
    _sender_email,
    _receiver_email,
    subject="Ping !",
    content="This is just a small ping message",
):
    message = MIMEMultipart()
    message["Subject"] = subject
    message["From"] = _sender_email
    message["To"] = _receiver_email

    html = f"""
		<html>
			<body>
				<p>{content}</p>
			</body>
		</html>
		"""

    mime1 = MIMEText(html, "html")
    message.attach(mime1)

    _mailer.sendmail(_sender_email, _receiver_email, message.as_string())
    print(f"Send an email to => {_receiver_email}")


print("Initializing ...")

with smtplib.SMTP_SSL(server, port, context=context) as mailer:
    print("Starting tls...")
    mailer.starttls()
    # Authentication
    print("Authenticating ...")
    mailer.login(username, password)

    print("Sending ...")

    for _email in EMAILS:
        mail(mailer, sender_email, _email)
