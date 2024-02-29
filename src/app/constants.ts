import { MailServerVerificationTypeObject } from "./types"

export const API_BASE = "http://localhost:8070/v1"

export const mode: {
  NEW: "NEW",
  EDIT: "EDIT"
} = {
  NEW: "NEW",
  EDIT: "EDIT"
}

export const mailServerVerificationType: MailServerVerificationTypeObject = {
  imap: "imap",
  smtp: "smtp",
}

export const securityOptions = [
  { text: "SSL", value: "ssl" },
  { text: "TLS", value: "tls" },
  { text: "Unsecure", value: "unsecure" },
]

export const SESSION_STATUS = {
  LOADING: "loading",
  AUTHENTICATED: "authenticated",
  UNAUTHENTICATED: "unauthenticated"
}

export const routes = {
  HOME: "/",
  MAIL_SERVERS: "/mail-servers",
  NEW_MAIL_SERVER: "/mail-servers/new",
  WARM_UPS: "/warm-ups",
  NEW_WARM_UP: "/warm-ups/new",
  EMAIL_LISTS: "/email-lists",
  CLIENT_EMAILS: "/email-lists/client-emails",
  REPLY_EMAILS: "/email-lists/reply-emails",
  SETTINGS: "/settings",
  SIGNUP: "/signup",
  LOGIN: "/login"
}


export const sampleWarmups = [
  {
    _id: "wwlkwk",
    no: "01",
    name: "Neww1",
    status: "draft",
    day: 0,
    spamEmail: 0,
    sentEmail: 0
  },
  {
    _id: "asdkfjasdf",
    no: "02",
    name: "warmup 2",
    status: "Sent 15 Aug, 8:30PM",
    day: 0,
    spamEmail: 0,
    sentEmail: 200
  },
]


export const sampleMailServers = [
  {
    _id: "wwlkwk",
    isChecked: true,
    no: "01",
    name: "Neww1",
    email: "anwar359**@gmail.com",
    day: 5,
    reputation: 70,
    bounceRate: 15,
    spamRate: 2
  },
  {
    _id: "asdkfjasdf",
    isChecked: false,
    no: "02",
    name: "New mail service2",
    email: "sadiq65**@gmail.com",
    day: 8,
    reputation: 60,
    bounceRate: 20,
    spamRate: 2
  },
  {
    _id: "aklsdfnsdmf",
    no: "03",
    isChecked: false,
    name: "Mail man mail service",
    email: "mailman232@yahoo.com",
    day: 20,
    reputation: 80,
    bounceRate: 10,
    spamRate: 1
  },
]
