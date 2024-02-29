import imaplib
import email
import yaml

with open("credentials.yml") as f:
    content = f.read()

credentials = yaml.load(content, Loader=yaml.FullLoader)

user = credentials["user"]
password = credentials["password"]

host = "imap.gmail.com"

imap = imaplib.IMAP4_SSL(host)
imap.login(user, password)
imap.select("[Gmail]/Spam")

_, bytemsgs = imap.search(None, "ALL")

emails = []

for msgid in bytemsgs[0].split():
    _, bytemsg = imap.fetch(msgid, "(RFC822)")
    if bytemsg[0] is None:
        continue
    message = email.message_from_bytes(bytemsg[0][1])

    print("Moving message to inbox and marking as not spam ..")

    # Mark message as important
    imap.store(msgid, "+FLAGS", "\\Flagged")

    # Mark message as Seen
    imap.store(msgid, "+FLAGS", "\\Seen")

    # Move message to inbox
    imap.copy(msgid, "Inbox")

    # Set message in spam as delete
    imap.store(msgid, "+FLAGS", "\\Deleted")

# Permanently delete messages marked as 'deleted'
imap.expunge()


imap.close()
