import { RefObject } from "react";
import { SMTPServerConfig, ServerConfig } from "./types";

export function isValidEmail(email: string) {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return emailRegex.test(email);
}


export function validateInput({ value, errRef, errorText, isEmail = false} : { 
  value: string, 
  errRef: RefObject<HTMLParagraphElement>, 
  errorText: string, 
  isEmail?: boolean 
}): boolean {
  if (!value){
    if (errRef && errRef.current){
      errRef.current.focus()
      errRef.current.textContent = errorText
    }
    return false
  }

  if (isEmail && isValidEmail(value) === false){
    if (errRef && errRef.current){
      errRef.current.focus()
      errRef.current.textContent = errorText
    }
    return false
  }

  if (errRef.current){
    errRef.current.textContent = ""
  }
  return true
}


export  function validateSMTP({ smtp, smtpHostnameRef, smtpPortRef, smtpEmailRef, smtpPasswordRef, smtpSecurityRef, smtpRecipientEmailRef }: { 
  smtp: SMTPServerConfig,
  smtpHostnameRef: RefObject<HTMLParagraphElement>, 
  smtpPortRef: RefObject<HTMLParagraphElement>, 
  smtpEmailRef: RefObject<HTMLParagraphElement>, 
  smtpPasswordRef: RefObject<HTMLParagraphElement>, 
  smtpSecurityRef: RefObject<HTMLParagraphElement>,
  smtpRecipientEmailRef: RefObject<HTMLParagraphElement>,
}): boolean{
  if (validateInput({ value: smtp.hostname, errRef: smtpHostnameRef, errorText: "SMTP Hostname is required" }) === false){
    return false
  }
  // check port
  if (validateInput({ value: smtp.port, errRef: smtpPortRef, errorText: "SMTP Port is required" }) === false){
    return false
  }
  // check email
  if (validateInput({ value: smtp.email, errRef: smtpEmailRef, errorText: "SMTP Email is required" }) === false){
    return false
  }
  // check email validity
  if (validateInput({ value: smtp.email, errRef: smtpEmailRef, errorText: "SMTP Email is not valid", isEmail: true }) === false){
    return false
  }
  // check password
  if (validateInput({ value: smtp.password, errRef: smtpPasswordRef, errorText: "SMTP Password is required" }) === false){
    return false
  }
  // check security
  if (validateInput({ value: smtp.security, errRef: smtpSecurityRef, errorText: "SMTP Security type is required" }) === false){
    return false
  }
  // check recipient email 
  if (validateInput({ value: smtp.recipientEmail, errRef: smtpRecipientEmailRef, errorText: "SMTP Recipient Email is required" }) === false){
    return false
  }
  // check recipient email validity
  if (validateInput({ value: smtp.recipientEmail, errRef: smtpRecipientEmailRef, errorText: "SMTP Recipient Email is not valid", isEmail: true }) === false){
    return false
  }
  return true
}


export function validateIMAP({ imap, imapHostnameRef, imapPortRef, imapEmailRef, imapPasswordRef, imapSecurityRef }: { 
  imap: ServerConfig,
  imapHostnameRef: RefObject<HTMLParagraphElement>, 
  imapPortRef: RefObject<HTMLParagraphElement>, 
  imapEmailRef: RefObject<HTMLParagraphElement>, 
  imapPasswordRef: RefObject<HTMLParagraphElement>, 
  imapSecurityRef: RefObject<HTMLParagraphElement>
}): boolean{
  if (validateInput({ value: imap.hostname, errRef: imapHostnameRef, errorText: "IMAP Hostname is required" }) === false){
    return false
  }
  // check port
  if (validateInput({ value: imap.port, errRef: imapPortRef, errorText: "IMAP Port is required" }) === false){
    return false
  }
  // check email
  if (validateInput({ value: imap.email, errRef: imapEmailRef, errorText: "IMAP Email is required" }) === false){
    return false
  }
  // check email validity
  if (validateInput({ value: imap.email, errRef: imapEmailRef, errorText: "IMAP Email is not valid", isEmail: true }) === false){
    return false
  }
  // check password
  if (validateInput({ value: imap.password, errRef: imapPasswordRef, errorText: "IMAP Password is required" }) === false){
    return false
  }
  // check security
  if (validateInput({ value: imap.security, errRef: imapSecurityRef, errorText: "IMAP Security type is required" }) === false){
    return false
  }
  return true
}
