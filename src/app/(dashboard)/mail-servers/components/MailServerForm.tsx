import React, { LegacyRef, MouseEvent, RefObject, useEffect, useRef, useState } from 'react'
import TextInput from '@/app/(dashboard)/components/TextInput'
import SelectInput from "@/app/(dashboard)/components/SelectInput"
import { MailServer, NewMailServer, ServerConfig } from '@/app/types'
import { mailServerVerificationType, securityOptions } from '@/app/constants'
import { IconContext } from 'react-icons'
import { BsX } from 'react-icons/bs'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { closeServerForm, getSelectedMailServer, getServerFormMode } from '../../store/slices/mailServersSlice'
import { mode } from '@/app/constants'
import { useAddMailServerMutation, useUpdateMailServerMutation, useVerifyMailServerMutation } from '../../store/api/apiSlice'
import { useUserContext } from '../../contexts/UserProvider'
import { useGlobalToastContext } from '@/app/contexts/GlobalToastProvider'
import { validateSMTP, validateInput } from '@/app/helpers'
import { validateIMAP } from '@/app/helpers'
import Loader2 from '../../components/Loader2'


const initialMailServerData: NewMailServer = {
  name: "",
  imapDetails: {
    hostname: "",
    port: "",
    email: "",
    password: "",
    security: "unsecure"
  },
  smtpDetails: {
    hostname: "",
    port: "",
    email: "",
    password: "",
    security: "unsecure",
    recipientEmail: ""
  }
}


