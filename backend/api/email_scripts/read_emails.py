import imaplib
import email

host = "mail.amplifymarketingcommunications.com"
port = 993

user_email = "Admin@amplifymarketingcommunications.com"
password = "$Aurabh2695"

imap_conn = imaplib.IMAP4_SSL(host, port)
imap_conn.login(user_email, password)

imap_conn.select("Inbox")
_, bytemsgs = imap_conn.search(None, "ALL")

emails = []

for mesgn in bytemsgs[0].split():
    _, bytemsg = imap_conn.fetch(mesgn, "(RFC822)")
    message = email.message_from_bytes(bytemsg[0][1])
    emails.append(message)

    """
	From - Mail sender -> 'Ben Gab <bengabdev4@gmail.com>'
	To - Mail Receiver -> 'ben@nicejobsales.com'
	In-Reply-To -> main message current email is replying to
	Message-ID -> Message id of current email
	Subject -> Subject of email
	Date -> Date of email
	"""

    print(f"Message Number: {message}")
    print(f"From: {message.get('From')}")
    print(f"To: {message.get('To')}")
    print(f"BCC: {message.get('BCC')}")
    print(f"Date: {message.get('Date')}")
    print(f"Subject: {message.get('Subject')}")

    print("Content:")
    for part in message.walk():
        if part.get_content_type() == "text/plain":
            print(part.as_string())
    print("- - -" * 100)

print(len(emails))

imap_conn.close()