export default function MailServerForm() {
  const dispatch = useAppDispatch() 
  const currentMode = useAppSelector(getServerFormMode)
  const server = useAppSelector(getSelectedMailServer)
  const [formState, setFormState] = useState<MailServer | NewMailServer>(initialMailServerData)
  const [verifySMTP, { isLoading: isVerifySMTPLoading, isError: isVerifySMTPError }] = useVerifyMailServerMutation()
  const [verifyIMAP, { isLoading: isVerifyIMAPLoading, isError: isVerifyIMAPError }] = useVerifyMailServerMutation()
  const [addMailServer, { isLoading: isAddMailServerLoading }] = useAddMailServerMutation()
  const [updateMailServer, { isLoading: isUpdateMailServerLoading }] = useUpdateMailServerMutation()
  const userData = useUserContext()
  const token = userData.token as string
  const {showSuccessToast, showErrorToast} = useGlobalToastContext()

  // error refs
  const nameRef = useRef<HTMLParagraphElement>(null)
  // imap
  const imapHostnameRef = useRef<HTMLParagraphElement>(null)
  const imapPortRef = useRef<HTMLParagraphElement>(null)
  const imapEmailRef = useRef<HTMLParagraphElement>(null)
  const imapPasswordRef = useRef<HTMLParagraphElement>(null)
  const imapSecurityRef = useRef<HTMLParagraphElement>(null)
  // smtp
  const smtpHostnameRef = useRef<HTMLParagraphElement>(null)
  const smtpPortRef = useRef<HTMLParagraphElement>(null)
  const smtpEmailRef = useRef<HTMLParagraphElement>(null)
  const smtpPasswordRef = useRef<HTMLParagraphElement>(null)
  const smtpSecurityRef = useRef<HTMLParagraphElement>(null)
  const smtpRecipientEmailRef = useRef<HTMLParagraphElement>(null)

  const [isSMTPVerified, setIsSMTPVerified] = useState(false)
  const [isIMAPVerified, setIsIMAPVerified] = useState(false)
  // const isSubmitDisabled = isSMTPVerified === false || isIMAPVerified === false
  // const isSubmitDisabled = isSMTPVerified === false
  const isSubmitDisabled = false

  useEffect(() => {
    if(server && currentMode === mode.EDIT){
      setFormState({ ...server, smtpDetails: { ...server.smtpDetails, recipientEmail: "" } })
    }else {
      setFormState(initialMailServerData)
    }
  }, [server, currentMode])

  // invalidate the verified status of the smtp details if any of them changes
  useEffect(() => {
    setIsSMTPVerified(false)
  }, [formState.smtpDetails])

  // invalidate the verified status of the imap details if any of them changes
  useEffect(() => {
    setIsIMAPVerified(false)
  }, [formState.imapDetails])


  async function handleVerifySMTPDetails(){
    let smtp = formState.smtpDetails
    if (validateSMTP({ smtp, smtpHostnameRef, smtpPortRef, smtpEmailRef, smtpPasswordRef, smtpSecurityRef, smtpRecipientEmailRef }) === false){
      return 
    }
    if (!smtp.verificationType){
      smtp = { ...smtp, verificationType: mailServerVerificationType.smtp }
    }
    try{
      const resp = await verifySMTP({ token, config: {...smtp} }).unwrap()
      if (resp.verificationStatus === "success"){
        showSuccessToast("SMTP Details are valid. You can now send emails with this mail server")
        setIsSMTPVerified(true)
      }else {
        showErrorToast(resp.description)
      }
    }catch(err: any){
      if (err.message){
        showErrorToast(err.message)
      }else{
        if (err.error){
          showErrorToast(err.error)
        }else{
          showErrorToast("Unable to complete smtp verification")
        }
      }
    }
  }

  async function handleVerifyIMAPDetails(){
    let imap = formState.imapDetails
    if (validateIMAP({  imap, imapHostnameRef, imapPortRef, imapEmailRef, imapPasswordRef, imapSecurityRef  }) === false){
      return
    }
    if (!imap.verificationType){
      imap = { ...imap,  verificationType: mailServerVerificationType.imap }
    }
    try{
      const resp = await verifyIMAP({ token, config: {...imap} }).unwrap()
      if (resp.verificationStatus === "success"){
        showSuccessToast("IMAP Details are valid")
        setIsIMAPVerified(true)
      }else{
        showErrorToast("IMAP Details are invalid")
      }
    }catch(err: any){
      if (err.message){
        showErrorToast(err.message)
      }else{
        if (err.error){
          showErrorToast(err.error)
        }else{
          showErrorToast("Unable to complete imap verification")
        }
      }
    }
  }

  function closeForm(){
    dispatch(closeServerForm())
  }

  function handleOnChange(update: { [key: string]: any }){
    setFormState(prev => ({ ...prev, ...update }))
  }

  async function handleFormSubmit(e: MouseEvent<HTMLButtonElement>){
    e.preventDefault()
    // validate  mail server name
    if (validateInput({ value: formState.name, errRef: nameRef, errorText: "Mail Server name is required"}) === false ){
      return
    }
    if (isSubmitDisabled){
      showErrorToast("Verify SMTP and IMAP details to continue")
      return 
    }

    try{
      if (currentMode === mode.NEW){
        await addMailServer({ token, name: formState.name, imapDetails: formState.imapDetails, smtpDetails: formState.smtpDetails }).unwrap()
        showSuccessToast("Mail Server Created!")
        setFormState(initialMailServerData)
      }else{
        await updateMailServer({ token, name: formState.name, imapDetails: formState.imapDetails, smtpDetails: formState.smtpDetails, mailServerId: server?._id as string }).unwrap()
        showSuccessToast("Mail Server Updated!")
      }
    }catch(err: any){
      if (currentMode === mode.NEW){
        if (err.data){
          showErrorToast(err.data.description)
        }else if (err.message){
          showErrorToast(err.message)
        }else{
          if (err.error){
            showErrorToast(err.error)
          }else{
            showErrorToast("Unable to create mail server")
          }
        }
      }else{
        if (err.data){
          showErrorToast(err.data.description)
        }else if (err.message){
          showErrorToast(err.message)
        }else{
          if (err.error){
            showErrorToast(err.error)
          }else{
            showErrorToast("Unable to update mail server")
          }
        }
      }
    }
  }

  return (
    <section className="absolute inset-0 w-full h-full overflow-auto flex bg-gray-150 px-5 py-10">
      <div className="w-full h-fit flex flex-col items-center justify-center gap-5 ">
        <form className="bg-white p-5 lg:p-10 rounded-3xl border-[1px] border-[#C2C2C2] w-full max-w-[60rem] flex flex-col gap-7 h-fit">
          <div className="flex w-full justify-between gap-3">
            <h3 className="text-xl text-blue font-medium">{ currentMode === mode.EDIT ? "Edit Mail Server": "Create Mail Server" }</h3>
            <button type="button" onClick={() => closeForm()} className="w-fit h-fit self-end">
              <IconContext.Provider value={{ size: "2em", className: `p-1 rounded-full bg-white text-gray-800 hover:bg-gray-200` }}>
                <BsX />
              </IconContext.Provider>
            </button>
          </div>
          <div className="flex flex-col gap-12 h-full w-full">
            <div className="w-full flex flex-col md:flex-row gap-5">
              <TextInput errRef={nameRef} label='Name of email server' placeholder='Enter mail server name' value={formState.name} onChange={(e) => handleOnChange({ name: e.target.value }) } />
            </div>
            <div className="flex flex-col gap-5">
              <h3 className="text-gray-800 text-xl">SMTP (sending emails)</h3>
              <div className="w-full flex flex-col md:flex-row gap-5">
                <TextInput errRef={smtpHostnameRef} label='Host' placeholder='Enter server name' value={formState.smtpDetails.hostname} onChange={(e) => handleOnChange({ smtpDetails: { ...formState.smtpDetails, hostname: e.target.value } }) } />
                <TextInput errRef={smtpPortRef} label='Port' placeholder='Enter port number' value={formState.smtpDetails.port} onChange={(e) => handleOnChange({ smtpDetails: { ...formState.smtpDetails, port: e.target.value } }) } />
              </div>
              <div className="w-full flex flex-col md:flex-row gap-5">
                <TextInput errRef={smtpEmailRef} label="From SMTP Email" placeholder="Enter email" value={formState.smtpDetails.email} onChange={(e) => handleOnChange({ smtpDetails: { ...formState.smtpDetails, email: e.target.value } }) } />
                <TextInput errRef={smtpPasswordRef} label="Password" placeholder="Enter password" value={formState.smtpDetails.password} onChange={(e) => handleOnChange({ smtpDetails: { ...formState.smtpDetails, password: e.target.value } }) } />
              </div>
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5">
                <SelectInput errRef={smtpSecurityRef} label="SMTP Security" placeholder="Choose security type" options={securityOptions} value={formState.smtpDetails.security} onChange={(val) => handleOnChange({ smtpDetails: { ...formState.smtpDetails, security: val } }) } />
                <TextInput errRef={smtpRecipientEmailRef} label="Recipient Email" placeholder="Enter recipient email" value={formState.smtpDetails.recipientEmail} onChange={(e) => handleOnChange({ smtpDetails: { ...formState.smtpDetails, recipientEmail: e.target.value } }) } />
              </div>
              <button onClick={() => handleVerifySMTPDetails()} type="button" className="disabled:opacity-50 disabled:cursor-not-allowed px-5 md:px-10 py-2 bg-blue rounded-md text-white w-fit" disabled={ isVerifySMTPLoading }>
                { isVerifySMTPLoading ? (
                  <p className="scale-50 flex justify-center items-center relative h-full w-full">
                    <Loader2 />
                  </p>
                ):("Verify") }
              </button>
            </div>
            <div className="flex flex-col gap-5">
              <h3 className="text-gray-800 text-xl">IMAP (receiving emails)</h3>
              <div className="w-full flex flex-col md:flex-row gap-5">
                <TextInput errRef={imapHostnameRef} label='Host' placeholder='Enter hostname' value={formState.imapDetails.hostname} onChange={(e) => handleOnChange({ imapDetails: { ...formState.imapDetails, hostname: e.target.value } }) } />
                <TextInput errRef={imapPortRef} label='Port' placeholder='Enter port number' value={formState.imapDetails.port} onChange={(e) => handleOnChange({ imapDetails: { ...formState.imapDetails, port: e.target.value } }) } />
              </div>
              <div className="w-full flex flex-col md:flex-row gap-5">
                <TextInput errRef={imapEmailRef} label="From IMAP Email" placeholder="Enter email" value={formState.imapDetails.email} onChange={(e) => handleOnChange({ imapDetails: { ...formState.imapDetails, email: e.target.value } }) } />
                <SelectInput errRef={imapSecurityRef} label="Security" placeholder="Enter your warm-up name" options={securityOptions} value={formState.imapDetails.security} onChange={(val) => handleOnChange({ imapDetails: { ...formState.imapDetails, security: val } })}  />
              </div>
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5">
                <TextInput errRef={imapPasswordRef} label="IMAP Password" placeholder="Enter your warm-up name" value={formState.imapDetails.password} onChange={(e) => handleOnChange({ imapDetails: { ...formState.imapDetails, password: e.target.value } }) } />
              </div>
              <button onClick={() => handleVerifyIMAPDetails()} type="button" className="disabled:opacity-50 disabled:cursor-not-allowed px-5 md:px-10 py-2 bg-blue rounded-md text-white w-fit" disabled={ isVerifyIMAPLoading }>
                { isVerifyIMAPLoading ? (
                  <p className="scale-50 flex justify-center items-center relative h-full w-full">
                    <Loader2 />
                  </p>
                ):("Verify") }
              </button>
            </div>
            <button disabled={isSubmitDisabled} onClick={handleFormSubmit} type="button" className="px-5 md:px-10 py-2 bg-blue rounded-md text-white w-fit disabled:opacity-50 disabled:cursor-not-allowed">
              { (isAddMailServerLoading || isUpdateMailServerLoading) ? (
                <p className="scale-50 flex justify-center items-center relative h-full w-full">
                  <Loader2 />
                </p>
              ):("Continue") }
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}
